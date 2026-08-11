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

// 1. Dump ALL keys for a shapePath - to find MasterGo-specific path fields
const shapePaths = findLayers(pageData.layers, l => l._class === 'shapePath');
console.log('\n=== shapePath ALL keys (first 3) ===');
shapePaths.slice(0, 3).forEach((s, i) => {
  console.log(`\n--- ShapePath ${i}: ${s.name} ---`);
  const allKeys = Object.keys(s);
  console.log('ALL keys:', allKeys);
  // Dump each non-standard key's value briefly
  allKeys.forEach(k => {
    if (!['do_objectID', 'name', 'style', 'layers', 'frame', 'booleanOperation', 'attributedString', 'exportOptions', 'resizingConstraint', 'resizingType', 'rotation', 'isFlippedHorizontal', 'isFlippedVertical', 'isLocked', 'isVisible', 'layerListExpandedType', 'nameIsFixed', 'reasonsForInvalidLayout', 'clippingMaskMode', 'hasClippingMask', 'shouldBreakMaskChain', 'originalObjectID', 'sharedStyleID'].includes(k)) {
      const val = s[k];
      const type = typeof val;
      if (type === 'object' && val !== null) {
        console.log(`  ${k} (${type}): keys=${Object.keys(val).join(',')}`);
        // brief dump for path-like objects
        if (k.includes('path') || k.includes('vector') || k.includes('point') || k.includes('curve') || k.includes('svg') || k.includes('data')) {
          console.log(`    content: ${JSON.stringify(val).slice(0, 1500)}`);
        }
      } else {
        console.log(`  ${k} (${type}): ${JSON.stringify(val).slice(0, 200)}`);
      }
    }
  });
});

// 2. Dump ALL keys for an oval
const ovals = findLayers(pageData.layers, l => l._class === 'oval');
console.log('\n=== oval ALL keys (first 2) ===');
ovals.slice(0, 2).forEach((s, i) => {
  console.log(`\n--- Oval ${i}: ${s.name} ---`);
  const allKeys = Object.keys(s);
  console.log('ALL keys:', allKeys);
  allKeys.forEach(k => {
    if (!['do_objectID', 'name', 'style', 'layers', 'frame', 'booleanOperation', 'attributedString', 'exportOptions', 'resizingConstraint', 'resizingType', 'rotation', 'isFlippedHorizontal', 'isFlippedVertical', 'isLocked', 'isVisible', 'layerListExpandedType', 'nameIsFixed', 'reasonsForInvalidLayout', 'clippingMaskMode', 'hasClippingMask', 'shouldBreakMaskChain', 'originalObjectID', 'sharedStyleID'].includes(k)) {
      const val = s[k];
      const type = typeof val;
      if (type === 'object' && val !== null) {
        console.log(`  ${k} (${type}): keys=${Object.keys(val).join(',')}`);
        if (k.includes('path') || k.includes('vector') || k.includes('point') || k.includes('curve') || k.includes('svg') || k.includes('data')) {
          console.log(`    content: ${JSON.stringify(val).slice(0, 1500)}`);
        }
      } else {
        console.log(`  ${k} (${type}): ${JSON.stringify(val).slice(0, 200)}`);
      }
    }
  });
});

// 3. Dump ALL keys for a rectangle
const rects = findLayers(pageData.layers, l => l._class === 'rectangle');
console.log('\n=== rectangle ALL keys (first 2) ===');
rects.slice(0, 2).forEach((s, i) => {
  console.log(`\n--- Rectangle ${i}: ${s.name} ---`);
  const allKeys = Object.keys(s);
  console.log('ALL keys:', allKeys);
  allKeys.forEach(k => {
    if (!['do_objectID', 'name', 'style', 'layers', 'frame', 'booleanOperation', 'attributedString', 'exportOptions', 'resizingConstraint', 'resizingType', 'rotation', 'isFlippedHorizontal', 'isFlippedVertical', 'isLocked', 'isVisible', 'layerListExpandedType', 'nameIsFixed', 'reasonsForInvalidLayout', 'clippingMaskMode', 'hasClippingMask', 'shouldBreakMaskChain', 'originalObjectID', 'sharedStyleID'].includes(k)) {
      const val = s[k];
      const type = typeof val;
      if (type === 'object' && val !== null) {
        console.log(`  ${k} (${type}): keys=${Object.keys(val).join(',')}`);
        if (k.includes('path') || k.includes('vector') || k.includes('point') || k.includes('curve') || k.includes('svg') || k.includes('data')) {
          console.log(`    content: ${JSON.stringify(val).slice(0, 1500)}`);
        }
      } else {
        console.log(`  ${k} (${type}): ${JSON.stringify(val).slice(0, 200)}`);
      }
    }
  });
});

