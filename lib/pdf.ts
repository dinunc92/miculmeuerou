import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Child = {
  childName: string;
  age: string;
  gender: string;
  eyeColor: string;
  hairColor: string;
  hairstyle: string;
  glasses: boolean;
};

export async function generateFisePDF(opts: {
  productTitle: string; // ex: "Fișe educative 4–5 ani"
  pages?: number;       // câte pagini să genereze (demo)
  brand?: { name?: string };
  child: Child;
}) {
  const {
    productTitle,
    pages = 5, // DEMO: 5 pagini. Poți crește la 20 când ești gata cu conținutul.
    brand = { name: "Micul Meu Erou" },
    child
  } = opts;

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= pages; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portret (pt)
    const { width, height } = page.getSize();

    // margini
    const m = 36;

    // header
    page.drawText(brand.name || "Micul Meu Erou", {
      x: m,
      y: height - m - 10,
      size: 12,
      font: fontBold,
      color: rgb(0.04, 0.85, 0.87) // turcoaz deschis aproximativ
    });

    // titlu fișă
    page.drawText(`${productTitle} — Pagina ${i}`, {
      x: m,
      y: height - m - 36,
      size: 16,
      font: fontBold,
      color: rgb(0.18, 0.18, 0.18)
    });

    // info copil
    const line1 = `Fișa veselă a lui ${child.childName || "[Nume]"} (${child.age || "?"} ani)`;
    const line2 = `Gen: ${child.gender} | Ochi: ${child.eyeColor} | Păr: ${child.hairColor} (${child.hairstyle}) ${child.glasses ? "| 👓" : ""}`;
    page.drawText(line1, { x: m, y: height - m - 60, size: 12, font, color: rgb(0.2,0.2,0.2) });
    page.drawText(line2, { x: m, y: height - m - 78, size: 10, font, color: rgb(0.4,0.4,0.4) });

    // „exercițiu” placeholder – o zonă mare încadrată unde tu poți ulterior desena elementele
    const areaX = m, areaY = m + 80, areaW = width - m*2, areaH = height - m*2 - 120;
    // chenar
    page.drawRectangle({
      x: areaX, y: areaY, width: areaW, height: areaH,
      borderColor: rgb(0.72, 0.54, 0.84), // lila aprox
      borderWidth: 2
    });
    page.drawText("Spațiu exercițiu (placeholder)", {
      x: areaX + 12,
      y: areaY + areaH - 24,
      size: 12,
      font: font,
      color: rgb(0.45, 0.45, 0.45)
    });

    // footer
    page.drawText("© MiculMeuErou.ro • Doar pentru uz personal. Redistribuirea interzisă.", {
      x: m,
      y: m - 2,
      size: 9,
      font,
      color: rgb(0.5,0.5,0.5)
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
