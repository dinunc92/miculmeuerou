// app/api/creeaza-carte/route.ts
import { NextRequest, NextResponse } from "next/server";
import { resend, FROM } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function sendMailSafe(payload: any) {
  try {
    return await resend.emails.send(payload);
  } catch (e: any) {
    // fallback dacă domeniul nu e verificat încă
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
  try {
    const form = await req.formData();

    const file = form.get("photo") as File | null;
    const childName = (form.get("childName") as string || "").trim();
    const parentEmail = (form.get("parentEmail") as string || "").trim();
    const age = (form.get("age") as string) || "";
    const relation = (form.get("relation") as string) || "";
    const relationName = (form.get("relationName") as string || "");
    const wantPrinted = (form.get("wantPrinted") as string) === "1";
    const coverId = (form.get("coverId") as string) || "";
    const message = (form.get("message") as string) || "";

    if (!file) return NextResponse.json({ error: "Lipsește fotografia." }, { status: 400 });
    if (!file.type?.startsWith("image/")) return NextResponse.json({ error: "Fișierul trebuie să fie imagine." }, { status: 400 });
    if (!childName) return NextResponse.json({ error: "Lipsește numele copilului." }, { status: 400 });
    if (!parentEmail) return NextResponse.json({ error: "Lipsește emailul părintelui." }, { status: 400 });

    // pregătim atașamentul (fotografia) pentru admin
    const arr = new Uint8Array(await file.arrayBuffer());
    const base64 = Buffer.from(arr).toString("base64");
    const filename = file.name || "poza-copil.jpg";

    const adminTo = process.env.ORDERS_TO!;
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://miculmeuerou.ro";

    // 1) Email către ADMIN (cu atașament)
    await sendMailSafe({
      from: FROM,
      to: adminTo,
      subject: `Creează-ți cartea — ${childName}${wantPrinted ? " (TIPĂRIT)" : ""}`,
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial">
          <h3>Solicitare nouă „Creează-ți cartea”</h3>
          <p><b>Nume copil:</b> ${childName}${age ? `, <b>Vârsta:</b> ${age}` : ""}</p>
          <p><b>Dedicat de la:</b> ${relation}${relationName ? ` — ${relationName}` : ""}</p>
          <p><b>Copertă:</b> ${coverId || "-"}</p>
          <p><b>Var. tipărită:</b> ${wantPrinted ? "DA" : "NU"}</p>
          <p><b>Email părinte:</b> ${parentEmail}</p>
          ${message ? `<p><b>Mesaj:</b> ${message}</p>` : ""}
          <hr style="margin:12px 0;border:none;border-top:1px solid #eee"/>
          <p>Foto încărcată este atașată acestui email.</p>
          <p>Site: <a href="${site}">${site}</a></p>
        </div>
      `,
      attachments: [{ filename, content: base64 }],
    });

    // 2) Email către PĂRINTE (fără atașament)
    await sendMailSafe({
      from: FROM,
      to: parentEmail,
      subject: "Am primit cererea ta — Creează-ți cartea",
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; line-height:1.5; color:#111">
          <p>Mulțumim! Am primit cererea ta pentru cartea personalizată a lui/ei <b>${childName}</b>.</p>
          <p>Vom reveni pe email în <b>24 de ore</b> cu varianta digitală a cărții.</p>
          ${wantPrinted ? `<p>Ai ales și varianta tipărită — livrarea se face în <b>5–7 zile lucrătoare</b>.</p>` : ""}
          <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
          <div style="text-align:center;opacity:.8;font-size:12px">
            <img src="${site}/logo-flat.svg" alt="MiculMeuErou" style="height:28px;margin-bottom:6px" />
            <div>MiculMeuErou.ro • Suport: <a href="mailto:hello@miculmeuerou.ro">hello@miculmeuerou.ro</a></div>
            <div>© 2025 MiculMeuErou.ro</div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Eroare la procesare." }, { status: 500 });
  }
}
