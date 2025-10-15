import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";

const FONT_PATH = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
const fontBytes = fs.existsSync(FONT_PATH) ? fs.readFileSync(FONT_PATH) : undefined;

export type PdfInfo = {
  productType: "carte" | "fise";
  baseTitle: string;   // cu [NumeCopil]
  gender?: "boy" | "girl";
  hair?: string;
  eye?: "green" | "brown" | "blue";
  childName: string;
};

export function sourcePdfPath(info: PdfInfo){
  const folder = info.productType === "carte" ? "carti" : "fise";
  // titluri noi: construim numele după convenție:
  // Ex: "Ziua lui [NumeCopil]_boy_brown-spike_green.pdf" sau pentru fișe: "Fișe educative 3-4 ani pentru [NumeCopil].pdf" (fără avatar)
  const suffix = info.productType === "carte" && info.gender && info.hair && info.eye
    ? `_${info.gender}_${info.hair}_${info.eye}`
    : ""; // fișele NU mai au avatar ⇒ fără sufix
  const srcName = `${info.baseTitle}${suffix}.pdf`;
  return path.join(process.cwd(),"public","books",folder,srcName);
}

export function outputPdfName(info: PdfInfo){
  const baseClean = info.baseTitle.replace(/\[NumeCopil\]/g, info.childName);
  return `${baseClean}.pdf`;
}

export async function personalizePdfSmart(info: PdfInfo): Promise<Buffer>{
  const src = sourcePdfPath(info);
  if(!fs.existsSync(src)) throw new Error(`Lipsește PDF-ul sursă: ${src}`);

  const bytes = fs.readFileSync(src);
  const pdfDoc = await PDFDocument.load(new Uint8Array(bytes)); // <-- FIX tip

  // 1) încearcă formularul AcroForm (NAME) pentru conținut; fișele pot avea doar badge
  try{
    const form = pdfDoc.getForm();
    const field = form.getTextField("NAME"); // dacă nu există, aruncă
    field.setText(info.childName);
    if (fontBytes) {
      const font = await pdfDoc.embedFont(new Uint8Array(fontBytes));
      form.updateFieldAppearances(font);
    } else {
      form.updateFieldAppearances();
    }
    form.flatten();
  }catch{
    // 2) fallback: badge discret pe prima pagină
    const page = pdfDoc.getPage(0);
    const font = fontBytes ? await pdfDoc.embedFont(new Uint8Array(fontBytes)) : undefined;
    const { width } = page.getSize();
    const text = `Pentru: ${info.childName}`;
    const size = 16;
    const pad = 10;
    const w = font ? font.widthOfTextAtSize(text, size) : text.length * size * 0.6;
    const bw = w + pad*2;
    const bh = size + pad*2;
    const x = Math.max(36, width - bw - 36);
    const y = 36;
    page.drawRectangle({ x, y, width: bw, height: bh, color: rgb(0.94,0.97,1) });
    page.drawText(text, { x: x + pad, y: y + pad, size, font, color: rgb(0.1,0.2,0.3) });
  }

  const out = await pdfDoc.save();
  return Buffer.from(out);
}
