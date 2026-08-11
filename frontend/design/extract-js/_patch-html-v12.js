/**
 * Patch V12 - 修复 V11 脚本的执行时机 bug
 * 
 * V11 里所有的 DOMContentLoaded 监听器都在 </body> 前注入，
 * 此时 DOMContentLoaded 事件已经 Fire 过了 → 永远不执行！
 * 
 * 修复方案：
 * - 将 V11 注入的脚本改为"立即执行 + readyState安全兜底"模式
 * - 同时微调注入元素的坐标，让两张并排卡片 / 通知 / 2x2 位置更符合设计稿
 */
const fs = require('fs');
const path = require('path');
const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

const SAFE_RUN_FN = `
// 安全执行：若document已ready则立即执行，否则等DOMContentLoaded
function V12_runWhenReady(fn) {
  try {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      try { fn(); } catch(e) { console.error('[V12-fn-error]:', e); }
    } else {
      document.addEventListener('DOMContentLoaded', function(){ try{ fn(); }catch(e){ console.error('[V12-fn-error]:',e); } });
      // 兜底 setTimeout
      setTimeout(function(){ try{ fn(); }catch(_){} }, 1500);
    }
  } catch(e) { console.error('[V12-runWhenReady error]:', e); }
}
`;

/* ============ 首页 ============ */
function patchHome() {
  console.log('\n===== 首页 V12 开始 =====');
  const file = path.join(PAGE_DIR, 'artboard-shou_ye.html');
  let html = fs.readFileSync(file, 'utf-8');

  const newScript = `
<script>
${SAFE_RUN_FN}
(function(){
  V12_runWhenReady(function(){
    // ---------- 1) 隐藏盾牌遮挡垃圾图层 ----------
    try {
      ['Vector_26','Ellipse_6178','Ellipse_6179'].forEach(function(cls){
        var el = document.querySelector('.shou_ye .'+cls);
        if (el) el.style.display = 'none';
      });
      console.log('[V12-H] 1) 垃圾图层隐藏 ✓');
    } catch(e){ console.error('[V12-H1] ERR', e.message); }

    // ---------- 2) 问候语容器 ----------
    try {
      var ph = document.querySelector('.shou_ye .____Placeholder');
      if (ph) {
        ph.style.position = 'absolute';
        ph.style.left = '0.4rem';
        ph.style.top  = '1.44rem';
        ph.style.width = 'auto';
        ph.style.height = 'auto';
        ph.style.minHeight = '1.4rem';
        ph.style.display = 'block';
        ph.style.zIndex = '15';
        ph.style.color = '';
        ph.style.fontSize = '';
        ph.style.fontWeight = '';
        ph.style.background = 'transparent';
        // 确保子 span 显示
        var spans = ph.querySelectorAll('span');
        spans.forEach(function(s){ s.style.display = 'block'; });
      }
      // 顶置 head style 防 V10 伪元素干扰
      var s1 = document.createElement('style');
      s1.textContent = \`.shou_ye .Group_1000007255::after { content: none !important; display: none !important; }\`;
      document.head.appendChild(s1);
      console.log('[V12-H] 2) 问候语容器修正 ✓');
    } catch(e){ console.error('[V12-H2] ERR', e.message); }

    // ---------- 3) Tab Bar 内联强制定位 + zu_45205容器调整 ----------
    try {
      var zu = document.querySelector('.shou_ye .zu_45205');
      var rootEl = document.querySelector('.shou_ye');
      var rootH = 812;   // 设计稿高 812px = 10.826667rem
      if (rootEl) {
        rootH = Math.max(rootEl.getBoundingClientRect().height, 812);
      }
      var TAB_H_REM = 0.773333;
      if (zu) {
        zu.style.position = 'absolute';
        zu.style.left = '0';
        zu.style.right = '0';
        zu.style.bottom = '0';
        zu.style.width = '100%';
        // zu: 上方 1.4rem 通知 + 底部 0.773333rem Tab
        zu.style.height = (1.4 + TAB_H_REM) + 'rem';
        zu.style.overflow = 'visible';
        zu.style.backgroundColor = '#FFFFFF';
      }
      var tm = [
        ['Tab_Bar',  'Tab_Bar_1', '0rem'],
        ['Tab_Bar_2','Tab_Bar_3','1rem'],
        ['Tab_Bar_4','Tab_Bar_5','2rem'],
        ['Tab_Bar_6','Tab_Bar_7','3rem'],
        ['Tab_Bar_8','Tab_Bar_9','4rem'],
      ];
      tm.forEach(function(pair){
        pair.slice(0,2).forEach(function(cls){
          var el = document.querySelector('.shou_ye .zu_45205 .'+cls);
          if (!el) return;
          el.style.position = 'absolute';
          el.style.bottom = '0';
          el.style.top = 'auto';
          el.style.left = pair[2];
          el.style.width = '1rem';
          el.style.height = TAB_H_REM + 'rem';
          el.style.backgroundColor = '#FFFFFF';
        });
      });
      var ju = document.querySelector('.shou_ye .zu_45205 .ju_xing_2424');
      if (ju) ju.style.display = 'none';
      console.log('[V12-H] 3) Tab/zu定位 ✓');
    } catch(e){ console.error('[V12-H3] ERR', e.message); }

    // ---------- 4) 注入缺失的"透析排班查询"卡片 ----------
    try {
      var rootEl = document.querySelector('.shou_ye');
      if (rootEl && !rootEl.querySelector('.V11_schedule_card')) {
        var c = document.createElement('div');
        c.className = 'V11_schedule_card';
        // 定位：健康管理提示(t≈230)→待提升指标(240~380)→ 下一排应该在 400px ~ 488px → 即 5.333rem ~ 6.5rem
        // 左右两张并排 160px = 2.133rem 宽，88px=1.173rem高
        // l=16px=0.213333rem, t=400px=5.333333rem
        c.style.cssText = [
          'position:absolute',
          'left:0.213333rem',
          'top:5.333333rem',
          'width:2.133333rem',
          'height:1.173333rem',
          'background-color:#FFFFFF',
          'border-radius:0.14rem',
          'box-shadow:0 2px 12px rgba(13,66,49,0.05)',
          'border:1px solid rgba(13,66,49,0.05)',
          'overflow:hidden',
          'z-index:6'
        ].join(' !important;')+' !important;';
        c.innerHTML =
          '<div style="position:absolute;left:0.2rem;top:0.16rem;font-size:0.2rem;font-weight:700;color:#1A2B44;">透析排班查询</div>'+
          '<div style="position:absolute;left:0.2rem;top:0.48rem;font-size:0.155rem;color:#7A8BA4;">一键查透析排班</div>'+
          '<img src="../images/Rectangle%203463952-2.svg" style="position:absolute;right:0.28rem;top:50%;transform:translateY(-50%);width:0.92rem;height:0.92rem;object-fit:contain;">';
        rootEl.appendChild(c);
      }
      console.log('[V12-H] 4) 透析排班卡片注入 ✓');
    } catch(e){ console.error('[V12-H4] ERR', e.message); }

    // ---------- 5) 注入缺失的"最新透析状态查询"卡片 ----------
    try {
      var rootEl = document.querySelector('.shou_ye');
      if (rootEl && !rootEl.querySelector('.V11_status_card')) {
        var c = document.createElement('div');
        c.className = 'V11_status_card';
        // l=375-160-16=199px=2.653333rem， 即 right:0.213333rem, 同样top=5.333333rem
        c.style.cssText = [
          'position:absolute',
          'right:0.213333rem',
          'top:5.333333rem',
          'width:2.133333rem',
          'height:1.173333rem',
          'background-color:#FFFFFF',
          'border-radius:0.14rem',
          'box-shadow:0 2px 12px rgba(13,66,49,0.05)',
          'border:1px solid rgba(13,66,49,0.05)',
          'overflow:hidden',
          'z-index:6'
        ].join(' !important;')+' !important;';
        c.innerHTML =
          '<div style="position:absolute;left:0.2rem;top:0.16rem;font-size:0.2rem;font-weight:700;color:#1A2B44;">最新透析状态查询</div>'+
          '<div style="position:absolute;left:0.2rem;top:0.48rem;font-size:0.155rem;color:#7A8BA4;">精准查询透析状态</div>'+
          '<img src="../images/Rectangle%203463952.svg" style="position:absolute;right:0.28rem;top:50%;transform:translateY(-50%);width:0.92rem;height:0.92rem;object-fit:contain;">';
        rootEl.appendChild(c);
      }
      console.log('[V12-H] 5) 最新透析状态卡片注入 ✓');
    } catch(e){ console.error('[V12-H5] ERR', e.message); }

    // ---------- 6) 注入缺失的通知消息正文内容 ----------
    try {
      var zu = document.querySelector('.shou_ye .zu_45205');
      if (zu && !zu.querySelector('.V11_notify_wrap')) {
        var nw = document.createElement('div');
        nw.className = 'V11_notify_wrap';
        // zu 容器高度是 (1.4 + 0.773333)rem → 通知部分占上方 1.4rem
        nw.style.cssText = [
          'position:absolute',
          'left:0','top:0',
          'width:100%',
          'height:1.4rem',
          'background-color:#FFFFFF',
          'overflow:hidden',
          'z-index:7'
        ].join(' !important;')+' !important;';
        nw.innerHTML =
          '<img src="../images/Frame%20164073.svg" style="position:absolute;left:0.24rem;top:0.24rem;width:0.36rem;height:0.36rem;object-fit:contain;">'+
          '<div style="position:absolute;left:0.72rem;top:0.26rem;font-size:0.2rem;font-weight:700;color:#1A2B44;">通知消息</div>'+
          '<div style="position:absolute;right:0.28rem;top:0.28rem;font-size:0.16rem;color:#2D9CDB;">查看更多 ></div>'+
          // 通知1
          '<img src="../images/%E8%B7%AF%E5%BE%84.svg" style="position:absolute;left:0.48rem;top:1.04rem;width:0.2rem;height:0.2rem;object-fit:contain;opacity:0.7;">'+
          '<div style="position:absolute;left:0.72rem;right:1rem;top:0.78rem;font-size:0.15rem;color:#4A5568;line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">医护人员将在本周内进行电话随访，请保持手机畅…</div>'+
          '<div style="position:absolute;left:0.72rem;top:1.04rem;font-size:0.14rem;color:#97A2B5;">07-27</div>'+
          '<div style="position:absolute;right:0.32rem;top:1.04rem;font-size:0.14rem;color:#2D9CDB;">查看</div>'+
          // 通知2
          '<img src="../images/%E8%B7%AF%E5%BE%84.svg" style="position:absolute;left:0.48rem;top:1.28rem;width:0.2rem;height:0.2rem;object-fit:contain;opacity:0.7;">'+
          '<div style="position:absolute;left:0.72rem;right:1rem;top:1.18rem;font-size:0.15rem;color:#4A5568;line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">这是通知消息，消息为文本内容，保持一行</div>'+
          '<div style="position:absolute;left:0.72rem;top:1.28rem;font-size:0.14rem;color:#97A2B5;">07-26</div>'+
          '<div style="position:absolute;right:0.32rem;top:1.28rem;font-size:0.14rem;color:#2D9CDB;">查看</div>';
        zu.insertBefore(nw, zu.firstChild);
      }
      console.log('[V12-H] 6) 通知消息内容注入 ✓');
    } catch(e){ console.error('[V12-H6] ERR', e.message); }

    console.log('[V12-H] 全部完成 ✓✓✓');
  });
})();
</script>
`;

  // 替换从第一个"<script>"（V11注入的）到"</body>"之间的全部
  const startTag = '\n<script>';
  const endTag = '\n</script>\n\n</body>';
  const sIdx = html.indexOf(startTag + '\n(function(){\n  try {\n    document.addEventListener(\'DOMContentLoaded\', function(){');
  if (sIdx < 0) {
    // 可能已经被替换过，或者是其他形式：直接替换 </body> 前的最后一个 <script>..</script>
    const bodyIdx = html.indexOf('</body>');
    if (bodyIdx < 0) { console.log('WARN: 找不到</body>'); return; }
    const lastScriptOpen = html.lastIndexOf('<script>', bodyIdx);
    if (lastScriptOpen < 0) {
      html = html.substring(0, bodyIdx) + newScript + '\n</html>';
    } else {
      html = html.substring(0, lastScriptOpen) + newScript + '\n</body>\n</html>';
    }
  } else {
    // clean remove old script + insert new
    const eIdx = html.indexOf(endTag, sIdx);
    if (eIdx < 0) return;
    html = html.substring(0, sIdx) + newScript + '\n</body>\n</html>';
  }
  fs.writeFileSync(file, html, 'utf-8');
  console.log('首页V12补丁完成 ✓');
}

