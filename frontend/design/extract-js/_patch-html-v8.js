/**
 * Patch V8 - 终极细节补齐补丁
 * 
 * 1) 首页: 用切片补Logo图片+品牌文字
 * 2) 首页: "第X天"改为绿色 + 文字字号对齐
 * 3) 首页: 补"待提升指标"4个文字标签 + "查看详情"
 * 4) 首页: 补"快捷管理健康状态"右上角文字
 * 5) 首页: 透析排班查询(水滴图标) / 最新透析状态(蓝图表图标)
 * 6) 首页: 通知消息 → 日期左侧小日历图标 + 左侧铃铛图标
 * 7) 首页+健康管理: 底部5个Tab图标用 images/*.svg 替换灰色方块
 * 8) 健康管理: Logo图片 + 编辑图标(铅笔)
 * 9) 清除所有linear-gradient替换为纯色
 */
const fs = require('fs');
const path = require('path');

const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');
const IMG_DIR = path.resolve(__dirname, 'output', 'html', 'images');

// 确保design目录下的切片已经复制到images
function copyIfMissing(srcName) {
    const homeSrc = path.join(__dirname, '首页', srcName);
    const healthSrc = path.join(__dirname, '健康管理', srcName);
    const dst = path.join(IMG_DIR, srcName);
    let src = null;
    if (fs.existsSync(homeSrc)) src = homeSrc;
    else if (fs.existsSync(healthSrc)) src = healthSrc;
    if (src && !fs.existsSync(dst)) {
        try { fs.copyFileSync(src, dst); console.log('复制资源: ' + srcName); } catch (e) {}
    }
}
[
  '图层 0 4.png', 'Group 1000007250@1x.png',
  '联集 1.svg', '路径.svg', '路径 1.svg',
  '我的.svg', '我的-2.svg',
  'Status Bar.svg', 'Frame 164073.svg',
  'Vector.svg', 'Vector-2.svg', 'Vector-3.svg', 'Vector 441.svg',
  'Right Side.svg',
  'Rectangle 3463952.svg', 'Rectangle 3463952-2.svg',
  'Ellipse 6178.svg', 'Ellipse 6179.svg', 'Ellipse 6180.svg', 'Ellipse 6181.svg', 'Ellipse 6182.svg',
  'Frame.svg', 'Frame-2.svg', 'Frame-3.svg', 'Frame-4.svg', 'Frame-5.svg', 'Frame-6.svg', 'Frame-7.svg', 'Frame-8.svg',
  'Polygon 2.svg',
  '矩形 2431.svg', '矩形 2431-2.svg',
  '矩形 2432.svg', '矩形 2432-2.svg', '矩形 2432-3.svg', '矩形 2432-4.svg',
  'Group 1000007254.svg', 'Group 1000007257.svg', 'Group 1000007258.svg',
  'image 2875.png'
].forEach(copyIfMissing);

/**
 * 在HTML中找整块div（含任意嵌套），正则匹配其内部从开始标签到匹配结束</div>的全部内容
 * 并将内部内容替换为newInnerHtml（保留外层div的id/class/style和定位）
 */
function replaceInnerContent(html, marker, newInnerHtml) {
    const attrMatch = /^(\w+)="([^"]+)"$/.exec(marker);
    if (!attrMatch) return html;
    const attrName = attrMatch[1];
    const attrValue = attrMatch[2];
    const openRegex = new RegExp(`<div\\s+([^>]*?${attrName}="${attrValue}"[^>]*)>`, 'g');
    let m, lastIdx = -1, attrs = '';
    while ((m = openRegex.exec(html)) !== null) { lastIdx = m.index; attrs = m[1]; }
    if (lastIdx < 0) return html;
    const firstClose = html.indexOf('>', lastIdx);
    if (firstClose < 0) return html;
    let depth = 1, i = firstClose + 1;
    const tagRe = /<\/?div[^>]*>/gi; tagRe.lastIndex = i;
    let tm, startInner = firstClose + 1, endInner = -1;
    while ((tm = tagRe.exec(html)) !== null) {
        const isClose = tm[0].startsWith('</');
        if (isClose) depth--; else depth++;
        if (depth === 0) { endInner = tm.index; break; }
    }
    if (endInner < 0) return html;
    const openTag = `<div ${attrs}>`;
    const newBlock = openTag + newInnerHtml + '</div>';
    return html.substring(0, lastIdx) + newBlock + html.substring(tm.index + tm[0].length);
}

