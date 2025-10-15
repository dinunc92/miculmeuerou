// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { resend, FROM } from "@/lib/resend";
import { personalizePdfSmart, outputPdfName } from "@/lib/pdf_personalize";
import { displayTitleFromPlaceholder } from "@/utils/title";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Titluri de bază pentru generarea numelui fișierului-sursă.
 * Folosim [NumeCopil] în nume (convenția din public/books/...).
 */
const BASE_TITLES: Record<string, string> = {
  // CĂRȚI (cu avatar => au și sufix _gender_hair_eye în numele fișierului sursă)
  "carte-ziua": "Ziua lui [NumeCopil]",
  "carte-numere": "[NumeCopil] învață să numere",
  "carte-sentimente": "[NumeCopil] și cutia cu sentimente",

  // FIȘE (fără avatar => fără sufix în numele fișierului sursă)
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

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  // BODY BRUT — nu folosi req.json() aici
  const raw = await req.text();

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

    // date client & livrare
    const emailClient =
      s.customer_details?.email || s.customer_email || s.customer?.email || "";
    const phoneClient = s.customer_details?.phone || "";
    const shipping = s.shipping_details || {};
    const addr = shipping?.address || {};

    // cart din metadata (umplut în /api/checkout)
    const cartTxt = s.metadata?.cart || "[]";
    let items: any[] = [];
    try {
      items = JSON.parse(cartTxt);
    } catch {
      items = [];
    }

    // separăm tipurile
    const fise = items.filter((i) => i.productType === "fise");
    const carti = items.filter((i) => i.productType === "carte");
    const custom = items.filter((i) => i.productType === "carte-custom"); // livrare manuală în 24h

    // atașamente generate
    const attachmentsClient: { filename: string; content: string }[] = [];
    const attachmentsAdmin: { filename: string; content: string }[] = [];

    // câte ar trebui să avem (client primește doar dacă le avem pe toate)
    const expectedAttachments = fise.length + carti.length;
    let missingAny = false;

    // helper pentru titluri drăguțe în mail
    const prettyLines = items
      .map((i) =>
        "• " +
        displayTitleFromPlaceholder(
          BASE_TITLES[i.productId] || i.title || i.productId,
          i.childName || i?.customization?.childName || ""
        )
      )
      .join("<br/>");

    // === FIȘE: fără avatar in sursă (fără sufix in numele fișierului) ===
    for (const it of fise) {
      try {
        const baseTitle = BASE_TITLES[it.productId];
        if (!baseTitle) throw new Error(`Titlu de bază lipsă pentru ${it.productId}`);

        const buf = await personalizePdfSmart({
          productType: "fise",
          baseTitle,                // cu [NumeCopil]
          childName: it.childName,  // numele copilului (max 10 introdus anterior)
        });

        const filename = outputPdfName({
          productType: "fise",
          baseTitle,
          childName: it.childName,
        });

        const base64 = (buf as Buffer).toString("base64");
        const att = { filename, content: base64 };
        attachmentsClient.push(att);
        attachmentsAdmin.push(att);
        console.log("📎 Generat (fișe):", filename);
      } catch (e: any) {
        console.error("⚠️ Fișe – personalizare eșuată:", e.message);
        missingAny = true;
      }
    }

    // === CĂRȚI: cu avatar (suffix în numele fișierului sursă) ===
    for (const it of carti) {
      try {
        const baseTitle = BASE_TITLES[it.productId];
        if (!baseTitle) throw new Error(`Titlu de bază lipsă pentru ${it.productId}`);
        if (!it.gender || !it.hairstyle || !it.eye)
          throw new Error(`Lipsesc atributele avatar (gender/hair/eye) pentru carte`);

        const buf = await personalizePdfSmart({
          productType: "carte",
          baseTitle,                // cu [NumeCopil]
          childName: it.childName,
          gender: it.gender,
          hair: it.hairstyle,
          eye: it.eye,
        });

        const filename = outputPdfName({
          productType: "carte",
          baseTitle,
          childName: it.childName,
        });

        const base64 = (buf as Buffer).toString("base64");
        const att = { filename, content: base64 };
        attachmentsClient.push(att);
        attachmentsAdmin.push(att);
        console.log("📎 Generat (carte):", filename);
      } catch (e: any) {
        console.error("⚠️ Carte – personalizare eșuată:", e.message);
        missingAny = true;
      }
    }

    // status generare
    const haveAll = !missingAny && attachmentsClient.length === expectedAttachments;

    // 1) CLIENT — doar dacă avem TOATE fișierele generate
    if (haveAll && emailClient) {
      try {
        await sendMail({
          from: FROM,
          to: emailClient,
          subject: "Comanda ta – Micul Meu Erou",
          html: `
            <p>Mulțumim pentru comanda ta! 🎉</p>
            <p>${prettyLines}</p>
            ${custom.length ? `<p><b>Cartea personalizată avansat</b> va fi livrată manual pe email în 24 de ore.</p>` : ""}
            <p>${carti.length ? "Dacă ai ales și varianta tipărită: livrare 5–9 zile lucrătoare (producție + transport)." : ""}</p>
          `,
          attachments: attachmentsClient,
        });
        console.log("📧 Email client trimis cu", attachmentsClient.length, "atașamente.");
      } catch (e: any) {
        console.error("❌ Email client error:", e?.message || e);
      }
    } else {
      console.log("ℹ️ Nu trimitem către client (fișiere lipsă sau doar carte-custom).");
    }

    // 2) ADMIN — întotdeauna, cu sumar clar și lista atașamentelor
    const addrHtml = addr
      ? `
        <p><b>Livrare</b><br/>
        ${shipping?.name || "-"}<br/>
        ${addr.line1 || ""} ${addr.line2 || ""}<br/>
        ${addr.postal_code || ""} ${addr.city || ""}<br/>
        ${addr.state || ""} ${addr.country || ""}<br/>
        Tel: ${phoneClient || "-"}</p>`
      : "<p><b>Fără adresă de livrare</b></p>";

    const listFilenames =
      (attachmentsAdmin || []).map((a) => a.filename).join("<br/>") || "(nimic)";

    try {
      await sendMail({
        from: FROM,
        to: process.env.ORDERS_TO!,
        subject: haveAll
          ? "Comandă nouă – toate fișierele au fost generate"
          : "⚠️ Comandă – NU toate fișierele au fost generate",
        html: `
          <p><b>Status fișiere:</b> ${
            haveAll
              ? "✔️ s-au trimis către client"
              : "❌ nu s-au trimis către client – verifică sursele"
          }</p>
          <p><b>Produse:</b><br/>${prettyLines}</p>
          ${addrHtml}
          <p><b>Client:</b> ${emailClient || "-"}</p>
          ${custom.length ? "<p><b>NOTE:</b> include carte personalizată avansat – livrare manuală în 24h (ODF/PDF).</p>" : ""}
          ${haveAll ? "" : "<p><b>ALERTĂ:</b> Lipsesc unele fișiere sursă în public/books/… sau avatarul nu e complet.</p>"}
          <p><b>Atașamente incluse acum:</b><br/>${listFilenames}</p>
        `,
        attachments: attachmentsAdmin.length ? attachmentsAdmin : undefined,
      });
      console.log("📧 Email admin trimis.");
    } catch (e: any) {
      console.error("❌ Email admin error:", e?.message || e);
    }
  }

  return NextResponse.json({ received: true });
}
