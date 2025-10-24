// scripts/img-optimize.mjs
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();

const INPUT_DIRS = [
  "public/previews",  // /previews/<slug>/p1.jpg...
  "public/covers",    // /covers/<slug>.jpg...
  "public/reviews"    // /reviews/*.jpg
].map(p => path.join(ROOT, p));

const OUT_DIR = path.join(ROOT, "public/_optimized"); // output separat (nu-ți stric originalele)
const MAX_W = 1200;    // lățime maximă pentru varianta mare
const MAX_W_SM = 600;  // lățime pentru thumb
const QUALITY = 80;    // calitate WebP

async function* walk(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function outPath(file, size) {
  // exemplu: public/previews/slug/p1.jpg -> public/_optimized/previews/slug/p1@1200.webp
  const rel = path.relative(path.join(ROOT, "public"), file).replace(/\\/g, "/");
  const extLess = rel.replace(/\.[a-zA-Z0-9]+$/, "");
  return path.join(OUT_DIR, `${extLess}@${size}.webp`);
}

async function ensureDir(p) {
  await fsp.mkdir(path.dirname(p), { recursive: true });
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return;

  for (const [size, width] of [["1200", MAX_W], ["600", MAX_W_SM]]) {
    const out = outPath(file, size);
    await ensureDir(out);
    const buf = await fsp.readFile(file);
    await sharp(buf).resize({ width, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
    console.log("✔", path.relative(ROOT, out));
  }
}

async function main() {
  for (const base of INPUT_DIRS) {
    if (!fs.existsSync(base)) continue;
    for await (const f of walk(base)) {
      await processFile(f);
    }
  }
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
