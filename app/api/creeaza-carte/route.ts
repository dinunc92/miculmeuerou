import { NextRequest, NextResponse } from "next/server";
import { resend, FROM } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

export async function POST(req: NextRequest){
  try {
    const form = await req.formData();
    const file = form.get("photo") as File | null;
    const childName = (form.get("childName") as string || "").slice(0, 10);
    const parentEmail = (form.get("parentEmail") as string || "").trim();
    const message = (form.get("message") as string || "").trim();

    if(!file) return NextResponse.json({ error: "Lipsește fotografia." }, { status: 400 });
    if(!file.type?.startsWith("image/")) return NextResponse.json({ error: "Fișierul trebuie să fie imagine." }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const base64 = buf.toString("base64");

    const toAdmin = process.env.ORDERS_TO!;
    const safeName = childName || "Eroul";

    // Email către tine (admin) cu atașamentul foto
    await sendMail({
      from: FROM,
      to: toAdmin,
      subject: `Fotografie primită – Creează-ți cartea (${safeName})`,
      html: `
        <p><b>Nume copil:</b> ${safeName}</p>
        <p><b>Email părinte:</b> ${parentEmail || "-"}</p>
        <p><b>Mesaj:</b> ${message ? message.replace(/\n/g,"<br/>") : "-"}</p>
        <p>Foto atașată mai jos.</p>
      `,
      attachments: [{ filename: file.name || "photo.jpg", content: base64 }],
    });

    // Răspuns client
    if (parentEmail) {
      await sendMail({
        from: FROM,
        to: parentEmail,
        subject: "Am primit fotografia – Micul Meu Erou",
        html: `
          <p>Mulțumim! Am primit fotografia pentru cartea personalizată.</p>
          <p>Verificăm imaginea și revenim pe email pentru confirmare și următorii pași.</p>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Eroare la trimiterea fotografiei." }, { status: 400 });
  }
}
