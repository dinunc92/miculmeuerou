// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { resend, FROM } from "@/lib/resend";
import {
  personalizePdfSmart,
  outputPdfName,
  sourcePdfPath,
  type PdfInfo,
} from "@/lib/pdf_personalize";
import { displayTitleFromPlaceholder } from "@/utils/title";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Titluri de bază pentru generarea numelui fișierului-sursă.
 * Convenția din public/books/... folosește [NumeCopil] în titlu.
 */
const BASE_TITLES: Record<string, string> = {
  // CĂRȚI (au avatar => sursa are sufix _gender_hair_eye)
  "carte-ziua": "Ziua lui [NumeCopil]",
  "carte-numere": "[NumeCopil] învață să numere",
  "carte-sentimente": "[NumeCopil] și cutia cu sentimente",

  // FIȘE (fără avatar => sursa NU are sufix)
  "fise-3-4": "Fișe educative 3-4 ani pentru [NumeCopil]",
  "fise-4-5": "Fișe educative 4-5 ani pentru [NumeCopil]",
  "fise-5-6": "Fișe educative 5-6 ani pentru [NumeCopil]",
  "fise-cifre": "Fișe educative - cifrele pentru [NumeCopil]",
};

/** Trimitere email cu fallback dacă domeniul nu e verificat în Resend. */
async function sendMail(payload: any) {
  try {
    return await resend.emails.send(payload);
  } catch (e: any) {
    if (e?.statusCode === 403 && /domain is not verified/i.test(e?.message || "")) {
      return await resend.emails.send({
        ...payload,
        from: "Micul Meu Erou <onboarding@resend.dev>",
      });
    }
    throw e;
  }
}

/** Titlu frumos pentru un item (în corpul emailului, subiect etc.). */
function prettyTitleForItem(it: any) {
  const base = BASE_TITLES[it.productId] || it.title || it.productId;
  const name = it.childName || it?.customization?.childName || "";
  return displayTitleFromPlaceholder(base, name);
}

/** Trimite 2 emailuri per produs (client + admin) când PDF-ul a fost generat. */
async function emailPerProductSuccess(args: {
  emailClient: string;
  adminTo: string | undefined;
  item: any;
  filename: string;
  fileBase64: string;
  shippingHtml: string;
}) {
  const { emailClient, adminTo, item, filename, fileBase64, shippingHtml } = args;
  const title = prettyTitleForItem(item);

  // 1) email către CLIENT cu 1 atașament (acest produs)
  if (emailClient) {
    await sendMail({
      from: FROM,
      to: emailClient,
      subject: `Fișierul tău: ${title}`,
      html: `
        <p>Mulțumim pentru comanda ta! 🎉</p>
        <p>Ți-am atașat fișierul personalizat pentru: <b>${title}</b>.</p>
        <p>Dacă ai întrebări, scrie-ne la hello@miculmeuerou.ro.</p>
      `,
      attachments: [{ filename, content: fileBase64 }],
    });
  }

  // 2) email către ADMIN (confirmare trimis + atașăm același fișier)
  if (adminTo) {
    await sendMail({
      from: FROM,
      to: adminTo,
      subject: `Trimis clientului: ${title}`,
      html: `
        <p><b>Status:</b> ✔️ fișierul a fost generat și trimis clientului.</p>
        <p><b>Produs:</b> ${title}</p>
        ${shippingHtml}
        <p><b>Atașament:</b> ${filename}</p>
      `,
      attachments: [{ filename, content: fileBase64 }],
    });
  }
}

/** Trimite DOAR email către ADMIN când nu s-a putut genera fișierul. */
async function emailPerProductFailure(args: {
  adminTo: string | undefined;
  item: any;
  errorMessage: string;
  shippingHtml: string;
  expectedPath?: string;
}) {
  const { adminTo, item, errorMessage, shippingHtml, expectedPath } = args;
  if (!adminTo) return;
  const title = prettyTitleForItem(item);
  await sendMail({
    from: FROM,
    to: adminTo,
    subject: `⚠️ NU s-a generat fișierul: ${title}`,
    html: `
      <p><b>Status:</b> ❌ fișierul NU a fost trimis clientului.</p>
      <p><b>Produs:</b> ${title}</p>
      ${shippingHtml}
      ${expectedPath ? `<p><b>Așteptat la:</b> ${expectedPath}</p>` : ""}
      <p><b>Eroare:</b> ${errorMessage}</p>
    `,
  });
}

