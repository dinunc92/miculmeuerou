import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token, mime, dataBase64 } = await req.json();
    if (!token || !mime || !dataBase64) {
      return NextResponse.json({ error: "Lipsesc câmpuri" }, { status: 400 });
    }
    await prisma.customAsset.upsert({
      where: { token },
      update: { mime, dataBase64 },
      create: { token, mime, dataBase64 },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Eroare" }, { status: 500 });
  }
}
