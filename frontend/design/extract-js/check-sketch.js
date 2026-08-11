const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, 'output', 'pages');
const files = fs.readdirSync(pagesDir);

files.forEach(f => {
  const d = JSON.parse(fs.readFileSync(path.join(pagesDir, f), 'utf8'));
  console.log('\n=== Page:', d.name, '===');

  function check(layers, depth) {
    (layers || []).forEach((l) => {
      // Check fills without color
      if (l.style && l.style.fills) {
        l.style.fills.forEach(fill => {
          if (fill.isEnabled && (fill.fillType === 0 || fill.fillType === undefined) && !fill.color) {
            console.log('  NO COLOR fill:', l.name, '| class:', l._class, '| fillType:', fill.fillType);
          }
        });
      }
      // Check borders without color
      if (l.style && l.style.borders) {
        l.style.borders.forEach(b => {
          if (b.isEnabled && !b.color) {
            console.log('  NO COLOR border:', l.name, '| class:', l._class);
          }
        });
      }
      // Check path without points
      if (l.path && !l.path.points) {
        console.log('  NO POINTS:', l.name, '| class:', l._class, '| path keys:', Object.keys(l.path));
      }
      // Check oval without path points
      if (l._class === 'oval' && (!l.path || !l.path.points)) {
        console.log('  OVAL NO PATH:', l.name);
      }
      // Recurse
      if (l.layers) check(l.layers, depth + 1);
    });
  }

  check(d.layers, 0);
});

console.log('\nCheck done.');
