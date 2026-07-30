/**
 * assets/foods 안의 음식 사진을 전부 JPEG로 통일하고 용량을 줄인다.
 * 새 사진을 추가한 뒤 `npm run compress-images`로 실행하면 된다.
 *
 * - 가장 긴 변을 1200px로 제한 (그 이하면 그대로 둠, 확대 안 함)
 * - JPEG 품질 78로 재인코딩
 * - .png로 넣었어도 자동으로 .jpg로 변환됨 (localImages.ts의 require 경로도 확인 필요)
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIR = path.join(__dirname, '..', 'assets', 'foods');
const MAX_SIDE = 1200;
const QUALITY = 78;

async function main() {
  const files = fs.readdirSync(DIR).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const inputPath = path.join(DIR, file);
    const before = fs.statSync(inputPath).size;

    const base = file.replace(/\.(jpg|jpeg|png)$/i, '');
    const newFile = `${base}.jpg`;
    const tmpPath = path.join(DIR, `__tmp__${newFile}`);

    await sharp(inputPath)
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(tmpPath);

    const after = fs.statSync(tmpPath).size;
    fs.unlinkSync(inputPath);
    fs.renameSync(tmpPath, path.join(DIR, newFile));

    totalBefore += before;
    totalAfter += after;
    console.log(
      `${file} -> ${newFile}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
    );
  }

  console.log('---');
  console.log(
    `TOTAL: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
