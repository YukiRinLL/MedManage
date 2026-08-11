const fs = require('fs');
const h = fs.readFileSync('d:/MedManage/frontend/design/output/html/page-Page_1/artboard-jian_kang_guan_li.html', 'utf-8');
const r = /<div[^>]*?class\s*=\s*"[^"]*?\bjian_kang_guan_li\b[^"]*?"[^>]*?>/g;
const m = r.exec(h);
const openEnd = m.index + m[0].length;
let depth = 1, i = openEnd;
const openR = /<div[\s>\/]/g;
let step = 0;
while (i < h.length && depth > 0) {
  openR.lastIndex = i;
  const om = openR.exec(h);
  const nO = om ? om.index : -1;
  const nC = h.indexOf('</div>', i);
  if (nC < 0) break;
  if (nO >= 0 && nO < nC) {
    depth++;
    i = nO + 4;
  } else {
    depth--;
    if (depth === 0) {
      console.log('FOUND CLOSE at ' + nC);
      console.log('Context: ' + h.substring(nC - 40, nC + 20).replace(/\n/g, '\\n'));
      break;
    }
    i = nC + 6;
  }
  step++;
  if (step <= 40 || depth <= 1) {
    const pos = nO >= 0 ? nO : nC;
    console.log('step ' + step + ': depth=' + depth + ' nO=' + (nO >= 0 ? nO : 'NONE') + ' nC=' + nC + ' ctx=' + h.substring(pos, pos + 40).replace(/\n/g, '\\n'));
  }
}
console.log('Final depth:', depth);
