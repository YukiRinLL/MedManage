/**
 * 后处理脚本：
 * 1. 复制 design/首页 和 design/健康管理 目录下的SVG/PNG切片到 output/html/images/
 * 2. 用DOM解析方式，将sketch-to-html解析出的失效SVG替换为design目录下的原始切片图片
 * 3. 修正颜色、文字样式、布局等细节问题
 * 4. 将渐变色改为纯色（遵守项目约束：整个APP不能有渐变色设计）
 */
const fs = require('fs');
const path = require('path');

const DESIGN_DIR = __dirname;
const HOME_SLICES = path.join(DESIGN_DIR, '首页');
const HEALTH_SLICES = path.join(DESIGN_DIR, '健康管理');
const OUTPUT_HTML = path.join(DESIGN_DIR, 'output', 'html');
const OUTPUT_IMG = path.join(OUTPUT_HTML, 'images');
const PAGE_DIR = path.join(OUTPUT_HTML, 'page-Page_1');

const HOME_HTML = path.join(PAGE_DIR, 'artboard-shou_ye.html');
const HOME_CSS = path.join(PAGE_DIR, 'artboard-shou_ye.css');
const HEALTH_HTML = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
const HEALTH_CSS = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.css');

// ========== 1. 拷贝切片 ==========
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const full = path.join(src, f);
    const st = fs.statSync(full);
    if (st.isFile() && /\.(svg|png|jpe?g)$/i.test(f)) {
      fs.copyFileSync(full, path.join(dest, f));
      console.log('  copy slice:', f);
    }
  }
}

console.log('[1/4] 拷贝切片资源 ...');
copyDir(HOME_SLICES, OUTPUT_IMG);
copyDir(HEALTH_SLICES, OUTPUT_IMG);

// ========== 工具：简易HTML替换（基于正则，避免引入cheerio） ==========
function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, c) { fs.writeFileSync(p, c, 'utf8'); }

// 用正则找到指定id或class的整块div（含嵌套匹配）
function replaceBlock(html, marker, replacement) {
  // marker 格式: id="xxx" 或 class="xxx"
  const attrMatch = /^(\w+)="([^"]+)"$/.exec(marker);
  if (!attrMatch) return html;
  const attrName = attrMatch[1];
  const attrValue = attrMatch[2];

  // 找到该标签起始
  const openRegex = new RegExp(`<div\\s+[^>]*?${attrName}="${attrValue}"[^>]*>`, 'g');
  let m;
  let lastIdx = -1;
  while ((m = openRegex.exec(html)) !== null) { lastIdx = m.index; }
  if (lastIdx < 0) return html;

  // 从 lastIdx 开始，找到匹配的闭合 </div>
  let depth = 0;
  let i = lastIdx;
  // 跳过开头的 <div ...>
  const firstClose = html.indexOf('>', lastIdx);
  if (firstClose < 0) return html;
  depth = 1;
  i = firstClose + 1;
  const tagRe = /<\/?div[^>]*>/gi;
  tagRe.lastIndex = i;
  let startIdx = lastIdx;
  let endIdx = -1;
  let tm;
  while ((tm = tagRe.exec(html)) !== null) {
    const isClose = tm[0].startsWith('</');
    if (isClose) depth--; else depth++;
    if (depth === 0) {
      endIdx = tm.index + tm[0].length;
      break;
    }
  }
  if (endIdx < 0) return html;
  return html.substring(0, startIdx) + replacement + html.substring(endIdx);
}

// 将指定SVG容器替换为图片
function replaceWithImg(html, marker, imgFile, extraStyle = '', extraClass = '') {
  // 先提取该容器原有的绝对定位样式（left/top/width/height）
  const attrMatch = /^(\w+)="([^"]+)"$/.exec(marker);
  if (!attrMatch) return html;
  const attrName = attrMatch[1];
  const attrValue = attrMatch[2];
  const posRegex = new RegExp(`<div\\s+[^>]*?${attrName}="${attrValue}"([^>]*)>`);
  const pm = posRegex.exec(html);
  let posStyle = '';
  if (pm) {
    const styleMatch = /style="([^"]*)"/.exec(pm[1]);
    if (styleMatch) posStyle = styleMatch[1];
  }
  const isId = attrName === 'id';
  const newBlock = `<div ${attrName}="${attrValue}"${extraClass ? ` class="${extraClass}"` : ''} style="${posStyle}${extraStyle}">`
    + `<img src="../images/${encodeURIComponent(imgFile)}" style="position:absolute;width:100%;height:100%;object-fit:contain;display:block;" />`
    + `</div>`;
  return replaceBlock(html, marker, newBlock);
}

