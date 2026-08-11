/**
 * Patch V11 - 终极修复：DOM注入 + inline内联样式
 * 
 * 解决V10仍存在的所有问题：
 * 
 * 【首页】
 *  1) 盾牌黑C形遮挡：隐藏 Vector_26、Ellipse_6178、Ellipse_6179 三个图层
 *  2) 问候语：移除::after重复"第1天"，扩大____Placeholder高度让两行span都可见
 *  3) Tab定位：给5个Tab直接加内联样式 top/bottom，精确强制到底部（绕开CSS优先级bug）
 *  4) zu_45205：直接inline强制高度和padding，让它同时容纳通知+Tab两部分
 *  5) 缺失内容注入：
 *     - 注入"透析排班查询"和"最新透析状态查询"两张卡片DOM
 *     - 注入"通知消息"的两条正文（医护随访通知 + 另一条通知）+ 查看按钮
 * 
 * 【健康管理】
 *  J1) 双Logo重叠：删除第一个过大重叠Status Bar的空Logo容器 (w=240,h=48,t=16)
 *  J2) 问候语裁切：扩大头像右移/缩小，或者问候语左缩进调整，修复文字显示不全
 *  J3) 2x2四个卡片：如果内部DOM缺失，直接注入DOM结构（标题/描述/查看按钮 + 右下角图标定位）
 *  J4) Tab定位：inline强制到底部
 *  J5) 重要标签、右箭头图标补齐
 */
const fs = require('fs');
const path = require('path');
const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

