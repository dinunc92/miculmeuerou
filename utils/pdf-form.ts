// utils/pdf-form.ts
import fs from "fs/promises";
import path from "path";
import { PDFDocument, PDFFont } from "pdf-lib";

type Kind = "carte" | "fise";

/** Calea către fișierul PDF-șablon, pe baza slug-ului și tipului. */
export function slugPath(slug: string, type: Kind) {
  const base = path.join(
    process.cwd(),
    "public",
    type === "carte" ? "books" : "worksheets"
  );
  return path.join(base, `${slug}.pdf`);
}

/** Încarcă fontul TTF pentru diacritice (DejaVuSans). Pune fișierul în /public/fonts/DejaVuSans.ttf */
async function loadFontBytes() {
  const p = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
  return fs.readFile(p);
}

/** Numele câmpurilor text pe care le umplem cu numele copilului.
 * Adaugă aici orice alte nume folosești în PDF (ex. NumeCopil_Coperta).
 */
function allNameFields() {
  return [
    "NumeCopil",
    "NumeCopil_1",
    "NumeCopil_2",
    "NumeCopil_Coperta",
    "NumeCopil_Interior",
  ];
}

/** Înlocuiește [NumeCopil] în titlul fișierului final. */
function resolveFileTitle(fileTitle: string, childName: string) {
  return (fileTitle || "carte").replace(/\[NumeCopil\]/g, childName) + ".pdf";
}

/** Actualizează aparențele tuturor câmpurilor text să folosească fontul nostru (diacritice ok). */
function updateAllTextFieldAppearances(pdfDoc: PDFDocument, font: PDFFont) {
  // pdf-lib nu expune direct lista tuturor câmpurilor; traversăm formularul prin API public
  const form = pdfDoc.getForm();
  // getFields() există, dar este tipat generic; îl folosim ca any pentru a le parcurge
  const fields = (form as any).getFields?.() || [];
  for (const f of fields) {
    // doar pentru textfields; altele le ignorăm
    if (typeof (f as any).setText === "function") {
      // Re-generează aparențele cu fontul nostru
      (f as any).updateAppearances?.(font);
    }
  }
}

/** Umple câmpurile `NumeCopil*`, aplatizează (flatten) și returnează { filename, contentBase64 } */
export async function fillPdfFormAndBase64(opts: {
  slug: string;          // ex. "ziua-lui-nume"
  type: Kind;            // "carte" | "fise"
  childName: string;     // ex. "Edy"
  fileTitle: string;     // ex. "Ziua lui [NumeCopil]"
}) {
  // 1) Citește șablonul
  const srcPath = slugPath(opts.slug, opts.type);
  const src = await fs.readFile(srcPath);

  // 2) Încarcă PDF-ul ca „formular” (nu actualizăm automat aparențele)
  const pdfDoc = await PDFDocument.load(src, { updateFieldAppearances: false });
  const form = pdfDoc.getForm();

  // 3) Încarcă fontul cu diacritice și setează-l ca aparență pentru textfields
  const fontBytes = await loadFontBytes();
  const embedded = await pdfDoc.embedFont(fontBytes);
  form.updateFieldAppearances(embedded);
  updateAllTextFieldAppearances(pdfDoc, embedded);

  // 4) Umple câmpurile standard cu numele copilului (limitează lungimea dacă vrei)
  const name = (opts.childName || "Edy").slice(0, 24);
  for (const fieldName of allNameFields()) {
    const f = form.getTextField(fieldName);
    if (f) {
      f.setText(name);
      // Sigurăm aparența corectă per-câmp (unele editoare ignoră setarea globală)
      (f as any).updateAppearances?.(embedded);
    }
  }

  // 5) Aplatizează formularul (devine static, ne-editabil)
  form.flatten();

  // 6) Salvează
  const out = await pdfDoc.save();
  const contentBase64 = Buffer.from(out).toString("base64");
  const filename = resolveFileTitle(opts.fileTitle, name);

  return { filename, contentBase64 };
}
