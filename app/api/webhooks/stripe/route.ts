import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { resend, FROM } from "@/lib/resend";
import { byId } from "@/data/products";
import { fillPdfFormAndBase64 } from "@/utils/pdf-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

async function sendMailSafe(payload: any) {
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

function formatOrderNo(n: number) {
  return String(n).padStart(6, "0");
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    const raw = await req.text();
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
    const items = full.line_items?.data || [];
    const totalRON = Math.round((full.amount_total || 0) / 100);

    // email prioritar din metadata.pe (setat în /api/checkout), altfel customer_details.email
    const parentEmail = (full.metadata?.pe || full.customer_details?.email || "").trim();

    const hasPrinted =
      full.metadata?.has_print === "1" ||
      items.some((li) => {
        const prod = li.price?.product as Stripe.Product;
        const md = (prod?.metadata || {}) as Record<string, any>;
        return md?.t === "shipping" || md?.wp === "1";
      });

    const s = full.metadata || {};
    const shippingAddress =
      s?.s_name
        ? `${s.s_name}
${s.s_street || ""}
${s.s_zip || ""} ${s.s_city || ""}`.trim()
        : null;
    const shippingPhone = s?.s_phone || null;

    // 1) orderNumber incremental în tranzacție
    const order = await prisma.$transaction(async (tx: { order: { findFirst: (arg0: { select: { orderNumber: boolean; }; orderBy: { orderNumber: string; }; }) => any; create: (arg0: { data: { paymentId: string; email: string; totalRON: number; status: string; orderNumber: any; hasPrinted: boolean; shippingAddress: string | null; shippingPhone: string | null; }; }) => any; }; }) => {
      const last = await tx.order.findFirst({
        select: { orderNumber: true },
        orderBy: { orderNumber: "desc" },
      });
      const nextNo = (last?.orderNumber || 0) + 1;
      return tx.order.create({
        data: {
          paymentId: session.id,
          email: parentEmail || "unknown@unknown",
          totalRON,
          status: "received",
          orderNumber: nextNo,
          hasPrinted,
          shippingAddress: shippingAddress || null,
          shippingPhone: shippingPhone || null,
        },
      });
    });

    // 2) OrderItem pentru produsele reale (ignorăm "shipping")
    for (const li of items) {
      const prod = li.price?.product as Stripe.Product;
      const md = (prod?.metadata || {}) as Record<string, any>;
      if (md?.t === "shipping") continue;

      const p = byId(md?.p || "");
      const title = prod?.name || li.description || (p?.title || "Produs");

      const customization: any = {};
      if (md?.n) customization.childName = md.n;
      if (md?.g) customization.gender = md.g;
      if (md?.e) customization.eyeColor = md.e;
      if (md?.h) customization.hairstyle = md.h;
      if (md?.wp) customization.wantPrinted = md.wp === "1";
      if (md?.tk) customization.token = md.tk;
      if (md?.st) customization.selectionTitle = md.st;
      if (md?.cv) customization.coverId = md.cv;
      if (md?.age) customization.age = Number(md.age);
      if (md?.rel) customization.relation = md.rel;
      if (md?.reln) customization.relationName = md.reln;
      if (md?.pm) customization.parentMessage = md.pm;

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

    // 3) Emailuri (client + admin)
    for (const li of items) {
      const prod = li.price?.product as Stripe.Product;
      const md = (prod?.metadata || {}) as Record<string, any>;
      if (md?.t === "shipping") continue;

      const productType = String(md?.t || "");
      const childName = String(md?.n || "");
      const wantPrinted = md?.wp === "1";
      const token = md?.tk as string | undefined;
      const parentMessage = md?.pm || "";
      const productId = String(md?.p || "");
      const catalog = byId(productId);

      const niceTitle =
        prod?.name || li.description || (catalog?.title || "Produs Micul Meu Erou");
      const orderNoStr = formatOrderNo(order.orderNumber);

      let pdfAttachment: { filename: string; content: string } | undefined;
      let photoAttachment: { filename: string; content: string } | undefined;
      let pdfMissing = false;

      if (productType === "carte-custom") {
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
        try {
          const { filename, contentBase64 } = await fillPdfFormAndBase64({
            slug: catalog.slug,
            type: catalog.type as "carte" | "fise",
            childName: childName || "Edy",
            fileTitle: catalog.title,
          });
          pdfAttachment = { filename, content: contentBase64 };
        } catch {
          pdfMissing = true;
        }
      }

      // ---- CLIENT ----
      if (parentEmail) {
        try {
          const isAvatar = productType === "carte";
          const isFoto = productType === "carte-custom";

          const subject =
            isFoto
              ? `📷 Comanda #${orderNoStr} – Carte personalizată cu fotografie`
              : isAvatar
              ? `📘 Comanda #${orderNoStr} – Carte personalizată cu avatar`
              : `🧩 Comanda #${orderNoStr} – Fișe educative`;

          const html: string[] = [
            `<p>Mulțumim pentru comanda ta!</p>`,
            `<p><b>${niceTitle}</b></p>`,
            `<p><b>Total:</b> ${order.totalRON} RON</p>`,
          ];

          if (productType === "carte-custom") {
            if (parentMessage) html.push(`<p><b>Mesajul tău:</b> ${parentMessage}</p>`);
            html.push(
              `<p>Cartea personalizată din fotografie va fi livrată pe email în <b>maximum 48 de ore</b>.</p>`
            );
          } else {
            if (pdfAttachment && !pdfMissing) {
              html.push(`<p>Ți-am atașat PDF-ul la acest email.</p>`);
            } else {
              html.push(
                `<p><b>Atenție:</b> PDF-ul nu a putut fi generat automat. Vom reveni pe email în cel mai scurt timp.</p>`
              );
            }
          }

          if (wantPrinted) {
            html.push(
              `<p>Ai ales și varianta tipărită. Livrarea se face în <b>5–7 zile lucrătoare</b>.</p>`
            );
            if (order.shippingAddress) {
              html.push(`<p><b>Adresă livrare:</b><br/><pre>${order.shippingAddress}</pre></p>`);
            }
            if (order.shippingPhone) {
              html.push(`<p><b>Telefon:</b> ${order.shippingPhone}</p>`);
            }
          }

          html.push(
            `<hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>` +
              `<div style="text-align:center;opacity:.8;font-size:12px">` +
              `<img src="${siteUrl}/logo-flat.svg" alt="MiculMeuErou" style="height:28px;margin-bottom:6px" />` +
              `<div>MiculMeuErou.ro • Suport: <a href="mailto:hello@miculmeuerou.ro">hello@miculmeuerou.ro</a></div>` +
              `<div>© 2025 MiculMeuErou.ro</div></div>`
          );

          await sendMailSafe({
            from: FROM,
            to: parentEmail,
            subject,
            html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5;color:#111">${html.join(
              ""
            )}</div>`,
            attachments: pdfAttachment ? [pdfAttachment] : undefined,
          });

          await prisma.emailLog.create({
            data: { orderId: order.id, to: parentEmail, subject, success: true },
          });
        } catch (e: any) {
          await prisma.emailLog.create({
            data: {
              orderId: order.id,
              to: parentEmail,
              subject: `Eșec email client (#${formatOrderNo(order.orderNumber)})`,
              success: false,
              error: String(e?.message || e),
            },
          });
          await prisma.order.update({ where: { id: order.id }, data: { status: "email_failed" } });
        }
      }

      // ---- ADMIN ----
      try {
        const isAvatar = productType === "carte";
        const isFoto = productType === "carte-custom";

        let subjectBase = isFoto ? "Carte-foto" : isAvatar ? "Carte-avatar" : "Fișe";
        if (!isFoto && pdfMissing) subjectBase = `⚠️ ${subjectBase} (PDF lipsă)`;

        const subject = `#${formatOrderNo(order.orderNumber)} · ${subjectBase} · ${niceTitle}`;

        const lines: string[] = [
          `<h3>Comandă nouă</h3>`,
          `<p><b>Nr:</b> #${formatOrderNo(order.orderNumber)}</p>`,
          `<p><b>Email client:</b> ${parentEmail || "-"}</p>`,
          `<p><b>Titlu:</b> ${niceTitle}</p>`,
          `<p><b>Tip produs:</b> ${productType}</p>`,
          `<p><b>Total:</b> ${order.totalRON} RON</p>`,
          `<p><b>Nume copil:</b> ${childName || "-"}</p>`,
          `<p><b>Tipărit:</b> ${wantPrinted ? "DA" : "NU"}</p>`,
        ];

        if (isFoto) {
          if (md?.age) lines.push(`<p><b>Vârstă:</b> ${md.age}</p>`);
          if (md?.rel || md?.reln)
            lines.push(`<p><b>Dedicat de la:</b> ${md?.rel || "-"} ${md?.reln ? `(${md.reln})` : ""}</p>`);
          if (md?.cv) lines.push(`<p><b>Copertă aleasă (ID):</b> ${md.cv}</p>`);
          if (md?.st) lines.push(`<p><b>Titlu selectat:</b> ${md.st}</p>`);
          if (parentMessage) lines.push(`<p><b>Mesaj client:</b> ${parentMessage}</p>`);
        }

        if (wantPrinted && order.shippingAddress) {
          lines.push(`<p><b>Adresă livrare:</b><br/><pre>${order.shippingAddress}</pre></p>`);
          if (order.shippingPhone) lines.push(`<p><b>Telefon:</b> ${order.shippingPhone}</p>`);
        }

        if (pdfMissing && !isFoto) {
          lines.push(`<p style="color:#b91c1c"><b>ATENȚIE:</b> PDF-ul nu a fost găsit/generat automat.</p>`);
        }

        const attachments = [
          ...(pdfAttachment ? [pdfAttachment] : []),
          ...(photoAttachment ? [photoAttachment] : []),
        ];

        await sendMailSafe({
          from: FROM,
          to: process.env.ORDERS_TO!,
          subject,
          html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5;color:#111">${lines.join(
            ""
          )}</div>`,
          attachments: attachments.length ? attachments : undefined,
        });

        await prisma.emailLog.create({
          data: { orderId: order.id, to: process.env.ORDERS_TO!, subject, success: true },
        });
      } catch (e: any) {
        await prisma.emailLog.create({
          data: {
            orderId: order.id,
            to: process.env.ORDERS_TO!,
            subject: `Eșec email admin (#${formatOrderNo(order.orderNumber)})`,
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
