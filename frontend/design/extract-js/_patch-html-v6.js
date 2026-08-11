/**
 * Patch Script V6 - 修复viewport致命问题
 * 问题根源：
 *   错误地设置了 <meta viewport width=375> → 浏览器把逻辑视口当375px
 *   桌面Chrome实际物理宽度~1000px，375逻辑宽度被拉伸后巨幅放大
 * 正确方案：
 *   viewport width=device-width + html font-size=75px
 *   5rem * 75px = 375px，在桌面就是一个375px的居中手机框
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
    const beginTag = '/* V6-PATCH-BEGIN */';
    const endTag = '/* V6-PATCH-END */';
    const fullBlock = `<style>${beginTag}\n${cssBlock}\n${endTag}</style>`;
    // 先移除旧的V6补丁
    const oldRe = new RegExp(`<style>\\s*${beginTag}[\\s\\S]*?${endTag}\\s*</style>`, 'g');
    html = html.replace(oldRe, '');
    return html.replace(marker, fullBlock + marker);
}

// 通用REM基础 + 布局
const BASE_CSS = `
/* ===== V6 REM 基准（关键正确版） ===== */
html {
  /* 5rem = 375px设计稿宽 → 1rem = 75px */
  font-size: 75px !important;
  -webkit-text-size-adjust: 100%;
}
body {
  margin: 0 !important;
  padding: 24px 0 48px !important;
  background: #BDBDBD !important;  /* 预览区外灰色，便于衬托手机屏 */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif;
}
`;