/**
 * 在HTML字符串中插入内容（在某个marker的关闭div之后）
 */
function insertAfter(html, marker, newHtml) {
    const attrMatch = /^(\w+)="([^"]+)"$/.exec(marker);
    if (!attrMatch) return html;
    const attrName = attrMatch[1];
    const attrValue = attrMatch[2];
    const openRegex = new RegExp(`<div\\s+[^>]*?${attrName}="${attrValue}"[^>]*>`, 'g');
    let m, lastIdx = -1;
    while ((m = openRegex.exec(html)) !== null) { lastIdx = m.index; }
    if (lastIdx < 0) return html;
    // find matching close
    const firstClose = html.indexOf('>', lastIdx);
    if (firstClose < 0) return html;
    let depth = 1, i = firstClose + 1;
    const tagRe = /<\/?div[^>]*>/gi; tagRe.lastIndex = i;
    let tm, endIdx = -1;
    while ((tm = tagRe.exec(html)) !== null) {
        const isClose = tm[0].startsWith('</');
        if (isClose) depth--; else depth++;
        if (depth === 0) { endIdx = tm.index + tm[0].length; break; }
    }
    if (endIdx < 0) return html;
    return html.substring(0, endIdx) + newHtml + html.substring(endIdx);
}

/* ============ 首页补丁 ============ */
function patchHome() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-shou_ye.html');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let extraCss = '';

    /* 1) 顶部Logo - 替换占位的 _121_1 (它有图片但只是叶子logo) */
    // 现在的占位: class="_121_1" 内有 img f8c697b73e59b4a2b3da77427a2e0f82.png(只是叶子)
    // 改成: 叶子 + 品牌文字 用 Group 1000007250@1x.png 或 图层 0 4.png
    const logoImg = `<img src="../images/%E5%9B%BE%E5%B1%82%200%204.png" style="position:absolute;left:0;top:0;width:3.2rem;height:0.6rem;object-fit:contain;display:block;" />`;
    const new1 = replaceInnerContent(html, `class="_121_1"`, logoImg);
    if (new1 !== html) { html = new1; console.log('1. 首页Logo 已替换 ✓'); } else { console.log('1. WARNING: 首页Logo未匹配'); }

    /* 2) "为您健康护航第1天" - 替换 Placeholder 内容 + 颜色样式 */
    // 里面两个span，改成两行 + 第X天绿色
    const titleNewInner = `
<span style="color:#1f2937;font-size:0.426667rem;font-weight:800;line-height:1.2;display:block;">为您健康护航</span>
<span style="color:#209D87;font-size:0.48rem;font-weight:800;line-height:1.2;display:block;margin-top:0.106667rem;">第1天</span>
`;
    const new2 = replaceInnerContent(html, `class="____Placeholder"`, titleNewInner);
    if (new2 !== html) { html = new2; console.log('2. 首页护航文字样式已调整 ✓'); } else { console.log('2. WARNING: Placeholder未匹配'); }

    /* 3) "快捷管理健康状态" - 在 "健康管理提示" 旁边添加 */
    // "健康管理提示" = class="shang_chuan_wen_jian_da_yin"，在其所在层级插入右边文字
    // 简便方法: 直接添加 inline CSS 修正
    extraCss += `
.shou_ye .shang_chuan_wen_jian_da_yin {
  color: #FFFFFF !important;
  font-weight: 700 !important;
  font-size: 0.24rem !important;
  letter-spacing: 0.01em;
}
.shou_ye .shang_chuan_wen_jian_da_yin::after {
  content: "快捷管理健康状态";
  position: absolute;
  right: 0.48rem;
  top: 50%;
  transform: translateY(-50%);
  color: #0B4A3B;
  font-size: 0.186667rem;
  font-weight: 400;
  opacity: 0.75;
}
`;

    /* 4) 待提升指标: 外围 Frame_1739330128 容器内，追加 4 个文字标签 + "查看详情" */
    // 4 个指标标签: 血红蛋白(右上) / 钾(右下) / 钠(左下) / 尿酸(左上)
    const labelsSvg = `
<div style="position:absolute;inset:0;pointer-events:none;">
  <!-- 4个指标标签 -->
  <div style="position:absolute;left:58%;top:22%;font-size:0.16rem;color:#6b7280;font-weight:500;">血红蛋白</div>
  <div style="position:absolute;left:68%;top:44%;font-size:0.16rem;color:#6b7280;font-weight:500;">钾</div>
  <div style="position:absolute;left:58%;top:66%;font-size:0.16rem;color:#6b7280;font-weight:500;">尿酸</div>
  <div style="position:absolute;left:22%;top:44%;font-size:0.16rem;color:#6b7280;font-weight:500;">钠</div>
  <!-- 中心待提升指标 + 查看详情 -->
  <div style="position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);text-align:center;white-space:nowrap;">
    <div style="font-size:0.213333rem;color:#1f2937;font-weight:700;line-height:1.3;">待提升指标</div>
    <div style="font-size:0.186667rem;color:#209D87;font-weight:500;line-height:1.3;margin-top:0.053333rem;">查看详情</div>
  </div>
</div>
`;
    // 在 Frame_1739330128 内部结尾追加
    const oldFrameEnd = `<div id="2abd963f-3bb9-42c6-89b1-48e745bd5499" class="Frame_1739330128_1" style="" ></div>`;
    if (html.includes(oldFrameEnd)) {
        html = html.replace(oldFrameEnd, oldFrameEnd + labelsSvg);
        console.log('4. 待提升指标4个标签+查看详情 已补 ✓');
    } else {
        console.log('4. WARNING: Frame_1739330128结构未匹配, 尝试class方式');
        const new4b = replaceInnerContent(html, `class="Frame_1739330128"`, labelsSvg);
        if (new4b !== html) { html = new4b; console.log('4. 待提升指标4个标签+查看详情 已补(class方式) ✓'); }
    }

    /* 5) 透析排班卡片 / 最新透析状态卡片 → 补图标 */
    // 排班: 用 Right Side.svg 或 Rectangle 3463952-2.svg (水滴绿)
    // 最新透析: Rectangle 3463952.svg (蓝色图表)
    // 在 透析排班查询 文字后面找容器位置: 
    //   "透析排班查询"=文字所在span 用 CSS ::after 太麻烦, 改为在两个卡片上追加icon
    extraCss += `
/* 排班查询图标 - Rectangle_3463952-2 (水滴绿色) */
.shou_ye .Rectangle_3465239::after {
  content: "";
  position: absolute;
  right: 0.32rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.906667rem;
  height: 0.906667rem;
  background-image: url("../images/Rectangle%203463952-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
}
.shou_ye .Rectangle_3465239 { position: relative !important; overflow: visible !important; }

/* 最新透析状态 - 蓝色图表 */
.shou_ye .Rectangle_3465231::after {
  content: "";
  position: absolute;
  right: 0.32rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.906667rem;
  height: 0.906667rem;
  background-image: url("../images/Rectangle%203463952.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
}
.shou_ye .Rectangle_3465231 { position: relative !important; overflow: visible !important; }
`;

    /* 6) 通知消息: 
        a. 左侧铃铛图标 (通过 ::before)
        b. 日期左侧的灰色方块(日历)替换成时钟图标 
        c. "查看更多"右侧加 > 箭头
    */
    // 找通知区域的第一个小方块 = Ellipse_6180 之类 (两个日期左侧), 替换为时钟图标
    // 日期左侧容器: 两个小灰色方形，应该是 class="Ellipse_6180" "Ellipse_6181" 之类
    // 或者直接 CSS ::before
    extraCss += `
/* "通知消息" 文字左侧小铃铛(用 联集 1.svg) */
.shou_ye .tong_zhi_xiao_xi::before,
.shou_ye [class*="tong_zhi"]::before { display:none !important; }
/* 简单: 通过页面上的通知模块找class，实际HTML里通知区域文字有 span */
/* 日期左侧灰色方块 → 时钟 */
.shou_ye .__15, .shou_ye .__16 { /* 日期左侧占位方块 */
  background: none !important;
  border: none !important;
}
.shou_ye .__15::before, .shou_ye .__16::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background-image: url("../images/%E8%B7%AF%E5%BE%84.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
`;

    // 找到两个日期左侧div (类名在HTML里是 __15 / __16 之类，实际上它们是空div)
    // 通过观察: 页面上有两个灰色方块，分别是 class="Ellipse_6180" / "Ellipse_6181" / "Ellipse_6182" 等
    // V7补丁已使用 Ellipse_6178=黑 Ellipse_6179=灰 (分页点)，其余 Ellipse_6180~6182 可能是日期图标
    extraCss += `
.shou_ye .Ellipse_6180, .shou_ye .Ellipse_6181, .shou_ye .Ellipse_6182 {
  background-image: url("../images/%E8%B7%AF%E5%BE%84.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-color: transparent !important;
  border-radius: 0 !important;
}
`;

    // 通知消息标题左侧蓝色铃铛
    extraCss += `
/* 通知消息左侧小铃铛图标 - Frame 164073.svg 或者 路径 1.svg */
.shou_ye .__14, /* 通知标题前面的方块 */
.shou_ye .tong_zhi_xiao_xi_tong_zhi_zuo_ce {
  background-image: url("../images/Frame%20164073.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-color: transparent !important;
}
/* 通过 ::before 挂到通知标题 */
.shou_ye [class*="tong_zhi_xiao_xi"] > :first-child { position: relative; padding-left: 0.426667rem; }
.shou_ye [class*="tong_zhi_xiao_xi"]::before { display:none; }
`;

    /* 7) 底部Tab图标 → 把 5 个 Tab Bar 的 Frame 内部内容换成切片 */
    // 首页 Tab (Tab_Bar Frame) -> 首页 Vector.svg
    // 健康管理 -> 矩形 2431.svg (或 Frame-3 类)
    // 服务中心 -> 我的.svg (人形)
    // 互动中心 -> 旗帜 Vector-2.svg
    // 我的 -> 我的-2.svg
    // 这里直接用 CSS 替换，因为层级太深不方便 DOM 替换
    extraCss += `
/* 底部Tab图标统一处理 - 用 images/*.svg 作为背景图 */
/* Tab1 首页 - 绿房子 选中 / 灰房子 未选中*/
.shou_ye .Tab_Bar .Frame_20,
.shou_ye .Tab_Bar .Frame_1000006734 {
  background-color: transparent !important;
}
.shou_ye .Tab_Bar .Frame_20 > * { display: none !important; }
.shou_ye .Tab_Bar .Frame_20::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/Vector.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
}
/* Tab2 健康管理 */
.shou_ye .Tab_Bar_2 .Frame_24,
.shou_ye .Tab_Bar_2 .Frame_1000006736 {
  background-color: transparent !important;
}
.shou_ye .Tab_Bar_2 .Frame_24 > * { display: none !important; }
.shou_ye .Tab_Bar_2 .Frame_24::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202431.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
/* Tab3 服务中心 */
.shou_ye .Tab_Bar_4 .Frame_1000006738_8 > :first-child {
  background-color: transparent !important;
}
.shou_ye .Tab_Bar_4 .Frame_28 > *,
.shou_ye .Tab_Bar_4 [class*="Frame_2"] > * { display: none !important; }
.shou_ye .Tab_Bar_4 .Frame_28::before,
.shou_ye .Tab_Bar_4 [class*="Frame_2"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E6%88%91%E7%9A%84.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
/* Tab4 互动中心 - 用 Vector-2.svg (旗帜) */
.shou_ye .Tab_Bar_6 [class*="Frame_"] > * { display: none !important; }
.shou_ye .Tab_Bar_6 [class*="Frame_"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/Vector-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
/* Tab5 我的 - 用 我的-2.svg */
.shou_ye .Tab_Bar_8 [class*="Frame_"] > * { display: none !important; }
.shou_ye .Tab_Bar_8 [class*="Frame_"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E6%88%91%E7%9A%84-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
/* Tab背景透明 */
.shou_ye .Tab_Bar, .shou_ye .Tab_Bar_2, .shou_ye .Tab_Bar_4,
.shou_ye .Tab_Bar_6, .shou_ye .Tab_Bar_8 {
  background-color: #FFFFFF !important;
  overflow: visible !important;
}
.shou_ye .Tab_Bar [class*="Frame_100000673"] { background-color: transparent !important; }
`;

    /* 8) 去掉linear-gradient 统一替换为纯色 (在容器和Vector组件里) */
    // 去掉Vector_31 / Vector_37 等容器上的 linear-gradient
    extraCss += `
/* 兜底: 所有带 linear-gradient 的 CSS 替换为纯色近似值 */
.shou_ye [style*="linear-gradient"] { background-image: none !important; }
/* 绿色文档图标容器 → 淡绿底 */
.shou_ye .Vector_31 { background-color: rgba(229,248,239,1) !important; }
/* 蓝色闹钟图标容器 → 淡蓝底 */
.shou_ye .Frame_4 { background-color: rgba(229,243,255,1) !important; }
.shou_ye .Frame_2 { background-color: rgba(229,243,255,1) !important; }
/* 首页待提升指标圆形容器 */
.shou_ye .Vector_42 { background-color: transparent !important; border: none !important; }
/* 健康管理提示绿色异形头部 Rectangle_3465227 → 深绿色 */
.shou_ye svg.Rectangle_3465227 path { fill: rgba(45,174,133,1) !important; }
/* "健康管理提示"白色文字 */
.shou_ye .shang_chuan_wen_jian_da_yin {
  color: #FFFFFF !important;
  font-weight: 700 !important;
  font-size: 0.24rem !important;
  position: relative;
}
/* 两个提示卡片 Rectangle_3465239 / Rectangle_3465239_1 白背景圆角 */
.shou_ye .Rectangle_3465239,
.shou_ye .Rectangle_3465239_1 {
  background-color: #FFFFFF !important;
  border-radius: 0.133333rem !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.shou_ye .Rectangle_3465239 > * { z-index: 3; position: relative; }
`;

    // 注入额外CSS (在 V7-PATCH style 标签末尾)
    html = html.replace('/* 兜底空fill */\n.shou_ye svg path[fill=""],', extraCss + '\n/* 兜底空fill */\n.shou_ye svg path[fill=""],');

    fs.writeFileSync(htmlFile, html, 'utf-8');
    console.log('首页V8补丁完成 ✓');
}

