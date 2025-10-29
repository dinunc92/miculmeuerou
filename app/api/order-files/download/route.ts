// app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { byId } from "@/data/products";
import { fillPdfFormAndBase64 } from "@/utils/pdf-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const itemId = req.nextUrl.searchParams.get("item");
    if (!itemId) return NextResponse.json({ error: "missing item" }, { status: 400 });

    const item = await prisma.orderItem.findUnique({ where: { id: itemId } });
    if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });

    if (!(item.productType === "fise" || item.productType === "carte")) {
      return NextResponse.json({ error: "not downloadable" }, { status: 400 });
    }

    const catalog = byId(item.productId);
    if (!catalog) return NextResponse.json({ error: "unknown product" }, { status: 404 });

    const childName = ((item.customization as any)?.childName as string | undefined) || "Edy";

    const { filename, contentBase64 } = await fillPdfFormAndBase64({
      slug: catalog.slug,
      type: catalog.type as "carte" | "fise",
      childName,
      fileTitle: catalog.title,
    });

    const buf = Buffer.from(contentBase64, "base64");
    const bytes = new Uint8Array(buf);

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    console.error("download error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "download error" }, { status: 500 });
  }
}