function patchHome() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-shou_ye.html');
    const cssFile = path.join(PAGE_DIR, 'artboard-shou_ye.css');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let css = fs.readFileSync(cssFile, 'utf-8');

    // ======= 关键点1: viewport保留device-width，不要强行375 =======
    html = html.replace(
        /<meta name="viewport"[^>]*>/,
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
    );

    // ======= 去CSS文件中的linear-gradient =======
    css = css.replace(/\bbackground:\s*linear-gradient\([^)]+\)/g, (match) => {
        const m = /rgba\([^)]+\)(?=\s*\d+(\.\d+)?%\s*\)$)/.exec(match);
        if (m) return 'background-color:' + m[0];
        return 'background-color:rgba(250,251,253,1)';
    });
    // 去SVG内部的fill gradient
    css = css.replace(/\bbackground:\s*linear-gradient\([^)]+\)/g, (match) => {
        const parts = match.match(/rgba\([^)]+\)/g);
        if (parts && parts.length) return 'background-color:' + parts[parts.length - 1];
        return 'background-color:transparent';
    });

    const extraCss = BASE_CSS + `
/* ===== 首页 V6 根容器 ===== */
.shou_ye {
  position: relative !important;   /* 作为子absolute的定位祖先 */
  width: 5rem !important;         /* 375px */
  min-height: 10.826667rem !important;
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  background-color: #F4FAF8 !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border-radius: 0.026667rem;
}

/* ===== 背景块 ===== */
.shou_ye svg.ju_xing_933 path { fill: #F4FAF8 !important; }
.shou_ye .Group_1000007255 { overflow: hidden; }

/* 顶部曲线装饰 Vector_441 */
.shou_ye svg.Vector_441 path { fill: rgba(32,157,135,0.20) !important; }

/* 绿色异形头卡片头 */
.shou_ye svg.Rectangle_3465227 path { fill: #2DAE85 !important; }

/* ===== 盾牌3D图 ===== */
.shou_ye .Simple_3D img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: contain;
}

/* ===== 护航第1天文字样式 ===== */
.shou_ye .____Placeholder span:first-child {
  color: rgba(27,113,94,1) !important;
  font-size: 0.32rem !important;
  font-weight: 700 !important;
}
.shou_ye .____Placeholder span:last-child {
  color: rgba(198,168,110,1) !important;
  font-size: 0.48rem !important;
  font-weight: 800 !important;
}

/* ===== 健康管理提示卡片 ===== */
.shou_ye .shang_chuan_wen_jian_da_yin {
  color: #FFFFFF !important; font-weight: 700 !important; font-size: 0.24rem !important;
}
.shou_ye .Rectangle_3465239,
.shou_ye .Rectangle_3465239_1 {
  background-color: #FFFFFF !important;
  border-radius: 0.133333rem !important;
}
.shou_ye .chuan_dan_hua_ce,
.shou_ye .chuan_dan_hua_ce_1 {
  color: #333333 !important; font-weight: 500 !important; font-size: 0.186667rem !important;
}

/* ===== 待提升指标卡片 ===== */
.shou_ye .Frame_1739330128 {
  background-color: #FFFFFF !important; border-radius: 0.133333rem !important;
}
.shou_ye .Vector_42 { border: none !important; background: transparent !important; }
/* 外圈虚线刻度 */
.shou_ye svg.Vector_43 path, .shou_ye svg.Vector_44 path, .shou_ye svg.Vector_45 path,
.shou_ye svg.Vector_46 path, .shou_ye svg.Vector_47 path, .shou_ye svg.Vector_48 path,
.shou_ye svg.Vector_49 path, .shou_ye svg.Vector_50 path, .shou_ye svg.Vector_51 path,
.shou_ye svg.Vector_52 path {
  stroke: #C8EAF8 !important; stroke-width: 2 !important; fill: none !important;
  stroke-dasharray: 4 3 !important;
}
/* 内圈蓝色进度 */
.shou_ye svg.Vector_53 path, .shou_ye svg.Vector_54 path, .shou_ye svg.Vector_55 path,
.shou_ye svg.Vector_56 path, .shou_ye svg.Vector_57 path, .shou_ye svg.Vector_58 path,
.shou_ye svg.Vector_59 path, .shou_ye svg.Vector_60 path, .shou_ye svg.Vector_61 path,
.shou_ye svg.Vector_62 path, .shou_ye svg.Vector_63 path, .shou_ye svg.Vector_64 path,
.shou_ye svg.Vector_65 path, .shou_ye svg.Vector_66 path, .shou_ye svg.Vector_67 path,
.shou_ye svg.Vector_68 path, .shou_ye svg.Vector_69 path, .shou_ye svg.Vector_70 path,
.shou_ye svg.Vector_71 path, .shou_ye svg.Vector_72 path, .shou_ye svg.Vector_73 path,
.shou_ye svg.Vector_74 path, .shou_ye svg.Vector_75 path, .shou_ye svg.Vector_76 path,
.shou_ye svg.Vector_77 path, .shou_ye svg.Vector_78 path, .shou_ye svg.Vector_79 path,
.shou_ye svg.Vector_80 path, .shou_ye svg.Vector_81 path {
  stroke: #2D9CDB !important; stroke-width: 3 !important; fill: #2D9CDB !important;
}

/* ===== 底部Tab ===== */
.shou_ye .zu_45205 { background-color: #FFFFFF !important; border-top: 1px solid rgba(0,0,0,0.06); }
.shou_ye .Tab_Bar, .shou_ye .Tab_Bar_2, .shou_ye .Tab_Bar_4,
.shou_ye .Tab_Bar_6, .shou_ye .Tab_Bar_8 { background-color: #FFFFFF !important; }
/* 首页Tab（____Label是第1个，绿色） */
.shou_ye .____Label { color: #209D87 !important; font-weight: 600 !important; }
.shou_ye .____Label_1, .shou_ye .____Label_2,
.shou_ye .____Label_3, .shou_ye .____Label_4 {
  color: #999999 !important; font-weight: 400 !important;
}
/* 非首页Tab的图标灰度 */
.shou_ye .Tab_Bar_2 img, .shou_ye .Tab_Bar_4 img,
.shou_ye .Tab_Bar_6 img, .shou_ye .Tab_Bar_8 img { opacity: 0.45; filter: grayscale(70%); }
.shou_ye .Tab_Bar_2 svg, .shou_ye .Tab_Bar_4 svg,
.shou_ye .Tab_Bar_6 svg, .shou_ye .Tab_Bar_8 svg { opacity: 0.45; filter: grayscale(70%); }

/* ===== 底部大卡片Rectangle_3465233（通知消息背景） ===== */
.shou_ye .Rectangle_3465233 {
  background-color: #FFFFFF !important;
  border-radius: 0.186667rem !important;
  border: none !important;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
}

/* 通知消息卡片的几个Ellipse点指示 */
.shou_ye .Ellipse_6178 { background-color: rgba(0,0,0,0.87) !important; border-radius: 50%; }
.shou_ye .Ellipse_6179 { background-color: rgba(0,0,0,0.25) !important; border-radius: 50%; }

/* ===== SVG path空fill兜底（按父容器背景推断） ===== */
.shou_ye svg path {
  vector-effect: non-scaling-stroke;
}
`;

    html = appendStyle(html, extraCss);
    fs.writeFileSync(htmlFile, html, 'utf-8');
    fs.writeFileSync(cssFile, css, 'utf-8');
    console.log('首页 V6 patched ✓');
}

