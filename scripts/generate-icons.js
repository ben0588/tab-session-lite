import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgPath = join(__dirname, '../public/icons/icon.svg');
const svg = readFileSync(svgPath);

const sizes = [16, 48, 128];

for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(join(__dirname, `../public/icons/icon${size}.png`));
  console.log(`Generated icon${size}.png`);
}

console.log('All icons generated!');
