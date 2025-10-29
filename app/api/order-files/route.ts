// app/api/order-files/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sid = req.nextUrl.searchParams.get("sid") || "";
  if (!sid) return NextResponse.json({ items: [] });

  const order = await prisma.order.findUnique({
    where: { paymentId: sid },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ items: [] });

const items = order.items
  .filter((i:any) => i.productType !== "carte-custom")
  .map((i: any) => {
    const t = (i.productType === "fise" ? "fise" : "carte") as "fise" | "carte";
    const n = i.customization?.childName || "Edy";
    const link = `/api/download?p=${encodeURIComponent(i.productId)}&t=${t}&n=${encodeURIComponent(n)}&title=${encodeURIComponent(i.title)}`;

    // titlu frumos:
    const niceTitle = t === "fise"
      ? `Fișe educative pentru ${n}`
      : String(i.title || "").replace("[NumeCopil]", n);

    return {
      id: i.id,
      title: niceTitle,
      productId: i.productId,
      type: t,
      childName: n,
      url: link,
    };
  });


  return NextResponse.json({ items });
}