// 4. Dump attributedString.attributes structure (text run info)
const texts = findLayers(pageData.layers, l => l._class === 'text');
console.log('\n=== text attributedString.attributes (first 3) ===');
texts.slice(0, 3).forEach((t, i) => {
  console.log(`\n--- Text ${i}: name=${t.name} string=${JSON.stringify(t.attributedString && t.attributedString.string)} ---`);
  if (t.attributedString && t.attributedString.attributes) {
    console.log('attributes array length:', t.attributedString.attributes.length);
    t.attributedString.attributes.forEach((attr, ai) => {
      console.log(`  attr[${ai}]: location=${attr.location} length=${attr.length}`);
      console.log(`    attributes keys:`, Object.keys(attr.attributes || {}));
      // dump font and color
      if (attr.attributes) {
        if (attr.attributes.MSAttributedStringFontAttribute) {
          console.log(`    font: ${JSON.stringify(attr.attributes.MSAttributedStringFontAttribute)}`);
        }
        if (attr.attributes.MSAttributedStringColorAttribute) {
          console.log(`    color: ${JSON.stringify(attr.attributes.MSAttributedStringColorAttribute)}`);
        }
        if (attr.attributes.paragraphStyle) {
          const ps = attr.attributes.paragraphStyle;
          console.log(`    paragraphStyle keys: ${Object.keys(ps)}`);
          console.log(`    alignment: ${ps.alignment}, minLineHeight: ${ps.minimumLineHeight}, maxLineHeight: ${ps.maximumLineHeight}`);
        }
      }
    });
  }
  if (t.style && t.style.textStyle && t.style.textStyle.encodedAttributes) {
    const ea = t.style.textStyle.encodedAttributes;
    console.log('encodedAttributes:');
    if (ea.MSAttributedStringFontAttribute) {
      console.log(`  font attr: ${JSON.stringify(ea.MSAttributedStringFontAttribute)}`);
    }
    if (ea.MSAttributedStringColorAttribute) {
      console.log(`  color attr: ${JSON.stringify(ea.MSAttributedStringColorAttribute)}`);
    }
    if (ea.paragraphStyle) {
      const ps = ea.paragraphStyle;
      console.log(`  paragraphStyle keys: ${Object.keys(ps)}`);
    }
  }
});

// 5. Also check for "_ref" image paths in style.fills to confirm image loading issue
const allFills = findLayers(pageData.layers, l => l.style && l.style.fills);
console.log('\n=== Fills with image (sample 3) ===');
let imgCount = 0;
for (const l of allFills) {
  if (imgCount >= 3) break;
  (l.style.fills || []).forEach((f, fi) => {
    if (f.image && imgCount < 3) {
      console.log(`Layer=${l.name} fill[${fi}]: image._ref=${f.image._ref || JSON.stringify(f.image).slice(0,300)}`);
      imgCount++;
    }
  });
}

// 6. Check images folder vs referenced images
const imagesDir = path.resolve(__dirname, 'output', 'images');
if (fs.existsSync(imagesDir)) {
  const imgs = fs.readdirSync(imagesDir);
  console.log('\n=== Images in output/images/ === (total:', imgs.length, ')');
  imgs.slice(0, 10).forEach(n => console.log(' -', n));
  if (imgs.length > 10) console.log(` ... and ${imgs.length - 10} more`);
}
