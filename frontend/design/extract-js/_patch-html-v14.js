/**
 * Patch V14 - 修复 V13 正则非贪婪匹配 bug
 * 
 * V13 的 appendChild 用的是 [\s\S]*? 非贪婪，会把元素插到第一个遇到的 </div> 前
 * 而不是最外层根容器的 </div> 前！
 * 
 * 修复：使用 "嵌套计数" 算法，精确定位 class=ROOTCLASS 的 <div> 的匹配 </div>
 *       然后在该 </div> 前追加子元素
 */
const fs = require('fs');
const path = require('path');
const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

/**
 * 扫描字符串找 class=rootClass 的 <div> 开标签，返回开标签起始位置 start / end（end 是开标签 > 的下一个字符位置）
 */
function findRootDivStart(html, rootClass) {
  const regex = new RegExp(`<div[^>]*?class\\s*=\\s*"[^"]*?\\b${rootClass}\\b[^"]*?"[^>]*?>`, 'g');
  const m = regex.exec(html);
  if (!m) return null;
  return { start: m.index, end: m.index + m[0].length, openTag: m[0] };
}

/**
 * 从开标签 end 位置开始扫描，找到匹配的 </div>。遇到 <div 计数+1，遇到 </div> 计数-1。
 * 返回匹配的 </div> 的起始位置（即<的位置）
 */
function findMatchingCloseDiv(html, searchFrom) {
  let depth = 1;
  let i = searchFrom;
  while (i < html.length && depth > 0) {
    const nxtOpen = html.indexOf('<div', i);
    const nxtClose = html.indexOf('</div>', i);
    if (nxtClose < 0) return -1;
    if (nxtOpen >= 0 && nxtOpen < nxtClose) {
      depth++;
      i = nxtOpen + 4; // <div
    } else {
      depth--;
      if (depth === 0) return nxtClose;
      i = nxtClose + 6; // </div>
    }
  }
  return -1;
}

/** 在 class=rootClass 的根div的闭合 </div> 前插入 html 片段 */
function appendToRoot(html, rootClass, snippet) {
  const rootInfo = findRootDivStart(html, rootClass);
  if (!rootInfo) { console.error(`  [WARN] 根容器 class=${rootClass} 未找到`); return html; }
  const closePos = findMatchingCloseDiv(html, rootInfo.end);
  if (closePos < 0) { console.error(`  [WARN] class=${rootClass} 的闭合 </div> 未找到`); return html; }
  return html.substring(0, closePos) + snippet + '\n' + html.substring(closePos);
}

/** 在 class=rootClass 的第一个子位置插入 html 片段（开标签后立刻插入） */
function prependToRoot(html, rootClass, snippet) {
  const rootInfo = findRootDivStart(html, rootClass);
  if (!rootInfo) { console.error(`  [WARN] 根容器 class=${rootClass} 未找到`); return html; }
  return html.substring(0, rootInfo.end) + '\n' + snippet + '\n' + html.substring(rootInfo.end);
}

/** 追加 style 到 head（如果没有对应标识符） */
function ensureCss(html, css, identifier) {
  if (html.indexOf(identifier) >= 0) return html;
  const marker = '/* V7-PATCH */';
  const idx = html.indexOf(marker);
  if (idx < 0) return html;
  const inject = '\n/* ' + identifier + ' */\n' + css + '\n';
  return html.substring(0, idx + marker.length) + inject + html.substring(idx + marker.length);
}

/** 移除所有 <script> 块 */
function stripAllScripts(html) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '');
}