/* ============ 健康管理页面补丁 ============ */
function patchHealth() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let extraCss = '';

    /* 1) 顶部Logo - 在 ju_xing_933_1 后面/前面插入 */
    // 在 Rectangle_3465233_1 结束后插入 logo div
    const logoDiv = `
<div id="v8-health-logo" style="position:absolute;left:0.32rem;top:0.213333rem;width:3.2rem;height:0.64rem;z-index:5;">
  <img src="../images/%E5%9B%BE%E5%B1%82%200%204.png" style="width:100%;height:100%;object-fit:contain;display:block;" />
</div>
`;
    if (!html.includes('v8-health-logo')) {
        // 在开头 Rectangle_3465233_1 之后插入
        const m = /(<div[^>]*class="Rectangle_3465233_1"[^>]*><\/div>)/.exec(html);
        if (m) {
            html = html.substring(0, m.index + m[0].length) + logoDiv + html.substring(m.index + m[0].length);
            console.log('H1. 健康管理Logo 已插入 ✓');
        } else {
            console.log('H1. WARNING: 健康管理 Logo 锚点未找到');
        }
    }

    /* 2) 编辑图标(铅笔) - 在 Vector_170 旁边 (铅笔图标：Vector_170 容器已经有一支铅笔了，但它渐变，补纯色) */
    extraCss += `
/* 编辑图标(铅笔) 去渐变, 使用 路径 1.svg 或者直接用路径 */
.jian_kang_guan_li .Vector_170 {
  background: none !important;
  background-image: none !important;
}
.jian_kang_guan_li .Vector_170::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E8%B7%AF%E5%BE%84%201.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
}
`;

    /* 3) "重要" 绿色标签 - V7 已经有 */
    /* 4) 头像 V7.5 已替换，这里优化问候语 */
    extraCss += `
/* 问候语 位置 & 样式 */
.jian_kang_guan_li .____1 {
  color: #1f2937 !important;
  font-weight: 600 !important;
  font-size: 0.266667rem !important;
  left: 1.066667rem !important;
  top: 1.613333rem !important;
}
`;

    /* 5) 底部Tab图标 - 和首页类似 */
    extraCss += `
/* ===== 健康管理 底部5个Tab图标 ===== */
/* Tab1 首页 灰色 (当前是 Frame_20) */
.jian_kang_guan_li .Tab_Bar_10 .Frame_20 {
  background-color: transparent !important;
}
.jian_kang_guan_li .Tab_Bar_10 .Frame_20 > * { display: none !important; }
.jian_kang_guan_li .Tab_Bar_10 .Frame_20::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/Vector.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
/* Tab2 健康管理 - 选中绿色 */
.jian_kang_guan_li .Tab_Bar_12 .Frame_24 > * { display: none !important; }
.jian_kang_guan_li .Tab_Bar_12 .Frame_24::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202431.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
/* Tab3 服务中心 - 灰色人形 */
.jian_kang_guan_li .Tab_Bar_14 [class*="Frame_2"] > *,
.jian_kang_guan_li .Tab_Bar_14 .Frame_28 > * { display: none !important; }
.jian_kang_guan_li .Tab_Bar_14 [class*="Frame_2"]::before,
.jian_kang_guan_li .Tab_Bar_14 .Frame_28::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E6%88%91%E7%9A%84.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
/* Tab4 互动中心 - 旗帜 */
.jian_kang_guan_li .Tab_Bar_16 [class*="Frame_"] > * { display: none !important; }
.jian_kang_guan_li .Tab_Bar_16 [class*="Frame_"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/Vector-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
/* Tab5 我的 */
.jian_kang_guan_li .Tab_Bar_18 [class*="Frame_"] > * { display: none !important; }
.jian_kang_guan_li .Tab_Bar_18 [class*="Frame_"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E6%88%91%E7%9A%84-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
/* Tab背景透明 */
.jian_kang_guan_li .Tab_Bar_10, .jian_kang_guan_li .Tab_Bar_12,
.jian_kang_guan_li .Tab_Bar_14, .jian_kang_guan_li .Tab_Bar_16,
.jian_kang_guan_li .Tab_Bar_18 {
  background-color: #FFFFFF !important;
}
.jian_kang_guan_li [class*="Frame_100000673"] { background-color: transparent !important; }
`;

    /* 6) 两个重要卡片上的 linear-gradient 替换纯色 */
    extraCss += `
.jian_kang_guan_li [style*="linear-gradient"] { background-image: none !important; }
/* 蓝色提升方案图标底色 淡蓝 */
.jian_kang_guan_li .Vector_175 { background-color: rgba(229,243,255,1) !important; }
/* 绿色透析评估底色 淡绿 */
.jian_kang_guan_li .Vector_181 { background-color: rgba(229,248,239,1) !important; }
/* 4个2x2网格里的图标容器 */
.jian_kang_guan_li .Vector_204 { background-color: rgba(229,243,255,1) !important; }
.jian_kang_guan_li .Vector_212 > svg { fill: #FF373A !important; }
.jian_kang_guan_li .Vector_213 { background-color: rgba(252,234,251,1) !important; }
.jian_kang_guan_li .Frame_28 { background-color: rgba(229,248,239,1) !important; }
`;

    // 注入额外CSS
    html = html.replace('/* 兜底空fill */\n.jian_kang_guan_li svg path[fill=""],', extraCss + '\n/* 兜底空fill */\n.jian_kang_guan_li svg path[fill=""],');

    fs.writeFileSync(htmlFile, html, 'utf-8');
    console.log('健康管理V8补丁完成 ✓');
}

try {
    console.log('=== Patch V8 (终极细节补齐) 开始 ===');
    patchHome();
    patchHealth();
    console.log('=== Patch V8 全部完成 ===');
} catch (e) {
    console.error('V8 失败:', e.message, e.stack);
    process.exit(1);
}
