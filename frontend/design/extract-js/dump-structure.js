const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, 'output', 'pages');
const files = fs.readdirSync(pagesDir);
const pageData = JSON.parse(fs.readFileSync(path.join(pagesDir, files[0]), 'utf8'));

function findLayers(layers, predicate, result = [], depth = 0) {
  (layers || []).forEach(l => {
    if (predicate(l)) result.push({ layer: l, depth });
    if (l.layers) findLayers(l.layers, predicate, result, depth + 1);
  });
  return result;
}

const artboards = findLayers(pageData.layers, l => l._class === 'artboard');
const shouYe = artboards.find(a => a.layer.name === '首页').layer;

// Dump the top-level hierarchy of 首页 with structural info
console.log('\n=== 首页 顶层图层结构 (depth first, max depth 5) ===\n');
function dump(layers, depth = 0, parentPath = '') {
  const prefix = '  '.repeat(depth);
  (layers || []).forEach(l => {
    const name = l.name || '(unnamed)';
    let extra = '';
    const w = l.frame && l.frame.width ? l.frame.width : 0;
    const h = l.frame && l.frame.height ? l.frame.height : 0;
    const x = l.frame && l.frame.x != null ? l.frame.x : 0;
    const y = l.frame && l.frame.y != null ? l.frame.y : 0;
    extra += ` [${w}x${h} @ (${Math.round(x)},${Math.round(y)})]`;
    if (l.style) {
      if (l.style.fills && l.style.fills.some(f => f.isEnabled)) {
        const fills = l.style.fills.filter(f => f.isEnabled);
        fills.forEach((f, fi) => {
          if (f.fillType === 0 && f.color) {
            const r = Math.round(f.color.red * 255), g = Math.round(f.color.green * 255), b = Math.round(f.color.blue * 255), a = f.color.alpha;
            extra += ` fill:rgb(${r},${g},${b},${a})`;
          } else if (f.fillType >= 1 && f.gradient) {
            extra += ' gradient';
          } else if (f.image) {
            extra += ' imgFill';
          }
        });
      }
      if (l.style.borders && l.style.borders.some(b => b.isEnabled)) extra += ' border';
      if (l.style.shadows && l.style.shadows.some(s => s.isEnabled)) extra += ' shadow';
      if (l.style.textStyle) extra += ' text';
    }
    if (l._class === 'bitmap') extra += ' BITMAP';
    if (l._class === 'shapePath') {
      const pts = l.points || (l.path && l.path.points);
      const ptsN = pts ? pts.length : 0;
      const allRect = pts && ptsN === 4 && pts.every(p => p.curveMode === 1);
      extra += allRect ? ` shapePath(rect-4pts)` : ` shapePath(${ptsN}pts)`;
      if (pts && ptsN === 4) {
        const radii = pts.map(p => p.cornerRadius || 0);
        if (radii.some(r => r > 0)) extra += ` radius:${radii.join(',')}`;
      }
    }
    if (l._class === 'rectangle') extra += ' rectangle';
    if (l._class === 'oval') extra += ' oval';
    if (l._class === 'group') extra += ` group[children:${l.layers ? l.layers.length : 0}]`;
    if (l._class === 'shapeGroup') extra += ` shapeGroup[children:${l.layers ? l.layers.length : 0}]`;
    if (l.isVisible === false) extra += ' [INVISIBLE]';
    if (l.hasClippingMask) extra += ' [HAS-CLIP-MASK]';
    if (l.booleanOperation != null) extra += ` boolOp:${l.booleanOperation}`;
    console.log(`${prefix}- [${l._class}] ${name}${extra}`);
    if (depth < 5 && l.layers) dump(l.layers, depth + 1, parentPath + '/' + name);
  });
}
dump(shouYe.layers, 0);

// Also dump the page height to confirm
console.log('\n\n=== 首页 artboard size:', shouYe.frame.width, 'x', shouYe.frame.height);