/** 隐藏含有指定class子串的标签（给开标签加 style="display:none !important"） */
function hideByClassContains(html, subCls) {
  const regex = new RegExp(`<div([^>]*?class\\s*=\\s*"[^"]*?\\b${subCls}\\b[^"]*?"[^>]*?)>`, 'g');
  let count = 0;
  const out = html.replace(regex, function(match, attrs){
    count++;
    if (/style\s*=\s*"/.test(attrs)) {
      // 已有 style
      return '<div' + attrs.replace(/style\s*=\s*"/, 'style="display:none !important; ') + '>';
    } else {
      return '<div style="display:none !important;"' + attrs + '>';
    }
  });
  return { html: out, count };
}

/* =========================================================
 *  首页
 * ========================================================= */
function patchHome() {
  console.log('\n===== 首页 V14 静态DOM补丁 开始 =====');
  let file = path.join(PAGE_DIR, 'artboard-shou_ye.html');
  let html = fs.readFileSync(file, 'utf-8');

  // Step 0) 移除所有 <script>
  html = stripAllScripts(html);
  console.log('Step 0) 旧脚本块清除 ✓');

  // Step 1) 注入关键CSS（只在还没有V13 CSS时才注入）
  const cssV14 = `
/* ====== V14 HOME CSS (Final) ====== */
html { font-size: 75px !important; }
body {
  margin: 0 !important;
  padding: 30px 0 60px !important;
  background: #D0D0D0 !important;
  min-height: 100vh;
  display: flex; justify-content: center; align-items: flex-start;
  -webkit-text-size-adjust: 100%;
  font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
}
.shou_ye {
  position: relative !important;
  width: 5rem !important;        /* 375px */
  min-height: 10.826667rem !important; /* 812px */
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  background-color: #F4FAF8 !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border-radius: 2px;
}
.shou_ye .Vector_26,
.shou_ye .Ellipse_6178,
.shou_ye .Ellipse_6179 { display: none !important; }

/* 问候语容器 */
.shou_ye .____Placeholder {
  position: absolute !important;
  left: 0.4rem !important;
  top: 1.44rem !important;
  width: auto !important;
  height: auto !important;
  min-height: 1.4rem !important;
  display: block !important;
  z-index: 15 !important;
  background: transparent !important;
}
.shou_ye .____Placeholder > span,
.shou_ye .____Placeholder > div { display: block !important; }
.shou_ye .Group_1000007255::after { content: none !important; display: none !important; }

/* Tab Bar 通知区 zu_45205 (1.4通知+0.773 Tab = 2.173rem) */
.shou_ye .zu_45205 {
  position: absolute !important;
  left: 0 !important; right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 2.173333rem !important;
  overflow: visible !important;
  background-color: #FFFFFF !important;
  z-index: 10 !important;
}
.shou_ye .zu_45205 .ju_xing_2424 { display: none !important; }
.shou_ye .zu_45205 .Tab_Bar, .shou_ye .zu_45205 .Tab_Bar_1 { position:absolute !important; bottom:0 !important; left:0 !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.shou_ye .zu_45205 .Tab_Bar_2, .shou_ye .zu_45205 .Tab_Bar_3 { position:absolute !important; bottom:0 !important; left:1rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.shou_ye .zu_45205 .Tab_Bar_4, .shou_ye .zu_45205 .Tab_Bar_5 { position:absolute !important; bottom:0 !important; left:2rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.shou_ye .zu_45205 .Tab_Bar_6, .shou_ye .zu_45205 .Tab_Bar_7 { position:absolute !important; bottom:0 !important; left:3rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.shou_ye .zu_45205 .Tab_Bar_8, .shou_ye .zu_45205 .Tab_Bar_9 { position:absolute !important; bottom:0 !important; left:4rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}

/* 通知消息容器 */
.shou_ye .V13_notify_wrap {
  position: absolute;
  left: 0; top: 0;
  width: 100%;
  height: 1.4rem;
  background-color: #FFFFFF;
  overflow: hidden;
  z-index: 11;
  box-sizing: border-box;
}
.shou_ye .V13_notify_bell  { position:absolute; left:0.24rem; top:0.24rem; width:0.36rem; height:0.36rem; object-fit:contain;}
.shou_ye .V13_notify_title { position:absolute; left:0.72rem; top:0.26rem; font-size:0.2rem; font-weight:700; color:#1A2B44;}
.shou_ye .V13_notify_more  { position:absolute; right:0.28rem; top:0.28rem; font-size:0.16rem; color:#2D9CDB;}
.shou_ye .V13_notify_dot   { position:absolute; width:0.2rem; height:0.2rem; object-fit:contain; opacity:0.7;}
.shou_ye .V13_notify_body  { position:absolute; left:0.72rem; right:1rem; font-size:0.15rem; color:#4A5568; line-height:1.45; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
.shou_ye .V13_notify_date  { position:absolute; left:0.72rem; font-size:0.14rem; color:#97A2B5;}
.shou_ye .V13_notify_view  { position:absolute; right:0.32rem; font-size:0.14rem; color:#2D9CDB;}
.shou_ye .V13_notify_1_dot  { left: 0.48rem; top: 0.8rem; }
.shou_ye .V13_notify_1_body { top: 0.78rem; }
.shou_ye .V13_notify_1_date { top: 1.04rem; }
.shou_ye .V13_notify_1_view { top: 1.04rem; }
.shou_ye .V13_notify_2_dot  { left: 0.48rem; top: 1.24rem; }
.shou_ye .V13_notify_2_body { top: 1.22rem; }
.shou_ye .V13_notify_2_date { top: 1.28rem; }
.shou_ye .V13_notify_2_view { top: 1.28rem; }

/* 排班/状态查询卡片 */
.shou_ye .V13_sched_card,
.shou_ye .V13_status_card {
  position: absolute;
  width: 2.133333rem;
  height: 1.173333rem;
  background-color: #FFFFFF;
  border-radius: 0.14rem;
  box-shadow: 0 2px 12px rgba(13,66,49,0.05);
  border: 1px solid rgba(13,66,49,0.05);
  overflow: hidden;
  z-index: 9;
  box-sizing: border-box;
}
.shou_ye .V13_sched_card { left: 0.213333rem; top: 5.333333rem; }
.shou_ye .V13_status_card { right: 0.213333rem; top: 5.333333rem; }
.shou_ye .V13_card_title { position:absolute; left:0.2rem; top:0.16rem; font-size:0.2rem; font-weight:700; color:#1A2B44; width:1.6rem;}
.shou_ye .V13_card_desc  { position:absolute; left:0.2rem; top:0.48rem; font-size:0.155rem; color:#7A8BA4; width:1.6rem;}
.shou_ye .V13_card_icon  { position:absolute; right:0.28rem; top:50%; transform:translateY(-50%); width:0.92rem; height:0.92rem; object-fit:contain;}
`;
  if (!html.includes('V14-HOME-FINAL')) {
    html = ensureCss(html, cssV14, 'V14-HOME-FINAL');
    console.log('Step 1) V14关键CSS注入 ✓');
  } else {
    console.log('Step 1) V14 CSS已存在跳过 ✓');
  }

  // Step 2) 先确保所有V11/V12残留的DOM都被清除（如果DOM里有的话——实际上HTML里没有是script生成的，这里只预防）
  //         把 V13_sched_card / V13_status_card / V13_notify_wrap 先从HTML里移除（若已经插入了错误位置的旧版本）
  //         简单做法：直接正则删掉所有 V13_* 的整段 div块
  html = html.replace(/<div class="V13_sched_card"[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div class="V13_status_card"[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div class="V13_notify_wrap"[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div class="V11_schedule_card"[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div class="V11_status_card"[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div class="V11_notify_wrap"[\s\S]*?<\/div>/g, '');
  console.log('Step 2) 旧V11/V12/V13残留DOM清理 ✓');

  // Step 3) 用嵌套计数法，追加排班/状态卡片到.shou_ye的末尾
  const schedCardHtml = `
  <div class="V13_sched_card">
    <div class="V13_card_title">透析排班查询</div>
    <div class="V13_card_desc">一键查透析排班</div>
    <img class="V13_card_icon" src="../images/Rectangle%203463952-2.svg">
  </div>`;
  const statusCardHtml = `
  <div class="V13_status_card">
    <div class="V13_card_title">最新透析状态查询</div>
    <div class="V13_card_desc">精准查询透析状态</div>
    <img class="V13_card_icon" src="../images/Rectangle%203463952.svg">
  </div>`;
  html = appendToRoot(html, 'shou_ye', schedCardHtml + statusCardHtml);
  console.log('Step 3) 透析排班/状态查询卡片追加到 .shou_ye 末尾 ✓');

  // Step 4) 通知消息插到 zu_45205 的开头（内部第一个子位置）
  const notifyHtml = `
  <div class="V13_notify_wrap">
    <img class="V13_notify_bell" src="../images/Frame%20164073.svg">
    <div class="V13_notify_title">通知消息</div>
    <div class="V13_notify_more">查看更多 ></div>
    <img class="V13_notify_dot V13_notify_1_dot" src="../images/%E8%B7%AF%E5%BE%84.svg">
    <div class="V13_notify_body V13_notify_1_body">医护人员将在本周内进行电话随访，请保持手机畅…</div>
    <div class="V13_notify_date V13_notify_1_date">07-27</div>
    <div class="V13_notify_view V13_notify_1_view">查看</div>
    <img class="V13_notify_dot V13_notify_2_dot" src="../images/%E8%B7%AF%E5%BE%84.svg">
    <div class="V13_notify_body V13_notify_2_body">这是通知消息，消息为文本内容，保持一行</div>
    <div class="V13_notify_date V13_notify_2_date">07-26</div>
    <div class="V13_notify_view V13_notify_2_view">查看</div>
  </div>`;
  html = prependToRoot(html, 'zu_45205', notifyHtml);
  console.log('Step 4) 通知消息区域插到 zu_45205 开头 ✓');

  fs.writeFileSync(file, html, 'utf-8');
  console.log('首页 V14 补丁完成 ✓\n');
}

/* =========================================================
 *  健康管理
 * ========================================================= */
function patchHealth() {
  console.log('\n===== 健康管理 V14 静态DOM补丁 开始 =====');
  const file = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
  let html = fs.readFileSync(file, 'utf-8');

  // Step 0) 移除所有 <script>
  html = stripAllScripts(html);
  console.log('Step 0) 旧脚本块清除 ✓');

  // 清理旧的 V13/V12 残留DOM
  html = html.replace(/<div class="V13_gridcard[^"]*"[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div class="V13_arrow_right"[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div class="V11_gridcard[^"]*"[\s\S]*?<\/div>/g, '');

  // Step 1) 关键CSS注入
  const cssV14 = `
/* ====== V14 HEALTH CSS (Final) ====== */
/* 重复过大Logo占位隐藏（双Logo问题） */
.jian_kang_guan_li .V14_OVERLAP_HIDE { display: none !important; }

/* 正确位置的头像 */
.jian_kang_guan_li .Group_1000007195 {
  position: absolute !important;
  left: 0.32rem !important;
  top: 1.48rem !important;
  width: 0.62rem !important;
  height: 0.62rem !important;
  z-index: 20 !important;
  border: 2px solid #FFFFFF !important;
  border-radius: 50% !important;
  box-shadow: 0 2px 8px rgba(45,174,133,0.25) !important;
  overflow: hidden !important;
  background: transparent !important;
  padding: 0 !important;
}
.jian_kang_guan_li .Group_1000007195 > * { /* 替换其内部图片 */
  width: 100% !important; height: 100% !important; object-fit: cover !important;
  border-radius: 50% !important; display: block !important;
}

/* 问候语 */
.jian_kang_guan_li .____1 {
  position: absolute !important;
  left: 1.08rem !important;
  top: 1.62rem !important;
  width: auto !important;
  height: auto !important;
  white-space: nowrap !important;
  overflow: visible !important;
  font-size: 0.26rem !important;
  font-weight: 700 !important;
  color: #0A2540 !important;
  z-index: 15 !important;
  background: transparent !important;
  clip: auto !important;
}

/* 另外："早上好，何先" 这部分可能在另一个 class，把它也移到一起 */
.jian_kang_guan_li [class^="____"]:not(.____1) {
  /* 让其它的前缀类也在同一行，或者如果有____ ____的文字也统一 */
  position: absolute !important;
  left: 1.08rem !important;
  top: 1.62rem !important;
  width: auto !important;
  height: auto !important;
  white-space: nowrap !important;
  overflow: visible !important;
  font-size: 0.26rem !important;
  font-weight: 700 !important;
  color: #0A2540 !important;
  z-index: 16 !important;
  background: transparent !important;
}

/* 健康建议头部右箭头 */
.jian_kang_guan_li .V13_arrow_right {
  position: absolute !important;
  right: 0.4rem !important;
  top: 2.56rem !important;
  width: 0.28rem !important;
  height: 0.28rem !important;
  color: #FFFFFF !important;
  font-size: 0.24rem !important;
  font-weight: 700 !important;
  text-align: center !important;
  line-height: 0.28rem !important;
  z-index: 14 !important;
  display: block !important;
}

/* Tab */
.jian_kang_guan_li .zu_45205_1 {
  position: absolute !important;
  left: 0 !important; right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 0.773333rem !important;
  overflow: visible !important;
  background-color: #FFFFFF !important;
}
.jian_kang_guan_li .zu_45205_1 .ju_xing_2424_1 { display: none !important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_10,.jian_kang_guan_li .zu_45205_1 .Tab_Bar_11 { position:absolute !important; bottom:0 !important; left:0 !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_12,.jian_kang_guan_li .zu_45205_1 .Tab_Bar_13 { position:absolute !important; bottom:0 !important; left:1rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_14,.jian_kang_guan_li .zu_45205_1 .Tab_Bar_15 { position:absolute !important; bottom:0 !important; left:2rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_16,.jian_kang_guan_li .zu_45205_1 .Tab_Bar_17 { position:absolute !important; bottom:0 !important; left:3rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_18,.jian_kang_guan_li .zu_45205_1 .Tab_Bar_19 { position:absolute !important; bottom:0 !important; left:4rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}

/* 隐藏无效壳 */
.jian_kang_guan_li .Vector_204,
.jian_kang_guan_li .Vector_212,
.jian_kang_guan_li .Vector_213,
.jian_kang_guan_li .Frame_28 { display:none !important; }

/* 重要标签 */
.jian_kang_guan_li [class*="zhong_yao"] {
  padding: 0.03rem 0.1rem !important;
  background-color: #2DAE85 !important;
  color: #FFFFFF !important;
  font-size: 0.13rem !important;
  font-weight: 600 !important;
  border-radius: 0.04rem !important;
  z-index: 12 !important;
  display: block !important;
}

/* 2x2 功能卡片 */
.jian_kang_guan_li .V13_gridcard {
  position: absolute;
  width: 2.266667rem;
  height: 1.493333rem;
  background-color: #FFFFFF;
  border-radius: 0.14rem;
  box-shadow: 0 2px 12px rgba(13,66,49,0.05);
  border: 1px solid rgba(13,66,49,0.05);
  overflow: hidden;
  box-sizing: border-box;
  z-index: 8;
}
.jian_kang_guan_li .V13_gridcard_title { position:absolute; left:0.24rem; top:0.22rem; font-size:0.2rem; font-weight:700; color:#1A2B44; }
.jian_kang_guan_li .V13_gridcard_desc  { position:absolute; left:0.24rem; top:0.56rem; font-size:0.15rem; color:#7A8BA4; }
.jian_kang_guan_li .V13_gridcard_view  { position:absolute; left:0.24rem; bottom:0.18rem; font-size:0.15rem; color:#2DAE85; font-weight:600; padding:0.04rem 0.18rem; background-color:rgba(45,174,133,0.08); border-radius:0.2rem; }
.jian_kang_guan_li .V13_gridcard_icon  { position:absolute; right:0.22rem; bottom:0.18rem; width:0.6rem; height:0.6rem; object-fit:contain; }
.jian_kang_guan_li .V13_gridcard_1 { left: 0.213333rem; top: 6.16rem; }
.jian_kang_guan_li .V13_gridcard_2 { left: 2.586667rem; top: 6.16rem; }
.jian_kang_guan_li .V13_gridcard_3 { left: 0.213333rem; top: 7.88rem; }
.jian_kang_guan_li .V13_gridcard_4 { left: 2.586667rem; top: 7.88rem; }
`;
  if (!html.includes('V14-HEALTH-FINAL')) {
    html = ensureCss(html, cssV14, 'V14-HEALTH-FINAL');
    console.log('Step 1) V14关键CSS注入 ✓');
  } else {
    console.log('Step 1) V14 CSS已存在跳过 ✓');
  }

  // Step 2) 健康管理页面的双Logo重叠：找到 Status Bar（9:41那个黑条）上方的过大Logo容器并隐藏
  //         这个过大容器通常包含 sheng_tong_shang_nuo_ 或 Group_1000007195_2 类的元素
  //         先隐藏含 sheng_tong_shang_nuo_ 的那个父div：在其外层父div（根容器的直接子，且不是status bar也不是第二个大logo）
  //         用简单方案：找到含有 "sheng_tong_shang_nuo_" 字符串的第一个 <div> 开标签的 class 里追加 V14_OVERLAP_HIDE
  //         但这个div实际是子元素。应该是它的"直接父div"才需要被隐藏（因为父是大空div壳）
  //         简化策略：用 hideByClassContains 先隐藏含有 Group_1000007195_2 的（第一个重复的大Logo图标div）
  //         再隐藏含有 sheng_tong_shang_nuo_ 的第二个重复的文字Logo div
  let hideR = hideByClassContains(html, 'Group_1000007195_2');
  html = hideR.html;
  console.log(`Step 2a) 隐藏 Group_1000007195_2 重复Logo: ${hideR.count} ✓`);
  hideR = hideByClassContains(html, 'sheng_tong_shang_nuo_');
  html = hideR.html;
  console.log(`Step 2b) 隐藏 sheng_tong_shang_nuo_ 重复Logo文字: ${hideR.count} ✓`);

  // Step 3) 头像内部图片替换成 Frame 1739330068
  (function(){
    const regex = /(<div[^>]*?class\s*=\s*"[^"]*?\bGroup_1000007195\b[^"]*?"[^>]*?>)([\s\S]*?)(<\/div>)/;
    const m = html.match(regex);
    if (!m) { console.log('Step 3) ⚠ 没找到Group_1000007195头像容器'); return; }
    // 这个正则非贪婪 [\s\S]*? 没问题，因为头像容器内部通常没有嵌套 </div> 或只有 <img>
    const newInner = m[1] + '\n    <img src="../images/Frame%201739330068.svg">\n  ' + m[3];
    html = html.substring(0, m.index) + newInner + html.substring(m.index + m[0].length);
    console.log('Step 3) 头像内部图片替换 Frame 1739330068 ✓');
  })();

  // Step 4) 健康建议头部右箭头 + 2x2 四卡片追加到 .jian_kang_guan_li 末尾（计数法）
  const arrowHtml = `<div class="V13_arrow_right">></div>`;
  const cardsHtml = `
  <div class="V13_gridcard V13_gridcard_1">
    <div class="V13_gridcard_title">健康档案</div>
    <div class="V13_gridcard_desc">查看个人健康信息</div>
    <div class="V13_gridcard_view">查看</div>
    <img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432-2.svg">
  </div>
  <div class="V13_gridcard V13_gridcard_2">
    <div class="V13_gridcard_title">生命体征</div>
    <div class="V13_gridcard_desc">记录体温血压血糖</div>
    <div class="V13_gridcard_view">查看</div>
    <img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432.svg">
  </div>
  <div class="V13_gridcard V13_gridcard_3">
    <div class="V13_gridcard_title">用药记录</div>
    <div class="V13_gridcard_desc">管理每日用药提醒</div>
    <div class="V13_gridcard_view">查看</div>
    <img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432-4.svg">
  </div>
  <div class="V13_gridcard V13_gridcard_4">
    <div class="V13_gridcard_title">核心指标</div>
    <div class="V13_gridcard_desc">查血指标趋势追踪</div>
    <div class="V13_gridcard_view">查看</div>
    <img class="V13_gridcard_icon" src="../images/%E7%9F%A9%E5%BD%A2%202432-3.svg">
  </div>`;
  html = appendToRoot(html, 'jian_kang_guan_li', arrowHtml + cardsHtml);
  console.log('Step 4) 健康建议右箭头 + 2x2 四卡片追加到末尾 ✓');

  fs.writeFileSync(file, html, 'utf-8');
  console.log('健康管理 V14 补丁完成 ✓\n');
}

try {
  console.log('=== V14 静态DOM修复补丁 开始 ===\n');
  patchHome();
  patchHealth();
  console.log('=== V14 全部完成 ===\n');
} catch(e) {
  console.error('V14 失败:', e.message, e.stack);
  process.exit(1);
}
