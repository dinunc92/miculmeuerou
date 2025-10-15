import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function generateFisePDF({ productTitle, pages, child }: any) {
  const pdfDoc = await PDFDocument.create();

  const fontPath = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
  const fontBytes = fs.readFileSync(fontPath);
  const font = await pdfDoc.embedFont(fontBytes);

  for (let i = 0; i < pages; i++) {
    const page = pdfDoc.addPage([595, 842]); // A4
    const { height } = page.getSize();
    page.drawText(`${productTitle} – Pagina ${i + 1}`, {
      x: 50, y: height - 100, size: 18, font, color: rgb(0, 0, 0),
    });
    if (child?.childName) {
      page.drawText(`Pentru: ${child.childName}`, {
        x: 50, y: height - 140, size: 14, font, color: rgb(0.2, 0.2, 0.2),
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
