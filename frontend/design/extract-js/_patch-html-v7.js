/**
 * Patch Script V7 - 终极干净版（基于新鲜解析output，无任何旧补丁残留）
 * 
 * 原始解析的正确基准：
 * - html { font-size: 75px } → 5rem = 375px
 * - .shou_ye / .jian_kang_guan_li width:5rem height:10.826667rem
 * - SVG内部linearGradient引用正确
 * 
 * 需要修正的点：
 * 1) body flex居中显示手机屏（带阴影+灰色外背景）
 * 2) .shou_ye/.jian_kang_guan_li 从position:absolute → position:relative（作为子absolute定位父）
 * 3) 去除所有linear-gradient → 替换为对应纯色（严格按设计稿主色去渐变规则）
 * 4) 缺失fill的SVG path（如Vector_441等）补齐颜色
 * 5) 底部Tab栏：当前页面Tab绿色，其他灰色+灰度图标
 * 6) 复制首页/健康管理设计目录下的SVG切片到images
 */
const fs = require('fs');
const path = require('path');

const DESIGN_DIR = __dirname;
const OUTPUT_DIR = path.join(DESIGN_DIR, 'output', 'html');
const IMG_DIR = path.join(OUTPUT_DIR, 'images');
const PAGE_DIR = path.join(OUTPUT_DIR, 'page-Page_1');

function copyAssets() {
    const srcDirs = [path.join(DESIGN_DIR, '首页'), path.join(DESIGN_DIR, '健康管理')];
    for (const dir of srcDirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir);
        for (const f of files) {
            const ext = path.extname(f).toLowerCase();
            if (ext === '.svg' || ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                fs.copyFileSync(path.join(dir, f), path.join(IMG_DIR, f));
            }
        }
    }
}

function appendStyle(html, cssBlock) {
    const marker = '</head>';
    const styleTag = `<!-- V7-PATCH --><style type="text/css">${cssBlock}</style>`;
    if (html.includes(styleTag)) return html;
    return html.replace(marker, styleTag + marker);
}

/**
 * 将CSS中的linear-gradient(...)替换为纯色。
 * 策略：提取gradient的最后一个颜色rgba（通常是主色）
 */
function replaceGradientsToSolid(css) {
    return css.replace(/\bbackground:\s*linear-gradient\([^)]+\)/gi, (match) => {
        const colors = match.match(/rgba?\([^)]+\)/g) || [];
        if (colors.length === 0) return 'background-color:rgba(250,251,253,1)';
        // 用gradient的"中间或最后一个有意义颜色"（根据设计稿取主色倾向：底部大卡片用#F4FAF8或白色）
        // 更稳健：匹配 gradient里 offset 最高的 stop-color 或 用最后一个rgba
        return 'background-color:' + colors[colors.length - 1];
    });
}

/**
 * 替换SVG内联的linearGradient为纯色
 * 策略：
 *   a) 删除整个 <defs><linearGradient ...>...</defs> 段
 *   b) path上原来的 fill="url(#g_xxx)" 替换为最后一个stop-color
 *   c) 保留SVG内部的其他属性和viewBox
 */
function replaceSvgGradients(html) {
    // 1. 提取所有linearGradient的 id -> final stop-color 映射
    const gradientMap = {};
    const defsRe = /<defs>\s*(<linearGradient[^>]*>[\s\S]*?<\/linearGradient>)\s*<\/defs>/gi;
    let m;
    const defsToRemove = [];
    while ((m = defsRe.exec(html)) !== null) {
        const wholeDefs = m[0];
        const lgBody = m[1];
        // 提取id
        const idRe = /\bid="([^"]+)"/.exec(lgBody);
        if (!idRe) continue;
        const gid = idRe[1];
        // 提取所有 <stop offset="X%" stop-color="rgba(...)"/>
        const stops = [];
        const stopRe = /<stop[^>]*offset="([^"]+)"[^>]*stop-color="([^"]+)"[^>]*\/?>/gi;
        let sm;
        while ((sm = stopRe.exec(lgBody)) !== null) {
            stops.push({ offsetStr: sm[1], color: sm[2] });
        }
        if (stops.length === 0) continue;
        // offset 降序排序，取最大offset对应的stop-color
        stops.sort((a, b) => {
            const pa = parseFloat(a.offsetStr);
            const pb = parseFloat(b.offsetStr);
            return pb - pa;
        });
        // 特殊判断：对于ju_xing_933（顶部背景矩形）：它原来渐变是从浅灰→浅绿
        // 但用户要求：不要渐变色，用纯色 #F4FAF8
        // 其他SVG：如盾牌渐变，用户也不允许渐变，要纯色。我们用主色代替（通常第一个stop是主色）
        // 更保险：对于大部分SVG，第一个stop是主题色倾向，用第一个stop
        stops.sort((a, b) => parseFloat(a.offsetStr) - parseFloat(b.offsetStr));
        gradientMap[gid] = stops[0].color; // 用第一个偏移处的颜色
        defsToRemove.push(wholeDefs);
    }

    // 2. 把 SVG 中 <path ... fill="url(#g_xxxx)" ...> 替换成实际颜色
    // 先去重
    for (const defs of Array.from(new Set(defsToRemove))) {
        html = html.split(defs).join('');
    }
    // 替换 fill=url
    for (const [gid, color] of Object.entries(gradientMap)) {
        const urlFill = `fill="url(#${gid})"`;
        if (html.includes(urlFill)) {
            html = html.split(urlFill).join(`fill="${color}"`);
        }
    }
    return html;
}