// ========== 2. 修复首页 ==========
console.log('[2/4] 修复首页 artboard-shou_ye.html ...');
let homeHtml = read(HOME_HTML);

// 2.1 盾牌3D图标 (Simple_3D容器) - 用 Group 1000007250@1x.png 替换（效果更好）
// 定位：class="Simple_3D"
homeHtml = replaceWithImg(homeHtml, 'class="Simple_3D"', 'Group 1000007250@1x.png', '');

// 2.2 右上角绿色装饰叶子(Vector_441) - 替换为 Vector 441.svg
homeHtml = replaceWithImg(homeHtml, 'class="Vector_441"', 'Vector 441.svg', '');

// 2.3 健康管理提示 - 第一个卡片图标（Frame.svg / "定期记录生命体征数据"卡片的绿色文档图标）
// 定位 zu_45202 (Frame容器)，包含 Frame 类的图标
homeHtml = replaceWithImg(homeHtml, 'class="zu_45202"', 'Frame.svg', '');

// 2.4 "按时查看用药提醒"卡片图标 zu_45201 -> Frame-2.svg (蓝色闹钟)
homeHtml = replaceWithImg(homeHtml, 'class="zu_45201"', 'Frame-2.svg', '');

// 2.5 底部导航的图标 (4个tab)，用对应svg替换
// Tab 1 首页 - 现在用 design/首页/Frame.svg 已不是首页图标，这里暂用联集 1.svg（首页图标）
homeHtml = replaceWithImg(homeHtml, 'class="Frame_20"', '联集 1.svg', '');
// Tab 2 健康管理 - Frame_22 容器 (矩形框图标)
homeHtml = replaceWithImg(homeHtml, 'class="Frame_22"', '矩形 2431.svg', '');
// Tab 3 服务中心 (Frame_26) - 暂时保留，需要找对应图标，用 路径.svg 或其他
homeHtml = replaceWithImg(homeHtml, 'class="Frame_26"', '路径.svg', '');
// Tab 4,5 后续如有需要再补

// 2.6 修改"为您健康护航第1天"的文字颜色
// 定位 class="____Placeholder" - 将里面"第1天"的颜色改为设计稿的金色(#C6A86E 类)，同时放大字号
// 同时根据项目约束："为您健康护航第X天"居中显示、36px字体、800字重、独立一行
const placeHolderRegex = /(<div[^>]*class="____Placeholder"[^>]*>)([\s\S]*?)(<\/div>)/;
homeHtml = homeHtml.replace(placeHolderRegex, (m, open, inner, close) => {
  // 重写为上下两行：第一行为主标题、第二行为天数，天数放大36px(0.48rem)/800字重 金色
  return `${open}<div style="width:100%;text-align:center;margin-top:0;">`
    + `<span style="color:rgba(27,113,94,1);font-size:0.32rem;font-weight:700;font-family:AlimamaShuHeiTi-Bold;display:block;line-height:1.4;">为您健康护航</span>`
    + `<span style="color:rgba(198,168,110,1);font-size:0.48rem;font-weight:800;font-family:AlimamaShuHeiTi-Bold;display:block;width:fit-content;margin:0.16rem auto 0;line-height:1.2;">第1天</span>`
    + `</div>${close}`;
});

write(HOME_HTML, homeHtml);

