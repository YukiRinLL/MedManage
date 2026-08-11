const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, 'output', 'pages');
const files = fs.readdirSync(pagesDir);
const pageData = JSON.parse(fs.readFileSync(path.join(pagesDir, files[0]), 'utf8'));

function findLayers(layers, predicate, result = []) {
  (layers || []).forEach(l => {
    if (predicate(l)) result.push(l);
    if (l.layers) findLayers(l.layers, predicate, result);
  });
  return result;
}

const bitmaps = findLayers(pageData.layers, l => l._class === 'bitmap');
console.log('Bitmap count:', bitmaps.length);
bitmaps.slice(0, 5).forEach((b, i) => {
  console.log(`\nBitmap ${i}: name=${b.name}`);
  console.log('ALL keys:', Object.keys(b));
  console.log('image field:', b.image ? JSON.stringify(b.image).slice(0, 800) : 'NO IMAGE FIELD');
  if (b.style && b.style.fills) {
    b.style.fills.forEach((f, fi) => {
      if (f.image) console.log(`  fill[${fi}].image:`, JSON.stringify(f.image).slice(0, 800));
    });
  }
});

// Check output/images filenames  
const imgsDir = path.resolve(__dirname, 'output', 'images');
console.log('\nImages on disk:', fs.readdirSync(imgsDir));

// Also check refs dir in output
if (fs.existsSync(path.resolve(__dirname, 'output'))) {
  console.log('Output top-level dirs:', fs.readdirSync(path.resolve(__dirname, 'output')));
}
