/**
 * Patch V19 - 干净版终极补丁（基于重新解析的干净HTML）
 * 
 * 只做三件事：
 * 1. 在 </head> 前注入 <style> CSS 覆盖规则
 * 2. 用嵌套计数法在 .shou_ye / .jian_kang_guan_li 末尾追加缺失DOM
 * 3. 替换关键SVG资源（盾牌、头像等）
 */
const fs = require('fs');
const path = require('path');
const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

/** 嵌套计数法：找 class=rootClass 的 <div> 的匹配 </div> 位置 */
function findRootDivClose(html, rootClass) {
  const regex = new RegExp(`<div[^>]*?class\\s*=\\s*"[^"]*?\\b${rootClass}\\b[^"]*?"[^>]*?>`, 'g');
  const m = regex.exec(html);
  if (!m) return -1;
  const openEnd = m.index + m[0].length;
  let depth = 1, i = openEnd;
  // 用正则匹配真正的 <div 标签（后跟空格、>或/），避免匹配SVG内容中的 <div 字符串
  const openTagRegex = /<div[\s>\/]/g;
  while (i < html.length && depth > 0) {
    openTagRegex.lastIndex = i;
    const openMatch = openTagRegex.exec(html);
    const nO = openMatch ? openMatch.index : -1;
    const nC = html.indexOf('</div>', i);
    if (nC < 0) return -1;
    if (nO >= 0 && nO < nC) { depth++; i = nO + 4; }
    else { depth--; if (depth === 0) return nC; i = nC + 6; }
  }
  return -1;
}

/** 在 class=rootClass 的 </div> 前插入内容 */
function appendToRoot(html, rootClass, snippet) {
  const closePos = findRootDivClose(html, rootClass);
  if (closePos < 0) { console.log(`  ⚠ ${rootClass} 闭合未找到`); return html; }
  return html.substring(0, closePos) + snippet + '\n' + html.substring(closePos);
}

/** 在 class=rootClass 的开标签后插入内容（作为第一个子元素） */
function prependToRoot(html, rootClass, snippet) {
  const regex = new RegExp(`<div[^>]*?class\\s*=\\s*"[^"]*?\\b${rootClass}\\b[^"]*?"[^>]*?>`);
  const m = regex.exec(html);
  if (!m) { console.log(`  ⚠ ${rootClass} 开标签未找到`); return html; }
  const pos = m.index + m[0].length;
  return html.substring(0, pos) + '\n' + snippet + '\n' + html.substring(pos);
}

/** 在 </head> 前注入 <style>，同时确保有 charset 声明 */
function injectStyleBeforeHead(html, css, id) {
  if (html.includes(id)) return html;
  // 确保有 charset 声明，否则中文乱码
  if (!html.includes('charset')) {
    html = html.replace('<head>', '<head>\n<meta charset="UTF-8">');
  }
  const idx = html.indexOf('</head>');
  if (idx < 0) return html;
  return html.substring(0, idx) + `<style id="${id}">\n${css}\n</style>\n` + html.substring(idx);
}

/* ========================================================= *
 *  首页
 * ========================================================= */
