const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

// Use the sketch-to-html modules directly (require by full path)
const libDir = path.join(__dirname, '..', 'node_modules', 'sketch-to-html');
const template = require(path.join(libDir, 'template', 'template'));
const util = require(path.join(libDir, 'util.js'));
const StyleStore = require(path.join(libDir, 'store', 'StyleStore'));
const layerParser = require(path.join(libDir, 'parser', 'layerParser'));
const styleRender = require(path.join(libDir, 'render', 'styleRender'));
const htmlRender = require(path.join(libDir, 'render', 'htmlRender'));

const source = path.resolve(__dirname, '圣通尚诺医疗.sketch');
const outputDir = path.resolve(__dirname, 'output');

// Clean output directory
if (fs.existsSync(outputDir)) {
  fse.removeSync(outputDir);
}
fs.mkdirSync(outputDir, { recursive: true });

console.log('Source file:', source);
console.log('Output dir:', outputDir);
console.log('Unzipping sketch file...');

// Sketch files are ZIP archives - use PowerShell Expand-Archive on Windows
const tempZip = path.resolve(__dirname, '_temp_sketch.zip');
fs.copyFileSync(source, tempZip);

const unzipCmd = `powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${outputDir}' -Force"`;

exec(unzipCmd, (err, stdout, stderr) => {
  // Clean up temp file
  try { fs.unlinkSync(tempZip); } catch(e) {}

  if (err) {
    console.error('Unzip error:', err);
    console.error('stderr:', stderr);
    return;
  }

  console.log('Unzip complete!');
  console.log('Output contents:', fs.readdirSync(outputDir));

  // Check if images directory exists and copy it
  const imagesDir = path.join(outputDir, 'images');
  const htmlDir = path.join(outputDir, 'html');
  fs.mkdirSync(htmlDir, { recursive: true });

  if (fs.existsSync(imagesDir)) {
    fse.copySync(imagesDir, path.join(htmlDir, 'images'));
    console.log('Images copied.');
  }

  // Copy template index.html
  const templateIndexPath = path.join(libDir, 'template', 'index.html');
  if (fs.existsSync(templateIndexPath)) {
    fse.copySync(templateIndexPath, path.join(htmlDir, 'index.html'));
  }

  // Parse pages
  const pagesDir = path.join(outputDir, 'pages');
  if (!fs.existsSync(pagesDir)) {
    console.error('No pages directory found in sketch file!');
    console.log('Available dirs:', fs.readdirSync(outputDir));
    return;
  }

  const files = fs.readdirSync(pagesDir);
  console.log('Found pages:', files.length);

  const fileStore = {};
  files.forEach((f) => {
    const filePath = path.join(pagesDir, f);
    try {
      fileStore[f] = JSON.parse(fs.readFileSync(filePath).toString());
    } catch(e) {
      console.error('Error parsing page file:', f, e.message);
    }
  });

  const outPages = [];
  const outResults = [];

  // Parse each page
  files.forEach((f) => {
    const data = fileStore[f];
    if (!data) return;
    try {
      const result = layerParser(data);
      outResults.push(result);
    } catch(e) {
      console.error('Error parsing layer for file:', f, e.message);
    }
  });

  // Handle artboards
  const handleArtBoard = (layer, pageName) => {
    if (layer.type == 'artboard') {
      try {
        StyleStore.reset();
        styleRender(layer, null, '../');
        let html = htmlRender(layer, null, '../');
        html = template(html, layer);
        const htmlPath = path.join(htmlDir, pageName, `artboard-${layer.name}.html`);
        const cssPath = path.join(htmlDir, pageName, `artboard-${layer.name}.css`);
        fse.outputFileSync(htmlPath, html);
        fse.outputFileSync(cssPath, StyleStore.toString());
        outPages.push({
          name: layer.name,
          url: `./${pageName}/artboard-${layer.name}.html`
        });
        console.log('Generated:', pageName, 'artboard-', layer.name);
      } catch(e) {
        console.error('Error rendering artboard:', layer.name, e.message);
      }
    } else {
      layer.childrens && layer.childrens.forEach((child) => {
        handleArtBoard(child, pageName);
      });
    }
  };

  outResults.forEach((result) => {
    if (result && result.type === 'page') {
      handleArtBoard(result, `page-${result.name}`);
    }
  });

  // Generate index.js
  let r = '';
  outPages.forEach((p) => {
    r += `addTab('${p.url}','${p.name}');`;
  });
  fse.outputFileSync(path.join(htmlDir, 'index.js'), r);

  console.log('\n=== Done! ===');
  console.log('Total artboards generated:', outPages.length);
  outPages.forEach(p => console.log(' -', p.name, '->', p.url));
  console.log('\nOpen this file in Chrome:');
  console.log(path.join(htmlDir, 'index.html'));
});
