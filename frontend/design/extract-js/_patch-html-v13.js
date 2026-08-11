/**
 * Patch V13 - 终极静态DOM补丁
 * 
 * 不再依赖浏览器端<script>注入执行！直接在Node端用正则 / 字符串替换
 * 对静态HTML / CSS做修改，写入最终DOM结构和内联样式
 * 
 * 策略：
 * - 把要显示/隐藏/追加的内容：直接用正则改HTML（追加到根容器末尾、改style属性）
 * - 把布局/定位规则：直接注入到<head>的<style>里（class选择器）
 * - 彻底移除所有未正确执行的<script>块，避免干扰
 */
const fs = require('fs');
const path = require('path');
const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

/**
 * 修改元素的内联 style 属性（用正则，保证安全）
 * @param {string} html 原始HTML字符串
 * @param {string} selector 'class="foo"' 或 'class="foo bar"' 的匹配部分（可以是 RegExp string）
 * @param {string} newStyle 追加/覆盖到 style="" 里的 cssText (不需要分号结尾)
 */
function patchInlineStyle(html, classMatch, newStyleCssText) {
  // 找到含 class="...classMatch..." 标签的开始部分，直到 >
  // 1) 先找所有 class 包含给定子串的 <div ... >
  const clsPattern = classMatch;
  const regex = new RegExp(
    `<div([^>]*?)class\\s*=\\s*"([^"]*?)\\b${clsPattern}\\b([^"]*?)"([^>]*?)>`,
    'g'
  );
  let replacedCount = 0;
  const out = html.replace(regex, function(match, pre1, cls1, cls2, post1){
    replacedCount++;
    // 现在看看是否有 style=... 属性
    const rest = pre1 + post1; // 整个标签除了 class=
    const styleRegex = /style\s*=\s*"([^"]*?)"/g;
    let addedCss = newStyleCssText;
    if (addedCss && !addedCss.endsWith(';')) addedCss += ';';
    let newRest;
    if (styleRegex.test(rest)) {
      // 已有style：追加
      newRest = rest.replace(styleRegex, function(sm, cssText){
        return 'style="' + (cssText? cssText + ';': '') + addedCss + '"';
      });
    } else {
      // 无 style：追加到末尾
      newRest = rest + ' style="' + addedCss + '"';
    }
    return `<div${newRest}class="${cls1}${clsPattern}${cls2}">`;
  });
  return { html: out, count: replacedCount };
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

/** 追加子元素到指定父 class 容器内的末尾 */
function appendChild(html, parentClass, childHtml) {
  // 找到 <div class="...parentClass..." 开标签 到匹配的闭标签
  // 简化处理：找到第一个父 class="parentClass" 的闭 </div> 前插入
  // 使用非贪婪找到该div内的最后一个 </div> 之前：用简单策略
  const regex = new RegExp(`(<div[^>]*?class\\s*=\\s*"[^"]*?\\b${parentClass}\\b[^"]*?"[^>]*?>)([\\s\\S]*?)(</div>)`);
  const m = html.match(regex);
  if (!m) return { html, count: 0 };
  // 计算：在 m[2]（内容）后面，</div> 前面 插入
  const whole = m[0];
  const replacedWhole = m[1] + m[2] + childHtml + m[3];
  return { html: html.substring(0, m.index) + replacedWhole + html.substring(m.index + whole.length), count: 1 };
}

/** 删除从某标记（如第一个<script>）到 </body> 之前的所有内容，然后只保留闭合 */
function stripAllScripts(html) {
  // 暴力移除所有 <script ...> ... </script>
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, function(m){
    return `<!-- REMOVED_SCRIPT_LEN_${m.length} -->`;
  });
}

/* =========================================================
 *  首页
 * ========================================================= */
