/**
 * Patch V20 - 健康管理页面专用修复
 * 
 * sketch-to-html 对健康管理页面的 HTML 结构与首页不同：
 * - 首页：所有元素嵌套在 .shou_ye 内 → CSS .shou_ye .xxx 有效
 * - 健康管理：元素在 body 层 → CSS .jian_kang_guan_li .xxx 无效
 * 
 * 修复：将 CSS 文件和 V19 样式中的 .jian_kang_guan_li 选择器替换为 body
 */
const fs = require('fs');
const path = require('path');
const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

function patchHealth() {
  console.log('===== 健康管理 V20 =====');
  
  // 1) 修改 CSS 文件：.jian_kang_guan_li .xxx → body .xxx
  const cssFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.css');
  let css = fs.readFileSync(cssFile, 'utf-8');
  // 替换后代选择器：.jian_kang_guan_li .child → body .child
  css = css.replace(/\.jian_kang_guan_li\s+/g, 'body ');
  // 替换根选择器：.jian_kang_guan_li { → body {
  css = css.replace(/\.jian_kang_guan_li\s*\{/g, 'body {');
  fs.writeFileSync(cssFile, css, 'utf-8');
  console.log('1) CSS文件选择器替换 ✓');

  // 2) 修改 HTML 文件中的 V19 <style> 块
  const htmlFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
  let html = fs.readFileSync(htmlFile, 'utf-8');
  
  // 替换 V19 样式中的 .jian_kang_guan_li 选择器
  html = html.replace(/\.jian_kang_guan_li\s+/g, 'body ');
  html = html.replace(/\.jian_kang_guan_li\s*\{/g, 'body {');
  
  // 3) 更新 body CSS：作为画板容器
  html = html.replace(
    /body \{\s*\/\* V19 HEALTH \*\/[\s\S]*?\}/,
    `body {
/* V20 HEALTH - body as artboard */
position: relative !important;
width: 5rem !important;
min-height: 10.826667rem !important;
height: 10.826667rem !important;
margin: 30px auto !important;
padding: 0 !important;
overflow: hidden !important;
background-color: #F4FAF8 !important;
display: block !important;
box-shadow: 0 10px 40px rgba(0,0,0,0.15);
border-radius: 2px;
font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
}`
  );
  
  // 4) 隐藏空的 .jian_kang_guan_li 容器
  if (!html.includes('V20-HIDE-JKG')) {
    html = html.replace('</style>', '.jian_kang_guan_li { display: none !important; }\n/* V20-HIDE-JKG */\n</style>');
  }
  
  fs.writeFileSync(htmlFile, html, 'utf-8');
  console.log('2) HTML样式选择器替换 ✓');
  console.log('3) body画板容器CSS ✓');
  console.log('4) 隐藏空.jian_kang_guan_li ✓');
  console.log('健康管理 V20 完成 ✓');
}

console.log('=== V20 健康管理选择器修复 ===');
patchHealth();
console.log('=== 完成 ===');
