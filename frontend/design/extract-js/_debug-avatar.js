const fs = require('fs');
const h = fs.readFileSync('d:/MedManage/frontend/design/output/html/page-Page_1/artboard-jian_kang_guan_li.html', 'utf-8');

// 检查 Group_1000007195 的内容
const idx = h.indexOf('class="Group_1000007195"');
if (idx < 0) { console.log('NOT FOUND'); process.exit(1); }

// 找到开标签
const openStart = h.lastIndexOf('<div', idx);
const openEnd = h.indexOf('>', idx) + 1;
console.log('Group_1000007195 open tag:', h.substring(openStart, openEnd));

// 找到内容（到第一个 </div>）
const firstClose = h.indexOf('</div>', openEnd);
console.log('Content to first </div>:', h.substring(openEnd, firstClose + 6));
console.log('Content length:', firstClose - openEnd);

// 检查内容中是否有嵌套 <div
const content = h.substring(openEnd, firstClose);
const nestedDivs = (content.match(/<div[\s>\/]/g) || []).length;
console.log('Nested <div in content:', nestedDivs);

// 用 findRootDivClose 找正确闭合
const openR = /<div[\s>\/]/g;
let depth = 1, i = openEnd;
let closePos = -1;
while (i < h.length && depth > 0) {
  openR.lastIndex = i;
  const om = openR.exec(h);
  const nO = om ? om.index : -1;
  const nC = h.indexOf('</div>', i);
  if (nC < 0) break;
  if (nO >= 0 && nO < nC) { depth++; i = nO + 4; }
  else { depth--; if (depth === 0) closePos = nC; i = nC + 6; }
}
console.log('Correct close position:', closePos);
console.log('Content at close:', h.substring(closePos - 20, closePos + 30));
