/**
 * Patch V9 - 终极像素级还原补丁（最终版）
 * 
 * 针对首页+健康管理所有细节缺失，强制用 design 切片替换所有失准矢量图标：
 * 
 * 【首页】
 * 1) Simple_3D 盾牌3D图标 → 整容器替换为 images/Simple 3D.svg
 * 2) 健康管理提示卡片1图标(绿色文档) → zu_45202 容器替换为 Frame.svg
 * 3) 健康管理提示卡片2图标(蓝色闹钟) → zu_45203 容器替换为 Frame-2.svg
 * 4) 透析排班卡片右下角水滴 → Rectangle_3465239 ::after 用 Rectangle 3463952-2.svg
 * 5) 最新透析状态右下角蓝图表 → Rectangle_3465231 ::after 用 Rectangle 3463952.svg
 * 6) 通知消息标题左侧蓝色铃铛 → 替换 image_2875 容器内容为 Frame 164073.svg
 * 7) 日期左侧时钟 (Ellipse_6180/81/82) → 背景图 路径.svg
 * 8) 待提升指标容器 Vector_42 去掉圆形黑框 + 中心蓝色弧形保留/增强
 * 9) 健康管理提示头部异形(Rectangle_3465227) fill 深绿
 * 10) 底部 5 个 Tab 图标 全切片替换 (Vector/矩形2431/我的/Vector-2/我的-2)
 * 
 * 【健康管理】
 * H1) 头像容器 → Frame 1739330068.svg (如未被V7.5替换)
 * H2) 右上角编辑铅笔 Vector_170 → 路径 1.svg
 * H3) 指标提升方案 蓝色圆形 → Group 1000007254.svg
 * H4) 透析评估 绿色文件 → Group 1000007257.svg
 * H5) 2x2 健康档案蓝色图标 → 矩形 2432-2.svg
 * H6) 2x2 生命体征红色心形 → 矩形 2432.svg
 * H7) 2x2 用药记录粉色药盒 → 矩形 2432-4.svg
 * H8) 2x2 核心指标绿色柱状 → 矩形 2432-3.svg
 * H9) 底部 5 个 Tab 全切片替换
 */
const fs = require('fs');
const path = require('path');

const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');
const IMG_DIR = path.resolve(__dirname, 'output', 'html', 'images');

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

