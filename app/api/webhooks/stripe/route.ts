// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { resend, FROM } from "@/lib/resend";
import { byId } from "@/data/products";
import { fillPdfFormAndBase64 } from "@/utils/pdf-form";
import { PRICE } from "@/config/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

// fallback dacă domeniul Resend nu e verificat (onboarding@)
async function sendMailSafe(payload: any) {
  try {
    return await resend.emails.send(payload);
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (e?.statusCode === 403 && /domain is not verified/i.test(msg)) {
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
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    const raw = await req.text(); // RAW body pentru semnătură
    event = stripe.webhooks.constructEvent(raw, sig!, whSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err?.message);
    return NextResponse.json({ error: `Invalid signature: ${err?.message}` }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    const full = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price.product"],
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://miculmeuerou.ro";
    const email = full.customer_details?.email || undefined;
    const items = full.line_items?.data || [];
    const totalRON = Math.round((full.amount_total || 0) / 100);

    // linie de transport?
    const hasPrinted = items.some((li) => {
      const prod = li.price?.product as Stripe.Product;
      const md = (prod?.metadata || {}) as any;
      return md?.t === "shipping" || md?.wp === "1";
    });

    // 1) salvăm comanda (idempotent)
    const order = await prisma.order.upsert({
      where: { paymentId: session.id },
      update: {},
      create: {
        paymentId: session.id,
        email: email || "unknown@unknown",
        totalRON,
        status: "received",
        wantPrinted: hasPrinted,
        shippingFeeRON: hasPrinted ? PRICE.SHIPPING_FEE : 0,
      },
    });

    // 2) salvăm item-urile (ignorăm transportul)
    for (const li of items) {
      const prod = li.price?.product as Stripe.Product;
      const md = (prod?.metadata || {}) as any;
      if (md?.t === "shipping") continue;

      const p = byId(md?.p || "");
      const title = prod?.name || li.description || (p?.title || "Produs");
      const customization: any = {};

      if (md?.n) customization.childName = md.n;
      if (md?.g) customization.gender = md.g;
      if (md?.h) customization.hairstyle = md.h;
      if (md?.e) customization.eyeColor = md.e;
      if (md?.wp) customization.wantPrinted = md.wp === "1";
      if (md?.tk) customization.token = md.tk;
      if (md?.st) customization.storyTitle = md.st;
      if (md?.age) customization.age = md.age;
      if (md?.rel) customization.relation = md.rel;
      if (md?.reln) customization.relationName = md.reln;
      if (md?.cv) customization.coverId = md.cv;

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: md?.p || "",
          productType: md?.t || "",
          title,
          priceRON: Math.round((li.price?.unit_amount || 0) / 100),
          customization,
        } as any,
      });
    }

    // 3) trimitem email per produs (client + admin)
    for (const li of items) {
      const prod = li.price?.product as Stripe.Product;
      const md = (prod?.metadata || {}) as any;
      if (md?.t === "shipping") continue;

      const productId = String(md?.p || "");
      const productType = String(md?.t || "");
      const childName = String(md?.n || "");
      const wantPrinted = md?.wp === "1";
      const token = md?.tk as string | undefined;
      const catalog = byId(productId);

      const niceTitle = prod?.name || li.description || (catalog?.title || "Produs Micul Meu Erou");

      let pdfAttachment: { filename: string; content: string } | undefined;
      let photoAttachment: { filename: string; content: string } | undefined;

      if (productType === "carte-custom") {
        // atașăm fotografia DOAR la mailul admin (dacă există în CustomAsset)
        if (token) {
          const asset = await prisma.customAsset.findUnique({ where: { token } });
          if (asset) {
            photoAttachment = {
              filename: `fotografie-${childName || "copil"}.${asset.mime.split("/")[1] || "jpg"}`,
              content: asset.dataBase64,
            };
          }
        }
      } else if (catalog) {
        // generăm PDF din template (cu structura pe avatar)
        const { filename, contentBase64 } = await fillPdfFormAndBase64({
          slug: catalog.slug,
          type: catalog.type as "carte" | "fise",
          childName: childName || "Edy",
          fileTitle: catalog.title,
          character:
            productType === "carte"
              ? {
                  gender: md?.g,
                  hairstyle: md?.h,
                  eyeColor: md?.e,
                }
              : undefined,
        });
        pdfAttachment = { filename, content: contentBase64 };
      }

      // --- CLIENT ---
      if (email) {
        try {
          const htmlClient =
            productType === "carte-custom"
              ? `
              <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5;color:#111">
                <p>Mulțumim pentru comanda ta!</p>
                <p>Cartea personalizată (cu fotografia încărcată) va fi livrată pe email în <b>maximum 2 zile lucrătoare</b>.</p>
                ${wantPrinted ? `<p>Varianta tipărită se livrează în <b>5–7 zile lucrătoare</b>.</p>` : ``}
                <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
                <div style="text-align:center;opacity:.8;font-size:12px">
                  <img src="${siteUrl}/logo-flat.svg" alt="MiculMeuErou" style="height:28px;margin-bottom:6px" />
                  <div>MiculMeuErou.ro • Suport: <a href="mailto:hello@miculmeuerou.ro">hello@miculmeuerou.ro</a></div>
                  <div>© 2025 MiculMeuErou.ro</div>
                </div>
              </div>`
              : `
              <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5;color:#111">
                <p>Mulțumim pentru comanda ta!</p>
                <p>Ți-am atașat fișierul pentru: <b>${niceTitle}</b>.</p>
                ${wantPrinted ? `<p>Ai ales și varianta tipărită. Livrarea se face în <b>5–7 zile lucrătoare</b>.</p>` : ``}
                <p style="margin-top:12px;">Dacă nu îl vezi imediat, verifică și folderul Spam/Promoții.</p>
                <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
                <div style="text-align:center;opacity:.8;font-size:12px">
                  <img src="${siteUrl}/logo-flat.svg" alt="MiculMeuErou" style="height:28px;margin-bottom:6px" />
                  <div>MiculMeuErou.ro • Suport: <a href="mailto:hello@miculmeuerou.ro">hello@miculmeuerou.ro</a></div>
                  <div>© 2025 MiculMeuErou.ro</div>
                </div>
              </div>`;

          await sendMailSafe({
            from: FROM,
            to: email,
            subject: `Comanda ta: ${niceTitle}`,
            html: htmlClient,
            attachments: pdfAttachment ? [pdfAttachment] : undefined,
          });

          await prisma.emailLog.create({
            data: { orderId: order.id, to: email, subject: `Comanda ta: ${niceTitle}`, success: true },
          });
        } catch (e: any) {
          await prisma.emailLog.create({
            data: {
              orderId: order.id,
              to: email,
              subject: `Comanda ta: ${niceTitle}`,
              success: false,
              error: String(e?.message || e),
            },
          });
          await prisma.order.update({ where: { id: order.id }, data: { status: "email_failed" } });
        }
      }

      // --- ADMIN ---
      try {
        const htmlAdmin =
          productType === "carte-custom"
            ? `
            <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5;color:#111">
              <h3>Comandă nouă (Creează-ți cartea)</h3>
              <p><b>Titlu:</b> ${niceTitle}</p>
              <p><b>Nume copil:</b> ${childName || "-"}</p>
              ${md?.age ? `<p><b>Vârstă:</b> ${md.age}</p>` : ``}
              ${(md?.rel || md?.reln) ? `<p><b>Dedicat de la:</b> ${md?.rel || "-"} ${md?.reln ? `(${md.reln})` : ""}</p>` : ``}
              ${md?.cv ? `<p><b>Copertă selectată:</b> ${md.cv}</p>` : ``}
              ${md?.st ? `<p><b>Titlu selectat:</b> ${md.st}</p>` : ``}
              <p><b>Tipărit:</b> ${wantPrinted ? "DA" : "NU"} • <b>Transport:</b> ${wantPrinted ? PRICE.SHIPPING_FEE + " RON" : "—"}</p>
              ${email ? `<p><b>Email client:</b> ${email}</p>` : ""}
              <p>Fotografia clientului este atașată.</p>
            </div>`
            : `
            <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5;color:#111">
              <h3>Comandă nouă</h3>
              <p><b>Titlu:</b> ${niceTitle}</p>
              <p><b>Nume copil:</b> ${childName || "-"}</p>
              ${md?.g ? `<p><b>Gen:</b> ${md.g}</p>` : ``}
              ${md?.h ? `<p><b>Coafură:</b> ${md.h}</p>` : ``}
              ${md?.e ? `<p><b>Ochi:</b> ${md.e}</p>` : ``}
              <p><b>Tip produs:</b> ${productType}</p>
              <p><b>Tipărit:</b> ${wantPrinted ? "DA" : "NU"} • <b>Transport:</b> ${wantPrinted ? PRICE.SHIPPING_FEE + " RON" : "—"}</p>
              ${email ? `<p><b>Email client:</b> ${email}</p>` : ""}
              <p>PDF-ul generat este atașat pentru arhivă.</p>
            </div>`;

        const attachments = [
          ...(pdfAttachment ? [pdfAttachment] : []),
          ...(photoAttachment ? [photoAttachment] : []),
        ];

        await sendMailSafe({
          from: FROM,
          to: process.env.ORDERS_TO!,
          subject: `Comandă: ${niceTitle} (${childName || "-"})`,
          html: htmlAdmin,
          attachments: attachments.length ? attachments : undefined,
        });

        await prisma.emailLog.create({
          data: { orderId: order.id, to: process.env.ORDERS_TO!, subject: `Comandă: ${niceTitle}`, success: true },
        });
      } catch (e: any) {
        await prisma.emailLog.create({
          data: {
            orderId: order.id,
            to: process.env.ORDERS_TO!,
            subject: `Comandă: ${niceTitle}`,
            success: false,
            error: String(e?.message || e),
          },
        });
        await prisma.order.update({ where: { id: order.id }, data: { status: "email_failed" } });
      }
    }

    await prisma.order.update({ where: { id: order.id }, data: { status: "emailed" } });
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook processing error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Webhook error" }, { status: 500 });
  }
}
