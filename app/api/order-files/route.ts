// app/api/order-files/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sid = req.nextUrl.searchParams.get("sid") || "";
    if (!sid) return NextResponse.json({ items: [] });

    // Căutăm comanda după paymentId (== Stripe session.id)
    const order = await prisma.order.findFirst({
      where: { paymentId: sid },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ items: [] });

    // Returnăm doar câmpurile necesare UI-ului
    const items = order.items.map((i: any) => ({
      id: i.id,
      title: i.title,
      productId: i.productId,
      productType: i.productType ?? i.type ?? "",   // compat cu modele mai vechi
      priceRON: i.priceRON ?? i.unitRON ?? 0,
      // dacă ai salvat personalizarea în câmpuri separate:
      childName: i.customization?.childName ?? i.childName ?? "",
      // poți construi aici și linkuri de descărcare din storage-ul tău, dacă ai:
      // downloadUrl: `/api/download?item=${i.id}`,
    }));

    return NextResponse.json({ items });
  } catch (e: any) {
    console.error("order-files error:", e?.message || e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
