// app/api/order-files/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ItemDTO = {
  id: string;
  title: string;
  productId: string;
  type: "fise" | "carte" | "carte-custom";
  childName: string | null;
};

// tip local pentru ce ne întoarce Prisma pe order.items (ajustabil dacă ai alte câmpuri)
type DbOrderItem = {
  id: string;
  title: string;
  productId: string;
  type: string;
  childName: string | null;
};

export async function GET(req: NextRequest) {
  const sid = req.nextUrl.searchParams.get("sid") || "";
  if (!sid) return NextResponse.json({ items: [] });

  const order = await prisma.order.findUnique({
    where: { paymentId: sid }, // sau stripeSessionId, după schema ta
    include: { items: true },
  });

  if (!order) return NextResponse.json({ items: [] });

  const items: ItemDTO[] = (order.items as unknown as DbOrderItem[]).map(
    (i: DbOrderItem): ItemDTO => ({
      id: i.id,
      title: i.title,
      productId: i.productId,
      type: (i.type as "fise" | "carte" | "carte-custom"),
      childName: i.childName,
    })
  );

  return NextResponse.json({ items });
}
