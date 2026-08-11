/**
 * Patch V17 - 根本修复：body 作为画板容器
 * 
 * sketch-to-html 把所有元素放在 <body> 下作为兄弟，
 * 而不是嵌套在 .shou_ye 内。导致 .shou_ye 宽度为 0，
 * 且所有 .shou_ye .xxx CSS 选择器不生效。
 * 
 * 修复：
 * 1. body 变成画板容器（position:relative, width:5rem, overflow:hidden）
 * 2. 隐藏空的 .shou_ye div
 * 3. 把所有 .shou_ye .xxx 选择器复制一份为 body .xxx
 * 4. 清理 .shou_ye 内部的残留 V13 破碎 HTML
 */
const fs = require('fs');
const path = require('path');
const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

function injectCss(html, css, identifier) {
  if (html.includes(identifier)) return html;
  const idx = html.indexOf('</style>');
  if (idx < 0) return html;
  return html.substring(0, idx) + '\n/* ' + identifier + ' */\n' + css + '\n' + html.substring(idx);
}

function patchHome() {
  console.log('===== 首页 V17 =====');
  const file = path.join(PAGE_DIR, 'artboard-shou_ye.html');
  let html = fs.readFileSync(file, 'utf-8');

  // 1) 清理 .shou_ye 内部的残留 V13 破碎 HTML
  //    .shou_ye 内只有 Rectangle_3465233 和一些 V13 残片，全部清空
  //    找到 <div class="shou_ye"...> 到它的匹配 </div>，替换内容为空
  const sRegex = /(<div[^>]*?class="shou_ye"[^>]*?>)[\s\S]*?(<\/div>)/;
  const sm = html.match(sRegex);
  if (sm) {
    html = html.substring(0, sm.index) + sm[1] + sm[2] + html.substring(sm.index + sm[0].length);
    console.log('1) .shou_ye 内部残留HTML清理 ✓');
  }

  // 2) 注入 V17 CSS：body 作为画板 + 选择器重映射
  const cssV17 = `
/* ====== V17 BODY-AS-ARTBOARD ====== */
html { font-size: 75px !important; }
body {
  position: relative !important;
  width: 5rem !important;
  min-height: 10.826667rem !important;
  margin: 30px auto !important;
  padding: 0 !important;
  overflow: hidden !important;
  background-color: #F4FAF8 !important;
  display: block !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border-radius: 2px;
  font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
}
/* 隐藏空的 .shou_ye 容器 */
.shou_ye { display: none !important; }

/* === 选择器重映射：所有 .shou_ye .xxx 也用 body .xxx 匹配 === */
body .Vector_26, body .Ellipse_6178, body .Ellipse_6179 { display: none !important; }
body .____Placeholder {
  position: absolute !important; left: 0.4rem !important; top: 1.44rem !important;
  width: auto !important; height: auto !important; min-height: 1.4rem !important;
  display: block !important; z-index: 15 !important; background: transparent !important;
}
body .____Placeholder > span, body .____Placeholder > div { display: block !important; }
body .Group_1000007255::after { content: none !important; display: none !important; }

body .zu_45205 {
  position: absolute !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
  width: 100% !important; height: 2.173333rem !important; overflow: visible !important;
  background-color: #FFFFFF !important; z-index: 10 !important;
}
body .zu_45205 .ju_xing_2424 { display: none !important; }
body .zu_45205 .Tab_Bar, body .zu_45205 .Tab_Bar_1 { position:absolute!important;bottom:0!important;left:0!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
body .zu_45205 .Tab_Bar_2, body .zu_45205 .Tab_Bar_3 { position:absolute!important;bottom:0!important;left:1rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
body .zu_45205 .Tab_Bar_4, body .zu_45205 .Tab_Bar_5 { position:absolute!important;bottom:0!important;left:2rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
body .zu_45205 .Tab_Bar_6, body .zu_45205 .Tab_Bar_7 { position:absolute!important;bottom:0!important;left:3rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
body .zu_45205 .Tab_Bar_8, body .zu_45205 .Tab_Bar_9 { position:absolute!important;bottom:0!important;left:4rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}

body .V13_notify_wrap { position:absolute;left:0;top:0;width:100%;height:1.4rem;background-color:#FFFFFF;overflow:hidden;z-index:11;box-sizing:border-box; }
body .V13_notify_bell { position:absolute;left:0.24rem;top:0.24rem;width:0.36rem;height:0.36rem;object-fit:contain; }
body .V13_notify_title { position:absolute;left:0.72rem;top:0.26rem;font-size:0.2rem;font-weight:700;color:#1A2B44; }
body .V13_notify_more { position:absolute;right:0.28rem;top:0.28rem;font-size:0.16rem;color:#2D9CDB; }
body .V13_notify_dot { position:absolute;width:0.2rem;height:0.2rem;object-fit:contain;opacity:0.7; }
body .V13_notify_body { position:absolute;left:0.72rem;right:1rem;font-size:0.15rem;color:#4A5568;line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
body .V13_notify_date { position:absolute;left:0.72rem;font-size:0.14rem;color:#97A2B5; }
body .V13_notify_view { position:absolute;right:0.32rem;font-size:0.14rem;color:#2D9CDB; }
body .V13_notify_1_dot { left:0.48rem;top:0.8rem; } body .V13_notify_1_body { top:0.78rem; } body .V13_notify_1_date { top:1.04rem; } body .V13_notify_1_view { top:1.04rem; }
body .V13_notify_2_dot { left:0.48rem;top:1.24rem; } body .V13_notify_2_body { top:1.22rem; } body .V13_notify_2_date { top:1.28rem; } body .V13_notify_2_view { top:1.28rem; }

body .V13_sched_card, body .V13_status_card { position:absolute;width:2.133333rem;height:1.173333rem;background-color:#FFFFFF;border-radius:0.14rem;box-shadow:0 2px 12px rgba(13,66,49,0.05);border:1px solid rgba(13,66,49,0.05);overflow:hidden;z-index:9;box-sizing:border-box; }
body .V13_sched_card { left:0.213333rem;top:5.333333rem; }
body .V13_status_card { right:0.213333rem;top:5.333333rem; }
body .V13_card_title { position:absolute;left:0.2rem;top:0.16rem;font-size:0.2rem;font-weight:700;color:#1A2B44;width:1.6rem; }
body .V13_card_desc { position:absolute;left:0.2rem;top:0.48rem;font-size:0.155rem;color:#7A8BA4;width:1.6rem; }
body .V13_card_icon { position:absolute;right:0.28rem;top:50%;transform:translateY(-50%);width:0.92rem;height:0.92rem;object-fit:contain; }
`;
  html = injectCss(html, cssV17, 'V17-HOME-FIX');
  console.log('2) V17 CSS注入 ✓');

  // 3) 在 body 末尾（</body>前）追加 V13 卡片和通知消息
  //    清理旧的 V13 残留
  html = html.replace(/<div class="V13_sched_card"[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div class="V13_status_card"[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div class="V13_notify_wrap"[\s\S]*?<\/div>/g, '');

  const schedCard = `<div class="V13_sched_card"><div class="V13_card_title">透析排班查询</div><div class="V13_card_desc">一键查透析排班</div><img class="V13_card_icon" src="../images/Rectangle%203463952-2.svg"></div>`;
  const statusCard = `<div class="V13_status_card"><div class="V13_card_title">最新透析状态查询</div><div class="V13_card_desc">精准查询透析状态</div><img class="V13_card_icon" src="../images/Rectangle%203463952.svg"></div>`;
  const notify = `<div class="V13_notify_wrap"><img class="V13_notify_bell" src="../images/Frame%20164073.svg"><div class="V13_notify_title">通知消息</div><div class="V13_notify_more">查看更多 ></div><img class="V13_notify_dot V13_notify_1_dot" src="../images/%E8%B7%AF%E5%BE%84.svg"><div class="V13_notify_body V13_notify_1_body">医护人员将在本周内进行电话随访，请保持手机畅…</div><div class="V13_notify_date V13_notify_1_date">07-27</div><div class="V13_notify_view V13_notify_1_view">查看</div><img class="V13_notify_dot V13_notify_2_dot" src="../images/%E8%B7%AF%E5%BE%84.svg"><div class="V13_notify_body V13_notify_2_body">这是通知消息，消息为文本内容，保持一行</div><div class="V13_notify_date V13_notify_2_date">07-26</div><div class="V13_notify_view V13_notify_2_view">查看</div></div>`;

  // 找到 zu_45205 容器，在它内部开头插入通知
  const zuRegex = /(<div[^>]*?class="zu_45205"[^>]*?>)/;
  const zum = html.match(zuRegex);
  if (zum) {
    html = html.substring(0, zum.index + zum[0].length) + '\n' + notify + '\n' + html.substring(zum.index + zum[0].length);
    console.log('3a) 通知消息插入 zu_45205 ✓');
  } else {
    // 没找到 zu_45205，直接追加到 body 末尾
    html = html.replace('</body>', notify + '\n</body>');
    console.log('3a) 通知消息追加到 body末尾 (zu_45205未找到) ⚠');
  }

  // 卡片追加到 body 末尾
  html = html.replace('</body>', schedCard + statusCard + '\n</body>');
  console.log('3b) 透析排班/状态卡片追加到 body ✓');

  fs.writeFileSync(file, html, 'utf-8');
  console.log('首页 V17 完成 ✓\n');
}

function patchHealth() {
  console.log('===== 健康管理 V17 =====');
  const file = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
  let html = fs.readFileSync(file, 'utf-8');

  const cssV17 = `
/* ====== V17 HEALTH BODY-AS-ARTBOARD ====== */
body {
  position: relative !important;
  width: 5rem !important;
  min-height: 10.826667rem !important;
  margin: 30px auto !important;
  padding: 0 !important;
  overflow: hidden !important;
  background-color: #F4FAF8 !important;
  display: block !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border-radius: 2px;
  font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
}
.jian_kang_guan_li { display: none !important; }

/* 头像 */
body .Group_1000007195 {
  position:absolute!important;left:0.32rem!important;top:1.48rem!important;width:0.62rem!important;height:0.62rem!important;z-index:20!important;border:2px solid #FFFFFF!important;border-radius:50%!important;box-shadow:0 2px 8px rgba(45,174,133,0.25)!important;overflow:hidden!important;background:transparent!important;padding:0!important;
}
body .Group_1000007195 > * { width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;display:block!important; }

/* 问候语 */
body .____1 {
  position:absolute!important;left:1.08rem!important;top:1.62rem!important;width:auto!important;height:auto!important;white-space:nowrap!important;overflow:visible!important;font-size:0.26rem!important;font-weight:700!important;color:#0A2540!important;z-index:15!important;background:transparent!important;clip:auto!important;
}

/* 右箭头 */
body .V13_arrow_right { position:absolute!important;right:0.4rem!important;top:2.56rem!important;width:0.28rem!important;height:0.28rem!important;color:#FFFFFF!important;font-size:0.24rem!important;font-weight:700!important;text-align:center!important;line-height:0.28rem!important;z-index:14!important;display:block!important; }

/* Tab */
body .zu_45205_1 { position:absolute!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;height:0.773333rem!important;overflow:visible!important;background-color:#FFFFFF!important; }
body .zu_45205_1 .ju_xing_2424_1 { display:none!important; }
body .zu_45205_1 .Tab_Bar_10, body .zu_45205_1 .Tab_Bar_11 { position:absolute!important;bottom:0!important;left:0!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
body .zu_45205_1 .Tab_Bar_12, body .zu_45205_1 .Tab_Bar_13 { position:absolute!important;bottom:0!important;left:1rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
body .zu_45205_1 .Tab_Bar_14, body .zu_45205_1 .Tab_Bar_15 { position:absolute!important;bottom:0!important;left:2rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
body .zu_45205_1 .Tab_Bar_16, body .zu_45205_1 .Tab_Bar_17 { position:absolute!important;bottom:0!important;left:3rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
body .zu_45205_1 .Tab_Bar_18, body .zu_45205_1 .Tab_Bar_19 { position:absolute!important;bottom:0!important;left:4rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}

/* 隐藏无效壳 */
body .Vector_204, body .Vector_212, body .Vector_213, body .Frame_28 { display:none!important; }

/* 重要标签 */
body [class*="zhong_yao"] { padding:0.03rem 0.1rem!important;background-color:#2DAE85!important;color:#FFFFFF!important;font-size:0.13rem!important;font-weight:600!important;border-radius:0.04rem!important;z-index:12!important;display:block!important; }

/* 2x2 卡片 */
body .V13_gridcard { position:absolute;width:2.266667rem;height:1.493333rem;background-color:#FFFFFF;border-radius:0.14rem;box-shadow:0 2px 12px rgba(13,66,49,0.05);border:1px solid rgba(13,66,49,0.05);overflow:hidden;box-sizing:border-box;z-index:8; }
body .V13_gridcard_title { position:absolute;left:0.24rem;top:0.22rem;font-size:0.2rem;font-weight:700;color:#1A2B44; }
body .V13_gridcard_desc { position:absolute;left:0.24rem;top:0.56rem;font-size:0.15rem;color:#7A8BA4; }
body .V13_gridcard_view { position:absolute;left:0.24rem;bottom:0.18rem;font-size:0.15rem;color:#2DAE85;font-weight:600;padding:0.04rem 0.18rem;background-color:rgba(45,174,133,0.08);border-radius:0.2rem; }
body .V13_gridcard_icon { position:absolute;right:0.22rem;bottom:0.18rem;width:0.6rem;height:0.6rem;object-fit:contain; }
body .V13_gridcard_1 { left:0.213333rem;top:6.16rem; }
body .V13_gridcard_2 { left:2.586667rem;top:6.16rem; }
body .V13_gridcard_3 { left:0.213333rem;top:7.88rem; }
body .V13_gridcard_4 { left:2.586667rem;top:7.88rem; }
`;
  html = injectCss(html, cssV17, 'V17-HEALTH-FIX');
  console.log('1) V17 CSS注入 ✓');

  // 清理旧 V13 残留
  html = html.replace(/<div class="V13_gridcard[^"]*"[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div class="V13_arrow_right"[\s\S]*?<\/div>/g, '');

  // 头像替换
  const avRegex = /(<div[^>]*?class="Group_1000007195"[^>]*?>)[\s\S]*?(<\/div>)/;
  const avm = html.match(avRegex);
  if (avm) {
    html = html.substring(0, avm.index) + avm[1] + '<img src="../images/Frame%201739330068.svg">' + avm[2] + html.substring(avm.index + avm[0].length);
    console.log('2) 头像替换 ✓');
  }

  // 追加卡片到 body 末尾
  const arrow = `<div class="V13_arrow_right">></div>`;
  const cards = `<div class="V13_gridcard V13_gridcard_1"><div class="V13_gridcard_title">健康档案</div><div class="V13_gridcard_desc">查看个人健康信息</div><div class="V13_gridcard_view">查看</div><img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432-2.svg"></div><div class="V13_gridcard V13_gridcard_2"><div class="V13_gridcard_title">生命体征</div><div class="V13_gridcard_desc">记录体温血压血糖</div><div class="V13_gridcard_view">查看</div><img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432.svg"></div><div class="V13_gridcard V13_gridcard_3"><div class="V13_gridcard_title">用药记录</div><div class="V13_gridcard_desc">管理每日用药提醒</div><div class="V13_gridcard_view">查看</div><img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432-4.svg"></div><div class="V13_gridcard V13_gridcard_4"><div class="V13_gridcard_title">核心指标</div><div class="V13_gridcard_desc">查血指标趋势追踪</div><div class="V13_gridcard_view">查看</div><img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432-3.svg"></div>`;
  html = html.replace('</body>', arrow + cards + '\n</body>');
  console.log('3) 右箭头+2x2卡片追加 ✓');

  fs.writeFileSync(file, html, 'utf-8');
  console.log('健康管理 V17 完成 ✓\n');
}

console.log('=== V17 body-as-artboard 修复 ===');
patchHome();
patchHealth();
console.log('=== 完成 ===');
