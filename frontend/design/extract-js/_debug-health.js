/**
 * 调试脚本：找出 .jian_kang_guan_li 的闭合位置和 body 层孤儿元素
 */
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, 'output', 'html', 'page-Page_1', 'artboard-jian_kang_guan_li.html');
const html = fs.readFileSync(file, 'utf-8');

// 找 .jian_kang_guan_li 开标签
const regex = /<div[^>]*?class\s*=\s*"[^"]*?\bjian_kang_guan_li\b[^"]*?"[^>]*?>/;
const m = regex.exec(html);
if (!m) { console.log('NOT FOUND'); process.exit(1); }

const openStart = m.index;
const openEnd = m.index + m[0].length;

// 嵌套计数找闭合
let depth = 1, i = openEnd;
let closePos = -1;
while (i < html.length && depth > 0) {
  const nO = html.indexOf('<div', i);
  const nC = html.indexOf('</div>', i);
  if (nC < 0) break;
  if (nO >= 0 && nO < nC) { depth++; i = nO + 4; }
  else { depth--; if (depth === 0) closePos = nC; i = nC + 6; }
}

console.log(`.jian_kang_guan_li 开标签: 位置 ${openStart}-${openEnd}`);
console.log(`.jian_kang_guan_li 闭合 </div>: 位置 ${closePos}-${closePos + 6}`);
console.log(`闭合后到 </body> 的内容长度: ${html.indexOf('</body>') - closePos - 6}`);

// 显示闭合后到 </body> 之间的前500字符
const afterClose = html.substring(closePos + 6, html.indexOf('</body>'));
console.log(`\n=== 闭合后到 </body> 的内容 (前800字符) ===`);
console.log(afterClose.substring(0, 800));

// 统计闭合后的 <div 和 </div 数量
const afterDivs = (afterClose.match(/<div/g) || []).length;
const afterCloseDivs = (afterClose.match(/<\/div>/g) || []).length;
console.log(`\n闭合后 <div 数量: ${afterDivs}, </div> 数量: ${afterCloseDivs}`);

// 也显示 .jian_kang_guan_li 内部的前500字符
const inner = html.substring(openEnd, closePos);
console.log(`\n=== .jian_kang_guan_li 内部内容 (前500字符) ===`);
console.log(inner.substring(0, 500));
console.log(`\n内部内容长度: ${inner.length}`);

// 统计 .jian_kang_guan_li 内的 class 名
const innerClasses = (inner.match(/class="([^"]+)"/g) || []).map(s => s.match(/class="([^"]+)"/)[1].split(' ')[0]);
console.log(`\n内部 class 列表 (前20): ${innerClasses.slice(0, 20).join(', ')}`);