/** Email per produs pentru carte personalizată avansat (manual, fără atașament). */
async function emailPerProductCustom(args: {
  emailClient: string;
  adminTo: string | undefined;
  item: any;
  shippingHtml: string;
}) {
  const { emailClient, adminTo, item, shippingHtml } = args;
  const name = item.childName || item?.customization?.childName || "Eroul";
  const titleHuman = `Cartea eroului – ${name}`;

  // Client: confirmare, fără atașament
  if (emailClient) {
    await sendMail({
      from: FROM,
      to: emailClient,
      subject: `Comanda ta – ${titleHuman}`,
      html: `
        <p>Mulțumim pentru comanda ta! 🎉</p>
        <p>Cartea ta personalizată avansat va fi realizată manual și o vei primi pe email în maxim <b>24 de ore</b>.</p>
        <p>Dacă ai selectat și varianta tipărită, te vom anunța separat despre livrare.</p>
      `,
    });
  }

  // Admin: sarcini de lucru
  if (adminTo) {
    await sendMail({
      from: FROM,
      to: adminTo,
      subject: `De realizat manual în 24h: ${titleHuman}`,
      html: `
        <p><b>Produs:</b> ${titleHuman}</p>
        ${shippingHtml}
        <p><b>Detalii personalizare:</b></p>
        <pre style="white-space:pre-wrap">${JSON.stringify(item, null, 2)}</pre>
      `,
    });
  }
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  const raw = await req.text(); // body brut pentru Stripe

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as any;

    const emailClient =
      s.customer_details?.email || s.customer_email || s.customer?.email || "";
    const phoneClient = s.customer_details?.phone || "";
    const shipping = s.shipping_details || {};
    const addr = shipping?.address || {};
    const adminTo = process.env.ORDERS_TO;

    const shippingHtml = addr
      ? `
        <p><b>Livrare</b><br/>
        ${shipping?.name || "-"}<br/>
        ${addr.line1 || ""} ${addr.line2 || ""}<br/>
        ${addr.postal_code || ""} ${addr.city || ""}<br/>
        ${addr.state || ""} ${addr.country || ""}<br/>
        Tel: ${phoneClient || "-"}</p>`
      : "<p><b>Fără adresă de livrare</b></p>";

    // Coșul simplificat din metadata
    const cartTxt = s.metadata?.cart || "[]";
    let items: any[] = [];
    try {
      items = JSON.parse(cartTxt);
    } catch {
      items = [];
    }

    // Procesăm fiecare produs separat (1 email/produs)
    for (const it of items) {
      try {
        if (it.productType === "carte-custom") {
          // livrare manuală, fără atașament
          await emailPerProductCustom({ emailClient, adminTo, item: it, shippingHtml });
          continue;
        }

        const baseTitle = BASE_TITLES[it.productId];
        if (!baseTitle) throw new Error(`Titlu de bază lipsă pentru ${it.productId}`);

        // info pentru generator
        const info: PdfInfo =
          it.productType === "carte"
            ? {
                productType: "carte",
                baseTitle,
                childName: it.childName,
                gender: it.gender,
                hair: it.hairstyle,
                eye: it.eye,
              }
            : {
                productType: "fise",
                baseTitle,
                childName: it.childName,
              };

        // încerci să personalizezi PDF
        const buf = await personalizePdfSmart(info);
        const filename = outputPdfName(info);
        const base64 = (buf as Buffer).toString("base64");

        // trimite cele 2 emailuri pentru acest produs (client + admin)
        await emailPerProductSuccess({
          emailClient,
          adminTo,
          item: it,
          filename,
          fileBase64: base64,
          shippingHtml,
        });
      } catch (e: any) {
        // La eroare: clientul NU primește nimic pentru acel produs; adminul primește alertă
        const expectedPath = (() => {
          try {
            const baseTitle = BASE_TITLES[it.productId];
            if (!baseTitle) return undefined;
            const info: any =
              it.productType === "carte"
                ? {
                    productType: "carte",
                    baseTitle,
                    childName: it.childName,
                    gender: it.gender,
                    hair: it.hairstyle,
                    eye: it.eye,
                  }
                : {
                    productType: "fise",
                    baseTitle,
                    childName: it.childName,
                  };
            return sourcePdfPath(info);
          } catch {
            return undefined;
          }
        })();

        await emailPerProductFailure({
          adminTo,
          item: it,
          errorMessage: e?.message || String(e),
          shippingHtml,
          expectedPath,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