/* ============ 健康管理 ============ */
function patchHealth() {
  console.log('\n===== 健康管理 V12 开始 =====');
  const file = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
  let html = fs.readFileSync(file, 'utf-8');

  const newScript = `
<script>
${SAFE_RUN_FN}
(function(){
  V12_runWhenReady(function(){
    var root = document.querySelector('.jian_kang_guan_li');
    if (!root) { console.warn('[V12-J] root not found'); return; }

    // ---------- J1) 删除过大的重叠空Logo容器 ----------
    try {
      var removed = 0;
      Array.from(root.children).forEach(function(el){
        if (!el.className && el.tagName === 'DIV') {
          var w = el.offsetWidth, h = el.offsetHeight;
          if (w >= 230 && w <= 260 && h >= 40 && h <= 60) {
            el.style.display = 'none';
            removed++;
          }
        }
      });
      // 兜底：如果页面顶部有2个Logo图标，隐藏第二个(第一个过大Status Bar重叠那个)
      var logos = root.querySelectorAll('[class*="Group_1000007195"], [class*="sheng_tong_shang_nuo_"], [class*="sheng_tong_shang_nuo "]');
      if (logos.length >= 2) {
        logos[0].style.display = 'none';
      }
      console.log('[V12-J] J1) 过大Logo隐藏(removed='+removed+') ✓');
    } catch(e){ console.error('[V12-J1] ERR', e.message); }

    // ---------- J2) 头像 + 问候语定位调整 ----------
    try {
      var av = document.querySelector('.jian_kang_guan_li .Group_1000007195');
      if (av) {
        av.style.position = 'absolute';
        av.style.left = '0.32rem';
        av.style.top  = '1.48rem';
        av.style.width = '0.62rem';
        av.style.height = '0.62rem';
        av.style.zIndex = '20';
        av.style.border = '2px solid #FFFFFF';
        av.style.borderRadius = '50%';
        av.style.boxShadow = '0 2px 8px rgba(45,174,133,0.25)';
        av.style.overflow = 'hidden';
        av.style.backgroundColor = 'transparent';
        // 强制替换内部为 Frame 1739330068.svg
        if (!av.querySelector('img[src*="1739330068"]')) {
          av.innerHTML = '<img src="../images/Frame%201739330068.svg" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;">';
        }
      }
      var greet = document.querySelector('.jian_kang_guan_li .____1');
      if (greet) {
        greet.style.position = 'absolute';
        greet.style.left = '1.08rem';
        greet.style.top  = '1.62rem';
        greet.style.width = 'auto';
        greet.style.height = 'auto';
        greet.style.whiteSpace = 'nowrap';
        greet.style.overflow = 'visible';
        greet.style.fontSize = '0.26rem';
        greet.style.fontWeight = '700';
        greet.style.color = '#0A2540';
        greet.style.zIndex = '15';
        greet.style.background = 'transparent';
      }
      console.log('[V12-J] J2) 头像+问候语位置 ✓');
    } catch(e){ console.error('[V12-J2] ERR', e.message); }

    // ---------- J4) Tab强制内联定位 ----------
    try {
      var zu = document.querySelector('.jian_kang_guan_li .zu_45205_1');
      if (zu) {
        zu.style.position = 'absolute';
        zu.style.left = '0'; zu.style.right = '0';
        zu.style.bottom = '0';
        zu.style.width = '100%';
        zu.style.height = '0.773333rem';
        zu.style.overflow = 'visible';
        zu.style.backgroundColor = '#FFFFFF';
      }
      var tm = [
        ['Tab_Bar_10','Tab_Bar_11','0rem'],
        ['Tab_Bar_12','Tab_Bar_13','1rem'],
        ['Tab_Bar_14','Tab_Bar_15','2rem'],
        ['Tab_Bar_16','Tab_Bar_17','3rem'],
        ['Tab_Bar_18','Tab_Bar_19','4rem'],
      ];
      tm.forEach(function(pair){
        pair.slice(0,2).forEach(function(cls){
          var el = document.querySelector('.jian_kang_guan_li .zu_45205_1 .'+cls);
          if (!el) return;
          el.style.position = 'absolute';
          el.style.bottom = '0';
          el.style.top = 'auto';
          el.style.left = pair[2];
          el.style.width = '1rem';
          el.style.height = '0.773333rem';
          el.style.backgroundColor = '#FFFFFF';
        });
      });
      var ju = document.querySelector('.jian_kang_guan_li .zu_45205_1 .ju_xing_2424_1');
      if (ju) ju.style.display = 'none';
      console.log('[V12-J] J4) Tab定位 ✓');
    } catch(e){ console.error('[V12-J4] ERR', e.message); }

    // ---------- J3) 注入2x2四个卡片 ----------
    try {
      var defs = [
        // suf,  left,        top,        title, desc, icon
        ['5', 0.213333, 6.16, '健康档案', '查看个人健康信息',   '%E7%9F%A9%E5%BD%A2%202432-2.svg'],
        ['6', 2.586667, 6.16, '生命体征', '记录体温血压血糖',   '%E7%9F%A9%E5%BD%A2%202432.svg'],
        ['7', 0.213333, 7.88, '用药记录', '管理每日用药提醒',   '%E7%9F%A9%E5%BD%A2%202432-4.svg'],
        ['8', 2.586667, 7.88, '核心指标', '查血指标趋势追踪',   '%E7%9F%A9%E5%BD%A2%202432-3.svg'],
      ];
      defs.forEach(function(def){
        var exist = root.querySelector('.V11_gridcard_'+def[0]);
        if (exist) return;
        var c = document.createElement('div');
        c.className = 'V11_gridcard_'+def[0];
        c.style.cssText = [
          'position:absolute',
          'left:'+def[1]+'rem',
          'top:'+def[2]+'rem',
          'width:2.266667rem',   // 170px
          'height:1.493333rem',  // 112px
          'background-color:#FFFFFF',
          'border-radius:0.14rem',
          'box-shadow:0 2px 12px rgba(13,66,49,0.05)',
          'border:1px solid rgba(13,66,49,0.05)',
          'overflow:hidden',
          'z-index:8',
        ].join(' !important;')+' !important;';
        c.innerHTML =
          '<div style="position:absolute;left:0.24rem;top:0.22rem;font-size:0.2rem;font-weight:700;color:#1A2B44;">'+def[3]+'</div>'+
          '<div style="position:absolute;left:0.24rem;top:0.56rem;font-size:0.15rem;color:#7A8BA4;">'+def[4]+'</div>'+
          '<div style="position:absolute;left:0.24rem;bottom:0.18rem;font-size:0.15rem;color:#2DAE85;font-weight:600;padding:0.04rem 0.18rem;background-color:rgba(45,174,133,0.08);border-radius:0.2rem;">查看</div>'+
          '<img src="../images/'+def[5]+'" style="position:absolute;right:0.22rem;bottom:0.18rem;width:0.6rem;height:0.6rem;object-fit:contain;">';
        root.appendChild(c);
      });
      console.log('[V12-J] J3) 2x2 四卡片注入 ✓');
    } catch(e){ console.error('[V12-J3] ERR', e.message); }

    // ---------- J5) 重要标签 + 右箭头 ----------
    try {
      // 重要标签调整
      var tags = root.querySelectorAll('[class*="zhong_yao"]');
      if (tags[0]) {
        tags[0].style.position = 'absolute';
        tags[0].style.left = '1.36rem';
        tags[0].style.top  = '4.55rem';
        tags[0].style.padding = '0.03rem 0.1rem';
        tags[0].style.backgroundColor = '#2DAE85';
        tags[0].style.color = '#FFFFFF';
        tags[0].style.fontSize = '0.13rem';
        tags[0].style.fontWeight = '600';
        tags[0].style.borderRadius = '0.04rem';
        tags[0].style.zIndex = '12';
      }
      if (tags[1]) {
        tags[1].style.position = 'absolute';
        tags[1].style.left = '3.72rem';
        tags[1].style.top  = '4.55rem';
        tags[1].style.padding = '0.03rem 0.1rem';
        tags[1].style.backgroundColor = '#2DAE85';
        tags[1].style.color = '#FFFFFF';
        tags[1].style.fontSize = '0.13rem';
        tags[1].style.fontWeight = '600';
        tags[1].style.borderRadius = '0.04rem';
        tags[1].style.zIndex = '12';
      }
      // 右箭头(健康建议头右侧 绿色">")
      if (!root.querySelector('.V11_arrow_right')) {
        var arr = document.createElement('div');
        arr.className = 'V11_arrow_right';
        arr.style.cssText = [
          'position:absolute',
          'right:0.4rem',
          'top:2.56rem',
          'width:0.28rem',
          'height:0.28rem',
          'color:#FFFFFF',
          'font-size:0.24rem',
          'font-weight:700',
          'text-align:center',
          'line-height:0.28rem',
          'z-index:14',
        ].join(' !important;')+' !important;';
        arr.textContent = '>';
        root.appendChild(arr);
      }
      console.log('[V12-J] J5) 重要标签+右箭头 ✓');
    } catch(e){ console.error('[V12-J5] ERR', e.message); }

    // ---------- J2+ 隐藏原有的 Vector_204/212/213/Frame_28 空壳 ----------
    try {
      var st = document.createElement('style');
      st.textContent = \`
        .jian_kang_guan_li .Vector_204,
        .jian_kang_guan_li .Vector_212,
        .jian_kang_guan_li .Vector_213,
        .jian_kang_guan_li .Frame_28 { display:none !important; }
        .jian_kang_guan_li .Rectangle_3465239_5,
        .jian_kang_guan_li .Rectangle_3465239_6,
        .jian_kang_guan_li .Rectangle_3465239_7,
        .jian_kang_guan_li .Rectangle_3465239_8 { opacity:0 !important; pointer-events:none !important; }
      \`;
      document.head.appendChild(st);
      console.log('[V12-J] J+) 隐藏空壳旧元素 ✓');
    } catch(e){ console.error('[V12-J+] ERR', e.message); }

    console.log('[V12-J] 全部完成 ✓✓✓');
  });
})();
</script>
`;

  const sIdx = html.indexOf("<script>\n(function(){\n  try {\n    document.addEventListener('DOMContentLoaded', function(){\n      var root = document.querySelector('.jian_kang_guan_li');");
  if (sIdx < 0) {
    const bodyIdx = html.indexOf('</body>');
    if (bodyIdx < 0) { console.log('WARN: 无</body>'); return; }
    const lastScriptOpen = html.lastIndexOf('<script>', bodyIdx);
    if (lastScriptOpen < 0) {
      html = html.substring(0, bodyIdx) + newScript + '\n</html>';
    } else {
      html = html.substring(0, lastScriptOpen) + newScript + '\n</body>\n</html>';
    }
  } else {
    const endTag = '\n</script>\n\n</body>';
    const eIdx = html.indexOf(endTag, sIdx);
    if (eIdx < 0) return;
    html = html.substring(0, sIdx) + newScript + '\n</body>\n</html>';
  }
  fs.writeFileSync(file, html, 'utf-8');
  console.log('健康管理V12补丁完成 ✓');
}

try {
  console.log('=== V12 开始 ===');
  patchHome();
  patchHealth();
  console.log('=== V12 全部完成 ===\n');
} catch(e) {
  console.error('V12 失败:', e.message, e.stack);
  process.exit(1);
}