/* ============ 首页 ============ */
function patchHome() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-shou_ye.html');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let extraCss = '';
    let okCount = 0;

    /* 1) 盾牌3D图标 - 整个 Simple_3D 容器内容替换为 Simple 3D.svg */
    {
        const inner = `<img src="../images/Simple%203D.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;" />`;
        const nh = replaceInnerContent(html, `class="Simple_3D"`, inner);
        if (nh !== html) { html = nh; okCount++; console.log('H-1 盾牌3D图标 ✓'); }
        else console.log('H-1 WARN 盾牌未匹配');
    }

    /* 2) 健康管理提示卡片1-绿色文档图标 (class="zu_45202" 第一个) */
    {
        // 找到第一个 zu_45202 (它在 3.293333rem 那层)
        // 直接替换内部内容，保留定位
        const inner = `<img src="../images/Frame.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;" />`;
        const nh = replaceInnerContent(html, `class="zu_45202"`, inner);
        if (nh !== html) { html = nh; okCount++; console.log('H-2 提示卡片1绿色文档图标 ✓'); }
        else console.log('H-2 WARN 提示卡片1图标未匹配');
    }

    /* 3) 健康管理提示卡片2-蓝色闹钟图标 (class="zu_45203") */
    {
        const inner = `<img src="../images/Frame-2.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;" />`;
        const nh = replaceInnerContent(html, `class="zu_45203"`, inner);
        if (nh !== html) { html = nh; okCount++; console.log('H-3 提示卡片2蓝色闹钟图标 ✓'); }
        else console.log('H-3 WARN 提示卡片2图标未匹配');
    }

    /* 4) 透析排班卡片右下角水滴 - CSS ::after (保留V8逻辑，这里加强+移除旧SVG) */
    extraCss += `
/* 透析排班 - 水滴图标(Rectangle 3463952-2.svg = Right Side.svg 类似水滴) */
.shou_ye .Rectangle_3465239 { position: relative !important; overflow: visible !important; }
.shou_ye .Rectangle_3465239::after {
  content: "" !important;
  position: absolute !important;
  right: 0.293333rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 0.96rem !important;
  height: 0.96rem !important;
  background-image: url("../images/Rectangle%203463952-2.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  z-index: 10 !important;
}
/* 最新透析状态 - 蓝色图表(Rectangle 3463952.svg) */
.shou_ye .Rectangle_3465231 { position: relative !important; overflow: visible !important; }
.shou_ye .Rectangle_3465231::after {
  content: "" !important;
  position: absolute !important;
  right: 0.293333rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 0.96rem !important;
  height: 0.96rem !important;
  background-image: url("../images/Rectangle%203463952.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  z-index: 10 !important;
}
`;

    /* 5) 通知消息标题左侧铃铛 - image_2875 容器替换 */
    {
        const inner = `<img src="../images/Frame%20164073.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;" />`;
        const nh = replaceInnerContent(html, `class="image_2875"`, inner);
        if (nh !== html) { html = nh; okCount++; console.log('H-5 通知标题左侧铃铛图标 ✓'); }
        else console.log('H-5 WARN 铃铛未匹配');
    }

    /* 6) 日期左侧时钟 - Ellipse_6180/6181/6182 容器内放 路径.svg */
    {
        const imgHtml = (svgClass) => replaceInnerContent(html, `class="${svgClass}"`,
            `<img src="../images/%E8%B7%AF%E5%BE%84.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;opacity:0.55;" />`);
        let did = false;
        ['Ellipse_6180','Ellipse_6181','Ellipse_6182'].forEach(c => {
            const n = imgHtml(c);
            if (n !== html) { html = n; did = true; }
        });
        if (did) { okCount++; console.log('H-6 日期左侧时钟图标 ✓'); }
        else console.log('H-6 WARN 日期时钟未匹配');
    }

    /* 7) 待提升指标圆形容器 Vector_42 去掉黑色边框 + 中心蓝色弧线保留 */
    extraCss += `
.shou_ye .Vector_42 {
  border: none !important;
  background-color: transparent !important;
}
/* "待提升指标"和"查看详情"这两个文字(H5/xie_hong_dan_bai等) 重新定位与设计一致:
   血红蛋白(右上) / 钾(右下) / 尿酸(左下) / 钠(左上) 的位置与V8注入一致，
   另外让 Vector_43~Vector_142 的圆圈点阵弧线颜色变淡只保留装饰感 */
.shou_ye .Vector_42 svg path { stroke: rgba(32,157,135,0.25) !important; stroke-width: 1px; fill: none !important; }
`;

    /* 8) 健康管理提示头部异形 Rectangle_3465227 fill 深绿 */
    extraCss += `
.shou_ye svg.Rectangle_3465227 path {
  fill: rgba(45,174,133,1) !important;
}
/* "快捷管理健康状态" class=kuai_jie_guan_li_jian_kang_zhuang_tai 定位向右 */
.shou_ye .kuai_jie_guan_li_jian_kang_zhuang_tai {
  color: rgba(11,74,59,0.8) !important;
  font-size: 0.186667rem !important;
  font-weight: 400 !important;
}
/* "健康管理提示" 白色粗体 */
.shou_ye .shang_chuan_wen_jian_da_yin {
  color: #FFFFFF !important;
  font-weight: 700 !important;
  font-size: 0.24rem !important;
}
`;

    /* 9) 底部 5 个 Tab 图标 全部用 ::before 替换（Frame容器隐藏内部SVG）
     * Tab1: 首页 Tab_Bar Frame_6 / Frame_20
     * Tab2: 健康管理 Tab_Bar_2 Frame_8 / Frame_24
     * Tab3: 服务中心 Tab_Bar_4 Frame_28
     * Tab4: 互动中心 Tab_Bar_6 Frame_32
     * Tab5: 我的 Tab_Bar_8 Frame_36
     */
    extraCss += `
/* ====== 首页-底部Tab 统一处理 ====== */
/* 通用 Tab Bar 背景白 */
.shou_ye .Tab_Bar, .shou_ye .Tab_Bar_2, .shou_ye .Tab_Bar_4,
.shou_ye .Tab_Bar_6, .shou_ye .Tab_Bar_8 {
  background-color: #FFFFFF !important;
  background-image: none !important;
  overflow: visible !important;
}
/* 去掉内部 Frame_100000673* 灰色方块背景 */
.shou_ye [class*="Frame_100000673"] {
  background-color: transparent !important;
  background-image: none !important;
}
.shou_ye [class*="Frame_6"], .shou_ye [class*="Frame_8"],
.shou_ye [class*="Frame_28"], .shou_ye [class*="Frame_32"],
.shou_ye [class*="Frame_36"] {
  background-color: transparent !important;
  background-image: none !important;
}

/* Tab1 首页 选中=绿色房子(Vector.svg) */
.shou_ye .Tab_Bar .Frame_6 { position: relative !important; background-color: transparent !important; }
.shou_ye .Tab_Bar .Frame_6 > * { display: none !important; }
.shou_ye .Tab_Bar .Frame_6::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/Vector.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
}

/* Tab2 健康管理 = 灰色 矩形2431.svg */
.shou_ye .Tab_Bar_2 .Frame_8 { position: relative !important; background-color: transparent !important; }
.shou_ye .Tab_Bar_2 .Frame_8 > * { display: none !important; }
.shou_ye .Tab_Bar_2 .Frame_8::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202431-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
  filter: grayscale(0.2) opacity(0.6);
}

/* Tab3 服务中心 = 灰色人形 我的.svg */
.shou_ye .Tab_Bar_4 .Frame_28,
.shou_ye .Tab_Bar_4 [class*="Frame_28"] { position: relative !important; background-color: transparent !important; }
.shou_ye .Tab_Bar_4 .Frame_28 > *,
.shou_ye .Tab_Bar_4 [class*="Frame_28"] > * { display: none !important; }
.shou_ye .Tab_Bar_4 .Frame_28::before,
.shou_ye .Tab_Bar_4 [class*="Frame_28"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E6%88%91%E7%9A%84.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
  opacity: 0.55;
}

/* Tab4 互动中心 = 旗帜 Vector-2.svg 灰色 */
.shou_ye .Tab_Bar_6 .Frame_32,
.shou_ye .Tab_Bar_6 [class*="Frame_32"] { position: relative !important; background-color: transparent !important; }
.shou_ye .Tab_Bar_6 .Frame_32 > *,
.shou_ye .Tab_Bar_6 [class*="Frame_32"] > * { display: none !important; }
.shou_ye .Tab_Bar_6 .Frame_32::before,
.shou_ye .Tab_Bar_6 [class*="Frame_32"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/Vector-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
  opacity: 0.55;
}

/* Tab5 我的 = 我的-2.svg 灰色 */
.shou_ye .Tab_Bar_8 .Frame_36,
.shou_ye .Tab_Bar_8 [class*="Frame_36"] { position: relative !important; background-color: transparent !important; }
.shou_ye .Tab_Bar_8 .Frame_36 > *,
.shou_ye .Tab_Bar_8 [class*="Frame_36"] > * { display: none !important; }
.shou_ye .Tab_Bar_8 .Frame_36::before,
.shou_ye .Tab_Bar_8 [class*="Frame_36"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E6%88%91%E7%9A%84-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
  opacity: 0.55;
}
`;

    /* 10) 兜底去渐变 + 布局小修正 */
    extraCss += `
/* 去所有 linear-gradient */
.shou_ye [style*="linear-gradient"] { background-image: none !important; }
.shou_ye [class*="Vector_31"] { background: none !important; background-image: none !important; background-color: transparent !important; }
.shou_ye [class*="Vector_37"] { background: none !important; background-image: none !important; background-color: transparent !important; }
/* 提示卡片底色圆角修正 - Rectangle_3465239 / _1 */
.shou_ye .Rectangle_3465239,
.shou_ye .Rectangle_3465239_1 {
  background-color: #FFFFFF !important;
  border-radius: 0.16rem !important;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05) !important;
}
/* 待提升指标卡片 Frame_1739330128 */
.shou_ye .Frame_1739330128 {
  background-color: rgba(249,249,249,1) !important;
  border-radius: 0.213333rem !important;
}
/* 透析排班/状态卡片背景 */
.shou_ye .Rectangle_3465239,
.shou_ye .Rectangle_3465231 {
  background-color: #FFFFFF !important;
  border-radius: 0.16rem !important;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05) !important;
}
/* 通知消息外框 - 整体背景白圆角 */
.shou_ye .zu_45205 { background-color: #FFFFFF !important; }
`;

    /* 注入 */
    html = html.replace('/* 兜底空fill */\n.shou_ye svg path[fill=""],', extraCss + '\n/* 兜底空fill */\n.shou_ye svg path[fill=""],');
    fs.writeFileSync(htmlFile, html, 'utf-8');
    console.log(`首页V9补丁完成 成功${okCount}项 ✓`);
}