function patchHome() {
  console.log('===== 首页 V19 =====');
  const file = path.join(PAGE_DIR, 'artboard-shou_ye.html');
  let html = fs.readFileSync(file, 'utf-8');

  // 1) CSS
  const css = `
/* V19 HOME */
html { font-size: 75px !important; }
body {
  margin: 0 !important;
  padding: 30px 0 60px !important;
  background: #D0D0D0 !important;
  min-height: 100vh;
  display: flex !important;
  justify-content: center;
  align-items: flex-start;
  -webkit-text-size-adjust: 100%;
  font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
}
.shou_ye {
  position: relative !important;
  width: 5rem !important;
  min-height: 10.826667rem !important;
  height: 10.826667rem !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  background-color: #F4FAF8 !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border-radius: 2px;
  flex: 0 0 5rem !important;
}
/* 隐藏盾牌上的黑C形和椭圆垃圾图层 */
.shou_ye .Vector_26,
.shou_ye .Ellipse_6178,
.shou_ye .Ellipse_6179 { display: none !important; }
/* 问候语容器 */
.shou_ye .____Placeholder {
  position: absolute !important; left: 0.4rem !important; top: 1.44rem !important;
  width: auto !important; height: auto !important; min-height: 1.4rem !important;
  display: block !important; z-index: 15 !important; background: transparent !important;
}
.shou_ye .____Placeholder > span, .shou_ye .____Placeholder > div { display: block !important; }
.shou_ye .Group_1000007255::after { content: none !important; display: none !important; }
/* Tab Bar 容器 */
.shou_ye .zu_45205 {
  position: absolute !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
  width: 100% !important; height: 2.173333rem !important; overflow: visible !important;
  background-color: #FFFFFF !important; z-index: 10 !important;
}
.shou_ye .zu_45205 .ju_xing_2424 { display: none !important; }
.shou_ye .zu_45205 .Tab_Bar, .shou_ye .zu_45205 .Tab_Bar_1 { position:absolute!important;bottom:0!important;left:0!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.shou_ye .zu_45205 .Tab_Bar_2, .shou_ye .zu_45205 .Tab_Bar_3 { position:absolute!important;bottom:0!important;left:1rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.shou_ye .zu_45205 .Tab_Bar_4, .shou_ye .zu_45205 .Tab_Bar_5 { position:absolute!important;bottom:0!important;left:2rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.shou_ye .zu_45205 .Tab_Bar_6, .shou_ye .zu_45205 .Tab_Bar_7 { position:absolute!important;bottom:0!important;left:3rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.shou_ye .zu_45205 .Tab_Bar_8, .shou_ye .zu_45205 .Tab_Bar_9 { position:absolute!important;bottom:0!important;left:4rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
/* 通知消息 */
.shou_ye .V13_notify_wrap { position:absolute;left:0;top:0;width:100%;height:1.4rem;background-color:#FFFFFF;overflow:hidden;z-index:11;box-sizing:border-box; }
.shou_ye .V13_notify_bell { position:absolute;left:0.24rem;top:0.24rem;width:0.36rem;height:0.36rem;object-fit:contain; }
.shou_ye .V13_notify_title { position:absolute;left:0.72rem;top:0.26rem;font-size:0.2rem;font-weight:700;color:#1A2B44; }
.shou_ye .V13_notify_more { position:absolute;right:0.28rem;top:0.28rem;font-size:0.16rem;color:#2D9CDB; }
.shou_ye .V13_notify_dot { position:absolute;width:0.2rem;height:0.2rem;object-fit:contain;opacity:0.7; }
.shou_ye .V13_notify_body { position:absolute;left:0.72rem;right:1rem;font-size:0.15rem;color:#4A5568;line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.shou_ye .V13_notify_date { position:absolute;left:0.72rem;font-size:0.14rem;color:#97A2B5; }
.shou_ye .V13_notify_view { position:absolute;right:0.32rem;font-size:0.14rem;color:#2D9CDB; }
.shou_ye .V13_notify_1_dot { left:0.48rem;top:0.8rem; } .shou_ye .V13_notify_1_body { top:0.78rem; } .shou_ye .V13_notify_1_date { top:1.04rem; } .shou_ye .V13_notify_1_view { top:1.04rem; }
.shou_ye .V13_notify_2_dot { left:0.48rem;top:1.24rem; } .shou_ye .V13_notify_2_body { top:1.22rem; } .shou_ye .V13_notify_2_date { top:1.28rem; } .shou_ye .V13_notify_2_view { top:1.28rem; }
/* 排班/状态查询卡片 */
.shou_ye .V13_sched_card, .shou_ye .V13_status_card { position:absolute;width:2.133333rem;height:1.173333rem;background-color:#FFFFFF;border-radius:0.14rem;box-shadow:0 2px 12px rgba(13,66,49,0.05);border:1px solid rgba(13,66,49,0.05);overflow:hidden;z-index:9;box-sizing:border-box; }
.shou_ye .V13_sched_card { left:0.213333rem;top:5.333333rem; }
.shou_ye .V13_status_card { right:0.213333rem;top:5.333333rem; }
.shou_ye .V13_card_title { position:absolute;left:0.2rem;top:0.16rem;font-size:0.2rem;font-weight:700;color:#1A2B44;width:1.6rem; }
.shou_ye .V13_card_desc { position:absolute;left:0.2rem;top:0.48rem;font-size:0.155rem;color:#7A8BA4;width:1.6rem; }
.shou_ye .V13_card_icon { position:absolute;right:0.28rem;top:50%;transform:translateY(-50%);width:0.92rem;height:0.92rem;object-fit:contain; }
`;
  html = injectStyleBeforeHead(html, css, 'V19-HOME');
  console.log('1) CSS注入 ✓');

  // 2) 在 .zu_45205 开头插入通知消息
  const notify = `<div class="V13_notify_wrap"><img class="V13_notify_bell" src="../images/Frame%20164073.svg"><div class="V13_notify_title">通知消息</div><div class="V13_notify_more">查看更多 ></div><img class="V13_notify_dot V13_notify_1_dot" src="../images/%E8%B7%AF%E5%BE%84.svg"><div class="V13_notify_body V13_notify_1_body">医护人员将在本周内进行电话随访，请保持手机畅…</div><div class="V13_notify_date V13_notify_1_date">07-27</div><div class="V13_notify_view V13_notify_1_view">查看</div><img class="V13_notify_dot V13_notify_2_dot" src="../images/%E8%B7%AF%E5%BE%84.svg"><div class="V13_notify_body V13_notify_2_body">这是通知消息，消息为文本内容，保持一行</div><div class="V13_notify_date V13_notify_2_date">07-26</div><div class="V13_notify_view V13_notify_2_view">查看</div></div>`;
  html = prependToRoot(html, 'zu_45205', notify);
  console.log('2) 通知消息插入 zu_45205 ✓');

  // 3) 在 .shou_ye 末尾追加两张查询卡片
  const sched = `<div class="V13_sched_card"><div class="V13_card_title">透析排班查询</div><div class="V13_card_desc">一键查透析排班</div><img class="V13_card_icon" src="../images/Rectangle%203463952-2.svg"></div>`;
  const status = `<div class="V13_status_card"><div class="V13_card_title">最新透析状态查询</div><div class="V13_card_desc">精准查询透析状态</div><img class="V13_card_icon" src="../images/Rectangle%203463952.svg"></div>`;
  html = appendToRoot(html, 'shou_ye', sched + status);
  console.log('3) 查询卡片追加 ✓');

  fs.writeFileSync(file, html, 'utf-8');
  console.log('首页 V19 完成 ✓\n');
}

