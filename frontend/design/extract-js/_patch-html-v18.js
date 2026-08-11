/**
 * Patch V18 - 修复 body 高度 + 清理残留 V13 孤儿元素
 */
const fs = require('fs');
const path = require('path');
const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

function patchHome() {
  console.log('===== 首页 V18 =====');
  const file = path.join(PAGE_DIR, 'artboard-shou_ye.html');
  let html = fs.readFileSync(file, 'utf-8');

  // 1) 在 V17 CSS 块中，给 body 加 height: 10.826667rem !important
  if (!html.includes('V18-HOME-FIX')) {
    html = html.replace(
      'min-height: 10.826667rem !important;\n  margin: 30px auto !important;',
      'min-height: 10.826667rem !important;\n  height: 10.826667rem !important;\n  margin: 30px auto !important;\n/* V18-HOME-FIX */'
    );
    console.log('1) body height 固定 ✓');
  }

  // 2) 清理 body 中的孤儿 V13 元素（不在 V13_sched_card/V13_status_card 内的）
  //    这些是之前 V14/V17 清理不完整留下的碎片
  //    模式：<img class="V13_card_icon" ...> 或 <div class="V13_card_desc">...</div> 出现在 body 直接子级
  //    简单做法：删除所有不在 .V13_sched_card 或 .V13_status_card 内的 V13_card_desc 和 V13_card_icon
  //    但正则很难做"不在某容器内"的判断...
  //    替代方案：删除 .shou_ye 后面到第一个 <div class="Group_1000007255" 之间的所有孤儿 V13 元素
  const orphanZone = html.match(/(<\/div><\/div>)([\s\S]*?)(<div[^>]*class="Group_1000007255")/);
  if (orphanZone) {
    const cleaned = orphanZone[2]
      .replace(/<div class="V13_card_desc">[^<]*<\/div>\s*/g, '')
      .replace(/<img class="V13_card_icon"[^>]*>\s*/g, '')
      .replace(/<div class="V13_card_title">[^<]*<\/div>\s*/g, '')
      .replace(/<div class="V13_sched_card">[\s\S]*?<\/div>\s*/g, '')
      .replace(/<div class="V13_status_card">[\s\S]*?<\/div>\s*/g, '')
      .replace(/\s*<\/div>\s*/g, '\n');
    html = html.substring(0, orphanZone.index) + orphanZone[1] + cleaned + orphanZone[3] + html.substring(orphanZone.index + orphanZone[0].length);
    console.log('2) 孤儿V13元素清理 ✓');
  }

  fs.writeFileSync(file, html, 'utf-8');
  console.log('首页 V18 完成 ✓');
}

function patchHealth() {
  console.log('===== 健康管理 V18 =====');
  const file = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
  let html = fs.readFileSync(file, 'utf-8');

  // 同样给 body 加固定高度
  if (!html.includes('V18-HEALTH-FIX')) {
    html = html.replace(
      'min-height: 10.826667rem !important;\n  margin: 30px auto !important;',
      'min-height: 10.826667rem !important;\n  height: 10.826667rem !important;\n  margin: 30px auto !important;\n/* V18-HEALTH-FIX */'
    );
    console.log('1) body height 固定 ✓');
  }

  fs.writeFileSync(file, html, 'utf-8');
  console.log('健康管理 V18 完成 ✓');
}

console.log('=== V18 ===');
patchHome();
patchHealth();
console.log('=== 完成 ===');
