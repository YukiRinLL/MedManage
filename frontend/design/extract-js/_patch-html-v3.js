/**
 * Patch Script V3 - 精准局部修复
 * 策略：
 * 1. 复制design/首页和健康管理的切片到images
 * 2. 用CSS覆盖追加方式修正颜色（渐变→纯色）、Tab高亮等
 * 3. 精准替换关键失效SVG（只换内部img，不动外层定位容器）
 * 4. 绝不新增结构块，避免布局错位
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
                if (!fs.existsSync(dst)) {
                    fs.copyFileSync(src, dst);
                    console.log('Copied:', f);
                }
            }
        }
    }
}

// ========== 工具：追加全局style到head ==========
function appendStyle(html, cssBlock) {
    const marker = '</head>';
    const styleTag = `<style type="text/css">${cssBlock}</style>`;
    if (html.includes(styleTag)) return html;
    return html.replace(marker, styleTag + marker);
}

// ========== 工具：用正则替换SVG path的fill值 ==========
function fixSvgFill(css, selector, color) {
    // 给指定class的SVG path设置填充色
    const rule = `\n${selector} path { fill: ${color} !important; }\n`;
    return css + rule;
}

// ========== 2. 处理首页 ==========
function patchHome() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-shou_ye.html');
    const cssFile = path.join(PAGE_DIR, 'artboard-shou_ye.css');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let css = fs.readFileSync(cssFile, 'utf-8');

    // ---- 2.1 CSS追加修正（颜色/渐变替换） ----
    let cssAppend = '';

    // 整体背景改为纯色浅绿 #F4FAF8
    cssAppend += `
.shou_ye { background-color: #F4FAF8 !important; }
.shou_ye .ju_xing_933 { background-color: #F4FAF8 !important; }
`;
    // 去掉所有linear-gradient，替换为纯色
    // 底部大卡片渐变替换
    css += css = css.replace(
        /\.shou_ye \.Rectangle_3465233\s*\{[^}]*background:linear-gradient\([^)]+\)[^}]*\}/,
        (match) => match.replace(/background:linear-gradient\([^)]+\)/, 'background-color:rgba(250,251,253,1)')
    );
    // 绿色头部（健康管理提示上方的绿色条）改为纯色 #77EACE 或 #2DAE85
    css = css.replace(
        /fill="rgba\(119,234,206,1\)"/,
        'fill="rgba(45,174,133,1)"'
    );
    // 修正第1天文字颜色 - 已有正确设置
    // 底部Tab Bar：首页选中绿色，其他灰色
    // 首页Tab图标和文字：Tab_Bar_2 / ____Label（注意：需先确认具体class名）
    // 用浏览器分析的class命名模式：第一个Tab是首页

    // ---- 2.2 精准替换失效图标为切片图片 ----
    // 只替换内层内容，保留外层定位容器

    // A. 盾牌3D图标：已经替换成 Group 1000007250@1x.png，检查是否正确显示
    //    如果已有img标签，确保图片引用路径正确
    html = html.replace(
        /src="\.\.\/images\/Group%201000007250%401x\.png"/g,
        `src="../images/${encodeURIComponent('Group 1000007250@1x.png')}"`
    );

    // B. Frame.svg (健康管理提示第一个图标) 替换为真实图片
    // 已有img引用，确保路径正确

    // C. Vector 441 (顶部绿色装饰曲线) - 用CSS给path上色
    // 用SVG fill 修正
    const globalCssFix = `
/* ======= 首页 V3 精准修正 ======= */
.shou_ye { background-color: #F4FAF8 !important; }
.shou_ye .ju_xing_933, 
.shou_ye svg.ju_xing_933 { background-color: #F4FAF8 !important; fill: #F4FAF8 !important; }
.shou_ye svg.ju_xing_933 path { fill: #F4FAF8 !important; }

/* 顶部绿色曲线 Vector_441 上色 */
.shou_ye svg.Vector_441 path { fill: rgba(32,157,135,0.15) !important; }

/* 虚线圆环（待提升指标）修正：用蓝色描边 */
.shou_ye .Frame_1739330128 { background-color: #FFFFFF !important; border-radius: 0.106667rem; }
.shou_ye .Vector_42 { border: none !important; }
.shou_ye svg.Vector_43 path { stroke: #C8EAF8 !important; stroke-width: 2 !important; stroke-dasharray: 4 3 !important; fill: none !important; }
.shou_ye svg.Vector_44 path, .shou_ye svg.Vector_45 path, .shou_ye svg.Vector_46 path,
.shou_ye svg.Vector_47 path, .shou_ye svg.Vector_48 path, .shou_ye svg.Vector_49 path,
.shou_ye svg.Vector_50 path, .shou_ye svg.Vector_51 path, .shou_ye svg.Vector_52 path {
  stroke: #C8EAF8 !important; stroke-width: 2 !important; fill: none !important;
}
/* 圆环刻度点也修正 */
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

/* 底部Tab图标和文字：首页高亮绿色，其他灰色 */
/* 首页Tab（第一个） */
.shou_ye .____Label { color: #209D87 !important; font-weight: 600 !important; }
.shou_ye .Frame_20 img, .shou_ye .Frame_20 svg path, .shou_ye .Frame_20 svg {
  filter: none !important;
}
/* 其他4个Tab灰色 */
.shou_ye .____Label_1, .shou_ye .____Label_2, .shou_ye .____Label_3, .shou_ye .____Label_4 {
  color: #999999 !important; font-weight: 400 !important;
}
.shou_ye .Frame_22, .shou_ye .Frame_24, .shou_ye .Frame_26, .shou_ye .wo_de_2 {
  opacity: 0.5;
  filter: grayscale(100%);
}

/* 健康管理提示卡片背景 */
.shou_ye .Rectangle_3465239, .shou_ye .Rectangle_3465239_1 {
  background-color: #FFFFFF !important; border-radius: 0.106667rem !important;
}
/* 健康管理提示卡片左侧绿色竖条 */
.shou_ye .shang_chuan_wen_jian_da_yin {
  color: #1B715E !important; font-weight: 600 !important;
}
`;

    html = appendStyle(html, globalCssFix);

    // ---- 2.3 修正待提升指标圆环内部文字 ----
    // 如果缺失，插入 (血红蛋白/钾/钠/尿酸 + 待提升指标 查看详情)

    fs.writeFileSync(htmlFile, html, 'utf-8');
    fs.writeFileSync(cssFile, css, 'utf-8');
    console.log('首页 patched ✓');
}

// ========== 3. 处理健康管理页 ==========
function patchHealth() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
    const cssFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.css');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let css = fs.readFileSync(cssFile, 'utf-8');

    // 整体背景修正
    css = css.replace(
        /\.jian_kang_guan_li\s*\{\s*position:absolute;\s*width:5\.000000rem;\s*height:10\.826667rem;\s*opacity:1;\s*background-color:rgba\(244,244,244,1\);/,
        `.jian_kang_guan_li {
position:absolute;
width:5.000000rem;
height:10.826667rem;
opacity:1;
background-color:rgba(244,250,248,1);`
    );
    // 大矩形背景
    css = css.replace(
        /\.jian_kang_guan_li \.ju_xing_933_1\s*\{[^}]*background-color:rgba\(244,244,244,1\);/,
        (m) => m.replace('rgba(244,244,244,1)', 'rgba(244,250,248,1)')
    );
    // 去掉所有linear-gradient替换为纯色
    // Rectangle_3465233_1 (底部大卡片)
    css = css.replace(
        /\.jian_kang_guan_li \.Rectangle_3465233_1\s*\{[^}]*background:linear-gradient\([^)]+\)[^}]*\}/,
        (match) => match.replace(/background:linear-gradient\([^)]+\)/, 'background-color:rgba(250,251,253,1)')
    );
    // Rectangle_3465239_4 (透析评估卡片)
    css = css.replace(
        /\.jian_kang_guan_li \.Rectangle_3465239_4\s*\{[^}]*background:linear-gradient\([^)]+\)[^}]*\}/,
        (match) => match.replace(/background:linear-gradient\([^)]+\)/, 'background-color:rgba(245,255,251,1)')
    );

    // V3 全局CSS修正
    const globalCssFix = `
/* ======= 健康管理 V3 精准修正 ======= */
.jian_kang_guan_li { background-color: #F4FAF8 !important; }
.jian_kang_guan_li svg.ju_xing_933_1 { background-color: #F4FAF8 !important; fill: #F4FAF8 !important; }
.jian_kang_guan_li svg.ju_xing_933_1 path { fill: #F4FAF8 !important; }

/* 健康建议头部绿色背景 */
.jian_kang_guan_li .Rectangle_3465233_2 { background-color: #2DAE85 !important; }
.jian_kang_guan_li svg.Rectangle_3465233_2 path { fill: #2DAE85 !important; }

/* 重要标签背景+文字 */
.jian_kang_guan_li .ju_xing_2431, .jian_kang_guan_li .ju_xing_2431_1 {
  background-color: #19A280 !important; border-radius: 0.04rem;
}
.jian_kang_guan_li .zhong_yao, .jian_kang_guan_li .zhong_yao_1 {
  color: #FFFFFF !important; font-size: 0.146667rem !important; font-weight: 600 !important;
}

/* 卡片图标修正：蓝色文档（健康档案） */
.jian_kang_guan_li .Vector_204 svg path, .jian_kang_guan_li .Vector_205 path,
.jian_kang_guan_li .Vector_206 path, .jian_kang_guan_li .Vector_207 path,
.jian_kang_guan_li .Vector_208 path, .jian_kang_guan_li .Vector_209 path,
.jian_kang_guan_li .Vector_210 path { fill: #379EFF !important; }

/* 红色心脏（生命体征）：已有正确fill */
.jian_kang_guan_li svg.Vector_212 path { fill: #FF373A !important; }

/* 紫色药瓶（用药记录） */
.jian_kang_guan_li .Vector_213 svg path, .jian_kang_guan_li .Vector_214 path,
.jian_kang_guan_li .Vector_215 path, .jian_kang_guan_li .Vector_216 path {
  fill: #DD7AD8 !important;
}
/* 紫色十字（用药记录图标内部十字） */
.jian_kang_guan_li svg.Vector_217 path { fill: #FFFFFF !important; }

/* 绿色图表（核心指标） */
.jian_kang_guan_li .Vector_218 svg path, .jian_kang_guan_li .Vector_219 path,
.jian_kang_guan_li .Vector_220 path, .jian_kang_guan_li .Vector_221 path,
.jian_kang_guan_li .Vector_222 path { fill: #1ACF90 !important; }
.jian_kang_guan_li svg.Vector_224 path, .jian_kang_guan_li svg.Vector_225 path,
.jian_kang_guan_li svg.Vector_226 path { fill: #FFFFFF !important; }

/* 查看按钮样式 */
.jian_kang_guan_li .ju_xing_2432, .jian_kang_guan_li .ju_xing_2432_1,
.jian_kang_guan_li .ju_xing_2432_2, .jian_kang_guan_li .ju_xing_2432_3 {
  background-color: rgba(32,157,135,0.08) !important; border-radius: 0.266667rem;
}
.jian_kang_guan_li .cha_kan, .jian_kang_guan_li .cha_kan_1,
.jian_kang_guan_li .cha_kan_2, .jian_kang_guan_li .cha_kan_3 {
  color: #209D87 !important; font-size: 0.16rem !important; font-weight: 500 !important;
}

/* 底部Tab：健康管理（第2个）高亮绿色，其他灰色 */
.jian_kang_guan_li .____Label_6 { color: #209D87 !important; font-weight: 600 !important; }
.jian_kang_guan_li .____Label_5, .jian_kang_guan_li .____Label_7,
.jian_kang_guan_li .____Label_8, .jian_kang_guan_li .____Label_9 {
  color: #999999 !important; font-weight: 400 !important;
}
.jian_kang_guan_li .Frame_22 { filter: none !important; }
.jian_kang_guan_li .Frame_20, .jian_kang_guan_li .Frame_26,
.jian_kang_guan_li .wo_de_4, .jian_kang_guan_li .wo_de_6 {
  opacity: 0.5; filter: grayscale(100%);
}

/* 顶部Logo区域补色 */
.jian_kang_guan_li .Rectangle_3465233_1_top_space {}

/* 头像背景修正 */
.jian_kang_guan_li .Frame_1739330068_1 { background: linear-gradient(135deg, #23B357 0%, #88D562 100%) !important; }
`;

    html = appendStyle(html, globalCssFix);

    fs.writeFileSync(htmlFile, html, 'utf-8');
    fs.writeFileSync(cssFile, css, 'utf-8');
    console.log('健康管理 patched ✓');
}

// ========== 主流程 ==========
try {
    console.log('=== Patch V3 开始 ===');
    copyAssets();
    patchHome();
    patchHealth();
    console.log('=== Patch V3 完成 ===');
} catch (e) {
    console.error('Patch failed:', e);
    process.exit(1);
}
