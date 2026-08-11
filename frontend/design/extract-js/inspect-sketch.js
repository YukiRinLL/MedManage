const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, 'output', 'pages');
const files = fs.readdirSync(pagesDir);

// Sample: take an oval and a rectangle from the shou_ye artboard and inspect structure
const pageFile = files[0];
const pageData = JSON.parse(fs.readFileSync(path.join(pagesDir, pageFile), 'utf8'));

function findLayers(layers, predicate, result = [], depth = 0) {
  (layers || []).forEach(l => {
    if (predicate(l)) {
      result.push({ layer: l, depth });
    }
    if (l.layers) findLayers(l.layers, predicate, result, depth + 1);
  });
  return result;
}

// 1. Find artboards
const artboards = findLayers(pageData.layers, l => l._class === 'artboard');
console.log('\n=== Artboards ===');
artboards.forEach(a => console.log(' -', a.layer.name, 'frame:', JSON.stringify(a.layer.frame)));

// 2. Find an oval (circle) in shou_ye and inspect its structure
const circles = findLayers(pageData.layers, l => l._class === 'oval');
console.log('\n=== Sample Oval structure ===');
if (circles.length > 0) {
  const s = circles[0].layer;
  console.log('Name:', s.name);
  console.log('_class:', s._class);
  console.log('frame:', JSON.stringify(s.frame));
  console.log('path keys:', s.path ? Object.keys(s.path) : 'NO PATH');
  if (s.path) {
    console.log('path JSON:', JSON.stringify(s.path, null, 2).slice(0, 2000));
  }
  console.log('has booleanOperation:', !!s.booleanOperation);
  console.log('style.fills count:', s.style && s.style.fills ? s.style.fills.length : 0);
  if (s.style && s.style.fills && s.style.fills.length) {
    console.log('style.fills[0]:', JSON.stringify(s.style.fills[0], null, 2).slice(0, 1000));
  }
}

// 3. Find a rectangle (mask or shape group)
const rects = findLayers(pageData.layers, l => l._class === 'rectangle' || l._class === 'shapePath');
console.log('\n=== Sample Rectangle/ShapePath structure (first 2) ===');
rects.slice(0, 2).forEach((r, i) => {
  const s = r.layer;
  console.log(`\nRect ${i}: Name=${s.name} class=${s._class}`);
  console.log('frame:', JSON.stringify(s.frame));
  console.log('path keys:', s.path ? Object.keys(s.path) : 'NO PATH');
  if (s.path) {
    console.log('path JSON:', JSON.stringify(s.path, null, 2).slice(0, 3000));
  }
});

// 4. Check if there is shapeGroup or group wrapping shape paths
const groups = findLayers(pageData.layers, l => l._class === 'shapeGroup' || l._class === 'group');
console.log('\n=== ShapeGroup/Group sample (first 2) ===');
groups.slice(0, 2).forEach((g, i) => {
  const s = g.layer;
  console.log(`\nGroup ${i}: Name=${s.name} class=${s._class}`);
  console.log('layers count:', s.layers ? s.layers.length : 0);
  console.log('frame:', JSON.stringify(s.frame));
  console.log('has style.fills:', s.style && s.style.fills && s.style.fills.length > 0);
  if (s.style && s.style.fills) {
    s.style.fills.forEach((f, idx) => {
      console.log(`  fill[${idx}]: fillType=${f.fillType} color=${f.color?JSON.stringify(f.color):'NO COLOR'} image=${f.image?'YES':'NO'}`);
    });
  }
  if (s.layers) {
    s.layers.forEach((c, ci) => {
      console.log(`  child[${ci}]: name=${c.name} class=${c._class}`);
      if (c.path) {
        console.log(`    path keys: ${Object.keys(c.path)}`);
        console.log(`    path: ${JSON.stringify(c.path).slice(0, 500)}`);
      }
    });
  }
});

// 5. Check text layer structure
const texts = findLayers(pageData.layers, l => l._class === 'text');
console.log('\n=== Text sample (first 2) ===');
texts.slice(0, 2).forEach((t, i) => {
  const s = t.layer;
  console.log(`\nText ${i}: Name=${s.name}`);
  console.log('frame:', JSON.stringify(s.frame));
  console.log('attributedString keys:', s.attributedString ? Object.keys(s.attributedString) : 'NO ATTR');
  if (s.attributedString) {
    console.log('archivedAttributedString:', s.attributedString.archivedAttributedString ? 'EXISTS' : 'NO');
    if (s.attributedString.string) console.log('string:', s.attributedString.string);
  }
  if (s.style && s.style.textStyle) {
    console.log('textStyle encodedAttributes keys:', s.style.textStyle.encodedAttributes ? Object.keys(s.style.textStyle.encodedAttributes) : 'NO ENC');
  }
});

// 6. Check for bitmap/image layers
const images = findLayers(pageData.layers, l => l._class === 'bitmap' || (l.style && l.style.fills && l.style.fills.some(f => f.image)));
console.log('\n=== Bitmap/Image layers (first 5) ===');
images.slice(0, 5).forEach(im => {
  const s = im.layer;
  console.log(`Layer: ${s.name} class=${s._class}`);
  if (s.style && s.style.fills) {
    s.style.fills.forEach((f, fi) => {
      if (f.image) {
        console.log(`  fill[${fi}] image.ref:`, f.image._ref || JSON.stringify(f.image).slice(0, 200));
      }
    });
  }
});

// 7. Check overall document structure
console.log('\n=== Document meta.json (if exists) ===');
const metaPath = path.resolve(__dirname, 'output', 'meta.json');
if (fs.existsSync(metaPath)) {
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  console.log('meta keys:', Object.keys(meta));
  console.log('meta.createVersion:', meta.createVersion);
  console.log('meta.saveVersion:', meta.saveVersion);
}

// 8. Check document.json
const docPath = path.resolve(__dirname, 'output', 'document.json');
if (fs.existsSync(docPath)) {
  const doc = JSON.parse(fs.readFileSync(docPath, 'utf8'));
  console.log('\n=== document.json ===');
  console.log('keys:', Object.keys(doc).slice(0, 15));
}
