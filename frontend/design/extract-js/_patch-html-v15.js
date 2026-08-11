/**
 * Patch V15 - 健康管理双Logo + 问候语微修
 * 
 * - 删除 id="v8-health-logo" 的V8旧注入重复大Logo
 * - 内联强制覆盖 ____1 问候语 style（位置+尺寸+不裁切）
 */
const fs = require('fs');
const path = require('path');
const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

function patchHealthLogoAndGreet() {
  console.log('===== 健康管理 V15 双Logo+问候语修复 开始 =====');
  const file = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
  let html = fs.readFileSync(file, 'utf-8');

  // 1) 删除V8旧注入的重复 v8-health-logo div（含内部img）
  const before = html.length;
  html = html.replace(/<div id="v8-health-logo"[\s\S]*?<\/div>\s*/, '');
  const delCount = before - html.length;
  console.log('1) 删除 v8-health-logo: ' + (delCount > 0 ? '✓ 删除字节数:' + delCount : '⚠ 没找到'));

  // 2) ____1 问候语内联style直接写入（100%生效，不依赖CSS）
  //    找到 <div id="9bbaf1fe-6d71-4a59-9af1-b95a3f8bd383" class="____1" style="" >
  //    替换 style 为完整的定位+尺寸样式
  //    不依赖id（怕变），直接用 class="____1" pattern
  const greetRegex = /(<div[^>]*?class="____1"[^>]*?style=")([^"]*)("[\s\S]*?>)(早上好，何先生～)(<\/div>)/;
  const gm = html.match(greetRegex);
  let setInline = 0;
  if (gm) {
    const inlineStyle = [
      'position:absolute',
      'left:1.08rem',
      'top:1.62rem',
      'width:auto',
      'height:auto',
      'min-width:2rem',
      'white-space:nowrap',
      'overflow:visible',
      'font-size:0.26rem',
      'font-weight:700',
      'color:#0A2540',
      'z-index:15',
      'background:transparent',
      'clip:auto',
      'display:block',
      'visibility:visible',
      'text-indent:0',
      'letter-spacing:normal',
      'word-break:normal',
    ].join(' !important;') + ' !important;';
    html = html.substring(0, gm.index)
      + gm[1] + inlineStyle + gm[3] + gm[4] + gm[5]
      + html.substring(gm.index + gm[0].length);
    setInline = 1;
  }
  console.log('2) 问候语内联style覆盖: ' + (setInline ? '✓' : '⚠ 没找到____1问候语容器'));

  fs.writeFileSync(file, html, 'utf-8');
  console.log('健康管理 V15 完成 ✓\n');
}

try {
  console.log('=== V15 健康管理Logo+问候语微修 开始 ===');
  patchHealthLogoAndGreet();
  console.log('=== V15 全部完成 ===\n');
} catch(e) {
  console.error('V15 失败:', e.message);
  process.exit(1);
}
