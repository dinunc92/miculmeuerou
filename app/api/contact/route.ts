import { NextRequest, NextResponse } from "next/server";
import { resend, FROM } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try{
    const txt = await req.text();
    const { name, email, phone, message } = txt ? JSON.parse(txt) : {};
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Câmpuri lipsă." }, { status: 400 });
    }
    await resend.emails.send({
      from: FROM,
      to: "dinunc92@gmail.com",      // schimbă cu adresa ta
      reply_to: email,
      subject: `Mesaj nou – ${name}`,
      html: `<p><b>De la:</b> ${name} (${email})</p>
             <p><b>Telefon:</b> ${phone || "-"}</p>
             <p><b>Mesaj:</b><br/>${String(message).replace(/\n/g,"<br/>")}</p>`
    });
    return NextResponse.json({ ok: true });
  }catch(e:any){
    return NextResponse.json({ error: e.message || "Eroare trimitere email" }, { status: 400 });
  }
}