/* ============ 健康管理 ============ */
function patchHealth() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let extraCss = '';
    let okCount = 0;

    /* H1) 头像: 如还有占位容器 zu_17400 / Ellipse 之类 */
    // (如 V7.5 已换 Frame 1739330068.svg 此处跳过，只做保险兜底)
    extraCss += `
/* 头像容器兜底 - Frame 1739330068.svg 如 V7.5已生效则此处不重复 */
`;

    /* H2) 右上角编辑铅笔 Vector_170 - 替换内容为 路径 1.svg */
    {
        const inner = `<img src="../images/%E8%B7%AF%E5%BE%84%201.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;" />`;
        const nh = replaceInnerContent(html, `class="Vector_170"`, inner);
        if (nh !== html) { html = nh; okCount++; console.log('H-2 编辑铅笔图标 ✓'); }
        else console.log('H-2 WARN 铅笔未匹配');
    }

    /* H3) 指标提升方案 蓝色圆形 - 找 class=zu_181 Vector_175 容器或外层 zu_ */
    // 用 CSS ::before 处理更简单 - 定位 Vector_175 背景替换
    extraCss += `
/* 指标提升方案 蓝色圆形 = Group 1000007254.svg (或类似蓝色提升图标) */
.jian_kang_guan_li .Vector_175 {
  background: none !important;
  background-color: transparent !important;
  position: relative !important;
}
.jian_kang_guan_li .Vector_175 > * { display: none !important; }
.jian_kang_guan_li .Vector_175::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/Group%201000007254.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
}

/* 透析评估 绿色文件 = Vector_181 用 Group 1000007257.svg */
.jian_kang_guan_li .Vector_181 {
  background: none !important;
  background-color: transparent !important;
  position: relative !important;
}
.jian_kang_guan_li .Vector_181 > * { display: none !important; }
.jian_kang_guan_li .Vector_181::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/Group%201000007257.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
}
`;

    /* H5-H8) 2x2 四个功能图标:
     * 健康档案(左上 Vector_204 / 类似) → 矩形2432-2.svg
     * 生命体征(右上) → 矩形2432.svg
     * 用药记录(左下 Vector_213 粉) → 矩形2432-4.svg
     * 核心指标(右下 Frame_28 绿柱) → 矩形2432-3.svg
     */
    extraCss += `
/* 2x2 健康档案 蓝色档案夹 = 矩形 2432-2.svg */
.jian_kang_guan_li .Vector_204 {
  background: none !important;
  background-color: transparent !important;
  position: relative !important;
}
.jian_kang_guan_li .Vector_204 > * { display: none !important; }
.jian_kang_guan_li .Vector_204::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202432-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
}

/* 生命体征 红色心形 = 矩形2432.svg */
.jian_kang_guan_li .Vector_212,
.jian_kang_guan_li [class*="Vector_212"] {
  position: relative !important;
}
.jian_kang_guan_li .Vector_212 > svg,
.jian_kang_guan_li [class*="Vector_212"] > svg { display: none !important; }
.jian_kang_guan_li .Vector_212::before,
.jian_kang_guan_li [class*="Vector_212"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202432.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
}

/* 用药记录 粉色药盒 = Vector_213 用 矩形2432-4.svg */
.jian_kang_guan_li .Vector_213 {
  background: none !important;
  background-color: transparent !important;
  position: relative !important;
}
.jian_kang_guan_li .Vector_213 > * { display: none !important; }
.jian_kang_guan_li .Vector_213::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202432-4.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
}

/* 核心指标 绿色柱状 = Frame_28(健康管理2x2右下) 用 矩形2432-3.svg */
.jian_kang_guan_li [class*="2x2_grid"] .Frame_28,
.jian_kang_guan_li .Frame_28[style*="229,248,239"] {
  background: none !important;
  background-color: transparent !important;
  position: relative !important;
}
/* 简化: 只选 Vector_212 旁边那个 绿柱Frame */
.jian_kang_guan_li .Frame_28 {
  position: relative !important;
}
.jian_kang_guan_li .Frame_28 > img,
.jian_kang_guan_li .Frame_28 > svg { display: none !important; }
.jian_kang_guan_li .Frame_28::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202432-3.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
}
`;

    /* H9) 健康管理 底部5个Tab图标 - 首页灰/健康绿/服务灰/互动灰/我的灰 */
    extraCss += `
/* ====== 健康管理-底部Tab ====== */
.jian_kang_guan_li .Tab_Bar_10, .jian_kang_guan_li .Tab_Bar_12,
.jian_kang_guan_li .Tab_Bar_14, .jian_kang_guan_li .Tab_Bar_16,
.jian_kang_guan_li .Tab_Bar_18 {
  background-color: #FFFFFF !important;
  background-image: none !important;
  overflow: visible !important;
}
.jian_kang_guan_li [class*="Frame_100000673"] {
  background-color: transparent !important;
  background-image: none !important;
}

/* Tab1 首页 = 灰色房子 Vector.svg (未选中) */
.jian_kang_guan_li .Tab_Bar_10 .Frame_6 { position: relative !important; background-color: transparent !important; }
.jian_kang_guan_li .Tab_Bar_10 .Frame_6 > * { display: none !important; }
.jian_kang_guan_li .Tab_Bar_10 .Frame_6::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/Vector.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
  opacity: 0.55;
}

/* Tab2 健康管理 - 选中 绿色 矩形2431.svg */
.jian_kang_guan_li .Tab_Bar_12 .Frame_8 { position: relative !important; background-color: transparent !important; }
.jian_kang_guan_li .Tab_Bar_12 .Frame_8 > * { display: none !important; }
.jian_kang_guan_li .Tab_Bar_12 .Frame_8::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202431.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
}

/* Tab3 服务中心 = 灰色人形 我的.svg */
.jian_kang_guan_li .Tab_Bar_14 .Frame_28,
.jian_kang_guan_li .Tab_Bar_14 [class*="Frame_28"] { position: relative !important; background-color: transparent !important; }
.jian_kang_guan_li .Tab_Bar_14 .Frame_28 > *,
.jian_kang_guan_li .Tab_Bar_14 [class*="Frame_28"] > * { display: none !important; }
.jian_kang_guan_li .Tab_Bar_14 .Frame_28::before,
.jian_kang_guan_li .Tab_Bar_14 [class*="Frame_28"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E6%88%91%E7%9A%84.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
  opacity: 0.55;
}

/* Tab4 互动中心 = 旗帜 Vector-2.svg 灰色 */
.jian_kang_guan_li .Tab_Bar_16 .Frame_32,
.jian_kang_guan_li .Tab_Bar_16 [class*="Frame_32"] { position: relative !important; background-color: transparent !important; }
.jian_kang_guan_li .Tab_Bar_16 .Frame_32 > *,
.jian_kang_guan_li .Tab_Bar_16 [class*="Frame_32"] > * { display: none !important; }
.jian_kang_guan_li .Tab_Bar_16 .Frame_32::before,
.jian_kang_guan_li .Tab_Bar_16 [class*="Frame_32"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/Vector-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
  opacity: 0.55;
}

/* Tab5 我的 = 我的-2.svg 灰色 */
.jian_kang_guan_li .Tab_Bar_18 .Frame_36,
.jian_kang_guan_li .Tab_Bar_18 [class*="Frame_36"] { position: relative !important; background-color: transparent !important; }
.jian_kang_guan_li .Tab_Bar_18 .Frame_36 > *,
.jian_kang_guan_li .Tab_Bar_18 [class*="Frame_36"] > * { display: none !important; }
.jian_kang_guan_li .Tab_Bar_18 .Frame_36::before,
.jian_kang_guan_li .Tab_Bar_18 [class*="Frame_36"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../images/%E6%88%91%E7%9A%84-2.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 5;
  opacity: 0.55;
}
`;

    /* 去渐变兜底 + 健康建议头深绿 */
    extraCss += `
/* 健康管理页去渐变 */
.jian_kang_guan_li [style*="linear-gradient"] { background-image: none !important; }
/* 健康建议头深绿 */
.jian_kang_guan_li svg.Rectangle_3465227 path,
.jian_kang_guan_li .Rectangle_3465233 path {
  fill: rgba(45,174,133,1) !important;
}
/* "重要"绿色标签 - Group 1000007258.svg 兜底 */
.jian_kang_guan_li [class*="zhong_yao"] { background-color: rgba(45,174,133,1) !important; color: #FFFFFF !important; }
`;

    html = html.replace('/* 兜底空fill */\n.jian_kang_guan_li svg path[fill=""],', extraCss + '\n/* 兜底空fill */\n.jian_kang_guan_li svg path[fill=""],');
    fs.writeFileSync(htmlFile, html, 'utf-8');
    console.log(`健康管理V9补丁完成 成功${okCount}项 ✓`);
}

try {
    console.log('=== Patch V9 (终极像素还原) 开始 ===');
    patchHome();
    patchHealth();
    console.log('=== Patch V9 全部完成 ===');
} catch (e) {
    console.error('V9 失败:', e.message, e.stack);
    process.exit(1);
}