/* ============ 首页补丁 ============ */
function patchHome() {
  const file = path.join(PAGE_DIR, 'artboard-shou_ye.html');
  let html = fs.readFileSync(file, 'utf-8');
  let ok = 0;

  /* ====== A. 注入内联 <script> 在 DOMContentLoaded 后执行（永久生效） ====== */
  const homeFixScript = `
<script>
(function(){
  try {
    document.addEventListener('DOMContentLoaded', function(){
      // ---------- 1) 隐藏盾牌遮挡垃圾图层 ----------
      ['Vector_26', 'Ellipse_6178', 'Ellipse_6179'].forEach(function(cls){
        var el = document.querySelector('.shou_ye .' + cls);
        if (el) { el.style.display = 'none'; }
      });

      // ---------- 2) 扩大问候语容器高度（避免"第1天"被裁切） ----------
      var ph = document.querySelector('.shou_ye .____Placeholder');
      if (ph) {
        ph.style.height = 'auto';
        ph.style.minHeight = '1.4rem';
        ph.style.left = '0.4rem';
        ph.style.top = '1.44rem';
        // 删除可能存在的 inline color/font-size 覆盖
        ph.style.color = '';
        ph.style.fontSize = '';
        ph.style.fontWeight = '';
        ph.style.zIndex = 15;
      }

      // ---------- 3) Tab Bar 强制内联定位：5个Tab（每个分 Tab_Bar_X + Tab_Bar_X+1 两层） ----------
      var tabMap = [
        ['Tab_Bar',   'Tab_Bar_1',   '0rem'],
        ['Tab_Bar_2', 'Tab_Bar_3',   '1rem'],
        ['Tab_Bar_4', 'Tab_Bar_5',   '2rem'],
        ['Tab_Bar_6', 'Tab_Bar_7',   '3rem'],
        ['Tab_Bar_8', 'Tab_Bar_9',   '4rem'],
      ];
      var zu = document.querySelector('.shou_ye .zu_45205');
      if (zu) {
        // zu 容器：强制作为 Tab 底板
        zu.style.position = 'absolute';
        zu.style.left = '0';
        zu.style.right = '0';
        zu.style.bottom = '0';
        zu.style.width = '100%';
        zu.style.height = '2.4rem';    // 上部通知(1.627rem) + 底部Tab(0.773rem)
        zu.style.paddingTop = '0.2rem';
        zu.style.paddingBottom = '0.773333rem';
        zu.style.boxSizing = 'border-box';
        zu.style.overflow = 'hidden';
      }
      tabMap.forEach(function(pair){
        pair.slice(0,2).forEach(function(cls){
          var el = document.querySelector('.shou_ye .zu_45205 .' + cls);
          if (el) {
            el.style.position = 'absolute';
            el.style.top = 'auto';
            el.style.bottom = '0';
            el.style.left = pair[2];
            el.style.width = '1rem';
            el.style.height = '0.773333rem';
            el.style.backgroundColor = '#fff';
          }
        });
      });
      // 隐藏 zu 容器里除 Tab 外所有无意义装饰（如ju_xing_2424顶黑条）
      var ju = document.querySelector('.shou_ye .zu_45205 .ju_xing_2424');
      if (ju) ju.style.display = 'none';

      // ---------- 4) 注入缺失的"透析排班查询"卡片 ----------
      // 设计稿中：健康管理提示/待提升指标下方 左右两张并排卡片
      // Rectangle_3465233 是在 t=508 的大背景。两张卡片应该在其内部或上层 t≈420 l≈16 和 l≈199
      var schCard = document.createElement('div');
      schCard.setAttribute('class', 'V11_schedule_card');
      schCard.style.cssText = [
        'position:absolute',
        'left:0.213333rem',
        'top:5.6rem',     // 即 420px
        'width:2.133333rem',  // 160px
        'height:1.173333rem', // 88px
        'background-color:#FFFFFF',
        'border-radius:0.14rem',
        'box-shadow:0 2px 12px rgba(13,66,49,0.05)',
        'border:1px solid rgba(13,66,49,0.05)',
        'box-sizing:border-box',
        'padding:0.2rem',
        'z-index:6'
      ].join(' !important;') + ' !important;';
      schCard.innerHTML = \`
        <div style="position:absolute;left:0.2rem;top:0.16rem;font-size:0.2rem;font-weight:700;color:#1A2B44;">透析排班查询</div>
        <div style="position:absolute;left:0.2rem;top:0.48rem;font-size:0.155rem;color:#7A8BA4;">一键查透析排班</div>
        <img src="../images/Rectangle%203463952-2.svg"
             style="position:absolute;right:0.28rem;top:50%;transform:translateY(-50%);width:0.92rem;height:0.92rem;object-fit:contain;display:block;" />
      \`;
      var rootEl = document.querySelector('.shou_ye');
      if (rootEl && !rootEl.querySelector('.V11_schedule_card')) {
        rootEl.appendChild(schCard);
      }

      // ---------- 5) 注入缺失的"最新透析状态查询"卡片 ----------
      var staCard = document.createElement('div');
      staCard.setAttribute('class', 'V11_status_card');
      staCard.style.cssText = [
        'position:absolute',
        'right:0.213333rem',
        'top:5.6rem',
        'width:2.133333rem',
        'height:1.173333rem',
        'background-color:#FFFFFF',
        'border-radius:0.14rem',
        'box-shadow:0 2px 12px rgba(13,66,49,0.05)',
        'border:1px solid rgba(13,66,49,0.05)',
        'box-sizing:border-box',
        'padding:0.2rem',
        'z-index:6'
      ].join(' !important;') + ' !important;';
      staCard.innerHTML = \`
        <div style="position:absolute;left:0.2rem;top:0.16rem;font-size:0.2rem;font-weight:700;color:#1A2B44;">最新透析状态查询</div>
        <div style="position:absolute;left:0.2rem;top:0.48rem;font-size:0.155rem;color:#7A8BA4;">精准查询透析状态</div>
        <img src="../images/Rectangle%203463952.svg"
             style="position:absolute;right:0.28rem;top:50%;transform:translateY(-50%);width:0.92rem;height:0.92rem;object-fit:contain;display:block;" />
      \`;
      if (rootEl && !rootEl.querySelector('.V11_status_card')) {
        rootEl.appendChild(staCard);
      }

      // ---------- 6) 注入缺失的通知消息正文内容 ----------
      // 在 zu_45205 容器内部上方(非Tab部分)添加两条通知
      var notifyWrap = document.createElement('div');
      notifyWrap.setAttribute('class', 'V11_notify_wrap');
      notifyWrap.style.cssText = [
        'position:absolute',
        'left:0',
        'top:0',
        'width:100%',
        'height:1.626667rem',  // 122px
        'background-color:#FFFFFF',
        'padding:0.24rem 0.24rem 0 0.24rem',
        'box-sizing:border-box',
        'z-index:7'
      ].join(' !important;') + ' !important;';
      notifyWrap.innerHTML = \`
        <!-- 通知标题行：喇叭 + "通知消息" + "查看更多 >" -->
        <img src="../images/Frame%20164073.svg"
             style="position:absolute;left:0.24rem;top:0.24rem;width:0.36rem;height:0.36rem;object-fit:contain;" />
        <div style="position:absolute;left:0.72rem;top:0.26rem;font-size:0.2rem;font-weight:700;color:#1A2B44;">通知消息</div>
        <div style="position:absolute;right:0.28rem;top:0.28rem;font-size:0.16rem;color:#2D9CDB;">查看更多 ></div>

        <!-- 通知1：医护随访 -->
        <img src="../images/%E8%B7%AF%E5%BE%84.svg"
             style="position:absolute;left:0.48rem;top:1.08rem;width:0.2rem;height:0.2rem;object-fit:contain;opacity:0.7;" />
        <div style="position:absolute;left:0.72rem;right:1rem;top:0.82rem;
                    font-size:0.15rem;color:#4A5568;line-height:1.45;
                    overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          医护人员将在本周内进行电话随访，请保持手机畅…
        </div>
        <div style="position:absolute;left:0.72rem;top:1.08rem;font-size:0.14rem;color:#97A2B5;">07-27</div>
        <div style="position:absolute;right:0.32rem;top:1.08rem;font-size:0.14rem;color:#2D9CDB;">查看</div>

        <!-- 通知2：文本通知 -->
        <img src="../images/%E8%B7%AF%E5%BE%84.svg"
             style="position:absolute;left:0.48rem;top:1.48rem;width:0.2rem;height:0.2rem;object-fit:contain;opacity:0.7;" />
        <div style="position:absolute;left:0.72rem;right:1rem;top:1.22rem;
                    font-size:0.15rem;color:#4A5568;line-height:1.45;
                    overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          这是通知消息，消息为文本内容，保持一行
        </div>
        <div style="position:absolute;left:0.72rem;top:1.48rem;font-size:0.14rem;color:#97A2B5;">07-26</div>
        <div style="position:absolute;right:0.32rem;top:1.48rem;font-size:0.14rem;color:#2D9CDB;">查看</div>
      \`;
      if (zu && !zu.querySelector('.V11_notify_wrap')) {
        // 清空 zu 里面原有的通知相关装饰（除了 Tab 结构保留）
        // 插入通知层作为第一个子元素
        zu.insertBefore(notifyWrap, zu.firstChild);
      }

      // ---------- 7) 移除 V10 中注入的重复"第1天" ::after（通过移除匹配类上的伪元素定义暂时无法用JS），
      //    我们用更彻底的方法：给 Group_1000007255 直接加一个含 content:none 的内联 style 无效，
      //    改为通过 document.head.appendChild 注入一条高优先级 style 覆盖。
      var antiAfterStyle = document.createElement('style');
      antiAfterStyle.textContent = \`
        .shou_ye .Group_1000007255::after { content: none !important; display: none !important; }
        .shou_ye .____Placeholder {
          position: absolute !important;
          left: 0.4rem !important;
          top: 1.44rem !important;
          width: auto !important;
          height: auto !important;
          min-height: 1.4rem !important;
          display: block !important;
          z-index: 15 !important;
        }
        .shou_ye .____Placeholder span { display: block !important; }
      \`;
      document.head.appendChild(antiAfterStyle);

      console.log('[V11] 首页修复脚本执行完成 ✓');
    });
  } catch(e) { console.error('[V11] HOME FIX ERROR:', e); }
})();
</script>
`;

  // 在 </body> 前注入（或找不到 </body> 就追加到末尾）
  if (html.indexOf('</body>') >= 0) {
    html = html.replace('</body>', homeFixScript + '\n</body>');
  } else {
    html += '\n' + homeFixScript;
  }
  ok++;
  console.log('H-SCRIPT 首页修复脚本注入 ✓');

  fs.writeFileSync(file, html, 'utf-8');
  console.log(`首页V11补丁完成 成功${ok}项 ✓`);
}

