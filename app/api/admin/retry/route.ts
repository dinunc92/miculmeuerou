// app/api/admin/retry/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: "orderId lipsă" }, { status: 400 });

  // aici poți porni un job de retrimitere; ca schelet, doar resetăm statusul la 'received'
  await prisma.order.update({ where: { id: orderId }, data: { status: "received" } });

  return NextResponse.json({ ok: true });
}
