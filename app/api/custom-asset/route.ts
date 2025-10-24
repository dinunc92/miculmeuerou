import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const base64 = buf.toString("base64");
  const token = crypto.randomUUID();
  const mime = file.type || "image/jpeg";

  await prisma.customAsset.create({
    data: { token, mime, dataBase64: base64 },
  });

  return NextResponse.json({ token });
}