/* ============ 健康管理补丁 ============ */
function patchHealth() {
  const file = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
  let html = fs.readFileSync(file, 'utf-8');
  let ok = 0;

  const healthFixScript = `
<script>
(function(){
  try {
    document.addEventListener('DOMContentLoaded', function(){
      var root = document.querySelector('.jian_kang_guan_li');
      if (!root) return;

      // ---------- J1) 删除过大的顶部重叠空Logo容器（w≈240,h=48,t=16,l=24 那个无class空div） ----------
      // 遍历所有无className子元素，找第一个 w=240,h=48,t:16,l:24 附近的
      Array.from(root.children).forEach(function(el){
        if (!el.className && el.tagName === 'DIV') {
          var w = el.offsetWidth, h = el.offsetHeight;
          if ((w >= 230 && w <= 250) && (h >= 40 && h <= 56)) {
            el.style.display = 'none';
          }
        }
      });

      // ---------- J2) 问候语裁切修复：头像尺寸+位置 ----------
      var av = document.querySelector('.jian_kang_guan_li .Group_1000007195');
      if (av) {
        av.style.position = 'absolute';
        av.style.left = '0.32rem';
        av.style.top = '1.44rem';
        av.style.width = '0.72rem';
        av.style.height = '0.72rem';
        av.style.zIndex = 20;
        av.style.border = '2px solid #fff';
        av.style.borderRadius = '50%';
        av.style.boxShadow = '0 2px 8px rgba(45,174,133,0.2)';
      }
      // 问候语 ____1
      var greet = document.querySelector('.jian_kang_guan_li .____1');
      if (greet) {
        greet.style.position = 'absolute';
        greet.style.left = '1.2rem';
        greet.style.top = '1.6rem';
        greet.style.width = 'auto';
        greet.style.height = 'auto';
        greet.style.fontSize = '0.28rem';
        greet.style.fontWeight = '700';
        greet.style.color = '#0A2540';
        greet.style.whiteSpace = 'nowrap';
        greet.style.overflow = 'visible';
        greet.style.zIndex = 15;
      }

      // ---------- J4) Tab强制内联定位（跟首页一样） ----------
      var tabMap = [
        ['Tab_Bar_10','Tab_Bar_11','0rem'],
        ['Tab_Bar_12','Tab_Bar_13','1rem'],
        ['Tab_Bar_14','Tab_Bar_15','2rem'],
        ['Tab_Bar_16','Tab_Bar_17','3rem'],
        ['Tab_Bar_18','Tab_Bar_19','4rem'],
      ];
      var zu = document.querySelector('.jian_kang_guan_li .zu_45205_1');
      if (zu) {
        zu.style.position = 'absolute';
        zu.style.left = '0';
        zu.style.right = '0';
        zu.style.bottom = '0';
        zu.style.width = '100%';
        zu.style.height = '0.773333rem';
        zu.style.boxSizing = 'border-box';
        zu.style.overflow = 'hidden';
        zu.style.backgroundColor = '#fff';
      }
      tabMap.forEach(function(pair){
        pair.slice(0,2).forEach(function(cls){
          var el = document.querySelector('.jian_kang_guan_li .zu_45205_1 .' + cls);
          if (el) {
            el.style.position = 'absolute';
            el.style.top = 'auto';
            el.style.bottom = '0';
            el.style.left = pair[2];
            el.style.width = '1rem';
            el.style.height = '0.773333rem';
            el.style.backgroundColor = '#fff';
          }
        });
      });
      var juBad = document.querySelector('.jian_kang_guan_li .zu_45205_1 .ju_xing_2424_1');
      if (juBad) juBad.style.display = 'none';

      // ---------- J3) 2x2 四个卡片：如果内部缺少内容/位置不对 直接注入 ----------
      // 左上: 健康档案 / 右上: 生命体征 / 左下: 用药记录 / 右下: 核心指标
      var cardDefs = [
        // cls 后缀, left, top, 标题, 描述, 图标svg, 图标色背景
        ['5', 0.213333, 6.2,  '健康档案',   '查看个人健康信息',         '%E7%9F%A9%E5%BD%A2%202432-2.svg'],
        ['6', 2.586667, 6.2,  '生命体征',   '记录体温血压血糖',         '%E7%9F%A9%E5%BD%A2%202432.svg'],
        ['7', 0.213333, 7.92, '用药记录',   '管理每日用药提醒',         '%E7%9F%A9%E5%BD%A2%202432-4.svg'],
        ['8', 2.586667, 7.92, '核心指标',   '查血指标趋势追踪',         '%E7%9F%A9%E5%BD%A2%202432-3.svg'],
      ];
      cardDefs.forEach(function(def){
        var exist = document.querySelector('.jian_kang_guan_li .V11_gridcard_' + def[0]);
        if (exist) return;  // 已注入跳过
        var c = document.createElement('div');
        c.setAttribute('class', 'V11_gridcard_' + def[0]);
        c.style.cssText = [
          'position:absolute',
          'left:' + def[1] + 'rem',
          'top:'  + def[2] + 'rem',
          'width:2.266667rem',  // 170px
          'height:1.493333rem', // 112px
          'background-color:#FFFFFF',
          'border-radius:0.14rem',
          'box-shadow:0 2px 12px rgba(13,66,49,0.05)',
          'border:1px solid rgba(13,66,49,0.05)',
          'box-sizing:border-box',
          'padding:0.24rem',
          'z-index:8'
        ].join(' !important;') + ' !important;';
        c.innerHTML = \`
          <div style="position:absolute;left:0.24rem;top:0.22rem;font-size:0.2rem;font-weight:700;color:#1A2B44;">\${def[3]}</div>
          <div style="position:absolute;left:0.24rem;top:0.56rem;font-size:0.15rem;color:#7A8BA4;">\${def[4]}</div>
          <div style="position:absolute;left:0.24rem;bottom:0.18rem;font-size:0.15rem;color:#2DAE85;font-weight:600;
                      padding:0.04rem 0.18rem;background-color:rgba(45,174,133,0.08);border-radius:0.2rem;">查看</div>
          <img src="../images/\${def[5]}"
               style="position:absolute;right:0.22rem;bottom:0.18rem;width:0.6rem;height:0.6rem;object-fit:contain;display:block;" />
        \`;
        root.appendChild(c);
      });

      // ---------- J5) 补齐"重要"绿色标签+右箭头(健康建议头) / "重要"标签位置修正 ----------
      // 健康建议头右侧蓝色箭头
      // 指标提升方案 重要标签：找已有的 zhong_yao 类
      Array.from(document.querySelectorAll('.jian_kang_guan_li [class*="zhong_yao"]')).forEach(function(el, idx){
        if (idx === 0) {
          // 第一个"重要"属于 指标提升方案
          el.style.position = 'absolute';
          el.style.left = '1.36rem';
          el.style.top = '4.60rem';
          el.style.display = 'inline-block';
          el.style.padding = '0.03rem 0.1rem';
          el.style.backgroundColor = '#2DAE85';
          el.style.color = '#fff';
          el.style.fontSize = '0.13rem';
          el.style.borderRadius = '0.04rem';
          el.style.fontWeight = '600';
          el.style.zIndex = 12;
        } else if (idx === 1) {
          // 第二个属于 透析评估 (右边卡片)
          el.style.position = 'absolute';
          el.style.left = '4.26rem';
          el.style.top = '4.60rem';
          el.style.display = 'inline-block';
          el.style.padding = '0.03rem 0.1rem';
          el.style.backgroundColor = '#2DAE85';
          el.style.color = '#fff';
          el.style.fontSize = '0.13rem';
          el.style.borderRadius = '0.04rem';
          el.style.fontWeight = '600';
          el.style.zIndex = 12;
        }
      });

      // ---------- 健康建议右上角右箭头 (用文字模拟绿色">") ----------
      if (!document.querySelector('.jian_kang_guan_li .V11_arrow_right')) {
        var arr = document.createElement('div');
        arr.setAttribute('class', 'V11_arrow_right');
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
          'z-index:14'
        ].join(' !important;') + ' !important;';
        arr.innerHTML = '>';
        root.appendChild(arr);
      }

      // ---------- J2+ 注入 超优先级 样式(head style) ----------
      var headStyle = document.createElement('style');
      headStyle.textContent = \`
        /* 健康管理 标题：防止双logo重叠，如果检测到2个重叠就隐藏第一个 */
        .jian_kang_guan_li > div[class=""][style*="240px"][style*="48px"] { display:none !important; }
        /* 2x2 原有的 Vector_204/212/213/Frame_28 不在 (0,0) 显示 */
        .jian_kang_guan_li .Vector_204,
        .jian_kang_guan_li .Vector_212,
        .jian_kang_guan_li .Vector_213,
        .jian_kang_guan_li .Frame_28 {
          display: none !important;
        }
        /* 原有的 Rectangle_3465239_5~8 如果位置不对也隐藏（由 V11 注入新版） */
        .jian_kang_guan_li .Rectangle_3465239_5,
        .jian_kang_guan_li .Rectangle_3465239_6,
        .jian_kang_guan_li .Rectangle_3465239_7,
        .jian_kang_guan_li .Rectangle_3465239_8 {
          opacity: 0 !important;
          pointer-events: none !important;
        }
      \`;
      document.head.appendChild(headStyle);

      console.log('[V11] 健康管理修复脚本执行完成 ✓');
    });
  } catch(e) { console.error('[V11] HEALTH FIX ERROR:', e); }
})();
</script>
`;
  if (html.indexOf('</body>') >= 0) {
    html = html.replace('</body>', healthFixScript + '\n</body>');
  } else {
    html += '\n' + healthFixScript;
  }
  ok++;
  console.log('J-SCRIPT 健康管理修复脚本注入 ✓');

  fs.writeFileSync(file, html, 'utf-8');
  console.log(`健康管理V11补丁完成 成功${ok}项 ✓`);
}

try {
  console.log('=== V11 终极脚本补丁开始 ===');
  patchHome();
  patchHealth();
  console.log('=== V11 全部完成 ===\n');
} catch (e) {
  console.error('V11 失败:', e.message);
  console.error(e.stack);
  process.exit(1);
}
