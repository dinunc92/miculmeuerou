// app/api/personalize/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fillPdfFormAndBase64 } from "@/utils/pdf-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { slug, type, childName, title } = await req.json();
    if (!slug || !type || !childName || !title) {
      return NextResponse.json({ error: "slug, type, childName, title sunt necesare." }, { status: 400 });
    }
    const { filename, contentBase64 } = await fillPdfFormAndBase64({
      slug,
      type,
      childName,
      fileTitle: title,
    });
    const buf = Buffer.from(contentBase64, "base64");
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Eroare generare PDF" }, { status: 500 });
  }
}