/* ========================================================= *
 *  健康管理
 * ========================================================= */
function patchHealth() {
  console.log('===== 健康管理 V19 =====');
  const file = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
  let html = fs.readFileSync(file, 'utf-8');

  const css = `
/* V19 HEALTH */
html { font-size: 75px !important; }
body {
  margin: 0 !important;
  padding: 30px 0 60px !important;
  background: #D0D0D0 !important;
  min-height: 100vh;
  display: flex !important;
  justify-content: center;
  align-items: flex-start;
  font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
}
.jian_kang_guan_li {
  position: relative !important;
  width: 5rem !important;
  min-height: 10.826667rem !important;
  height: 10.826667rem !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  background-color: #F4FAF8 !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border-radius: 2px;
  flex: 0 0 5rem !important;
}
/* 头像 */
.jian_kang_guan_li .Group_1000007195 {
  position:absolute!important;left:0.32rem!important;top:1.48rem!important;width:0.62rem!important;height:0.62rem!important;z-index:20!important;border:2px solid #FFFFFF!important;border-radius:50%!important;box-shadow:0 2px 8px rgba(45,174,133,0.25)!important;overflow:hidden!important;background:transparent!important;padding:0!important;
}
.jian_kang_guan_li .Group_1000007195 > * { width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;display:block!important; }
/* 问候语 */
.jian_kang_guan_li .____1 {
  position:absolute!important;left:1.08rem!important;top:1.62rem!important;width:auto!important;height:auto!important;white-space:nowrap!important;overflow:visible!important;font-size:0.26rem!important;font-weight:700!important;color:#0A2540!important;z-index:15!important;background:transparent!important;clip:auto!important;
}
/* 右箭头 */
.jian_kang_guan_li .V13_arrow_right { position:absolute!important;right:0.4rem!important;top:2.56rem!important;width:0.28rem!important;height:0.28rem!important;color:#FFFFFF!important;font-size:0.24rem!important;font-weight:700!important;text-align:center!important;line-height:0.28rem!important;z-index:14!important;display:block!important; }
/* Tab */
.jian_kang_guan_li .zu_45205_1 { position:absolute!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;height:0.773333rem!important;overflow:visible!important;background-color:#FFFFFF!important; }
.jian_kang_guan_li .zu_45205_1 .ju_xing_2424_1 { display:none!important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_10, .jian_kang_guan_li .zu_45205_1 .Tab_Bar_11 { position:absolute!important;bottom:0!important;left:0!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_12, .jian_kang_guan_li .zu_45205_1 .Tab_Bar_13 { position:absolute!important;bottom:0!important;left:1rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_14, .jian_kang_guan_li .zu_45205_1 .Tab_Bar_15 { position:absolute!important;bottom:0!important;left:2rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_16, .jian_kang_guan_li .zu_45205_1 .Tab_Bar_17 { position:absolute!important;bottom:0!important;left:3rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_18, .jian_kang_guan_li .zu_45205_1 .Tab_Bar_19 { position:absolute!important;bottom:0!important;left:4rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
/* 隐藏无效壳 */
.jian_kang_guan_li .Vector_204, .jian_kang_guan_li .Vector_212, .jian_kang_guan_li .Vector_213, .jian_kang_guan_li .Frame_28 { display:none!important; }
/* 重要标签 */
.jian_kang_guan_li [class*="zhong_yao"] { padding:0.03rem 0.1rem!important;background-color:#2DAE85!important;color:#FFFFFF!important;font-size:0.13rem!important;font-weight:600!important;border-radius:0.04rem!important;z-index:12!important;display:block!important; }
/* 2x2 卡片 */
.jian_kang_guan_li .V13_gridcard { position:absolute;width:2.266667rem;height:1.493333rem;background-color:#FFFFFF;border-radius:0.14rem;box-shadow:0 2px 12px rgba(13,66,49,0.05);border:1px solid rgba(13,66,49,0.05);overflow:hidden;box-sizing:border-box;z-index:8; }
.jian_kang_guan_li .V13_gridcard_title { position:absolute;left:0.24rem;top:0.22rem;font-size:0.2rem;font-weight:700;color:#1A2B44; }
.jian_kang_guan_li .V13_gridcard_desc { position:absolute;left:0.24rem;top:0.56rem;font-size:0.15rem;color:#7A8BA4; }
.jian_kang_guan_li .V13_gridcard_view { position:absolute;left:0.24rem;bottom:0.18rem;font-size:0.15rem;color:#2DAE85;font-weight:600;padding:0.04rem 0.18rem;background-color:rgba(45,174,133,0.08);border-radius:0.2rem; }
.jian_kang_guan_li .V13_gridcard_icon { position:absolute;right:0.22rem;bottom:0.18rem;width:0.6rem;height:0.6rem;object-fit:contain; }
.jian_kang_guan_li .V13_gridcard_1 { left:0.213333rem;top:6.16rem; }
.jian_kang_guan_li .V13_gridcard_2 { left:2.586667rem;top:6.16rem; }
.jian_kang_guan_li .V13_gridcard_3 { left:0.213333rem;top:7.88rem; }
.jian_kang_guan_li .V13_gridcard_4 { left:2.586667rem;top:7.88rem; }
`;
  html = injectStyleBeforeHead(html, css, 'V19-HEALTH');
  console.log('1) CSS注入 ✓');

  // 2) 头像替换 - 用 findRootDivClose 找正确闭合，避免非贪婪正则截断嵌套div
  const avClosePos = findRootDivClose(html, 'Group_1000007195');
  if (avClosePos > 0) {
    const avOpenRegex = /<div[^>]*?class\s*=\s*"[^"]*?\bGroup_1000007195\b[^"]*?"[^>]*?>/;
    const avOpenMatch = avOpenRegex.exec(html);
    if (avOpenMatch) {
      const avOpenEnd = avOpenMatch.index + avOpenMatch[0].length;
      html = html.substring(0, avOpenEnd) + '<img src="../images/Frame%201739330068.svg">' + html.substring(avClosePos);
      console.log('2) 头像替换 ✓ (closePos=' + avClosePos + ')');
    }
  } else {
    console.log('2) 头像替换跳过 (Group_1000007195 未找到)');
  }

  // 3) 右箭头 + 2x2卡片追加到 .jian_kang_guan_li 末尾
  const arrow = `<div class="V13_arrow_right">></div>`;
  const cards = `<div class="V13_gridcard V13_gridcard_1"><div class="V13_gridcard_title">健康档案</div><div class="V13_gridcard_desc">查看个人健康信息</div><div class="V13_gridcard_view">查看</div><img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432-2.svg"></div><div class="V13_gridcard V13_gridcard_2"><div class="V13_gridcard_title">生命体征</div><div class="V13_gridcard_desc">记录体温血压血糖</div><div class="V13_gridcard_view">查看</div><img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432.svg"></div><div class="V13_gridcard V13_gridcard_3"><div class="V13_gridcard_title">用药记录</div><div class="V13_gridcard_desc">管理每日用药提醒</div><div class="V13_gridcard_view">查看</div><img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432-4.svg"></div><div class="V13_gridcard V13_gridcard_4"><div class="V13_gridcard_title">核心指标</div><div class="V13_gridcard_desc">查血指标趋势追踪</div><div class="V13_gridcard_view">查看</div><img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432-3.svg"></div>`;
  html = appendToRoot(html, 'jian_kang_guan_li', arrow + cards);
  console.log('3) 右箭头+2x2卡片追加 ✓');

  fs.writeFileSync(file, html, 'utf-8');
  console.log('健康管理 V19 完成 ✓\n');
}

console.log('=== V19 干净版补丁 ===');
patchHome();
patchHealth();
console.log('=== 完成 ===');
