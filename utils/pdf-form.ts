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

async function resolveTemplatePath(
  slug: string,
  type: Kind,
  ch?: CharacterOpts
): Promise<string> {
  const base =
    type === "carte"
      ? path.join(process.cwd(), "public", "books")
      : path.join(process.cwd(), "public", "worksheets");

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
    } catch {}
  }

  const p1 = path.join(base, slug, "template.pdf");
  try {
    await fs.access(p1);
    return p1;
  } catch {}

  const p2 = path.join(base, `${slug}.pdf`);
  await fs.access(p2); // lasă să arunce ENOENT pentru debugging clar
  return p2;
}

// Încarcă font TTF cu diacritice (DejaVuSans.ttf în /public/fonts)
async function loadFontBytes(): Promise<Uint8Array> {
  const p = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
  const buf = await fs.readFile(p);
  return new Uint8Array(buf);
}

// câmpurile de formular care primesc numele copilului
function allNameFields(): string[] {
  return [
    "NumeCopil",
    "NumeCopil_1",
    "NumeCopil_2",
    "NumeCopil_Coperta",
    "NumeCopil_Interior",
  ];
}

// titlul final de fișier: înlocuiește [NumeCopil] și curăță sufixe descriptive
function resolveFileTitle(fileTitle: string, childName: string) {
  const cleanTitle = (fileTitle || "carte")
    .replace(/\[NumeCopil\]/g, childName)
    .replace(/\s*[–-]\s*(băiat|fată).*$/i, "")
  .trim();

  return `${cleanTitle}.pdf`;
}

// regenerează aparențele câmpurilor text cu fontul nostru
function updateAllTextFieldAppearances(pdfDoc: PDFDocument, font: PDFFont) {
  const form = pdfDoc.getForm();
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
  character?: CharacterOpts; // pentru căutarea template-ului corect la avatar
}) {
  const srcPath = await resolveTemplatePath(opts.slug, opts.type, opts.character);
  const srcBuf = await fs.readFile(srcPath);
  const src = new Uint8Array(srcBuf);

  // Încărcăm PDF
  const pdfDoc = await PDFDocument.load(src);
  const form = pdfDoc.getForm();

  // Font DejaVuSans.ttf
  const fontBytes = await loadFontBytes();
  const embedded = await pdfDoc.embedFont(fontBytes);

  // Completăm toate câmpurile NumeCopil*
  const name = (opts.childName || "Edy").slice(0, 24);
  for (const fieldName of allNameFields()) {
    try {
      const tf = form.getTextField(fieldName);
      if (tf) {
        tf.setText(name);
        (tf as any).updateAppearances?.(embedded);
      }
    } catch {}
  }

  // (siguranță) regenerează aparențele
  try {
    (form as any).updateFieldAppearances?.(embedded);
  } catch {}
  updateAllTextFieldAppearances(pdfDoc, embedded);

  // Aplatizăm
  form.flatten();

  // Salvăm
  const out = await pdfDoc.save(); // Uint8Array
  const contentBase64 = Buffer.from(out).toString("base64");
  const filename = resolveFileTitle(opts.fileTitle, name);

  return { filename, contentBase64 };
}
