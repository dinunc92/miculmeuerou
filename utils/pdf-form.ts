// utils/pdf-form.ts
import fs from "fs/promises";
import path from "path";
import { PDFDocument, PDFFont } from "pdf-lib";

// Tipuri de produse
export type Kind = "carte" | "fise";

// Personalizare (pentru găsirea șablonului pe avatar)
export type CharacterOpts = {
  gender?: "boy" | "girl";
  hairstyle?: string; // ex. "blonde-curly"
  eyeColor?: "blue" | "brown" | "green";
};

// --- Helper: rezolvăm calea spre template.pdf după structura nouă ---
// public/books/{slug}/{gender}/{hairstyle}/{eyeColor}/template.pdf
// Fallback: public/books/{slug}.pdf (legacy) sau public/worksheets/{slug}.pdf
async function resolveTemplatePath(
  slug: string,
  type: Kind,
  ch?: CharacterOpts
): Promise<string> {
  const base =
    type === "carte"
      ? path.join(process.cwd(), "public", "books")
      : path.join(process.cwd(), "public", "worksheets");

  // dacă avem toate atributele avatarului -> căutăm structura pe foldere
  if (type === "carte" && ch?.gender && ch?.hairstyle && ch?.eyeColor) {
    const p = path.join(
      base,
      slug,
      ch.gender,
      ch.hairstyle,
      ch.eyeColor,
      "template.pdf"
    );
    try {
      await fs.access(p);
      return p;
    } catch {
      // cade pe fallback mai jos
    }
  }

  // fallback 1: {base}/{slug}/template.pdf
  const p1 = path.join(base, slug, "template.pdf");
  try {
    await fs.access(p1);
    return p1;
  } catch {}

  // fallback 2: {base}/{slug}.pdf (moștenire)
  const p2 = path.join(base, `${slug}.pdf`);
  await fs.access(p2); // dacă nu există, lasă să arunce ENOENT (utile pentru debugging)
  return p2;
}

// Încarcă font TTF cu diacritice (DejaVuSans.ttf în /public/fonts)
async function loadFontBytes(): Promise<Uint8Array> {
  const p = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
  const buf = await fs.readFile(p);
  return new Uint8Array(buf); // asigurăm tipul așteptat de pdf-lib
}

// câmpuri de formular care vor primi numele copilului
function allNameFields(): string[] {
  return [
    "NumeCopil",
    "NumeCopil_1",
    "NumeCopil_2",
    "NumeCopil_Coperta",
    "NumeCopil_Interior",
  ];
}

// numele fișierului final: înlocuiește [NumeCopil] și scoate descrierea avatarului din titlu
function resolveFileTitle(fileTitle: string, childName: string) {
  const cleanTitle = (fileTitle || "carte")
    .replace(/\[NumeCopil\]/g, childName)
    // elimină eventuale sufixe de tip: "– băiat, blonde-spike, blue"
    .replace(/\s*[–-]\s*(băiat|fată).*$/i, "")
    .trim();

  return `${cleanTitle}.pdf`;
}

// regenerează aparențele câmpurilor text cu fontul nostru
function updateAllTextFieldAppearances(pdfDoc: PDFDocument, font: PDFFont) {
  const form = pdfDoc.getForm();
  // api public: getFields()
  const fields = (form as any).getFields?.() || [];
  for (const f of fields) {
    if (typeof (f as any).setText === "function") {
      (f as any).updateAppearances?.(font);
    }
  }
}

// API principal: întoarce { filename, contentBase64 }
export async function fillPdfFormAndBase64(opts: {
  slug: string;
  type: Kind;
  childName: string;
  fileTitle: string; // ex: "Ziua lui [NumeCopil] – băiat, blonde-spike, blue"
  character?: CharacterOpts; // pentru căutarea template-ului corect
}) {
  // 1) găsim calea template-ului
  const srcPath = await resolveTemplatePath(opts.slug, opts.type, opts.character);
  const srcBuf = await fs.readFile(srcPath);
  const src = new Uint8Array(srcBuf);

  // 2) încărcăm PDF (lăsăm updateFieldAppearances default -> îl controlăm noi)
  const pdfDoc = await PDFDocument.load(src);
  const form = pdfDoc.getForm();

  // 3) fontul cu diacritice
  const fontBytes = await loadFontBytes();
  const embedded = await pdfDoc.embedFont(fontBytes);

  // 4) completăm toate câmpurile NumeCopil*
  const name = (opts.childName || "Edy").slice(0, 24);
  for (const fieldName of allNameFields()) {
    const tf = form.getTextField(fieldName);
    if (tf) {
      tf.setText(name);
      (tf as any).updateAppearances?.(embedded);
    }
  }
  // (siguranță) regenerează aparențele
  form.updateFieldAppearances(embedded);
  updateAllTextFieldAppearances(pdfDoc, embedded);

  // 5) aplatizăm
  form.flatten();

  // 6) salvăm
  const out = await pdfDoc.save(); // Uint8Array
  const contentBase64 = Buffer.from(out).toString("base64");
  const filename = resolveFileTitle(opts.fileTitle, name);

  return { filename, contentBase64 };
}
