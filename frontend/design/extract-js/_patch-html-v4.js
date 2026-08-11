/**
 * Patch Script V4 - 核心修复
 * 修复:
 * 1. viewport width=375 + html font-size=75px (5rem * 75 = 375)
 * 2. 根容器居中 + body背景
 * 3. SVG path fill 全局兜底填充
 * 4. 继续V3的颜色/Tab修正
 */
const fs = require('fs');
const path = require('path');

const DESIGN_DIR = __dirname;
const OUTPUT_DIR = path.join(DESIGN_DIR, 'output', 'html');
const IMG_DIR = path.join(OUTPUT_DIR, 'images');
const PAGE_DIR = path.join(OUTPUT_DIR, 'page-Page_1');

// ========== 1. 复制切片资源 ==========
function copyAssets() {
    const srcDirs = [
        path.join(DESIGN_DIR, '首页'),
        path.join(DESIGN_DIR, '健康管理')
    ];
    for (const dir of srcDirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir);
        for (const f of files) {
            const ext = path.extname(f).toLowerCase();
            if (ext === '.svg' || ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                const src = path.join(dir, f);
                const dst = path.join(IMG_DIR, f);
                // 每次都覆盖，确保最新
                fs.copyFileSync(src, dst);
            }
        }
    }
    console.log('切片资源复制完成');
}

function appendStyle(html, cssBlock) {
    const marker = '</head>';
    const styleTag = `<style type="text/css">${cssBlock}</style>`;
    if (html.includes(styleTag)) return html;
    return html.replace(marker, styleTag + marker);
}

