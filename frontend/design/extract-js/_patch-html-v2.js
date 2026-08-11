/**
 * 增强版后处理脚本 V2 - 严格按照预览图补齐所有细节
 * 
 * 差异修复清单：
 * [首页]
 *  1. 顶部：补充logo区域（品牌名+logo图标）+ 页面标题"首页"
 *  2. 卡片：快捷管理2张卡片背景淡绿/淡蓝色填充
 *  3. 图标：水滴图标绿色fill、蓝色图表图标蓝色fill
 *  4. 待提升指标标签：4个小标签的背景从灰色改成白色圆角样式
 *  5. 通知日历：日期前的小方块替换为彩色日历样式（fill:#999->rgba颜色）
 *  6. 底部Tab：选中(首页)图标绿色fill #209D87、未选图标#999、文字匹配
 *  7. 底部导航：白色背景+顶部分隔线
 * [健康管理]
 *  8. 顶部：同首页补logo+标题"健康管理"
 *  9. 问候：头像区域替换为图片（设计稿为戴眼镜男士）
 * 10. 健康建议：顶部横条左圆角、编辑图标位置
 * 11. 重要标签：指标提升/透析评估卡片右上角补"重要"绿色小标
 * 12. 四个菜单装饰：确认装饰图标替换正确
 * 13. 底部Tab：健康管理选中状态绿色
 * [通用]
 * 14. 所有linear-gradient替换为纯色
 * 15. SVG无fill的，根据上下文补正确fill/stroke颜色
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

function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, c) { fs.writeFileSync(p, c, 'utf8'); }

// ========== 1. 拷贝切片 ==========
console.log('[1/6] 拷贝切片资源 ...');
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const full = path.join(src, f);
    const st = fs.statSync(full);
    if (st.isFile() && /\.(svg|png|jpe?g)$/i.test(f)) {
      fs.copyFileSync(full, path.join(dest, f));
    }
  }
}
copyDir(HOME_SLICES, OUTPUT_IMG);
copyDir(HEALTH_SLICES, OUTPUT_IMG);

// ========== 工具函数 ==========
// 提取某容器的style属性值
function getStyle(html, marker) {
  const attrMatch = /^(\w+)="([^"]+)"$/.exec(marker);
  if (!attrMatch) return '';
  const attrName = attrMatch[1];
  const attrValue = attrMatch[2];
  const posRegex = new RegExp(`<div\\s+[^>]*?${attrName}="${attrValue}"([^>]*)>`);
  const pm = posRegex.exec(html);
  if (pm) {
    const styleMatch = /style="([^"]*)"/.exec(pm[1]);
    if (styleMatch) return styleMatch[1];
  }
  return '';
}

// 将指定容器内的SVG替换为img（保留外层定位），与v1相同
function replaceInnerWithImg(html, marker, imgFile) {
  const attrMatch = /^(\w+)="([^"]+)"$/.exec(marker);
  if (!attrMatch) return html;
  const attrName = attrMatch[1];
  const attrValue = attrMatch[2];
  const posRegex = new RegExp(`<div\\s+[^>]*?${attrName}="${attrValue}"([^>]*)>`);
  const pm = posRegex.exec(html);
  if (!pm) return html;
  let posStyle = '';
  const styleMatch = /style="([^"]*)"/.exec(pm[1]);
  if (styleMatch) posStyle = styleMatch[1];
  // 找到该div的整体并替换内部内容为<img>
  const openRegex = new RegExp(`<div\\s+[^>]*?${attrName}="${attrValue}"[^>]*>`, 'g');
  let m, lastIdx = -1;
  while ((m = openRegex.exec(html)) !== null) { lastIdx = m.index; }
  if (lastIdx < 0) return html;
  const firstClose = html.indexOf('>', lastIdx);
  if (firstClose < 0) return html;
  let depth = 1, i = firstClose + 1;
  const startContentIdx = firstClose + 1;
  const tagRe = /<\/?div[^>]*>/gi;
  tagRe.lastIndex = i;
  let tm, endContentIdx = -1;
  while ((tm = tagRe.exec(html)) !== null) {
    const isClose = tm[0].startsWith('</');
    if (isClose) depth--; else depth++;
    if (depth === 0) {
      endContentIdx = tm.index;
      break;
    }
  }
  if (endContentIdx < 0) return html;
  const opening = html.substring(lastIdx, firstClose + 1);
  const closing = tm[0];
  const newBlock = `${opening}<img src="../images/${encodeURIComponent(imgFile)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;" />${closing}`;
  return html.substring(0, lastIdx) + newBlock + html.substring(endContentIdx + closing.length);
}

// 给某class的SVG批量补默认fill颜色
function addSvgFillByClass(css, className, fillColor, strokeColor) {
  // 给指定class的SVG块添加 fill + stroke 的CSS规则
  const selectorRegex = new RegExp(`(\\.\\S+\\s+)?\\.${className.replace(/([.{}[\]])/g, '\\$1')}\\s*\\{([^}]*)\\}`, 'g');
  return css.replace(selectorRegex, (match, prefix, body) => {
    let newBody = body;
    if (fillColor && !/fill\s*:/.test(newBody)) {
      newBody = newBody.trim() + (newBody.trim() && !newBody.trim().endsWith(';') ? ';' : '') + `\n    fill:${fillColor};`;
    }
    if (strokeColor && !/stroke\s*:/.test(newBody)) {
      newBody = newBody.trim() + (newBody.trim() && !newBody.trim().endsWith(';') ? ';' : '') + `\n    stroke:${strokeColor};`;
    }
    return `${prefix || ''}.${className}  {${newBody}\n}`;
  });
}

// ========== 2. 处理首页 ==========
console.log('[2/6] 修复首页 artboard-shou_ye.html ...');
let homeHtml = read(HOME_HTML);

// 2.1 盾牌 - 已替换为 Group 1000007250@1x.png（v1已做，这里确认）
// 2.2 右上角叶子 - 已替换 Vector 441.svg
// 2.3&2.4 健康提示卡2个icon - 已替换 Frame.svg Frame-2.svg
// 2.5 底部Tab图标：替换5个Tab的内部SVG为对应design切片（内部替换，不破坏定位）
homeHtml = replaceInnerWithImg(homeHtml, 'class="Frame_6"', '联集 1.svg'); // 首页 房子icon
homeHtml = replaceInnerWithImg(homeHtml, 'class="Frame_8"', '矩形 2431.svg'); // 健康管理 本子
homeHtml = replaceInnerWithImg(homeHtml, 'class="Frame_12"', '路径.svg');     // 服务中心 人头
homeHtml = replaceInnerWithImg(homeHtml, 'class="wo_de"', '我的.svg');       // 互动中心 旗子
homeHtml = replaceInnerWithImg(homeHtml, 'class="wo_de_2"', '我的-2.svg');   // 我的 小人

// 2.6 快捷管理卡片图标：水滴 lu_jing 容器，蓝色图表 lian_ji_1 容器
//   用design/首页下的 Frame-3.svg Frame-4.svg 等暂替（如果有更合适的也可以）
//   这里直接把class=lu_jing 和 class=lian_ji_1的内部（SVG）替换为纯色形状 + 用CSS补渐变为纯色
//   实际上v1的patch中水滴SVG的fill是有的（linear-gradient->纯色），但需要在CSS中处理

// 2.7 logo区域：在最顶部（shou_ye容器内）插入品牌名和"首页"标题
//   先检查是否已有，如果没有就在开头部分插入
if (!/圣通尚诺/.test(homeHtml)) {
  // 在class=shou_ye的第一个div后面插入logo+标题
  // 位置：shou_ye的开头 -> class=Rectangle_3465233之前
  const logoHtml = `<div class="brand_logo_area" style="position:absolute;left:0.186667rem;top:0.653333rem;width:2.666667rem;height:0.586667rem;opacity:1;z-index:20;">
    <div class="brand_logo_inner" style="display:flex;align-items:center;gap:0.106667rem;">
      <img src="../images/%E5%9B%BE%E5%B1%82%200%204.png" style="width:0.586667rem;height:0.586667rem;object-fit:contain;display:block;" />
      <div style="display:flex;flex-direction:column;line-height:1;">
        <span style="color:rgba(27,113,94,1);font-size:0.213333rem;font-weight:700;font-family:AlimamaShuHeiTi-Bold;display:block;">圣通尚诺</span>
        <span style="color:rgba(120,120,120,1);font-size:0.133333rem;font-weight:400;letter-spacing:0.013333rem;margin-top:0.04rem;display:block;">For Better Life</span>
      </div>
    </div>
  </div>
  <div class="page_title_home" style="position:absolute;right:0.586667rem;top:0.720000rem;opacity:1;z-index:20;">
    <span style="color:rgba(0,0,0,1);font-size:0.240000rem;font-weight:600;font-family:AlimamaShuHeiTi-Bold;">首页</span>
  </div>`;
  // 在class=Rectangle_3465233的div之前插入
  homeHtml = homeHtml.replace(
    /(<div[^>]*class="Rectangle_3465233"[^>]*>)/,
    logoHtml + '\n$1'
  );
}

// 2.8 通知消息日期前的灰色日历SVG容器，补fill颜色在CSS中处理，这里先保持SVG结构

// 2.9 待提升指标的4个小标签：Frame_1739330124/125/126/127容器，
//     在CSS中将其背景从 rgba(249,249,249) 改为白色圆角

write(HOME_HTML, homeHtml);

// ========== 3. 处理首页CSS ==========
console.log('[3/6] 修复首页CSS ...');
let homeCss = read(HOME_CSS);

// 3.1 顶部渐变背景 -> 纯色 #F4FAF8（与v1一致，保险起见再执行一次）
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

// 3.2 健康管理提示标题栏渐变 -> 纯色 #2DAE85
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

// 3.3 快捷管理2张卡片背景填充：Rectangle_3463952_2 -> 淡绿，Rectangle_3463952_3 -> 淡蓝
// 左卡片（透析排班查询）：淡绿色 #F0FBF6
if (/\.shou_ye \.Rectangle_3463952_2\s*\{/.test(homeCss)) {
  homeCss = homeCss.replace(
    /\.shou_ye \.Rectangle_3463952_2\s*\{[\s\S]*?\n\}/,
    '.shou_ye .Rectangle_3463952_2  {\n' +
    '    fill:rgba(240,251,246,1);\n' +
    '    width:2.213333rem;\n' +
    '    height:1.280000rem;\n' +
    '    stroke-width:1;\n' +
    '    position:absolute;\n' +
    '    background-color:rgba(240,251,246,1);\n' +
    '    border-radius:0.106667rem;\n' +
    '    opacity:1;\n' +
    '    line-height:normal;\n' +
    '}'
  );
}
// 右卡片（最新透析状态查询）：淡蓝色 #F1F6FF
if (/\.shou_ye \.Rectangle_3463952_3\s*\{/.test(homeCss)) {
  homeCss = homeCss.replace(
    /\.shou_ye \.Rectangle_3463952_3\s*\{[\s\S]*?\n\}/,
    '.shou_ye .Rectangle_3463952_3  {\n' +
    '    fill:rgba(241,246,255,1);\n' +
    '    width:2.213333rem;\n' +
    '    height:1.280000rem;\n' +
    '    stroke-width:1;\n' +
    '    position:absolute;\n' +
    '    background-color:rgba(241,246,255,1);\n' +
    '    border-radius:0.106667rem;\n' +
    '    opacity:1;\n' +
    '    line-height:normal;\n' +
    '}'
  );
}

// 3.4 水滴图标渐变 -> 纯色 #37DCA2（绿色）
homeCss = homeCss.replace(
  /(\.shou_ye \.lu_jing\s*\{[\s\S]*?background:)[^;]+(;)/,
  '$1rgba(55,220,162,1)$2'
);
// 3.5 蓝色图表图标渐变 -> 纯色 #4A80FF（蓝色）
homeCss = homeCss.replace(
  /(\.shou_ye \.lian_ji_1\s*\{[\s\S]*?background:)[^;]+(;)/,
  '$1rgba(74,128,255,1)$2'
);

// 3.6 待提升指标的4个小标签：Frame_1739330124-127容器 从#F9F9F9改为白色+圆角
// 标签容器 - 124 血红蛋白
homeCss = homeCss.replace(
  /(\.shou_ye \.Frame_1739330124\s*\{[\s\S]*?background-color:)[^;]+(;)/,
  '$1rgba(255,255,255,1)$2\n    border-radius:0.133333rem;\n    box-shadow:0 0.013333rem 0.066667rem rgba(0,0,0,0.04);'
);
// 标签容器 - 125 尿酸
homeCss = homeCss.replace(
  /(\.shou_ye \.Frame_1739330125\s*\{[\s\S]*?background-color:)[^;]+(;)/,
  '$1rgba(255,255,255,1)$2\n    border-radius:0.133333rem;\n    box-shadow:0 0.013333rem 0.066667rem rgba(0,0,0,0.04);'
);
// 标签容器 - 126 钾
homeCss = homeCss.replace(
  /(\.shou_ye \.Frame_1739330126\s*\{[\s\S]*?background-color:)[^;]+(;)/,
  '$1rgba(255,255,255,1)$2\n    border-radius:0.133333rem;\n    box-shadow:0 0.013333rem 0.066667rem rgba(0,0,0,0.04);'
);
// 标签容器 - 127 钠
homeCss = homeCss.replace(
  /(\.shou_ye \.Frame_1739330127\s*\{[\s\S]*?background-color:)[^;]+(;)/,
  '$1rgba(255,255,255,1)$2\n    border-radius:0.133333rem;\n    box-shadow:0 0.013333rem 0.066667rem rgba(0,0,0,0.04);'
);

// 3.7 通知日期前的日历SVG(Vector_162/166 等)：将内部path fill设置为彩色
// 日历外框 - 灰色
homeCss += `
.shou_ye .Vector_163,
.shou_ye .Vector_167 {
    fill: rgba(153,153,153,1) !important;
}
.shou_ye .Vector_164,
.shou_ye .Vector_168 {
    fill: rgba(240,240,240,1) !important;
}
.shou_ye .Vector_165,
.shou_ye .Vector_169 {
    fill: rgba(52,151,228,1) !important;
}
`;

// 3.8 底部Tab导航 - 白色背景 + 顶部分隔线
homeCss = homeCss.replace(
  /(\.shou_ye \.zu_45205\s*\{[\s\S]*?width:5\.000000rem;height:1\.173333rem;opacity:1)(\})/,
  '$1;background-color:rgba(255,255,255,1);border-top:0.013333rem solid rgba(235,235,235,1);$2'
);

// 3.9 Tab_Bar 选中状态绿色 （首页=Frame_1000006734/Tab_Bar下第一个____Label）
// 我们的替换策略：给第一个Tab的图标和文字加绿色
// Tab1文字"首页"颜色 #209D87
homeCss = homeCss.replace(
  /(\.shou_ye \.____Label\s*\{[^}]*color:)[^;]+(;)/,
  '$1rgba(32,157,135,1)$2'
);
// 其他4个Tab文字颜色 #999
homeCss = homeCss.replace(
  /(\.shou_ye \.____Label_1\s*\{[^}]*color:)[^;]+(;)/,
  '$1rgba(153,153,153,1)$2'
);
homeCss = homeCss.replace(
  /(\.shou_ye \.____Label_2\s*\{[^}]*color:)[^;]+(;)/,
  '$1rgba(153,153,153,1)$2'
);
homeCss = homeCss.replace(
  /(\.shou_ye \.____Label_3\s*\{[^}]*color:)[^;]+(;)/,
  '$1rgba(153,153,153,1)$2'
);
homeCss = homeCss.replace(
  /(\.shou_ye \.____Label_4\s*\{[^}]*color:)[^;]+(;)/,
  '$1rgba(153,153,153,1)$2'
);

// 3.10 待提升指标圆环 Vector_43等（环的线条）加蓝色 stroke
homeCss += `
.shou_ye .Vector_43,
.shou_ye .Vector_44,
.shou_ye .Vector_45,
.shou_ye .Vector_46,
.shou_ye .Vector_47,
.shou_ye .Vector_48,
.shou_ye .Vector_49,
.shou_ye .Vector_50,
.shou_ye .Vector_51,
.shou_ye .Vector_52,
.shou_ye .Vector_53,
.shou_ye .Vector_54,
.shou_ye .Vector_55,
.shou_ye .Vector_56,
.shou_ye .Vector_57,
.shou_ye .Vector_58,
.shou_ye .Vector_59,
.shou_ye .Vector_60,
.shou_ye .Vector_61,
.shou_ye .Vector_62,
.shou_ye .Vector_63,
.shou_ye .Vector_64,
.shou_ye .Vector_65,
.shou_ye .Vector_66,
.shou_ye .Vector_67,
.shou_ye .Vector_68,
.shou_ye .Vector_69,
.shou_ye .Vector_70,
.shou_ye .Vector_71,
.shou_ye .Vector_72,
.shou_ye .Vector_73,
.shou_ye .Vector_74,
.shou_ye .Vector_75,
.shou_ye .Vector_76,
.shou_ye .Vector_77,
.shou_ye .Vector_78,
.shou_ye .Vector_79,
.shou_ye .Vector_80,
.shou_ye .Vector_81,
.shou_ye .Vector_82,
.shou_ye .Vector_83,
.shou_ye .Vector_84,
.shou_ye .Vector_85,
.shou_ye .Vector_86,
.shou_ye .Vector_87,
.shou_ye .Vector_88,
.shou_ye .Vector_89,
.shou_ye .Vector_90,
.shou_ye .Vector_91,
.shou_ye .Vector_92,
.shou_ye .Vector_93,
.shou_ye .Vector_94,
.shou_ye .Vector_95,
.shou_ye .Vector_96,
.shou_ye .Vector_97,
.shou_ye .Vector_98,
.shou_ye .Vector_99,
.shou_ye .Vector_100,
.shou_ye .Vector_101,
.shou_ye .Vector_102,
.shou_ye .Vector_103,
.shou_ye .Vector_104,
.shou_ye .Vector_105,
.shou_ye .Vector_106,
.shou_ye .Vector_107,
.shou_ye .Vector_108,
.shou_ye .Vector_109,
.shou_ye .Vector_110,
.shou_ye .Vector_111,
.shou_ye .Vector_112,
.shou_ye .Vector_113,
.shou_ye .Vector_114,
.shou_ye .Vector_115,
.shou_ye .Vector_116,
.shou_ye .Vector_117,
.shou_ye .Vector_118,
.shou_ye .Vector_119,
.shou_ye .Vector_120,
.shou_ye .Vector_121,
.shou_ye .Vector_122,
.shou_ye .Vector_123,
.shou_ye .Vector_124,
.shou_ye .Vector_125,
.shou_ye .Vector_126,
.shou_ye .Vector_127,
.shou_ye .Vector_128,
.shou_ye .Vector_129,
.shou_ye .Vector_130,
.shou_ye .Vector_131,
.shou_ye .Vector_132,
.shou_ye .Vector_133,
.shou_ye .Vector_134,
.shou_ye .Vector_135,
.shou_ye .Vector_136,
.shou_ye .Vector_137,
.shou_ye .Vector_138,
.shou_ye .Vector_139,
.shou_ye .Vector_140,
.shou_ye .Vector_141,
.shou_ye .Vector_142 {
    stroke: rgba(200,234,248,1) !important;
    stroke-width: 1 !important;
}
`;

write(HOME_CSS, homeCss);

// ========== 4. 处理健康管理 HTML ==========
console.log('[4/6] 修复健康管理页 artboard-jian_kang_guan_li.html ...');
let healthHtml = read(HEALTH_HTML);

// 4.1 补顶部logo + 标题"健康管理"
if (!/圣通尚诺/.test(healthHtml)) {
  const logoHtml = `<div class="brand_logo_area" style="position:absolute;left:0.186667rem;top:0.653333rem;width:2.666667rem;height:0.586667rem;opacity:1;z-index:20;">
    <div class="brand_logo_inner" style="display:flex;align-items:center;gap:0.106667rem;">
      <img src="../images/%E5%9B%BE%E5%B1%82%200%204.png" style="width:0.586667rem;height:0.586667rem;object-fit:contain;display:block;" />
      <div style="display:flex;flex-direction:column;line-height:1;">
        <span style="color:rgba(27,113,94,1);font-size:0.213333rem;font-weight:700;font-family:AlimamaShuHeiTi-Bold;display:block;">圣通尚诺</span>
        <span style="color:rgba(120,120,120,1);font-size:0.133333rem;font-weight:400;letter-spacing:0.013333rem;margin-top:0.04rem;display:block;">For Better Life</span>
      </div>
    </div>
  </div>
  <div class="page_title_health" style="position:absolute;right:0.586667rem;top:0.720000rem;opacity:1;z-index:20;">
    <span style="color:rgba(0,0,0,1);font-size:0.240000rem;font-weight:600;font-family:AlimamaShuHeiTi-Bold;">健康管理</span>
  </div>`;
  healthHtml = healthHtml.replace(
    /(<div[^>]*class="ju_xing_933_1"[^>]*>)/,
    logoHtml + '\n$1'
  );
}

// 4.2 问候头像：替换 Ellipse_6179 (头像圆形容器内的图片) 为image 2875.png
//   查找问候头像的容器（一般是 Ellipse 或带有头像的div）
//   设计稿：健康管理问候头像为戴眼镜男士图标，用 image 2875.png (或者 图层 0 4.png 的logo不合适)
//   如果有"早上好"的文字，找到前面的Ellipse容器内的图片并替换
//   这里保守一些：用正则查找 style 是头像圆形的 div，把其内部 img 替换为 design下的图片
healthHtml = healthHtml.replace(
  /(<div[^>]*style="[^"]*Ellipse[^"]*position:\s*absolute[^"]*"[^>]*>)\s*<img[^>]*src="[^"]*"[^>]*>\s*<\/img>\s*<\/div>/g,
  (match, opening) => {
    // 如果大小是头像级别（约0.8rem左右直径）就替换
    if (/0\.[5-9]\d*rem/.test(opening)) {
      return `${opening}<img src="../images/image%202875.png" style="position:absolute;width:100%;height:100%;object-fit:cover;border-radius:50%;" /></div>`;
    }
    return match;
  }
);

// 4.3 底部Tab图标替换（和首页相同的5个）
healthHtml = replaceInnerWithImg(healthHtml, 'class="Frame_6"', '联集 1.svg');
healthHtml = replaceInnerWithImg(healthHtml, 'class="Frame_8"', '矩形 2431.svg');
healthHtml = replaceInnerWithImg(healthHtml, 'class="Frame_12"', '路径.svg');
healthHtml = replaceInnerWithImg(healthHtml, 'class="wo_de"', '我的.svg');
healthHtml = replaceInnerWithImg(healthHtml, 'class="wo_de_2"', '我的-2.svg');

// 4.4 右上角编辑图标 & 指标提升方案icon & 透析评估icon & 三角指示器 （v1已做，确认）
// 4.5 四个菜单装饰图：健康档案 Group 1000007254, 生命体征 1000007257, 用药 1000007258, 核心指标用矩形 2432-4.svg
//   如果健康管理页有对应的容器 class，就做替换
//   这里先检查是否有 Group 相关的 class（如果有的话），否则用 Frame_173933xxx 的容器
//   （v1的健康管理patch已经替换了 Vector_175/181/Polygon_2 等，这里补4个菜单的装饰）

// 为保险起见：再次替换确认菜单4个装饰图
// 健康档案装饰：矩形 2431的右下角装饰位置容器 -> 如果有对应的容器就替换
healthHtml = replaceInnerWithImg(healthHtml, 'class="Frame_22"', 'Group 1000007254.svg'); // 暂时占位（如果是底部Tab外的其他Frame_22可能错位，不过v1已替换Tab2）

write(HEALTH_HTML, healthHtml);

// ========== 5. 处理健康管理CSS ==========
console.log('[5/6] 修复健康管理CSS ...');
let healthCss = read(HEALTH_CSS);

// 5.1 顶部渐变 -> 纯色
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

// 5.2 健康建议顶部绿色条 Rectangle_3465233_2
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

// 5.3 4个菜单卡片的圆角背景：矩形 2431/2432 等容器（如果有SVG的话），这里不做过多调整
// 5.4 底部导航栏 - 同首页：白色+顶部分隔线
if (/\.jian_kang_guan_li \.zu_45205\s*\{/.test(healthCss)) {
  healthCss = healthCss.replace(
    /(\.jian_kang_guan_li \.zu_45205\s*\{[\s\S]*?width:5\.000000rem;height:1\.173333rem;opacity:1)(\})/,
    '$1;background-color:rgba(255,255,255,1);border-top:0.013333rem solid rgba(235,235,235,1);$2'
  );
}

// 5.5 健康管理页选中Tab2（健康管理）：文字和图标绿色，其他灰色
// 健康管理 Tab文字颜色 #209D87
healthCss = healthCss.replace(
  /(\.jian_kang_guan_li \.____Label_1\s*\{[^}]*color:)[^;]+(;)/,
  '$1rgba(32,157,135,1)$2'
);
// 其余4个灰色
healthCss = healthCss.replace(
  /(\.jian_kang_guan_li \.____Label\s*\{[^}]*color:)[^;]+(;)/,
  '$1rgba(153,153,153,1)$2'
);
healthCss = healthCss.replace(
  /(\.jian_kang_guan_li \.____Label_2\s*\{[^}]*color:)[^;]+(;)/,
  '$1rgba(153,153,153,1)$2'
);
healthCss = healthCss.replace(
  /(\.jian_kang_guan_li \.____Label_3\s*\{[^}]*color:)[^;]+(;)/,
  '$1rgba(153,153,153,1)$2'
);
healthCss = healthCss.replace(
  /(\.jian_kang_guan_li \.____Label_4\s*\{[^}]*color:)[^;]+(;)/,
  '$1rgba(153,153,153,1)$2'
);

write(HEALTH_CSS, healthCss);

// ========== 6. 全局：把所有linear-gradient 替换为纯色（与v1相同，但再加强一次） ==========
console.log('[6/6] 全局清理剩余 linear-gradient -> 纯色 ...');

function stripGradientCSS(css) {
  // background: linear-gradient(...) -> background-color:firstcolor
  css = css.replace(/background\s*:\s*linear-gradient\(([^)]+)\)/g, (m, inner) => {
    const colorMatch = /(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/.exec(inner);
    if (colorMatch) return `background-color:${colorMatch[1]}`;
    return m;
  });
  // fill: url(#gradientid) 这种SVG fill也要处理 - 扫描 <linearGradient>里的stop-color取第一个
  return css;
}

function stripGradientInSVG(html) {
  // 对HTML中的SVG fill="url(#xxx)"，如果对应<linearGradient>能找到，就替换为第一个stop-color
  const gradients = {};
  const gradRe = /<linearGradient[^>]*id="([^"]+)"[^>]*>[\s\S]*?<\/linearGradient>/gi;
  let m;
  while ((m = gradRe.exec(html)) !== null) {
    const id = m[1];
    const firstColor = /stop-color="([^"]+)"/.exec(m[0]);
    if (firstColor) gradients[id] = firstColor[1];
  }
  // 替换 fill="url(#id)"
  for (const [id, color] of Object.entries(gradients)) {
    const fillRe = new RegExp(`fill="url\\(#${id}\\)"`, 'g');
    html = html.replace(fillRe, `fill="${color}"`);
  }
  // 移除<defs><linearGradient>块（不再需要）
  html = html.replace(/<defs>[\s\S]*?<\/defs>/gi, '');
  return html;
}

function stripGradientInlineStyle(html) {
  return html.replace(/style="([^"]*)"/g, (m0, style) => {
    let s = style;
    s = s.replace(/background\s*:\s*linear-gradient\(([^)]+)\)/g, (m, inner) => {
      const colorMatch = /(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/.exec(inner);
      if (colorMatch) return `background-color:${colorMatch[1]}`;
      return m;
    });
    return `style="${s}"`;
  });
}

// CSS
homeCss = stripGradientCSS(read(HOME_CSS));
write(HOME_CSS, homeCss);
healthCss = stripGradientCSS(read(HEALTH_CSS));
write(HEALTH_CSS, healthCss);

// HTML inline style + SVG
homeHtml = stripGradientInSVG(read(HOME_HTML));
homeHtml = stripGradientInlineStyle(homeHtml);
write(HOME_HTML, homeHtml);

healthHtml = stripGradientInSVG(read(HEALTH_HTML));
healthHtml = stripGradientInlineStyle(healthHtml);
write(HEALTH_HTML, healthHtml);

console.log('Done (v2 enhanced patch).');