function patchHome() {
  console.log('\n===== 首页 V13 静态DOM补丁 开始 =====');
  let file = path.join(PAGE_DIR, 'artboard-shou_ye.html');
  let html = fs.readFileSync(file, 'utf-8');

  // Step 0) 先移除所有旧 <script> 块（V11/V12无效注入）
  html = stripAllScripts(html);
  console.log('Step 0) 旧脚本块已清除 ✓');

  // Step 1) 注入全局 <style> 规则（布局/定位/隐藏）
  const cssV13 = `
/* ============ V13 HOME CRITICAL CSS ============ */
/* 隐藏盾牌上的黑色C形和两个椭圆垃圾图层 */
.shou_ye .Vector_26,
.shou_ye .Ellipse_6178,
.shou_ye .Ellipse_6179 { display: none !important; }

/* 问候语容器：强制扩展 */
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
  color: inherit !important;
}
.shou_ye .____Placeholder > * { display: block !important; }
/* 干掉伪元素上的"第1天"重复 */
.shou_ye .Group_1000007255::after { content: none !important; display: none !important; }

/* Tab 容器 zu_45205 + zu_45205 下面的通知区高度（1.4 + 0.773333） */
.shou_ye .zu_45205 {
  position: absolute !important;
  left: 0 !important; right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 2.173333rem !important;   /* 1.4 + 0.773333 */
  overflow: visible !important;
  background-color: #FFFFFF !important;
  z-index: 10 !important;
}
.shou_ye .zu_45205 .ju_xing_2424 { display: none !important; }

/* 5个 Tab 强制定位（使用每个 Tab 类） */
.shou_ye .zu_45205 .Tab_Bar,
.shou_ye .zu_45205 .Tab_Bar_1 { position:absolute !important; bottom:0 !important; left:0 !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.shou_ye .zu_45205 .Tab_Bar_2,
.shou_ye .zu_45205 .Tab_Bar_3 { position:absolute !important; bottom:0 !important; left:1rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.shou_ye .zu_45205 .Tab_Bar_4,
.shou_ye .zu_45205 .Tab_Bar_5 { position:absolute !important; bottom:0 !important; left:2rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.shou_ye .zu_45205 .Tab_Bar_6,
.shou_ye .zu_45205 .Tab_Bar_7 { position:absolute !important; bottom:0 !important; left:3rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.shou_ye .zu_45205 .Tab_Bar_8,
.shou_ye .zu_45205 .Tab_Bar_9 { position:absolute !important; bottom:0 !important; left:4rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}

/* 注入的通知区 */
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

/* 注入的 透析排班 + 最新透析状态 查询卡片 */
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
  padding: 0;
  margin: 0;
}
.shou_ye .V13_sched_card { left: 0.213333rem; top: 5.333333rem; }
.shou_ye .V13_status_card { right: 0.213333rem; top: 5.333333rem; }

.shou_ye .V13_card_title {
  position: absolute; left: 0.2rem; top: 0.16rem;
  font-size: 0.2rem; font-weight: 700; color: #1A2B44;
  width: 1.6rem;
}
.shou_ye .V13_card_desc {
  position: absolute; left: 0.2rem; top: 0.48rem;
  font-size: 0.155rem; color: #7A8BA4;
  width: 1.6rem;
}
.shou_ye .V13_card_icon {
  position: absolute; right: 0.28rem; top: 50%;
  transform: translateY(-50%);
  width: 0.92rem; height: 0.92rem; object-fit: contain;
  display: block;
}

/* 通知内部元素 */
.shou_ye .V13_notify_bell {
  position: absolute; left: 0.24rem; top: 0.24rem;
  width: 0.36rem; height: 0.36rem; object-fit: contain;
}
.shou_ye .V13_notify_title {
  position: absolute; left: 0.72rem; top: 0.26rem;
  font-size: 0.2rem; font-weight: 700; color: #1A2B44;
}
.shou_ye .V13_notify_more {
  position: absolute; right: 0.28rem; top: 0.28rem;
  font-size: 0.16rem; color: #2D9CDB;
}
.shou_ye .V13_notify_dot {
  position: absolute; width: 0.2rem; height: 0.2rem; object-fit: contain; opacity: 0.7;
}
.shou_ye .V13_notify_body {
  position: absolute; left: 0.72rem; right: 1rem;
  font-size: 0.15rem; color: #4A5568;
  line-height: 1.45;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.shou_ye .V13_notify_date {
  position: absolute; left: 0.72rem;
  font-size: 0.14rem; color: #97A2B5;
}
.shou_ye .V13_notify_view {
  position: absolute; right: 0.32rem;
  font-size: 0.14rem; color: #2D9CDB;
}
.shou_ye .V13_notify_1_body { top: 0.78rem; }
.shou_ye .V13_notify_1_dot  { left: 0.48rem; top: 0.8rem; }
.shou_ye .V13_notify_1_date { top: 1.04rem; }
.shou_ye .V13_notify_1_view { top: 1.04rem; }
.shou_ye .V13_notify_2_body { top: 1.22rem; }
.shou_ye .V13_notify_2_dot  { left: 0.48rem; top: 1.24rem; }
.shou_ye .V13_notify_2_date { top: 1.28rem; }
.shou_ye .V13_notify_2_view { top: 1.28rem; }
`;
  html = ensureCss(html, cssV13, 'V13-HOME-CSS');
  console.log('Step 1) V13关键CSS注入 ✓');

  // Step 2) 在.shou_ye 容器尾追加 透析排班查询 + 最新透析状态查询 两个卡片 + 通知区
  // 注意：通知区其实是放在 zu_45205 的 firstChild 之前的 → 直接 appendChild 到 zu_45205 内部
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

  // 2a) 把卡片追加到 .shou_ye
  let r1 = appendChild(html, 'shou_ye', schedCardHtml + statusCardHtml);
  html = r1.html;
  console.log('Step 2a) 2张卡片追加到.shou_ye ' + (r1.count > 0 ? '✓' : '⚠ 没找到.shou_ye容器'));

  // 2b) 把通知区追加到 .zu_45205 的firstChild之前（用 appendChild 到开头的话：先取内容，再把通知插到前面）
  //     实际上简单做法：在 .zu_45205 内部开头插入
  const zuRegex = /(<div[^>]*?class\s*=\s*"[^"]*?\bzu_45205\b[^"]*?"[^>]*?>)([\s\S]*?)(<\/div>)/;
  const zuMatch = html.match(zuRegex);
  if (zuMatch) {
    const replaced = zuMatch[1] + notifyHtml + zuMatch[2] + zuMatch[3];
    html = html.substring(0, zuMatch.index) + replaced + html.substring(zuMatch.index + zuMatch[0].length);
    console.log('Step 2b) 通知区插到 zu_45205 开头 ✓');
  } else {
    console.log('Step 2b) ⚠ 未找到 zu_45205 容器');
  }

  // 补回移除掉的 script 占位符（可选，留空即可），直接写回
  fs.writeFileSync(file, html, 'utf-8');
  console.log('首页 V13 静态DOM补丁完成 ✓\n');
}

