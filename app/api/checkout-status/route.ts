import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import fs from "fs";
import path from "path";

function sourcePdfPath(item:any){
  const baseTitleMap: Record<string,string> = {
    "carte-ziua-lui-edy": "Ziua lui XXX",
    "carte-fara-suzi": "Edy nu mai are nevoie de suzi".replace(/Edy/g,"XXX"),
    "carte-vrea-sa-creasca": "Edy vrea să crească".replace(/Edy/g,"XXX"),
    "carte-invata-sa-numere": "Edy învață să numere".replace(/Edy/g,"XXX"),
    "carte-halloween-prieteni": "Edy și prietenii lui de Halloween".replace(/Edy/g,"XXX"),
    "fise-3-4": "Fișe educative 3-4 ani pentru XXX",
    "fise-4-5": "Fișe educative 4-5 ani pentru XXX",
    "fise-5-6": "Fișe educative 5-6 ani pentru XXX",
  };
  const base = baseTitleMap[item.productId] || "Produs pentru XXX";
  const folder = item.productType === "carte" ? "carti" : "fise";
  const file = `${base}_${item.gender}_${item.hairstyle}_${item.eye}.pdf`;
  return path.join(process.cwd(), "public", "books", folder, file);
}

export async function GET(req: NextRequest) {
  try{
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");
    if(!session_id) return NextResponse.json({ error:"missing session_id" }, { status:400 });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const cartTxt = (session.metadata?.cart as string) || "[]";
    let items:any[] = [];
    try { items = JSON.parse(cartTxt); } catch { items = []; }

    const checks = items.map(it => {
      const src = sourcePdfPath(it);
      const exists = fs.existsSync(src);
      return { item: it, src, exists };
    });

    const haveAll = checks.every(c => c.exists);

    return NextResponse.json({
      haveAll,
      missing: checks.filter(c=>!c.exists).map(c=>({ productId:c.item.productId, src:c.src })),
      countExpected: checks.length,
      countFound: checks.filter(c=>c.exists).length
    });
  }catch(e:any){
    return NextResponse.json({ error: e.message || "error" }, { status: 500 });
  }
}
