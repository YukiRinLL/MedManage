/**
 * Patch V16 - 修复 V14 CSS 未注入的 bug
 * 
 * V14 的 ensureCss 查找 `/* V7-PATCH * /` (CSS注释)，
 * 但 HTML 中实际是 `<!-- V7-PATCH -->` (HTML注释)，导致 CSS 从未注入！
 * 
 * 本脚本直接在 <style> 标签内追加 V14 关键 CSS
 */
const fs = require('fs');
const path = require('path');
const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

function injectCss(html, css, identifier) {
  if (html.includes(identifier)) return html;
  // 找到第一个 </style> 前插入
  const idx = html.indexOf('</style>');
  if (idx < 0) return html;
  return html.substring(0, idx) + '\n/* ' + identifier + ' */\n' + css + '\n' + html.substring(idx);
}

/* ============ 首页 CSS ============ */
const HOME_CSS = `
/* ====== V16 HOME CSS ====== */
html { font-size: 75px !important; }
body {
  margin: 0 !important;
  padding: 30px 0 60px !important;
  background: #D0D0D0 !important;
  min-height: 100vh;
  display: flex; justify-content: center; align-items: flex-start;
  font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
}
.shou_ye {
  position: relative !important;
  width: 5rem !important;
  min-height: 10.826667rem !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  background-color: #F4FAF8 !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border-radius: 2px;
}
.shou_ye .Vector_26,
.shou_ye .Ellipse_6178,
.shou_ye .Ellipse_6179 { display: none !important; }
.shou_ye .____Placeholder {
  position: absolute !important; left: 0.4rem !important; top: 1.44rem !important;
  width: auto !important; height: auto !important; min-height: 1.4rem !important;
  display: block !important; z-index: 15 !important; background: transparent !important;
}
.shou_ye .____Placeholder > span, .shou_ye .____Placeholder > div { display: block !important; }
.shou_ye .Group_1000007255::after { content: none !important; display: none !important; }
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
.shou_ye .V13_sched_card, .shou_ye .V13_status_card { position:absolute;width:2.133333rem;height:1.173333rem;background-color:#FFFFFF;border-radius:0.14rem;box-shadow:0 2px 12px rgba(13,66,49,0.05);border:1px solid rgba(13,66,49,0.05);overflow:hidden;z-index:9;box-sizing:border-box; }
.shou_ye .V13_sched_card { left:0.213333rem;top:5.333333rem; }
.shou_ye .V13_status_card { right:0.213333rem;top:5.333333rem; }
.shou_ye .V13_card_title { position:absolute;left:0.2rem;top:0.16rem;font-size:0.2rem;font-weight:700;color:#1A2B44;width:1.6rem; }
.shou_ye .V13_card_desc { position:absolute;left:0.2rem;top:0.48rem;font-size:0.155rem;color:#7A8BA4;width:1.6rem; }
.shou_ye .V13_card_icon { position:absolute;right:0.28rem;top:50%;transform:translateY(-50%);width:0.92rem;height:0.92rem;object-fit:contain; }
`;

/* ============ 健康管理 CSS ============ */
const HEALTH_CSS = `
/* ====== V16 HEALTH CSS ====== */
.jian_kang_guan_li .Group_1000007195 {
  position:absolute!important;left:0.32rem!important;top:1.48rem!important;width:0.62rem!important;height:0.62rem!important;z-index:20!important;border:2px solid #FFFFFF!important;border-radius:50%!important;box-shadow:0 2px 8px rgba(45,174,133,0.25)!important;overflow:hidden!important;background:transparent!important;padding:0!important;
}
.jian_kang_guan_li .Group_1000007195 > * { width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;display:block!important; }
.jian_kang_guan_li .____1 {
  position:absolute!important;left:1.08rem!important;top:1.62rem!important;width:auto!important;height:auto!important;white-space:nowrap!important;overflow:visible!important;font-size:0.26rem!important;font-weight:700!important;color:#0A2540!important;z-index:15!important;background:transparent!important;clip:auto!important;
}
.jian_kang_guan_li .V13_arrow_right { position:absolute!important;right:0.4rem!important;top:2.56rem!important;width:0.28rem!important;height:0.28rem!important;color:#FFFFFF!important;font-size:0.24rem!important;font-weight:700!important;text-align:center!important;line-height:0.28rem!important;z-index:14!important;display:block!important; }
.jian_kang_guan_li .zu_45205_1 { position:absolute!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;height:0.773333rem!important;overflow:visible!important;background-color:#FFFFFF!important; }
.jian_kang_guan_li .zu_45205_1 .ju_xing_2424_1 { display:none!important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_10,.jian_kang_guan_li .zu_45205_1 .Tab_Bar_11 { position:absolute!important;bottom:0!important;left:0!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_12,.jian_kang_guan_li .zu_45205_1 .Tab_Bar_13 { position:absolute!important;bottom:0!important;left:1rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_14,.jian_kang_guan_li .zu_45205_1 .Tab_Bar_15 { position:absolute!important;bottom:0!important;left:2rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_16,.jian_kang_guan_li .zu_45205_1 .Tab_Bar_17 { position:absolute!important;bottom:0!important;left:3rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_18,.jian_kang_guan_li .zu_45205_1 .Tab_Bar_19 { position:absolute!important;bottom:0!important;left:4rem!important;width:1rem!important;height:0.773333rem!important;background:#FFF!important;top:auto!important;}
.jian_kang_guan_li .Vector_204,.jian_kang_guan_li .Vector_212,.jian_kang_guan_li .Vector_213,.jian_kang_guan_li .Frame_28 { display:none!important; }
.jian_kang_guan_li [class*="zhong_yao"] { padding:0.03rem 0.1rem!important;background-color:#2DAE85!important;color:#FFFFFF!important;font-size:0.13rem!important;font-weight:600!important;border-radius:0.04rem!important;z-index:12!important;display:block!important; }
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

function patchHome() {
  const file = path.join(PAGE_DIR, 'artboard-shou_ye.html');
  let html = fs.readFileSync(file, 'utf-8');
  html = injectCss(html, HOME_CSS, 'V16-HOME-CSS');
  fs.writeFileSync(file, html, 'utf-8');
  console.log('首页 V16 CSS注入 ' + (html.includes('V16-HOME-CSS') ? '✓' : '✗'));
}

function patchHealth() {
  const file = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
  let html = fs.readFileSync(file, 'utf-8');
  html = injectCss(html, HEALTH_CSS, 'V16-HEALTH-CSS');
  fs.writeFileSync(file, html, 'utf-8');
  console.log('健康管理 V16 CSS注入 ' + (html.includes('V16-HEALTH-CSS') ? '✓' : '✗'));
}

console.log('=== V16 CSS修复注入 ===');
patchHome();
patchHealth();
console.log('=== 完成 ===');