/* =========================================================
 *  健康管理
 * ========================================================= */
function patchHealth() {
  console.log('\n===== 健康管理 V13 静态DOM补丁 开始 =====');
  const file = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
  let html = fs.readFileSync(file, 'utf-8');

  // Step 0) 先移除所有 <script>
  html = stripAllScripts(html);
  console.log('Step 0) 旧脚本块已清除 ✓');

  const cssV13 = `
/* ============ V13 HEALTH CRITICAL CSS ============ */
/* 双Logo重叠问题：隐藏第一个过大Logo（如果存在空div过大或 Group_1000007195 的上一个） */
/* 简化：强制把所有除了正确那个以外的Logo容器都隐藏 */
/* 正确Logo应该是 class="Group_1000007195" 的那个：放在顶部左侧 0.32rem, 1.48rem, w=0.62rem */

/* 顶部过大的空div（和StatusBar同级的）先隐藏 */
.jian_kang_guan_li > div:not([class]) {
  /* 过大的空div: 250x50左右 -> 直接display:none; 但需小心别误伤其他 */
  /* 不全局直接干，而是用下面内联style方式在后面追加 */
}

/* 头像：在左侧 */
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
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}
.jian_kang_guan_li .Group_1000007195 img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
  border-radius: 50% !important;
}

/* 问候语 ____1：在头像右侧 */
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
  text-indent: 0 !important;
}

/* 健康建议头的右箭头 */
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

/* Tab Bar */
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
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_10,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_11 { position:absolute !important; bottom:0 !important; left:0 !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_12,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_13 { position:absolute !important; bottom:0 !important; left:1rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_14,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_15 { position:absolute !important; bottom:0 !important; left:2rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_16,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_17 { position:absolute !important; bottom:0 !important; left:3rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_18,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_19 { position:absolute !important; bottom:0 !important; left:4rem !important; width:1rem !important; height:0.773333rem !important; background:#FFF !important; top:auto !important;}

/* 隐藏无效矢量占位符 */
.jian_kang_guan_li .Vector_204,
.jian_kang_guan_li .Vector_212,
.jian_kang_guan_li .Vector_213,
.jian_kang_guan_li .Frame_28 { display:none !important; }
.jian_kang_guan_li .Rectangle_3465239_5,
.jian_kang_guan_li .Rectangle_3465239_6,
.jian_kang_guan_li .Rectangle_3465239_7,
.jian_kang_guan_li .Rectangle_3465239_8 { opacity: 0 !important; pointer-events: none !important; }

/* 重要标签 - zhong_yao_ */
.jian_kang_guan_li [class*="zhong_yao_"] {
  padding: 0.03rem 0.1rem !important;
  background-color: #2DAE85 !important;
  color: #FFFFFF !important;
  font-size: 0.13rem !important;
  font-weight: 600 !important;
  border-radius: 0.04rem !important;
  z-index: 12 !important;
  display: block !important;
}

/* 2x2 功能卡片 - V13_gridcard */
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
.jian_kang_guan_li .V13_gridcard_title {
  position: absolute; left: 0.24rem; top: 0.22rem;
  font-size: 0.2rem; font-weight: 700; color: #1A2B44;
}
.jian_kang_guan_li .V13_gridcard_desc {
  position: absolute; left: 0.24rem; top: 0.56rem;
  font-size: 0.15rem; color: #7A8BA4;
}
.jian_kang_guan_li .V13_gridcard_view {
  position: absolute; left: 0.24rem; bottom: 0.18rem;
  font-size: 0.15rem; color: #2DAE85; font-weight: 600;
  padding: 0.04rem 0.18rem;
  background-color: rgba(45,174,133,0.08);
  border-radius: 0.2rem;
}
.jian_kang_guan_li .V13_gridcard_icon {
  position: absolute; right: 0.22rem; bottom: 0.18rem;
  width: 0.6rem; height: 0.6rem; object-fit: contain;
}
/* 4个卡片定位 */
.jian_kang_guan_li .V13_gridcard_1 { left: 0.213333rem; top: 6.16rem; }
.jian_kang_guan_li .V13_gridcard_2 { left: 2.586667rem; top: 6.16rem; }
.jian_kang_guan_li .V13_gridcard_3 { left: 0.213333rem; top: 7.88rem; }
.jian_kang_guan_li .V13_gridcard_4 { left: 2.586667rem; top: 7.88rem; }
`;
  html = ensureCss(html, cssV13, 'V13-HEALTH-CSS');
  console.log('Step 1) V13关键CSS注入 ✓');

  // Step 2) 处理双Logo重叠：隐藏顶部过大的空div（在顶层.jian_kang_guan_li的直接子div且无class且宽约250高约50的那个）
  //         简单方案：在 <head> 里加个V13_TOP_HIDE_CLASS，然后用JS evaluate方式在Node里：找所有.jian_kang_guan_li > div:not([class])，加 display:none 内联
  //         但因为是静态，在正则层面：遍历找顶层 jian_kang_guan_li 里面 <div> 且后面紧跟 比如 StatusBar 的那个过大 logo 容器
  //         保守方案：只隐藏"内容为空纯占位符式的"div。具体：匹配第一个子元素就是 <div class="Rectangle_...StatusBar" 之前的空div
  // 简化处理：我们在 CSS 中用 Group_1000007195 显示正确Logo的位置，这里把上面那个重复的大Logo占位（通常是 <div>...</div> 里面嵌套 sheng_tong_shang_nuo_ 或 Group_1000007195_2 的）找到并隐藏。
  //         做法：找到 .jian_kang_guan_li > 的第一个 div 且内部包含 'Group_1000007195_2' 或 'sheng_tong_shang_nuo_' 的那个加 display:none
  // 最简单粗暴有效：用正则找到含有 "sheng_tong_shang_nuo_" 或 "Group_1000007195_2" 的最顶层父div标签，追加 style="display:none"
  function hideOverlapLogo(htmlSub) {
    // 先找 class 包含 sheng_tong_shang_nuo_ 或 Group_1000007195_2 的标签
    const pattern = /<div([^>]*?class\s*=\s*"(?:[^"]*\b)?(?:sheng_tong_shang_nuo_|Group_1000007195_2)\b[^"]*?"[^>]*?)>/;
    const m = htmlSub.match(pattern);
    if (!m) return htmlSub;
    // 已经找到，如果这个div已含 style= 则追加 display:none
    const tag = m[0];
    let newTag;
    if (/style\s*=\s*"/.test(tag)) {
      newTag = tag.replace(/style\s*=\s*"/, 'style="display:none !important; ');
    } else {
      newTag = tag.replace(/^<div/, '<div style="display:none !important;"');
    }
    return htmlSub.substring(0, m.index) + newTag + htmlSub.substring(m.index + tag.length);
  }
  html = hideOverlapLogo(html);
  console.log('Step 2) 重复过大的Logo占位隐藏 ✓');

  // Step 3) 头像内部替换：确保 Group_1000007195 里面是 Frame 1739330068.svg
  //         找到 Group_1000007195 的div，清空内容后插入正确img
  (function(){
    const regex = /(<div[^>]*?class\s*=\s*"[^"]*?\bGroup_1000007195\b[^"]*?"[^>]*?>)([\s\S]*?)(<\/div>)/;
    const m = html.match(regex);
    if (!m) { console.log('Step 3) ⚠ 没找到Group_1000007195头像容器'); return; }
    const newInner = m[1] + '\n    <img src="../images/Frame%201739330068.svg">\n  ' + m[3];
    html = html.substring(0, m.index) + newInner + html.substring(m.index + m[0].length);
    console.log('Step 3) 头像内部图片替换为 Frame 1739330068 ✓');
  })();

  // Step 4) 健康建议头右箭头 + 2x2 四个卡片追加到 .jian_kang_guan_li
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

  let r = appendChild(html, 'jian_kang_guan_li', arrowHtml + cardsHtml);
  html = r.html;
  console.log('Step 4) 右箭头+2x2四卡片追加 ' + (r.count > 0 ? '✓' : '⚠ 没找到.jian_kang_guan_li容器'));

  fs.writeFileSync(file, html, 'utf-8');
  console.log('健康管理 V13 静态DOM补丁完成 ✓\n');
}

try {
  console.log('=== V13 静态DOM补丁 开始 ===\n');
  patchHome();
  patchHealth();
  console.log('=== V13 全部完成 ===\n');
} catch(e) {
  console.error('V13 失败:', e.message, e.stack);
  process.exit(1);
}