// 2.7 修正首页CSS：移除渐变、替换为纯色；调整卡片圆角阴影等
let homeCss = read(HOME_CSS);
// 将背景渐变改为纯色（项目约束：无渐变色）
// 顶部卡片背景 gradient(#F4F4F4 -> #A9EBDA) 改为 #F4FAF8
homeCss = homeCss.replace(
  /\.shou_ye \.Group_1000007255 \.Group_1000007250 \.zu_45200 \.ju_xing_933\s*\{[\s\S]*?\n\}/,
  '.shou_ye .Group_1000007255 .Group_1000007250 .zu_45200 .ju_xing_933  {\n' +
  '    fill:none;\n' +
  '    width:5.000000rem;\n' +
  '    height:4.738971rem;\n' +
  '    stroke-width:1;\n' +
  '    position:absolute;\n' +
  '    background-color:rgba(244,250,248,1);\n' +
  '    opacity:1;\n' +
  '    line-height:normal;\n' +
  '}'
);
// 健康管理提示卡片 Rectangle_3465227 (绿色gradient) -> 改为纯色 #2DAE85
homeCss = homeCss.replace(
  /\.shou_ye \.Rectangle_3465227\s*\{[\s\S]*?\n\}/,
  '.shou_ye .Rectangle_3465227  {\n' +
  '    fill:rgba(45,174,133,1);\n' +
  '    width:4.560000rem;\n' +
  '    height:0.946667rem;\n' +
  '    stroke-width:1;\n' +
  '    position:absolute;\n' +
  '    left:0.220000rem;\n' +
  '    top:2.600000rem;\n' +
  '    background-color:rgba(45,174,133,1);\n' +
  '    border-radius:0.106667rem 0.106667rem 0 0;\n' +
  '    opacity:1;\n' +
  '    line-height:normal;\n' +
  '}'
);
// 移除 Vector_441 的 gradient（因为已用图片替换，这里只是保险）
homeCss = homeCss.replace(
  /(\.shou_ye \.Group_1000007255 \.Vector_441\s*\{[\s\S]*?background:)[^;]+(;)/,
  '$1rgba(32,157,135,1)$2'
);
write(HOME_CSS, homeCss);

// ========== 3. 修复健康管理页 ==========
console.log('[3/4] 修复健康管理页 artboard-jian_kang_guan_li.html ...');
let healthHtml = read(HEALTH_HTML);

// 3.1 右上角编辑文档图标 Vector_170 -> Vector-2.svg（健康管理目录下的编辑图标）
healthHtml = replaceWithImg(healthHtml, 'class="Vector_170"', 'Vector-2.svg', '');

// 3.2 指标提升方案卡片 icon Vector_175 (蓝色水滴+盾牌) -> Frame 164073.svg 或 Frame.svg（蓝色盾牌）
healthHtml = replaceWithImg(healthHtml, 'class="Vector_175"', 'Frame 164073.svg', '');

// 3.3 透析评估卡片 icon Vector_181 (绿色文档) -> Frame.svg (绿色文档图)
healthHtml = replaceWithImg(healthHtml, 'class="Vector_181"', 'Frame.svg', '');

// 3.4 健康建议卡片 Polygon_2（小三角指示器）-> Polygon 2.svg
healthHtml = replaceWithImg(healthHtml, 'class="Polygon_2"', 'Polygon 2.svg', '');

// 3.5 健康档案菜单矩形 2431, 生命体征矩形 2432, 用药记录矩形 2432-2, 核心指标矩形 2432-3
// 这些菜单卡片的装饰图标：
//   健康档案 -> i_note_action@2x.png (Group 1000007254.svg 替代)
//   生命体征 -> 心形 (Group 1000007257.svg)
//   用药记录 -> 十字 (Group 1000007258.svg)
//   核心指标 -> 柱状 (需要找一个svg，用 Right Side.svg 暂不处理)
// 我们找到对应的装饰容器再替换 (暂时跳过，因为截图里当前没显示到底部4个菜单)

// 3.6 底部Tab导航图标
healthHtml = replaceWithImg(healthHtml, 'class="Frame_20"', '联集 1.svg', '');
healthHtml = replaceWithImg(healthHtml, 'class="Frame_22"', '矩形 2431.svg', '');
healthHtml = replaceWithImg(healthHtml, 'class="Frame_26"', '路径.svg', '');

write(HEALTH_HTML, healthHtml);

// 3.7 修正健康管理CSS：移除渐变
let healthCss = read(HEALTH_CSS);
// 顶部渐变背景 -> 纯色 #F4FAF8
healthCss = healthCss.replace(
  /\.jian_kang_guan_li \.ju_xing_933_1\s*\{[\s\S]*?\n\}/,
  '.jian_kang_guan_li .ju_xing_933_1  {\n' +
  '    fill:none;\n' +
  '    width:5.000000rem;\n' +
  '    height:4.738971rem;\n' +
  '    stroke-width:1;\n' +
  '    position:absolute;\n' +
  '    top:-0.005639rem;\n' +
  '    background-color:rgba(244,250,248,1);\n' +
  '    opacity:1;\n' +
  '    line-height:normal;\n' +
  '}'
);
// 健康建议绿色卡片 Rectangle_3465233_2 gradient -> 纯色 #2DAE85
healthCss = healthCss.replace(
  /\.jian_kang_guan_li \.Rectangle_3465233_2\s*\{[\s\S]*?\n\}/,
  '.jian_kang_guan_li .Rectangle_3465233_2  {\n' +
  '    fill:rgba(45,174,133,1);\n' +
  '    width:4.573333rem;\n' +
  '    height:1.226667rem;\n' +
  '    stroke-width:1;\n' +
  '    position:absolute;\n' +
  '    left:0.213333rem;\n' +
  '    top:2.360000rem;\n' +
  '    background-color:rgba(45,174,133,1);\n' +
  '    border-radius:0.106667rem 0.106667rem 0 0;\n' +
  '    opacity:1;\n' +
  '    line-height:normal;\n' +
  '}'
);
// Polygon_2 gradient -> 纯色
healthCss = healthCss.replace(
  /(\.jian_kang_guan_li \.Polygon_2\s*\{[\s\S]*?background:)[^;]+(;)/,
  '$1rgba(45,174,133,1)$2'
);
// 卡片 Rectangle_3465239_3 gradient -> 纯色
healthCss = healthCss.replace(
  /(\.jian_kang_guan_li \.Rectangle_3465239_3\s*\{[\s\S]*?background:)[^;]+(;)/,
  '$1rgba(255,255,255,1)$2'
);
write(HEALTH_CSS, healthCss);

// ========== 4. 将所有 gradient linear-gradient 改为纯色 ==========
// 全局：将 CSS 中所有 linear-gradient(...) 替换为其第一个 stop color
console.log('[4/4] 将剩余 linear-gradient 全局替换为纯色 ...');

function stripGradient(css) {
  // 匹配 linear-gradient(...) 并从中取第一个颜色值作为纯色
  return css.replace(/background:\s*linear-gradient\(([^)]+)\)/g, (m, inner) => {
    // 取第一个 rgba(...) 或 #xxx 颜色
    const colorMatch = /(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/.exec(inner);
    if (colorMatch) return `background-color:${colorMatch[1]}`;
    return m; // 找不到颜色就保持原样
  });
}

homeCss = stripGradient(read(HOME_CSS));
write(HOME_CSS, homeCss);
healthCss = stripGradient(read(HEALTH_CSS));
write(HEALTH_CSS, healthCss);

// 对HTML中的style属性中包含linear-gradient的也处理
function stripGradientInHtml(html) {
  return html.replace(/style="([^"]*)"/g, (m0, style) => {
    let s = style;
    s = s.replace(/background:\s*linear-gradient\(([^)]+)\)/g, (m, inner) => {
      const colorMatch = /(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/.exec(inner);
      if (colorMatch) return `background-color:${colorMatch[1]}`;
      return m;
    });
    return `style="${s}"`;
  });
}
homeHtml = stripGradientInHtml(read(HOME_HTML));
write(HOME_HTML, homeHtml);
healthHtml = stripGradientInHtml(read(HEALTH_HTML));
write(HEALTH_HTML, healthHtml);

console.log('Done.');