function patchHealth() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
    const cssFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.css');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let css = fs.readFileSync(cssFile, 'utf-8');

    html = html.replace(
        /<meta name="viewport"[^>]*>/,
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
    );

    css = css.replace(/\bbackground:\s*linear-gradient\([^)]+\)/g, (match) => {
        const m = /rgba\([^)]+\)(?=\s*\d+(\.\d+)?%\s*\)$)/.exec(match);
        if (m) return 'background-color:' + m[0];
        return 'background-color:rgba(250,251,253,1)';
    });

    const extraCss = BASE_CSS + `
/* ===== 健康管理 V6 根容器 ===== */
.jian_kang_guan_li {
  position: relative !important;
  width: 5rem !important;
  min-height: 10.826667rem !important;
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  background-color: #F4FAF8 !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border-radius: 0.026667rem;
}
.jian_kang_guan_li svg.ju_xing_933_1 path { fill: #F4FAF8 !important; }

/* ===== 健康建议头部 ===== */
.jian_kang_guan_li .Rectangle_3465233_2 { background-color: #2DAE85 !important; border-radius: 0.133333rem 0.133333rem 0 0 !important; }
.jian_kang_guan_li svg.Rectangle_3465233_2 path { fill: #2DAE85 !important; }
.jian_kang_guan_li svg.Polygon_2 path { fill: #19A280 !important; }
.jian_kang_guan_li .shang_chuan_wen_jian_da_yin_1 { color: #FFFFFF !important; font-weight: 700 !important; font-size: 0.24rem !important; }
.jian_kang_guan_li .Rectangle_3465230_1 { background-color: rgba(255,255,255,0.88) !important; border-radius: 0 0 0.133333rem 0.133333rem !important; }
.jian_kang_guan_li .bao_chi_gui_lv_zuo_xi____________________________________________________________ {
  color: #333333 !important; line-height: 1.6 !important; font-size: 0.186667rem !important;
}

/* ===== 头像背景 ===== */
.jian_kang_guan_li .Frame_1739330068_1 { background: #23B357 !important; }
.jian_kang_guan_li .____1 { color: #333333 !important; font-weight: 600 !important; font-size: 0.24rem !important; }

/* ===== 两张方案/评估卡片 ===== */
.jian_kang_guan_li .Rectangle_3465239_3,
.jian_kang_guan_li .Rectangle_3465239_4 {
  background-color: #FFFFFF !important; border-radius: 0.133333rem !important;
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
.jian_kang_guan_li .Vector_175, .jian_kang_guan_li .Vector_181 { background: transparent !important; }
.jian_kang_guan_li .Vector_175 svg path { fill: #0083FF !important; }
.jian_kang_guan_li .Vector_181 svg path { fill: #00C67C !important; }

/* ===== "重要"绿色标签 ===== */
.jian_kang_guan_li .ju_xing_2431,
.jian_kang_guan_li .ju_xing_2431_1 { background-color: #19A280 !important; border-radius: 0 0.133333rem 0.133333rem 0 !important; }
.jian_kang_guan_li .zhong_yao,
.jian_kang_guan_li .zhong_yao_1 { color: #FFFFFF !important; font-size: 0.146667rem !important; font-weight: 600 !important; }

/* ===== 4个2x2网格卡片图标 ===== */
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
.jian_kang_guan_li svg.Vector_221 path, .jian_kang_guan_li svg.Vector_222 path { fill: #1ACF90 !important; }
.jian_kang_guan_li .Vector_223 { background-color: #FFFFFF !important; }
.jian_kang_guan_li svg.Vector_224 path, .jian_kang_guan_li svg.Vector_225 path,
.jian_kang_guan_li svg.Vector_226 path { fill: #FFFFFF !important; }

/* ===== 查看按钮 ===== */
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
  color: #333 !important; font-weight: 600 !important; font-size: 0.2rem !important;
}
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_1,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_2,
.jian_kang_guan_li .cha_kan_ge_ren_jian_kang_xin_xi_3 { color: #7A91A3 !important; }

/* ===== 底部Tab栏 ===== */
.jian_kang_guan_li .zu_45205_1 { background-color: #FFFFFF !important; border-top: 1px solid rgba(0,0,0,0.06); }
.jian_kang_guan_li .Tab_Bar_10, .jian_kang_guan_li .Tab_Bar_12,
.jian_kang_guan_li .Tab_Bar_14, .jian_kang_guan_li .Tab_Bar_16,
.jian_kang_guan_li .Tab_Bar_18 { background-color: #FFFFFF !important; }
.jian_kang_guan_li .____Label_6 { color: #209D87 !important; font-weight: 600 !important; }
.jian_kang_guan_li .____Label_5, .jian_kang_guan_li .____Label_7,
.jian_kang_guan_li .____Label_8, .jian_kang_guan_li .____Label_9 {
  color: #999999 !important; font-weight: 400 !important;
}
.jian_kang_guan_li .Tab_Bar_10 img, .jian_kang_guan_li .Tab_Bar_14 img,
.jian_kang_guan_li .Tab_Bar_16 img, .jian_kang_guan_li .Tab_Bar_18 img { opacity: 0.45; filter: grayscale(70%); }
.jian_kang_guan_li .Tab_Bar_10 svg, .jian_kang_guan_li .Tab_Bar_14 svg,
.jian_kang_guan_li .Tab_Bar_16 svg, .jian_kang_guan_li .Tab_Bar_18 svg { opacity: 0.45; filter: grayscale(70%); }
`;

    html = appendStyle(html, extraCss);
    fs.writeFileSync(htmlFile, html, 'utf-8');
    fs.writeFileSync(cssFile, css, 'utf-8');
    console.log('健康管理 V6 patched ✓');
}

try {
    console.log('=== Patch V6 开始 ===');
    copyAssets();
    patchHome();
    patchHealth();
    console.log('=== Patch V6 完成 ===');
} catch (e) {
    console.error('V6 failed:', e.message, e.stack);
    process.exit(1);
}