// ========== 2. 处理首页 ==========
function patchHome() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-shou_ye.html');
    const cssFile = path.join(PAGE_DIR, 'artboard-shou_ye.css');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let css = fs.readFileSync(cssFile, 'utf-8');

    // ---- 2.0 viewport修复: 固定width=375 ----
    html = html.replace(
        /<meta name="viewport"[^>]*>/,
        '<meta name="viewport" content="width=375, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui">'
    );

    // ---- 2.1 核心：rem初始化 + 根容器居中 ----
    const coreFix = `
/* ====== V4 核心 REM 布局修复 ====== */
html { font-size: 75px !important; } /* 5rem * 75px = 375px 设计稿宽度 */
body {
  margin: 0 !important;
  padding: 0 !important;
  background: #E6E6E6 !important;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  -webkit-text-size-adjust: 100%;
}
.shou_ye {
  position: relative !important;
  width: 5rem !important; /* 375px */
  min-height: 10.826667rem !important; /* 812px (iPhone X-ish) */
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden;
  background-color: #F4FAF8 !important;
  box-shadow: 0 0 20px rgba(0,0,0,0.08);
}
/* 所有子元素absolute都相对.shou_ye定位 */
.shou_ye > * { position: absolute; }
/* 但有flex子容器（如brand_logo_inner）需覆盖 */
.shou_ye .brand_logo_area,
.shou_ye .brand_logo_inner,
.shou_ye .brand_logo_inner > div { position: relative; }
.shou_ye .brand_logo_inner > div { display: flex; flex-direction: column; }

/* ====== V4 首页 SVG 全局兜底 fill ====== */
.shou_ye svg path:not([fill]),
.shou_ye svg path[fill=""],
.shou_ye svg path[fill="none"] {
  fill: currentColor !important;
}
/* 给每个SVG父容器设currentColor，从背景色继承 */
.shou_ye svg.Vector_441 { color: rgba(32,157,135,0.15); }
.shou_ye svg.Rectangle_3465227 path { fill: rgba(45,174,133,1) !important; }
.shou_ye svg.ju_xing_933 path { fill: #F4FAF8 !important; }

/* 盾牌图片位置：右上角 */
.shou_ye .Simple_3D {
  z-index: 30 !important;
}
.shou_ye .Simple_3D img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* ====== 顶部标题 ====== */
.shou_ye .page_title_home span {
  color: rgba(0,0,0,0.87) !important;
  font-weight: 600 !important;
}

/* ====== 健康管理提示卡片 ====== */
.shou_ye .Rectangle_3465239,
.shou_ye .Rectangle_3465239_1 {
  background-color: #FFFFFF !important;
  border-radius: 0.133333rem !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.shou_ye .chuan_dan_hua_ce,
.shou_ye .chuan_dan_hua_ce_1 {
  color: #333333 !important;
  font-size: 0.186667rem !important;
  font-weight: 500 !important;
}
.shou_ye .shang_chuan_wen_jian_da_yin {
  color: #1B715E !important;
  font-weight: 700 !important;
  font-size: 0.213333rem !important;
}

/* ====== 待提升指标虚线圆环 ====== */
.shou_ye .Frame_1739330128 {
  background-color: #FFFFFF !important;
  border-radius: 0.133333rem !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: visible !important;
}
.shou_ye .Vector_42 { border: none !important; }
/* 虚线圆圈：蓝色描边 */
.shou_ye svg.Vector_43 path,
.shou_ye svg.Vector_44 path, .shou_ye svg.Vector_45 path,
.shou_ye svg.Vector_46 path, .shou_ye svg.Vector_47 path,
.shou_ye svg.Vector_48 path, .shou_ye svg.Vector_49 path,
.shou_ye svg.Vector_50 path, .shou_ye svg.Vector_51 path,
.shou_ye svg.Vector_52 path {
  stroke: #C8EAF8 !important; stroke-width: 2 !important; fill: none !important;
  stroke-dasharray: 4 3 !important;
}
/* 已达标的进度点：蓝色实心 */
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

/* ====== 底部Tab栏 ====== */
.shou_ye .zu_45205 {
  background-color: #FFFFFF !important;
  border-top: 1px solid rgba(0,0,0,0.06);
}
/* 首页Tab（当前）绿色 */
.shou_ye .____Label { color: #209D87 !important; font-weight: 600 !important; }
/* 其他灰色 */
.shou_ye .____Label_1, .shou_ye .____Label_2,
.shou_ye .____Label_3, .shou_ye .____Label_4 {
  color: #999999 !important; font-weight: 400 !important;
}
/* 其他Tab图标灰度 */
.shou_ye .Frame_22 img, .shou_ye .Frame_24 img,
.shou_ye .Frame_26 img, .shou_ye .wo_de_2 img,
.shou_ye .Frame_22 svg, .shou_ye .Frame_24 svg,
.shou_ye .Frame_26 svg, .shou_ye .wo_de_2 svg {
  opacity: 0.5;
  filter: grayscale(80%);
}

/* 去掉Rectangle_3465233的渐变 */
`;

    // 去掉CSS文件中的渐变
    css = css.replace(/background:linear-gradient\([^)]+\)/g, (match) => {
        // 提取渐变最后一个颜色，当作纯色用
        const m = /rgba\([^)]+\)(?=\s*\d+%\s*\)$)/.exec(match);
        if (m) return 'background-color:' + m[0];
        return 'background-color:rgba(250,251,253,1)';
    });

    html = appendStyle(html, coreFix);

    fs.writeFileSync(htmlFile, html, 'utf-8');
    fs.writeFileSync(cssFile, css, 'utf-8');
    console.log('首页 V4 patched ✓');
}