function patchHome() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-shou_ye.html');
    const cssFile = path.join(PAGE_DIR, 'artboard-shou_ye.css');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let css = fs.readFileSync(cssFile, 'utf-8');

    // === 1. CSS去渐变 ===
    css = replaceGradientsToSolid(css);

    // === 2. HTML中的SVG内联去渐变 ===
    html = replaceSvgGradients(html);

    // === 3. 用户强制的"不能有渐变" ===
    // 对ju_xing_933顶部大背景，强制改成纯色 #F4FAF8（不管stop是什么）
    const extraCss = `
/* ===== V7 首页 全局基础布局 ===== */
body {
  margin: 0 !important;
  padding: 30px 0 60px !important;
  background: #D0D0D0 !important;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  -webkit-text-size-adjust: 100%;
  font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
}

/* 手机屏容器：从absolute → relative（作为子元素absolute的定位父） */
.shou_ye {
  position: relative !important;
  width: 5rem !important;
  min-height: 10.826667rem !important;
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden;
  background-color: #F4FAF8 !important;   /* 纯色，无渐变 */
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border-radius: 2px;
}

/* ===== 关键细节修正 ===== */

/* 顶部大背景 ju_xing_933 SVG 纯色 */
.shou_ye svg.ju_xing_933 path { fill: #F4FAF8 !important; }

/* 右上角绿色装饰曲线 Vector_441（原始SVG path无fill） */
.shou_ye svg.Vector_441 path { fill: rgba(32,157,135,0.18) !important; }

/* 健康管理提示卡片的绿色异形头 Rectangle_3465227 */
.shou_ye svg.Rectangle_3465227 path { fill: rgba(45,174,133,1) !important; }

/* 健康管理提示卡片的白色底板 Rectangle_3465239 Rectangle_3465239_1 */
.shou_ye .Rectangle_3465239,
.shou_ye .Rectangle_3465239_1 {
  background-color: #FFFFFF !important;
  border-radius: 0.133333rem !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.shou_ye .shang_chuan_wen_jian_da_yin {
  color: #FFFFFF !important;
  font-weight: 700 !important;
  font-size: 0.24rem !important;
}
.shou_ye .chuan_dan_hua_ce,
.shou_ye .chuan_dan_hua_ce_1 {
  color: #333333 !important;
  font-weight: 500 !important;
  font-size: 0.186667rem !important;
}

/* 待提升指标卡片 Frame_1739330128 白背景 */
.shou_ye .Frame_1739330128 {
  background-color: #FFFFFF !important;
  border-radius: 0.133333rem !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.shou_ye .Vector_42 { border: none !important; background: transparent !important; }
/* 外圈虚线路径(Vector_43..Vector_52)：浅蓝色描边 */
.shou_ye svg.Vector_43 path,
.shou_ye svg.Vector_44 path, .shou_ye svg.Vector_45 path,
.shou_ye svg.Vector_46 path, .shou_ye svg.Vector_47 path,
.shou_ye svg.Vector_48 path, .shou_ye svg.Vector_49 path,
.shou_ye svg.Vector_50 path, .shou_ye svg.Vector_51 path,
.shou_ye svg.Vector_52 path {
  stroke: #C8EAF8 !important; stroke-width: 2 !important; fill: none !important;
  stroke-dasharray: 4 3 !important;
}
/* 内圈蓝色进度刻度(Vector_53..Vector_81)：实色蓝 */
.shou_ye svg.Vector_53 path, .shou_ye svg.Vector_54 path,
.shou_ye svg.Vector_55 path, .shou_ye svg.Vector_56 path,
.shou_ye svg.Vector_57 path, .shou_ye svg.Vector_58 path,
.shou_ye svg.Vector_59 path, .shou_ye svg.Vector_60 path,
.shou_ye svg.Vector_61 path, .shou_ye svg.Vector_62 path,
.shou_ye svg.Vector_63 path, .shou_ye svg.Vector_64 path,
.shou_ye svg.Vector_65 path, .shou_ye svg.Vector_66 path,
.shou_ye svg.Vector_67 path, .shou_ye svg.Vector_68 path,
.shou_ye svg.Vector_69 path, .shou_ye svg.Vector_70 path,
.shou_ye svg.Vector_71 path, .shou_ye svg.Vector_72 path,
.shou_ye svg.Vector_73 path, .shou_ye svg.Vector_74 path,
.shou_ye svg.Vector_75 path, .shou_ye svg.Vector_76 path,
.shou_ye svg.Vector_77 path, .shou_ye svg.Vector_78 path,
.shou_ye svg.Vector_79 path, .shou_ye svg.Vector_80 path,
.shou_ye svg.Vector_81 path {
  stroke: #2D9CDB !important; stroke-width: 3 !important; fill: #2D9CDB !important;
}

/* 底部大卡片 Rectangle_3465233 纯浅灰白 */
.shou_ye .Rectangle_3465233 {
  background-color: #FFFFFF !important;
  border-radius: 0.186667rem !important;
  border: none !important;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
}

/* 分页指示点 Ellipse_6178/6179 */
.shou_ye .Ellipse_6178 { background-color: rgba(0,0,0,0.85) !important; border-radius: 50% !important; }
.shou_ye .Ellipse_6179 { background-color: rgba(0,0,0,0.25) !important; border-radius: 50% !important; }

/* ===== 底部Tab栏 ===== */
.shou_ye .zu_45205 { background-color: #FFFFFF !important; border-top: 1px solid rgba(0,0,0,0.06); }
.shou_ye .Tab_Bar, .shou_ye .Tab_Bar_2, .shou_ye .Tab_Bar_4,
.shou_ye .Tab_Bar_6, .shou_ye .Tab_Bar_8 { background-color: #FFFFFF !important; }

/* 首页Tab = ____Label = 绿色选中 */
.shou_ye .____Label { color: #209D87 !important; font-weight: 600 !important; }
/* 其余4个 = 灰色 */
.shou_ye .____Label_1, .shou_ye .____Label_2,
.shou_ye .____Label_3, .shou_ye .____Label_4 {
  color: #999999 !important; font-weight: 400 !important;
}
/* 非首页Tab图标灰度 (Tab_Bar_2 / _4 / _6 / _8 是4个非当前页Tab对应Frame) */
.shou_ye .Tab_Bar_2 img, .shou_ye .Tab_Bar_4 img,
.shou_ye .Tab_Bar_6 img, .shou_ye .Tab_Bar_8 img { opacity: 0.45; filter: grayscale(70%); }
.shou_ye .Tab_Bar_2 svg, .shou_ye .Tab_Bar_4 svg,
.shou_ye .Tab_Bar_6 svg, .shou_ye .Tab_Bar_8 svg { opacity: 0.45; filter: grayscale(70%); }

/* ===== 兜底：任何空fill的path都继承父容器颜色 ===== */
.shou_ye svg path[fill=""],
.shou_ye svg path:not([fill]) {
  fill: inherit !important;
}
.shou_ye svg path[fill="none" i] { fill: none !important; }
`;

    html = appendStyle(html, extraCss);
    fs.writeFileSync(htmlFile, html, 'utf-8');
    fs.writeFileSync(cssFile, css, 'utf-8');
    console.log('首页 V7 patched ✓');
}

