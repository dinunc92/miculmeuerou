// app/api/download/route.ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // exemplu: primești un Base64 și îl trimiți ca download
  const { filename, base64 } = await req.json();

  // Base64 -> Uint8Array
  const bin = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  // Uint8Array -> ArrayBuffer (slice safe)
  const ab = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);

  return new Response(ab, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename || "fisier.pdf"}"`,
      "Cache-Control": "no-store",
    },
  });
}