// ========== 3. 处理健康管理页 ==========
function patchHealth() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
    const cssFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.css');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let css = fs.readFileSync(cssFile, 'utf-8');

    // viewport修复
    html = html.replace(
        /<meta name="viewport"[^>]*>/,
        '<meta name="viewport" content="width=375, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui">'
    );

    const coreFix = `
/* ====== V4 核心 REM 布局修复 ====== */
html { font-size: 75px !important; }
body {
  margin: 0 !important;
  padding: 0 !important;
  background: #E6E6E6 !important;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  -webkit-text-size-adjust: 100%;
}
.jian_kang_guan_li {
  position: relative !important;
  width: 5rem !important;
  min-height: 10.826667rem !important;
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden;
  background-color: #F4FAF8 !important;
  box-shadow: 0 0 20px rgba(0,0,0,0.08);
}
.jian_kang_guan_li > * { position: absolute; }
.jian_kang_guan_li .brand_logo_area,
.jian_kang_guan_li .brand_logo_inner { position: relative; }

/* ====== SVG 全局兜底 fill ====== */
.jian_kang_guan_li svg path:not([fill]),
.jian_kang_guan_li svg path[fill=""],
.jian_kang_guan_li svg path[fill="none"] {
  fill: currentColor !important;
}
.jian_kang_guan_li svg.ju_xing_933_1 path { fill: #F4FAF8 !important; }
.jian_kang_guan_li svg.Rectangle_3465233_2 path { fill: rgba(45,174,133,1) !important; }
.jian_kang_guan_li svg.Polygon_2 path { fill: rgba(25,162,128,1) !important; }

/* ====== 健康建议头部 ====== */
.jian_kang_guan_li .Rectangle_3465233_2 {
  background-color: rgba(45,174,133,1) !important;
}
.jian_kang_guan_li .shang_chuan_wen_jian_da_yin_1 {
  color: #FFFFFF !important;
  font-weight: 600 !important;
}
.jian_kang_guan_li .Rectangle_3465230_1 {
  background-color: rgba(255,255,255,0.85) !important;
  backdrop-filter: blur(10px);
}
.jian_kang_guan_li .bao_chi_gui_lv_zuo_xi____________________________________________________________ {
  color: #333333 !important;
  line-height: 1.6 !important;
}

/* ====== 头像背景 ====== */
.jian_kang_guan_li .Frame_1739330068_1 {
  background: #23B357 !important;
}

/* ====== 指标提升方案卡片 ====== */
.jian_kang_guan_li .Rectangle_3465239_3,
.jian_kang_guan_li .Rectangle_3465239_4 {
  border-radius: 0.133333rem !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
}
.jian_kang_guan_li .chuan_dan_hua_ce_3,
.jian_kang_guan_li .chuan_dan_hua_ce_4 {
  color: #333333 !important;
  font-weight: 600 !important;
  font-size: 0.2rem !important;
}
.jian_kang_guan_li .ge_xing_hua_gan_yu_fang_an_zhen_dui_xing_gai_shan_jian_kang_zhi_biao,
.jian_kang_guan_li .fan_kui_dang_tian_tou_xi_qing_kuang_______ {
  color: #7A91A3 !important;
  line-height: 1.5 !important;
}

/* ====== "重要"绿色标签 ====== */
.jian_kang_guan_li .ju_xing_2431,
.jian_kang_guan_li .ju_xing_2431_1 {
  background-color: #19A280 !important;
  border-radius: 0.04rem 0.133333rem 0.133333rem 0.04rem !important;
}
.jian_kang_guan_li .zhong_yao,
.jian_kang_guan_li .zhong_yao_1 {
  color: #FFFFFF !important;
  font-size: 0.146667rem !important;
  font-weight: 600 !important;
}

/* ====== 卡片图标上色 ====== */
/* 蓝色文档 (健康档案) */
.jian_kang_guan_li .Vector_204 { background: transparent !important; }
.jian_kang_guan_li svg.Vector_204 path,
.jian_kang_guan_li svg.Vector_205 path,
.jian_kang_guan_li svg.Vector_206 path,
.jian_kang_guan_li svg.Vector_207 path,
.jian_kang_guan_li svg.Vector_208 path,
.jian_kang_guan_li svg.Vector_209 path,
.jian_kang_guan_li svg.Vector_210 path { fill: #379EFF !important; }
/* 内部小图标白色 */
.jian_kang_guan_li svg.Vector_211 path { fill: #FFFFFF !important; }

/* 红色心脏 (生命体征) */
.jian_kang_guan_li svg.Vector_212 path { fill: #FF373A !important; }

/* 紫色药瓶 (用药记录) */
.jian_kang_guan_li .Vector_213 { background: transparent !important; }
.jian_kang_guan_li svg.Vector_213 path,
.jian_kang_guan_li svg.Vector_214 path,
.jian_kang_guan_li svg.Vector_215 path,
.jian_kang_guan_li svg.Vector_216 path { fill: #DD7AD8 !important; }
.jian_kang_guan_li svg.Vector_217 path { fill: #FFFFFF !important; }

/* 绿色图表 (核心指标) */
.jian_kang_guan_li .Frame_28 { background: transparent !important; }
.jian_kang_guan_li .Vector_218 { background: transparent !important; }
.jian_kang_guan_li svg.Vector_218 path,
.jian_kang_guan_li svg.Vector_219 path,
.jian_kang_guan_li svg.Vector_220 path,
.jian_kang_guan_li svg.Vector_221 path,
.jian_kang_guan_li svg.Vector_222 path { fill: #1ACF90 !important; }
.jian_kang_guan_li svg.Vector_223 { background-color: #FFFFFF !important; }
.jian_kang_guan_li svg.Vector_224 path,
.jian_kang_guan_li svg.Vector_225 path,
.jian_kang_guan_li svg.Vector_226 path { fill: #FFFFFF !important; }

/* ====== 查看按钮 ====== */
.jian_kang_guan_li .ju_xing_2432,
.jian_kang_guan_li .ju_xing_2432_1,
.jian_kang_guan_li .ju_xing_2432_2,
.jian_kang_guan_li .ju_xing_2432_3 {
  background-color: rgba(32,157,135,0.08) !important;
  border-radius: 0.266667rem !important;
}
.jian_kang_guan_li .cha_kan,
.jian_kang_guan_li .cha_kan_1,
.jian_kang_guan_li .cha_kan_2,
.jian_kang_guan_li .cha_kan_3 {
  color: #209D87 !important;
  font-size: 0.16rem !important;
  font-weight: 500 !important;
}

/* ====== 2x2卡片标题 ====== */
.jian_kang_guan_li .chuan_dan_hua_ce_5,
.jian_kang_guan_li .chuan_dan_hua_ce_6,
.jian_kang_guan_li .chuan_dan_hua_ce_7,
.jian_kang_guan_li .chuan_dan_hua_ce_8 {
  color: #333333 !important;
  font-weight: 600 !important;
  font-size: 0.2rem !important;
}
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_1,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_2,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_3 {
  color: #7A91A3 !important;
}

/* ====== 底部Tab栏：健康管理(第2个)绿色 ====== */
.jian_kang_guan_li .zu_45205_1 {
  background-color: #FFFFFF !important;
  border-top: 1px solid rgba(0,0,0,0.06);
}
.jian_kang_guan_li .____Label_6 { color: #209D87 !important; font-weight: 600 !important; }
.jian_kang_guan_li .____Label_5, .jian_kang_guan_li .____Label_7,
.jian_kang_guan_li .____Label_8, .jian_kang_guan_li .____Label_9 {
  color: #999999 !important; font-weight: 400 !important;
}
/* 其他Tab图标灰度 */
.jian_kang_guan_li .Frame_20 img, .jian_kang_guan_li .Frame_26 img,
.jian_kang_guan_li .wo_de_4 img, .jian_kang_guan_li .wo_de_6 img,
.jian_kang_guan_li .Frame_20 svg, .jian_kang_guan_li .Frame_26 svg {
  opacity: 0.5;
  filter: grayscale(80%);
}
`;

    // CSS文件中去掉渐变
    css = css.replace(/background:linear-gradient\([^)]+\)/g, (match) => {
        const m = /rgba\([^)]+\)(?=\s*\d+%\s*\)$)/.exec(match);
        if (m) return 'background-color:' + m[0];
        return 'background-color:rgba(250,251,253,1)';
    });

    html = appendStyle(html, coreFix);

    fs.writeFileSync(htmlFile, html, 'utf-8');
    fs.writeFileSync(cssFile, css, 'utf-8');
    console.log('健康管理 V4 patched ✓');
}

// ========== 主流程 ==========
try {
    console.log('=== Patch V4 开始 ===');
    copyAssets();
    patchHome();
    patchHealth();
    console.log('=== Patch V4 完成 ===');
} catch (e) {
    console.error('Patch failed:', e);
    process.exit(1);
}