function patchHealth() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
    const cssFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.css');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let css = fs.readFileSync(cssFile, 'utf-8');

    css = replaceGradientsToSolid(css);
    html = replaceSvgGradients(html);

    const extraCss = `
/* ===== V7 健康管理 全局基础布局 ===== */
body {
  margin: 0 !important;
  padding: 30px 0 60px !important;
  background: #D0D0D0 !important;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  -webkit-text-size-adjust: 100%;
  font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
}
.jian_kang_guan_li {
  position: relative !important;
  width: 5rem !important;
  min-height: 10.826667rem !important;
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden;
  background-color: #F4FAF8 !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border-radius: 2px;
}

/* 顶部大背景 */
.jian_kang_guan_li svg.ju_xing_933_1 path { fill: #F4FAF8 !important; }

/* ===== 健康建议头部绿色渐变 → 纯绿 ===== */
.jian_kang_guan_li .Rectangle_3465233_2 { background-color: #2DAE85 !important; border-radius: 0.133333rem 0.133333rem 0 0 !important; }
.jian_kang_guan_li svg.Rectangle_3465233_2 path { fill: #2DAE85 !important; }
.jian_kang_guan_li svg.Polygon_2 path { fill: #19A280 !important; }
.jian_kang_guan_li .shang_chuan_wen_jian_da_yin_1 { color: #FFFFFF !important; font-weight: 700 !important; font-size: 0.24rem !important; }
.jian_kang_guan_li .Rectangle_3465230_1 { background-color: rgba(255,255,255,0.88) !important; border-radius: 0 0 0.133333rem 0.133333rem !important; }
.jian_kang_guan_li .bao_chi_gui_lv_zuo_xi____________________________________________________________ {
  color: #333333 !important; line-height: 1.6 !important; font-size: 0.186667rem !important;
}

/* ===== 头像背景(绿色实心) Frame_1739330068_1 ===== */
.jian_kang_guan_li .Frame_1739330068_1 { background: #23B357 !important; }
.jian_kang_guan_li .____1 { color: #333333 !important; font-weight: 600 !important; font-size: 0.24rem !important; }

/* ===== 两张主卡片 ===== */
.jian_kang_guan_li .Rectangle_3465239_3,
.jian_kang_guan_li .Rectangle_3465239_4 {
  background-color: #FFFFFF !important; border-radius: 0.133333rem !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04) !important;
}
.jian_kang_guan_li .chuan_dan_hua_ce_3,
.jian_kang_guan_li .chuan_dan_hua_ce_4 { color: #333333 !important; font-weight: 600 !important; font-size: 0.2rem !important; }
.jian_kang_guan_li .ge_xing_hua_gan_yu_fang_an_zhen_dui_xing_gai_shan_jian_kang_zhi_biao,
.jian_kang_guan_li .fan_kui_dang_tian_tou_xi_qing_kuang_______ { color: #7A91A3 !important; line-height: 1.5 !important; }

/* 图标上色：方案蓝色 / 评估绿色 */
.jian_kang_guan_li .Vector_175, .jian_kang_guan_li .Vector_181 { background: transparent !important; }
.jian_kang_guan_li .Vector_175 svg path { fill: #0083FF !important; }
.jian_kang_guan_li .Vector_181 svg path { fill: #00C67C !important; }

/* ===== "重要"绿色标签 ===== */
.jian_kang_guan_li .ju_xing_2431,
.jian_kang_guan_li .ju_xing_2431_1 {
  background-color: #19A280 !important;
  border-radius: 0 0.053333rem 0.053333rem 0 !important;
}
.jian_kang_guan_li .zhong_yao,
.jian_kang_guan_li .zhong_yao_1 {
  color: #FFFFFF !important; font-size: 0.146667rem !important; font-weight: 600 !important;
}

/* ===== 4个2x2网格图标上色 ===== */
/* 健康档案 - 蓝色文档(Vector_204为容器, Vector_205..Vector_210为蓝文档主体 Vector_211白条) */
.jian_kang_guan_li .Vector_204 { background: transparent !important; }
.jian_kang_guan_li svg.Vector_205 path, .jian_kang_guan_li svg.Vector_206 path,
.jian_kang_guan_li svg.Vector_207 path, .jian_kang_guan_li svg.Vector_208 path,
.jian_kang_guan_li svg.Vector_209 path, .jian_kang_guan_li svg.Vector_210 path { fill: #379EFF !important; }
.jian_kang_guan_li svg.Vector_211 path { fill: #FFFFFF !important; }

/* 生命体征 - 红色心脏 Vector_212 */
.jian_kang_guan_li svg.Vector_212 path { fill: #FF373A !important; }

/* 用药记录 - 紫色药瓶 Vector_213(Vector_214..216瓶身 Vector_217瓶内白条) */
.jian_kang_guan_li .Vector_213 { background: transparent !important; }
.jian_kang_guan_li svg.Vector_214 path, .jian_kang_guan_li svg.Vector_215 path,
.jian_kang_guan_li svg.Vector_216 path { fill: #DD7AD8 !important; }
.jian_kang_guan_li svg.Vector_217 path { fill: #FFFFFF !important; }

/* 核心指标 - 绿色图表 Vector_218/219/220/221/222 图表 Vector_223白色卡片底色*/
.jian_kang_guan_li .Frame_28, .jian_kang_guan_li .Vector_218 { background: transparent !important; }
.jian_kang_guan_li svg.Vector_219 path, .jian_kang_guan_li svg.Vector_220 path,
.jian_kang_guan_li svg.Vector_221 path, .jian_kang_guan_li svg.Vector_222 path { fill: #1ACF90 !important; }
.jian_kang_guan_li .Vector_223 { background-color: #FFFFFF !important; }
.jian_kang_guan_li svg.Vector_224 path, .jian_kang_guan_li svg.Vector_225 path,
.jian_kang_guan_li svg.Vector_226 path { fill: #FFFFFF !important; }

/* ===== "查看"按钮 ===== */
.jian_kang_guan_li .ju_xing_2432, .jian_kang_guan_li .ju_xing_2432_1,
.jian_kang_guan_li .ju_xing_2432_2, .jian_kang_guan_li .ju_xing_2432_3 {
  background-color: rgba(32,157,135,0.08) !important; border-radius: 0.266667rem !important;
}
.jian_kang_guan_li .cha_kan, .jian_kang_guan_li .cha_kan_1,
.jian_kang_guan_li .cha_kan_2, .jian_kang_guan_li .cha_kan_3 {
  color: #209D87 !important; font-size: 0.16rem !important; font-weight: 500 !important;
}
.jian_kang_guan_li .chuan_dan_hua_ce_5, .jian_kang_guan_li .chuan_dan_hua_ce_6,
.jian_kang_guan_li .chuan_dan_hua_ce_7, .jian_kang_guan_li .chuan_dan_hua_ce_8 {
  color: #333333 !important; font-weight: 600 !important; font-size: 0.2rem !important;
}
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_1,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_2,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_3 { color: #7A91A3 !important; }

/* ===== 底部Tab栏 - 健康管理第2个(____Label_6)绿色，其余灰色 ===== */
.jian_kang_guan_li .zu_45205_1 { background-color: #FFFFFF !important; border-top: 1px solid rgba(0,0,0,0.06); }
.jian_kang_guan_li .Tab_Bar_10, .jian_kang_guan_li .Tab_Bar_12,
.jian_kang_guan_li .Tab_Bar_14, .jian_kang_guan_li .Tab_Bar_16,
.jian_kang_guan_li .Tab_Bar_18 { background-color: #FFFFFF !important; }
.jian_kang_guan_li .____Label_6 { color: #209D87 !important; font-weight: 600 !important; }
.jian_kang_guan_li .____Label_5, .jian_kang_guan_li .____Label_7,
.jian_kang_guan_li .____Label_8, .jian_kang_guan_li .____Label_9 {
  color: #999999 !important; font-weight: 400 !important;
}
/* 非健康管理页Tab图标灰度 */
.jian_kang_guan_li .Tab_Bar_10 img, .jian_kang_guan_li .Tab_Bar_14 img,
.jian_kang_guan_li .Tab_Bar_16 img, .jian_kang_guan_li .Tab_Bar_18 img { opacity: 0.45; filter: grayscale(70%); }
.jian_kang_guan_li .Tab_Bar_10 svg, .jian_kang_guan_li .Tab_Bar_14 svg,
.jian_kang_guan_li .Tab_Bar_16 svg, .jian_kang_guan_li .Tab_Bar_18 svg { opacity: 0.45; filter: grayscale(70%); }

/* 兜底空fill */
.jian_kang_guan_li svg path[fill=""],
.jian_kang_guan_li svg path:not([fill]) { fill: inherit !important; }
.jian_kang_guan_li svg path[fill="none" i] { fill: none !important; }
`;

    html = appendStyle(html, extraCss);
    fs.writeFileSync(htmlFile, html, 'utf-8');
    fs.writeFileSync(cssFile, css, 'utf-8');
    console.log('健康管理 V7 patched ✓');
}

try {
    console.log('=== Patch V7 (终极干净版) 开始 ===');
    copyAssets();
    patchHome();
    patchHealth();
    console.log('=== Patch V7 完成 ===');
} catch (e) {
    console.error('V7 failed:', e.message, e.stack);
    process.exit(1);
}
