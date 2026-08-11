/**
 * Patch Script V5 - 精准布局修复
 * 关键修正:
 * - 移除致命的 > * { position: absolute } 规则
 * - 只保留原本标注了absolute的元素的定位
 * - rem基准 + 根容器居中
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
    console.log('切片资源复制完成');
}

function appendStyle(html, cssBlock, markerId) {
    const marker = '</head>';
    const styleTag = `<!-- ${markerId} --><style type="text/css">${cssBlock}</style>`;
    if (html.includes(styleTag)) return html;
    return html.replace(marker, styleTag + marker);
}

// ========== 通用rem基础配置 ==========
const REM_BASE_CSS = `
html { 
  font-size: 75px !important; /* 关键: 5rem * 75px = 375px 设计稿宽 */
  -webkit-text-size-adjust: 100%;
}
body {
  margin: 0 !important;
  padding: 20px 0 !important;
  background: #D8D8D8 !important;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}
/* 去掉V3/V4遗留的旧补丁 */
`;

function patchHome() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-shou_ye.html');
    const cssFile = path.join(PAGE_DIR, 'artboard-shou_ye.css');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let css = fs.readFileSync(cssFile, 'utf-8');

    // viewport: 固定宽度375，避免device-width干扰
    html = html.replace(
        /<meta name="viewport"[^>]*>/,
        '<meta name="viewport" content="width=375, initial-scale=1, maximum-scale=1, user-scalable=no">'
    );

    // 去掉CSS中的linear-gradient
    css = css.replace(/\bbackground:linear-gradient\([^)]+\)/g, (match) => {
        const m = /rgba\([^)]+\)(?=\s*\d+(\.\d+)?%\s*\)$)/.exec(match);
        if (m) return 'background-color:' + m[0];
        return 'background-color:rgba(250,251,253,1)';
    });

    const extraCss = REM_BASE_CSS + `
/* ===== 首页 V5 根容器 ===== */
.shou_ye {
  position: relative !important; /* 作为absolute子元素的定位父级 */
  width: 5rem !important;       /* 375px */
  min-height: 10.826667rem !important;
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden;
  background-color: #F4FAF8 !important;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  border-radius: 0.013333rem;
  /* 关键点：不要改子元素的position，保持原有inline style */
}

/* 文本容器不应该absolute，保持文档流 */
.shou_ye > span { position: relative !important; display: inline-block; }

/* ===== 大背景SVG ===== */
.shou_ye svg.ju_xing_933 { width: 5rem; height: 4.738971rem; background-color: #F4FAF8; }
.shou_ye svg.ju_xing_933 path { fill: #F4FAF8 !important; }

/* 顶部绿色装饰曲线 */
.shou_ye svg.Vector_441 path { fill: rgba(32,157,135,0.18) !important; }

/* 绿色头部形状 (健康管理提示卡片头) */
.shou_ye svg.Rectangle_3465227 path { fill: rgba(45,174,133,1) !important; }

/* ===== Logo 区域 ===== */
.shou_ye .brand_logo_area { z-index: 50; }
.shou_ye .page_title_home { z-index: 50; }

/* ===== 盾牌3D图标 ===== */
.shou_ye .Simple_3D { z-index: 40; }
.shou_ye .Simple_3D img {
  position: absolute;
  width: 100%; height: 100%;
  object-fit: contain;
  display: block;
  top: 0; left: 0;
}

/* ===== 护航第1天文字 ===== */
.shou_ye .____Placeholder { z-index: 35; }

/* ===== 健康管理提示卡片 ===== */
.shou_ye .Rectangle_3465239,
.shou_ye .Rectangle_3465239_1 {
  background-color: #FFFFFF !important;
  border-radius: 0.133333rem !important;
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

/* ===== 待提升指标圆环 ===== */
.shou_ye .Frame_1739330128 {
  background-color: #FFFFFF !important;
  border-radius: 0.133333rem !important;
}
/* 外圈虚线 */
.shou_ye .Vector_42 { border: none !important; background: transparent !important; }
.shou_ye svg.Vector_43 path,
.shou_ye svg.Vector_44 path, .shou_ye svg.Vector_45 path,
.shou_ye svg.Vector_46 path, .shou_ye svg.Vector_47 path,
.shou_ye svg.Vector_48 path, .shou_ye svg.Vector_49 path,
.shou_ye svg.Vector_50 path, .shou_ye svg.Vector_51 path,
.shou_ye svg.Vector_52 path {
  stroke: #C8EAF8 !important; stroke-width: 2 !important; fill: none !important;
  stroke-dasharray: 4 3 !important;
}
/* 进度刻度 */
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

/* ===== 底部Tab ===== */
.shou_ye .zu_45205 { background-color: #FFFFFF !important; border-top: 1px solid rgba(0,0,0,0.06); }
.shou_ye .Tab_Bar, .shou_ye .Tab_Bar_2,
.shou_ye .Tab_Bar_4, .shou_ye .Tab_Bar_6, .shou_ye .Tab_Bar_8 {
  background-color: #FFFFFF !important;
}
/* 首页Tab(1号)绿色 */
.shou_ye .____Label { color: #209D87 !important; font-weight: 600 !important; }
/* 其他灰色 */
.shou_ye .____Label_1, .shou_ye .____Label_2,
.shou_ye .____Label_3, .shou_ye .____Label_4 {
  color: #999999 !important; font-weight: 400 !important;
}
/* 图标灰度(非首页) */
.shou_ye .Tab_Bar_2 svg, .shou_ye .Tab_Bar_4 svg,
.shou_ye .Tab_Bar_6 svg, .shou_ye .Tab_Bar_8 svg { opacity: 0.45; filter: grayscale(70%); }
.shou_ye .Tab_Bar_2 img, .shou_ye .Tab_Bar_4 img,
.shou_ye .Tab_Bar_6 img, .shou_ye .Tab_Bar_8 img { opacity: 0.45; filter: grayscale(70%); }

/* SVG path 兜底fill: 从父容器background-color推断 */
.shou_ye svg path[fill="none" i] { fill: none !important; }
.shou_ye svg path:not([stroke]):not([fill]),
.shou_ye svg path[fill=""],
.shou_ye svg path[fill="none"]:not([stroke]) { fill: inherit !important; }
`;

    html = appendStyle(html, extraCss, 'V5-home-fix');
    fs.writeFileSync(htmlFile, html, 'utf-8');
    fs.writeFileSync(cssFile, css, 'utf-8');
    console.log('首页 V5 patched ✓');
}

function patchHealth() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
    const cssFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.css');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let css = fs.readFileSync(cssFile, 'utf-8');

    html = html.replace(
        /<meta name="viewport"[^>]*>/,
        '<meta name="viewport" content="width=375, initial-scale=1, maximum-scale=1, user-scalable=no">'
    );

    // 去掉linear-gradient
    css = css.replace(/\bbackground:linear-gradient\([^)]+\)/g, (match) => {
        const m = /rgba\([^)]+\)(?=\s*\d+(\.\d+)?%\s*\)$)/.exec(match);
        if (m) return 'background-color:' + m[0];
        return 'background-color:rgba(250,251,253,1)';
    });

    const extraCss = REM_BASE_CSS + `
/* ===== 健康管理 V5 根容器 ===== */
.jian_kang_guan_li {
  position: relative !important;
  width: 5rem !important;
  min-height: 10.826667rem !important;
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden;
  background-color: #F4FAF8 !important;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  border-radius: 0.013333rem;
}
.jian_kang_guan_li > span { position: relative !important; }

.jian_kang_guan_li svg.ju_xing_933_1 path { fill: #F4FAF8 !important; background-color: #F4FAF8 !important; }

/* ===== 健康建议绿色头部 ===== */
.jian_kang_guan_li .Rectangle_3465233_2 { background-color: #2DAE85 !important; border-radius: 0.133333rem 0.133333rem 0 0 !important; }
.jian_kang_guan_li svg.Rectangle_3465233_2 path { fill: #2DAE85 !important; }
.jian_kang_guan_li svg.Polygon_2 path { fill: #19A280 !important; }
.jian_kang_guan_li .shang_chuan_wen_jian_da_yin_1 {
  color: #FFFFFF !important; font-weight: 700 !important; font-size: 0.24rem !important;
}
.jian_kang_guan_li .Rectangle_3465230_1 {
  background-color: rgba(255,255,255,0.88) !important;
  border-radius: 0 0 0.133333rem 0.133333rem !important;
}
.jian_kang_guan_li .bao_chi_gui_lv_zuo_xi____________________________________________________________ {
  color: #333333 !important; line-height: 1.6 !important; font-size: 0.186667rem !important;
}

/* ===== 头像 ===== */
.jian_kang_guan_li .Frame_1739330068_1 { background: #23B357 !important; }

/* ===== 两张卡片（指标提升/透析评估） ===== */
.jian_kang_guan_li .Rectangle_3465239_3,
.jian_kang_guan_li .Rectangle_3465239_4 {
  background-color: #FFFFFF !important;
  border-radius: 0.133333rem !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04) !important;
}
.jian_kang_guan_li .chuan_dan_hua_ce_3,
.jian_kang_guan_li .chuan_dan_hua_ce_4 {
  color: #333333 !important; font-weight: 600 !important; font-size: 0.2rem !important;
}
.jian_kang_guan_li .ge_xing_hua_gan_yu_fang_an_zhen_dui_xing_gai_shan_jian_kang_zhi_biao,
.jian_kang_guan_li .fan_kui_dang_tian_tou_xi_qing_kuang_______ {
  color: #7A91A3 !important; line-height: 1.5 !important;
}

/* ===== "重要"标签 ===== */
.jian_kang_guan_li .ju_xing_2431,
.jian_kang_guan_li .ju_xing_2431_1 {
  background-color: #19A280 !important;
  border-radius: 0.04rem 0 0.133333rem 0.04rem !important;
}
.jian_kang_guan_li .zhong_yao,
.jian_kang_guan_li .zhong_yao_1 {
  color: #FFFFFF !important; font-size: 0.146667rem !important; font-weight: 600 !important;
}

/* ===== 图标上色 ===== */
.jian_kang_guan_li .Vector_175, .jian_kang_guan_li .Vector_181 { background: transparent !important; }

/* 蓝色方案图标 */
.jian_kang_guan_li .Vector_175 svg path { fill: #0083FF !important; }
/* 绿色评估图标 */
.jian_kang_guan_li .Vector_181 svg path { fill: #00C67C !important; }

/* 健康档案 - 蓝色文档 */
.jian_kang_guan_li .Vector_204 { background: transparent !important; }
.jian_kang_guan_li svg.Vector_205 path, .jian_kang_guan_li svg.Vector_206 path,
.jian_kang_guan_li svg.Vector_207 path, .jian_kang_guan_li svg.Vector_208 path,
.jian_kang_guan_li svg.Vector_209 path, .jian_kang_guan_li svg.Vector_210 path {
  fill: #379EFF !important;
}
.jian_kang_guan_li svg.Vector_211 path { fill: #FFFFFF !important; }

/* 生命体征 - 红色心脏 */
.jian_kang_guan_li svg.Vector_212 path { fill: #FF373A !important; }

/* 用药记录 - 紫色药瓶 */
.jian_kang_guan_li .Vector_213 { background: transparent !important; }
.jian_kang_guan_li svg.Vector_214 path, .jian_kang_guan_li svg.Vector_215 path,
.jian_kang_guan_li svg.Vector_216 path { fill: #DD7AD8 !important; }
.jian_kang_guan_li svg.Vector_217 path { fill: #FFFFFF !important; }

/* 核心指标 - 绿色图表 */
.jian_kang_guan_li .Frame_28, .jian_kang_guan_li .Vector_218 { background: transparent !important; }
.jian_kang_guan_li svg.Vector_219 path, .jian_kang_guan_li svg.Vector_220 path,
.jian_kang_guan_li svg.Vector_221 path, .jian_kang_guan_li svg.Vector_222 path {
  fill: #1ACF90 !important;
}
.jian_kang_guan_li .Vector_223 { background-color: #FFFFFF !important; }
.jian_kang_guan_li svg.Vector_224 path, .jian_kang_guan_li svg.Vector_225 path,
.jian_kang_guan_li svg.Vector_226 path { fill: #FFFFFF !important; }

/* ===== 查看按钮 ===== */
.jian_kang_guan_li .ju_xing_2432, .jian_kang_guan_li .ju_xing_2432_1,
.jian_kang_guan_li .ju_xing_2432_2, .jian_kang_guan_li .ju_xing_2432_3 {
  background-color: rgba(32,157,135,0.08) !important;
  border-radius: 0.266667rem !important;
}
.jian_kang_guan_li .cha_kan, .jian_kang_guan_li .cha_kan_1,
.jian_kang_guan_li .cha_kan_2, .jian_kang_guan_li .cha_kan_3 {
  color: #209D87 !important; font-size: 0.16rem !important; font-weight: 500 !important;
}

/* 2x2卡片标题 */
.jian_kang_guan_li .chuan_dan_hua_ce_5, .jian_kang_guan_li .chuan_dan_hua_ce_6,
.jian_kang_guan_li .chuan_dan_hua_ce_7, .jian_kang_guan_li .chuan_dan_hua_ce_8 {
  color: #333 !important; font-weight: 600 !important; font-size: 0.2rem !important;
}
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_1,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_2,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_3 {
  color: #7A91A3 !important;
}

/* ===== 底部Tab：健康管理(第2个)绿色 ===== */
.jian_kang_guan_li .zu_45205_1 { background-color: #FFFFFF !important; border-top: 1px solid rgba(0,0,0,0.06); }
.jian_kang_guan_li .Tab_Bar_10, .jian_kang_guan_li .Tab_Bar_12,
.jian_kang_guan_li .Tab_Bar_14, .jian_kang_guan_li .Tab_Bar_16,
.jian_kang_guan_li .Tab_Bar_18 { background-color: #FFFFFF !important; }

.jian_kang_guan_li .____Label_6 { color: #209D87 !important; font-weight: 600 !important; }
.jian_kang_guan_li .____Label_5, .jian_kang_guan_li .____Label_7,
.jian_kang_guan_li .____Label_8, .jian_kang_guan_li .____Label_9 {
  color: #999999 !important; font-weight: 400 !important;
}
/* 非当前Tab图标灰度 */
.jian_kang_guan_li .Tab_Bar_10 svg, .jian_kang_guan_li .Tab_Bar_14 svg,
.jian_kang_guan_li .Tab_Bar_16 svg, .jian_kang_guan_li .Tab_Bar_18 svg { opacity: 0.45; filter: grayscale(70%); }
.jian_kang_guan_li .Tab_Bar_10 img, .jian_kang_guan_li .Tab_Bar_14 img,
.jian_kang_guan_li .Tab_Bar_16 img, .jian_kang_guan_li .Tab_Bar_18 img { opacity: 0.45; filter: grayscale(70%); }
`;

    html = appendStyle(html, extraCss, 'V5-health-fix');
    fs.writeFileSync(htmlFile, html, 'utf-8');
    fs.writeFileSync(cssFile, css, 'utf-8');
    console.log('健康管理 V5 patched ✓');
}

try {
    console.log('=== Patch V5 开始 ===');
    copyAssets();
    patchHome();
    patchHealth();
    console.log('=== Patch V5 完成 ===');
} catch (e) {
    console.error('Patch V5 failed:', e.message, e.stack);
    process.exit(1);
}
