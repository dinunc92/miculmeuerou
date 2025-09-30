import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { resend, FROM } from "@/lib/resend";

export async function POST(req: NextRequest){
  const sig = req.headers.get("stripe-signature") as string;
  const buf = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err:any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if(event.type === "checkout.session.completed"){
    const s = event.data.object as any;
    const items = JSON.parse(s.metadata?.items || "[]");
    const email = s.customer_details?.email;

    // TODO: dacă produs = fișe -> generezi link PDF (sau atașezi)
    // Deocamdată trimitem un mail simplu de confirmare + placeholder
    if(email){
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Comanda ta Micul Meu Erou",
        html: `<p>Mulțumim pentru comandă!</p>
               <p>Produse: ${items.map((i:any)=>i.title).join(", ")}</p>
               <p>Fișele (dacă există în comandă) vor fi livrate în curând pe email ca PDF.</p>`
      });
    }
  }
  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } } as any;
