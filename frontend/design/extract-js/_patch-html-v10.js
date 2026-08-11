/**
 * Patch V10 - 严格按照设计稿逐像素还原
 * 
 * 核心修复清单:
 * ===== 首页 (shou_ye) =====
 *  H0) rem 基础设置: html { font-size: 75px !important; }  5rem=375px
 *  H1) TabBar 嵌套在 .zu_45205 导致全在 (0,0)
 *      → 将 .zu_45205 设置为 position:static，并强制 5 个 Tab Bar 绝对定位于 .shou_ye 底部
 *  H2) 通知消息: .zu_45205 的内容被 Tab 污染 → 将其内部非通知元素隐藏，并在 .zu_45205 顶部用:before/:after 重建两条通知 + 查看更多
 *  H3) 健康管理提示卡片2闹钟图标: V9 用 zu_45203(0,0空容器) 不对，真正的图标容器是 zu_45201
 *  H4) 待提升指标: Vector_43..Vector_81 全都 w=0,h=0 → 用 SVG 背景图模拟虚线圆环和蓝色进度弧
 *  H5) 盾牌 Simple_3D: 内部残余 SVG 元素叠了纯黑 C 形 → 彻底 Simple_3D 容器内部隐藏，只保留 <img> 替换
 *  H6) Logo/标题区: 补上 "圣通尚诺 For Better Life" Logo 和 "首页" 文字; "第1天" 绿色副标题
 *  H7) 透析排班查询/最新透析状态查询: 两张卡片文字补齐; 水滴/蓝色图表图标用 ::after 定位
 *  H8) 健康管理提示卡片头: Rectangle_3465227 (异形头部 SVG) fill 正确深绿
 *
 * ===== 健康管理 (jian_kang_guan_li) =====
 *  J1) TabBar 嵌套 .zu_45205_1 导致 (0,0) → 强制定位于页面底部
 *  J2) 2x2 四个图标 Vector_204/212/213/Frame_28 全在 (0,0) → 用 ::before 定位到四个卡片右下角
 *  J3) 顶部: 补上 "圣通尚诺" Logo + "健康管理" 标题，大背景纯色淡绿
 *  J4) 头像 Group_1000007195 → Frame 1739330068.svg 正确位置
 *  J5) 指标提升方案/透析评估: 重要标签 + 标题 + 描述补齐
 *  J6) 健康建议头部: 右箭头 绿色 ">" 编辑铅笔用 路径 1.svg
 */
const fs = require('fs');
const path = require('path');

const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');
const IMG_DIR = path.resolve(__dirname, 'output', 'html', 'images');

/* ==================== 通用工具 ==================== */
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

/* ==================== 首页 ==================== */
function patchHome() {
    console.log('\n===== 首页 V10 补丁开始 =====');
    const htmlFile = path.join(PAGE_DIR, 'artboard-shou_ye.html');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let ok = 0;

    /* H0) 注入根级 CSS：rem 基础 + 所有系统性修复 */
    const rootCss = `
/* ============ V10 HOME PATCH (ROOT) ============ */
html { font-size: 75px !important; }
body {
  margin: 0 !important; padding: 30px 0 60px !important;
  background: #e9e9e9 !important;
  min-height: 100vh; display: flex; justify-content: center; align-items: flex-start;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}
.shou_ye {
  position: relative !important;
  width: 5rem !important;        /* 375px */
  min-height: 10.826667rem !important; /* 812px */
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  background-color: #F4FAF8 !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
  border-radius: 2px;
}
/* 去渐变兜底 */
.shou_ye [style*="linear-gradient"],
.shou_ye [class*="ju_xing_933"],
.shou_ye [class*="Rectangle_3465233"] {
  background-image: none !important;
}
/* 顶部大背景 SVG 纯色淡绿 */
.shou_ye svg.ju_xing_933 path,
.shou_ye svg.ju_xing_933 rect,
.shou_ye svg.ju_xing_933 polygon { fill: #F4FAF8 !important; }

/* ============ H6) 顶部 Logo + 标题 + 问候 ============ */
/* Logo 容器 Group_1000007250 用背景图片 */
.shou_ye .Group_1000007250 {
  position: absolute !important;
  left: 0.32rem !important; top: 0.56rem !important;
  width: 1.6rem !important; height: 0.52rem !important;
  background-image: url("../images/Group%201000007250@1x.png") !important;
  background-size: contain !important; background-repeat: no-repeat !important;
  background-position: left center !important;
  z-index: 20 !important;
}
.shou_ye .Group_1000007250 > * { display: none !important; }
/* 顶部 "首页" 文字 一般在 zu_45200 里或它旁边 */
.shou_ye .zu_45200,
.shou_ye [class*="shou_ye_zi"],
.shou_ye .Group_1000007255 > [class*="shou_ye"] {
  position: absolute !important;
  left: 50% !important; transform: translateX(-50%) !important;
  top: 0.56rem !important;
  font-size: 0.24rem !important; font-weight: 600 !important;
  color: #0A2540 !important;
  z-index: 25 !important;
}

/* 问候大标题：为您健康护航 */
.shou_ye .Group_1000007255 > [class*="wei_nin"],
.shou_ye .Group_1000007255 > [class*="Placeholder"],
.shou_ye .____Placeholder {
  position: absolute !important;
  left: 0.4rem !important;
  top: 1.44rem !important;
  font-size: 0.48rem !important;
  font-weight: 800 !important;
  color: #0A2540 !important;
  letter-spacing: -0.008rem !important;
  line-height: 1.15 !important;
  z-index: 15 !important;
  width: auto !important;
  height: auto !important;
  white-space: normal !important;
}
/* 占位符里用 <br> 拆分: "为您健康护航<br>第1天" → "第1天" 段落单独样式 */
.shou_ye .____Placeholder > div,
.shou_ye .____Placeholder > span,
.shou_ye .____Placeholder br {
  /* 子元素如果存在就不要干扰 */
}
/* 直接通过 ::after 追加 "第1天" 绿色大字避免原结构错乱 */
.shou_ye .Group_1000007255::after {
  content: "第1天" !important;
  position: absolute !important;
  left: 0.4rem !important;
  top: 2.68rem !important;
  font-size: 0.4rem !important;
  font-weight: 800 !important;
  color: #9ACD32 !important;   /* 黄绿主色 */
  letter-spacing: -0.005rem !important;
  z-index: 16 !important;
  pointer-events: none !important;
}
/* 原有的 "第1天" 文本节点如果存在就隐藏(通过覆盖容器) */
.shou_ye .Group_1000007255 > [class*="di_"],
.shou_ye .Group_1000007255 > [class*="day"] {
  display: none !important;
}

/* ============ H5) 盾牌 Simple_3D ============ */
.shou_ye .Simple_3D {
  position: absolute !important;
  right: 0.32rem !important;
  top: 1.28rem !important;
  width: 2.4rem !important;
  height: 2.4rem !important;
  z-index: 12 !important;
  overflow: visible !important;
  background-image: url("../images/Simple%203D.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}
.shou_ye .Simple_3D > * { display: none !important; }

/* ============ H8) 健康管理提示头部 异形 SVG fill 深绿 ============ */
.shou_ye svg.Rectangle_3465227 path,
.shou_ye svg.Rectangle_3465227 rect,
.shou_ye svg.Rectangle_3465227 polygon {
  fill: #2DAE85 !important;
}
/* "健康管理提示" */
.shou_ye .shang_chuan_wen_jian_da_yin {
  color: #FFFFFF !important;
  font-weight: 700 !important;
  font-size: 0.24rem !important;
  left: 0.38rem !important;
  top: 2.66rem !important;
  position: absolute !important;
  z-index: 10 !important;
}
/* "快捷管理健康状态" */
.shou_ye .kuai_jie_guan_li_jian_kang_zhuang_tai {
  color: rgba(255,255,255,0.85) !important;
  font-size: 0.18rem !important;
  font-weight: 400 !important;
  position: absolute !important;
  right: 0.38rem !important;
  top: 2.68rem !important;
  z-index: 10 !important;
}
/* 健康管理提示外框 + 圆角 + 阴影 */
.shou_ye .Rectangle_3465230,
.shou_ye .zu_45204 {
  background-color: #FFFFFF !important;
  border-radius: 0.2rem 0.2rem 0.16rem 0.16rem !important;
  box-shadow: 0 2px 14px rgba(13, 66, 49, 0.06) !important;
}
/* 提示卡片背景 */
.shou_ye .Rectangle_3465239,
.shou_ye .Rectangle_3465239_1 {
  background-color: #FFFFFF !important;
  border-radius: 0.14rem !important;
  box-shadow: 0 2px 10px rgba(13, 66, 49, 0.04) !important;
  border: 1px solid rgba(13, 66, 49, 0.05) !important;
}

/* ============ H3) 卡片1绿色文档(zu_45202) + 卡片2蓝色闹钟(zu_45201) ============ */
.shou_ye .zu_45202 {
  background-image: url("../images/Frame.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-color: rgba(45,174,133,0.1) !important;
  border-radius: 0.1rem !important;
  overflow: hidden !important;
}
.shou_ye .zu_45202 > * { display: none !important; }

.shou_ye .zu_45201 {
  background-image: url("../images/Frame-6.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-color: rgba(0,128,255,0.08) !important;
  border-radius: 0.1rem !important;
  overflow: hidden !important;
}
.shou_ye .zu_45201 > * { display: none !important; }

/* 卡片1、2右侧文字 */
.shou_ye .chuan_dan_hua_ce,
.shou_ye .chuan_dan_hua_ce_1 {
  color: #1A2B44 !important;
  font-weight: 600 !important;
  font-size: 0.186667rem !important;
  line-height: 1.35 !important;
}

/* ============ H4) 待提升指标 - 虚线圆环 + 蓝色进度弧 + 4指标 + 标题 ============ */
.shou_ye .Frame_1739330128 {
  background-color: #FFFFFF !important;
  border-radius: 0.14rem !important;
  box-shadow: 0 2px 12px rgba(13, 66, 49, 0.04) !important;
  border: 1px solid rgba(13, 66, 49, 0.05) !important;
  overflow: visible !important;
}
/* 背景 Frame_1739330128_1 作为虚线圆环容器 */
.shou_ye .Frame_1739330128_1 {
  position: absolute !important;
  left: 50% !important; top: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 1.4rem !important; height: 1.4rem !important;
  border: 1px dashed #B9DFF6 !important;
  border-radius: 50% !important;
  background-color: transparent !important;
  box-sizing: border-box !important;
}
/* Vector_42 内部作为蓝色进度弧 + 中心文字容器 */
.shou_ye .Vector_42 {
  position: absolute !important;
  left: 50% !important; top: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 1.1rem !important; height: 1.1rem !important;
  border: none !important;
  background:
    conic-gradient(from -90deg, #2D9CDB 0 62%, rgba(45,156,219,0.1) 62% 100%) !important;
  -webkit-mask: radial-gradient(circle, transparent 56%, #000 58%) !important;
          mask: radial-gradient(circle, transparent 56%, #000 58%) !important;
  border-radius: 50% !important;
  overflow: hidden !important;
}
.shou_ye .Vector_42 > * { display: none !important; }
/* 中心 "待提升指标 / 查看详情" 用 Group_1000007190 > 子 */
.shou_ye .Group_1000007190 {
  position: absolute !important;
  left: 50% !important; top: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 1.4rem !important; height: 1.4rem !important;
  text-align: center !important;
}
/* 找到 "待提升指标" 大字 */
.shou_ye .Group_1000007190 > [class*="dai_ti_sheng_zhi_biao_zi"]:first-of-type,
.shou_ye .Group_1000007190 > [class*="dai_ti_sheng_zhi_biao"][class*="__Label"]:first-of-type {
  position: absolute !important;
  left: 0 !important; right: 0 !important;
  top: 0.48rem !important;
  font-size: 0.2rem !important;
  font-weight: 700 !important;
  color: #1A2B44 !important;
  text-align: center !important;
  transform: none !important;
}
/* "查看详情" */
.shou_ye .Group_1000007190 > [class*="cha_kan_xiang_qing"],
.shou_ye .Group_1000007190 > [class*="__Label"][class*="xiang_qing"] {
  position: absolute !important;
  left: 0 !important; right: 0 !important;
  top: 0.78rem !important;
  font-size: 0.15rem !important;
  color: #2D9CDB !important;
  text-align: center !important;
  transform: none !important;
}
/* 四个指标: 血红蛋白(右上) 钾(右下) 尿酸(左下) 钠(左上) */
/* 血红蛋白 - 右上 */
.shou_ye .Group_1000007190 > [class*="xue_hong_dan_bai"],
.shou_ye .Group_1000007190 > [class*="__Label"][class*="dan_bai"] {
  position: absolute !important;
  right: -0.08rem !important;
  top: 0.08rem !important;
  transform: none !important;
  font-size: 0.16rem !important;
  color: #D94C4C !important;
  font-weight: 600 !important;
}
/* 钾 - 右下 */
.shou_ye .Group_1000007190 > [class*="jia_zi"][class*="__Label"],
.shou_ye .Group_1000007190 > [class*="__Label"][class*="jia_zi"] {
  position: absolute !important;
  right: 0.02rem !important;
  bottom: 0.04rem !important;
  transform: none !important;
  font-size: 0.16rem !important;
  color: #9B59B6 !important;
  font-weight: 600 !important;
}
/* 尿酸 - 左下 */
.shou_ye .Group_1000007190 > [class*="niao_suan"][class*="__Label"],
.shou_ye .Group_1000007190 > [class*="__Label"][class*="niao_suan"] {
  position: absolute !important;
  left: -0.04rem !important;
  bottom: 0.04rem !important;
  transform: none !important;
  font-size: 0.16rem !important;
  color: #F2994A !important;
  font-weight: 600 !important;
}
/* 钠 - 左上 */
.shou_ye .Group_1000007190 > [class*="na_zi"][class*="__Label"],
.shou_ye .Group_1000007190 > [class*="__Label"][class*="na_zi"] {
  position: absolute !important;
  left: -0.06rem !important;
  top: 0.08rem !important;
  transform: none !important;
  font-size: 0.16rem !important;
  color: #2D9CDB !important;
  font-weight: 600 !important;
}
/* 隐藏其他 Vector_43..Vector_81 (全是0尺寸) */
.shou_ye [class*="Vector_43"], .shou_ye [class*="Vector_44"],
.shou_ye [class*="Vector_45"], .shou_ye [class*="Vector_46"],
.shou_ye [class*="Vector_47"], .shou_ye [class*="Vector_48"],
.shou_ye [class*="Vector_49"], .shou_ye [class*="Vector_50"],
.shou_ye [class*="Vector_51"], .shou_ye [class*="Vector_52"],
.shou_ye [class*="Vector_53"], .shou_ye [class*="Vector_54"],
.shou_ye [class*="Vector_55"], .shou_ye [class*="Vector_56"],
.shou_ye [class*="Vector_57"], .shou_ye [class*="Vector_58"],
.shou_ye [class*="Vector_59"], .shou_ye [class*="Vector_60"],
.shou_ye [class*="Vector_61"], .shou_ye [class*="Vector_62"],
.shou_ye [class*="Vector_63"], .shou_ye [class*="Vector_64"],
.shou_ye [class*="Vector_65"], .shou_ye [class*="Vector_66"],
.shou_ye [class*="Vector_67"], .shou_ye [class*="Vector_68"],
.shou_ye [class*="Vector_69"], .shou_ye [class*="Vector_70"],
.shou_ye [class*="Vector_71"], .shou_ye [class*="Vector_72"],
.shou_ye [class*="Vector_73"], .shou_ye [class*="Vector_74"],
.shou_ye [class*="Vector_75"], .shou_ye [class*="Vector_76"],
.shou_ye [class*="Vector_77"], .shou_ye [class*="Vector_78"],
.shou_ye [class*="Vector_79"], .shou_ye [class*="Vector_80"],
.shou_ye [class*="Vector_81"] { display: none !important; }

/* ============ H7) 透析排班查询 + 最新透析状态查询 卡片 ============ */
.shou_ye .Rectangle_3465239_2 {
  background-color: #FFFFFF !important;
  border-radius: 0.14rem !important;
  box-shadow: 0 2px 12px rgba(13, 66, 49, 0.04) !important;
  border: 1px solid rgba(13, 66, 49, 0.05) !important;
  overflow: visible !important;
  position: relative !important;
}
/* 卡片大标题 (如 "透析排班查询") */
.shou_ye [class*="tou_xi_pai_ban_cha_xun"][class*="__Label"],
.shou_ye [class*="Rectangle_3465239_2"] > [class*="__Label"]:first-of-type {
  position: absolute !important;
  left: 0.2rem !important;
  top: 0.16rem !important;
  font-size: 0.2rem !important;
  font-weight: 700 !important;
  color: #1A2B44 !important;
}
/* 副标题 "一键查透析排班" */
.shou_ye [class*="yi_jian_cha_tou_xi_pai_ban"][class*="__Label"],
.shou_ye [class*="Rectangle_3465239_2"] > [class*="__Label"]:nth-of-type(2) {
  position: absolute !important;
  left: 0.2rem !important;
  top: 0.48rem !important;
  font-size: 0.16rem !important;
  color: #7A8BA4 !important;
}
/* 透析排班右下角水滴 */
.shou_ye .Rectangle_3465239_2::after {
  content: "" !important;
  position: absolute !important;
  right: 0.28rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 0.92rem !important; height: 0.92rem !important;
  background-image: url("../images/Rectangle%203463952-2.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}

/* 最新透析状态查询 */
.shou_ye .Rectangle_3465231 {
  background-color: #FFFFFF !important;
  border-radius: 0.14rem !important;
  box-shadow: 0 2px 12px rgba(13, 66, 49, 0.04) !important;
  border: 1px solid rgba(13, 66, 49, 0.05) !important;
  overflow: visible !important;
  position: relative !important;
}
.shou_ye [class*="zui_xin_tou_xi_zhuang_tai_cha_xun"][class*="__Label"],
.shou_ye .Rectangle_3465231 > [class*="__Label"]:first-of-type {
  position: absolute !important;
  left: 0.2rem !important;
  top: 0.16rem !important;
  font-size: 0.2rem !important;
  font-weight: 700 !important;
  color: #1A2B44 !important;
}
.shou_ye [class*="jing_zhun_cha_xun_tou_xi_zhuang_tai"][class*="__Label"],
.shou_ye .Rectangle_3465231 > [class*="__Label"]:nth-of-type(2) {
  position: absolute !important;
  left: 0.2rem !important;
  top: 0.48rem !important;
  font-size: 0.16rem !important;
  color: #7A8BA4 !important;
}
/* 右下角蓝色图表 */
.shou_ye .Rectangle_3465231::after {
  content: "" !important;
  position: absolute !important;
  right: 0.28rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 0.92rem !important; height: 0.92rem !important;
  background-image: url("../images/Rectangle%203463952.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}

/* ============ H1+H2) 通知消息 + Tab Bar (嵌套修复) ============ */
/* 通知容器 zu_45205：设置为普通流容器，但是高度用 padding 撑开承载通知，Tab 独立 absolute 到底部 */
.shou_ye .zu_45205 {
  position: absolute !important;
  left: 0.213333rem !important;
  top: 8.04rem !important;
  width: 4.573333rem !important;
  height: 1.733333rem !important;
  background-color: #FFFFFF !important;
  border-radius: 0.14rem !important;
  box-shadow: 0 2px 12px rgba(13, 66, 49, 0.04) !important;
  overflow: visible !important;
  padding: 0.28rem 0 0.24rem !important;
  box-sizing: border-box !important;
  z-index: 5 !important;
}
/* 清空 .zu_45205 内部所有子元素的背景色 */
.shou_ye .zu_45205 > * { background-color: transparent !important; }

/* 隐藏 Tab Bar 嵌套结构的外层背景 (Tab_Bar~Tab_Bar_9 在 zu_45205 内部的所有视觉样式都作废，重新 absolute 定位到外面) */
.shou_ye .zu_45205 .Tab_Bar,
.shou_ye .zu_45205 .Tab_Bar_1,
.shou_ye .zu_45205 .Tab_Bar_2,
.shou_ye .zu_45205 .Tab_Bar_3,
.shou_ye .zu_45205 .Tab_Bar_4,
.shou_ye .zu_45205 .Tab_Bar_5,
.shou_ye .zu_45205 .Tab_Bar_6,
.shou_ye .zu_45205 .Tab_Bar_7,
.shou_ye .zu_45205 .Tab_Bar_8,
.shou_ye .zu_45205 .Tab_Bar_9 {
  position: absolute !important;
  background-color: transparent !important;
  background-image: none !important;
  opacity: 1 !important;
}
/* 将 Tab Bar 的 10 个元素(5 组 Tab_Bar_X + Tab_Bar_X+1) 整体 absolute 定位到页面底部 */
/* Tab1: 首页 */
.shou_ye .zu_45205 .Tab_Bar { left: 0 !important;  bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
.shou_ye .zu_45205 .Tab_Bar_1 { left: 0 !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
/* Tab2: 健康管理 */
.shou_ye .zu_45205 .Tab_Bar_2 { left: 1rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
.shou_ye .zu_45205 .Tab_Bar_3 { left: 1rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
/* Tab3: 服务中心 */
.shou_ye .zu_45205 .Tab_Bar_4 { left: 2rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
.shou_ye .zu_45205 .Tab_Bar_5 { left: 2rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
/* Tab4: 互动中心 */
.shou_ye .zu_45205 .Tab_Bar_6 { left: 3rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
.shou_ye .zu_45205 .Tab_Bar_7 { left: 3rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
/* Tab5: 我的 */
.shou_ye .zu_45205 .Tab_Bar_8 { left: 4rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
.shou_ye .zu_45205 .Tab_Bar_9 { left: 4rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }

/* 现在 zu_45205 内部除了 Tab，其余是通知内容；用 ::before / ::after + 绝对定位添加通知视觉内容 */
.shou_ye .zu_45205::before {
  content: "" !important;
  position: absolute !important;
  left: 0.2rem !important;
  top: 0.24rem !important;
  width: 0.36rem !important; height: 0.36rem !important;
  background-image: url("../images/Frame%20164073.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
}
.shou_ye .zu_45205::after {
  content: "查看更多 >" !important;
  position: absolute !important;
  right: 0.24rem !important;
  top: 0.26rem !important;
  font-size: 0.16rem !important;
  color: #2D9CDB !important;
  z-index: 6 !important;
}
/* 通知标题 */
.shou_ye [class*="tong_zhi_xiao_xi"],
.shou_ye .zu_45205 > [class*="__Label"]:first-child,
.shou_ye .zu_45205 > [class*="tong_zhi"] {
  position: absolute !important;
  left: 0.68rem !important;
  top: 0.26rem !important;
  font-size: 0.2rem !important;
  font-weight: 700 !important;
  color: #1A2B44 !important;
  width: auto !important;
}
/* 通知 1 / 2 容器: 让已有的文字标签正确定位 (原解析已有 日期 07-27 / 07-26) */
.shou_ye [class*="07_27"],
.shou_ye [class*="__Label"][class*="27_ri"],
.shou_ye [class*="Ellipse_6180"] + [class*="__Label"] {
  position: absolute !important;
  left: 0.68rem !important;
  top: 1.08rem !important;   /* 第1条通知下方日期位置 */
  font-size: 0.14rem !important;
  color: #97A2B5 !important;
}
.shou_ye [class*="07_26"],
.shou_ye [class*="__Label"][class*="26_ri"],
.shou_ye [class*="Ellipse_6182"] + [class*="__Label"] {
  position: absolute !important;
  left: 0.68rem !important;
  top: 1.48rem !important;   /* 第2条通知下方日期位置 */
  font-size: 0.14rem !important;
  color: #97A2B5 !important;
}
/* "查看" 按钮 1/2 */
.shou_ye [class*="cha_kan_1"],
.shou_ye .zu_45205 > [class*="__Label"][class*="cha_kan"] {
  position: absolute !important;
  right: 0.28rem !important;
  top: 1.08rem !important;
  font-size: 0.14rem !important;
  color: #2D9CDB !important;
}
.shou_ye [class*="cha_kan_2"] {
  top: 1.48rem !important;
}
/* 两条通知正文 (长文本) */
.shou_ye [class*="yi_hu_ren_yuan"],
.shou_ye [class*="__Label"][class*="sui_fang"],
.shou_ye [class*="__Label"][class*="shou_ji_chang_kai"] {
  position: absolute !important;
  left: 0.68rem !important;
  right: 0.9rem !important;
  top: 0.82rem !important;
  font-size: 0.15rem !important;
  color: #4A5568 !important;
  line-height: 1.45 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.shou_ye [class*="zhe_shi_tong_zhi_xiao_xi"],
.shou_ye [class*="__Label"][class*="xiao_xi_wei_wen_ben_nei_rong"] {
  position: absolute !important;
  left: 0.68rem !important;
  right: 0.9rem !important;
  top: 1.22rem !important;
  font-size: 0.15rem !important;
  color: #4A5568 !important;
  line-height: 1.45 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
/* 时钟小图标 Ellipse_6180/6181/6182 放到日期左侧 */
.shou_ye .zu_45205 .Ellipse_6180,
.shou_ye .zu_45205 .Ellipse_6181,
.shou_ye .zu_45205 .Ellipse_6182 {
  position: absolute !important;
  left: 0.44rem !important;
  width: 0.2rem !important; height: 0.2rem !important;
  background-image: url("../images/%E8%B7%AF%E5%BE%84.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  opacity: 0.7 !important;
}
.shou_ye .zu_45205 .Ellipse_6180 { top: 1.08rem !important; }
.shou_ye .zu_45205 .Ellipse_6181 { display: none !important; }
.shou_ye .zu_45205 .Ellipse_6182 { top: 1.48rem !important; }
.shou_ye .zu_45205 .Ellipse_6180 > *,
.shou_ye .zu_45205 .Ellipse_6182 > * { display: none !important; }

/* ============ 底部 Tab 背景 + 图标替换 (V9 逻辑加强 + 位置兜底) ============ */
.shou_ye .zu_45205 {
  /* Tab 背景区域应该扩展到页面最底部 0.773333rem 高度 */
  padding-bottom: 1.0rem !important;
}
.shou_ye .zu_45205::before { z-index: 7 !important; }
.shou_ye .zu_45205::after  { z-index: 7 !important; }
/* 给 Tab 加白色背景底板 (最底部 0.773333rem) */
.shou_ye .zu_45205 {
  background: linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF calc(100% - 0.773333rem), #FFFFFF calc(100% - 0.773333rem), #FFFFFF 100%) !important;
  background-image: none !important;
  background-color: #FFFFFF !important;
}
.shou_ye .zu_45205::before { /* 防止前面的 ::before 被 background 覆盖 */ }
/* 增加一个 Tab 底板 via CSS */
.shou_ye > [class*="Tab_Bar_Bottom_Bg"] { /* not in use yet */ }

/* 五个 Tab 图标 (V9 逻辑加强) */
/* Tab1: 首页 - 绿色房子 */
.shou_ye .zu_45205 .Tab_Bar .Frame_6,
.shou_ye .zu_45205 .Tab_Bar_1 .Frame_6 {
  position: absolute !important;
  left: 50% !important; transform: translateX(-50%) !important;
  top: 0.1rem !important;
  width: 0.4rem !important; height: 0.4rem !important;
  background-image: url("../images/Vector.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
}
.shou_ye .zu_45205 .Tab_Bar .Frame_6 > *,
.shou_ye .zu_45205 .Tab_Bar_1 .Frame_6 > * { display: none !important; }
/* Tab1 label "首页" 绿色 */
.shou_ye .zu_45205 .Tab_Bar .____Label,
.shou_ye .zu_45205 .Tab_Bar_1 .____Label {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  bottom: 0.08rem !important;
  font-size: 0.14rem !important;
  color: #2DAE85 !important;
  font-weight: 600 !important;
}

/* Tab2: 健康管理 - 灰色矩形 2431-2 */
.shou_ye .zu_45205 .Tab_Bar_2 .Frame_8,
.shou_ye .zu_45205 .Tab_Bar_3 .Frame_8 {
  position: absolute !important;
  left: 50% !important; transform: translateX(-50%) !important;
  top: 0.1rem !important;
  width: 0.4rem !important; height: 0.4rem !important;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202431-2.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  opacity: 0.55 !important;
}
.shou_ye .zu_45205 .Tab_Bar_2 .Frame_8 > *,
.shou_ye .zu_45205 .Tab_Bar_3 .Frame_8 > * { display: none !important; }
.shou_ye .zu_45205 .Tab_Bar_2 .____Label_1,
.shou_ye .zu_45205 .Tab_Bar_3 .____Label_1 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  bottom: 0.08rem !important;
  font-size: 0.14rem !important;
  color: #97A2B5 !important;
  font-weight: 500 !important;
}

/* Tab3: 服务中心 - 灰色人形 我的.svg */
.shou_ye .zu_45205 .Tab_Bar_4 .Frame_28,
.shou_ye .zu_45205 .Tab_Bar_5 .Frame_28 {
  position: absolute !important;
  left: 50% !important; transform: translateX(-50%) !important;
  top: 0.1rem !important;
  width: 0.4rem !important; height: 0.4rem !important;
  background-image: url("../images/%E6%88%91%E7%9A%84.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  opacity: 0.55 !important;
}
.shou_ye .zu_45205 .Tab_Bar_4 .Frame_28 > *,
.shou_ye .zu_45205 .Tab_Bar_5 .Frame_28 > * { display: none !important; }
.shou_ye .zu_45205 .Tab_Bar_4 .____Label_2,
.shou_ye .zu_45205 .Tab_Bar_5 .____Label_2 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  bottom: 0.08rem !important;
  font-size: 0.14rem !important;
  color: #97A2B5 !important;
  font-weight: 500 !important;
}

/* Tab4: 互动中心 - 旗帜 Vector-2.svg 灰色 */
.shou_ye .zu_45205 .Tab_Bar_6 .Frame_32,
.shou_ye .zu_45205 .Tab_Bar_7 .Frame_32 {
  position: absolute !important;
  left: 50% !important; transform: translateX(-50%) !important;
  top: 0.1rem !important;
  width: 0.4rem !important; height: 0.4rem !important;
  background-image: url("../images/Vector-2.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  opacity: 0.55 !important;
}
.shou_ye .zu_45205 .Tab_Bar_6 .Frame_32 > *,
.shou_ye .zu_45205 .Tab_Bar_7 .Frame_32 > * { display: none !important; }
.shou_ye .zu_45205 .Tab_Bar_6 .____Label_3,
.shou_ye .zu_45205 .Tab_Bar_7 .____Label_3 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  bottom: 0.08rem !important;
  font-size: 0.14rem !important;
  color: #97A2B5 !important;
  font-weight: 500 !important;
}

/* Tab5: 我的 - 我的-2.svg 灰色 */
.shou_ye .zu_45205 .Tab_Bar_8 .Frame_36,
.shou_ye .zu_45205 .Tab_Bar_9 .Frame_36 {
  position: absolute !important;
  left: 50% !important; transform: translateX(-50%) !important;
  top: 0.1rem !important;
  width: 0.4rem !important; height: 0.4rem !important;
  background-image: url("../images/%E6%88%91%E7%9A%84-2.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  opacity: 0.55 !important;
}
.shou_ye .zu_45205 .Tab_Bar_8 .Frame_36 > *,
.shou_ye .zu_45205 .Tab_Bar_9 .Frame_36 > * { display: none !important; }
.shou_ye .zu_45205 .Tab_Bar_8 .____Label_4,
.shou_ye .zu_45205 .Tab_Bar_9 .____Label_4 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  bottom: 0.08rem !important;
  font-size: 0.14rem !important;
  color: #97A2B5 !important;
  font-weight: 500 !important;
}
/* Tab 通用: 隐藏内部无用的 Frame_10000067* 等装饰元素 */
.shou_ye .zu_45205 [class*="Frame_100000673"] {
  background-color: transparent !important; background-image: none !important; opacity: 1 !important;
}
.shou_ye .zu_45205 [class*="Frame_100000673"] > * { opacity: 0 !important; visibility: hidden !important; }
.shou_ye .zu_45205 .Frame_6, .shou_ye .zu_45205 .Frame_8,
.shou_ye .zu_45205 .Frame_28, .shou_ye .zu_45205 .Frame_32,
.shou_ye .zu_45205 .Frame_36,
.shou_ye .zu_45205 [class*="____Label"] { opacity: 1 !important; visibility: visible !important; }

/* ============ 日期左侧时钟 (可能在 Rectangle_3465239 / 通知外层) ============ */
.shou_ye .Ellipse_6178, .shou_ye .Ellipse_6179,
.shou_ye .Ellipse_6180, .shou_ye .Ellipse_6181, .shou_ye .Ellipse_6182 {
  /* 只保留通知里的时钟样式 (上方已设置) */
}
.shou_ye .ju_xing_2424 {
  /* 顶部导航栏 小黑条 隐藏 */
  display: none !important;
}

/* ============ 右上角装饰曲线 ============ */
.shou_ye svg.Vector_441 {
  opacity: 0.35 !important;
}
`;

    /* 把 rootCss 注入到 style 块中 */
    const marker = '/* 兜底空fill */\n.shou_ye svg path[fill=""],';
    if (html.indexOf(marker) >= 0) {
        html = html.replace(marker, rootCss + '\n' + marker);
    } else {
        // fallback: 在第一个 <style> 尾部追加
        const styleEnd = html.indexOf('</style>');
        if (styleEnd >= 0) {
            html = html.substring(0, styleEnd) + '\n' + rootCss + '\n' + html.substring(styleEnd);
        }
    }
    ok++;
    console.log('H-ROOT 系统级CSS注入 ✓');

    /* H5) 盾牌 Simple_3D: 用 <img> 彻底替换内部所有内容 */
    {
        const inner = `<img src="../images/Simple%203D.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;" />`;
        const nh = replaceInnerContent(html, `class="Simple_3D"`, inner);
        if (nh !== html) { html = nh; ok++; console.log('H5 盾牌图标 ✓'); }
    }

    /* H3 补充: zu_45201 内部也用 img 替换 闹钟 Frame-6.svg */
    {
        const inner = `<img src="../images/Frame-6.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;" />`;
        const nh = replaceInnerContent(html, `class="zu_45201"`, inner);
        if (nh !== html) { html = nh; ok++; console.log('H3 提示卡片2(闹钟)图标替换 ✓'); }
    }

    /* H3 补充: zu_45202 内部用 img 替换 Frame.svg (绿色文档) */
    {
        const inner = `<img src="../images/Frame.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;" />`;
        const nh = replaceInnerContent(html, `class="zu_45202"`, inner);
        if (nh !== html) { html = nh; ok++; console.log('H3 提示卡片1(绿色文档)图标替换 ✓'); }
    }

    /* H5 补充: image_2875 铃铛通知标题左侧 图标 */
    {
        const inner = `<img src="../images/Frame%20164073.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;" />`;
        const nh = replaceInnerContent(html, `class="image_2875"`, inner);
        if (nh !== html) { html = nh; ok++; console.log('H2 通知消息铃铛图标替换 ✓'); }
    }

    fs.writeFileSync(htmlFile, html, 'utf-8');
    console.log(`首页V10补丁完成 成功${ok}项 ✓`);
}

/* ==================== 健康管理 ==================== */
function patchHealth() {
    console.log('\n===== 健康管理 V10 补丁开始 =====');
    const htmlFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
    let html = fs.readFileSync(htmlFile, 'utf-8');
    let ok = 0;

    const rootCss = `
/* ============ V10 HEALTH PATCH (ROOT) ============ */
html { font-size: 75px !important; }
.jian_kang_guan_li {
  position: relative !important;
  width: 5.026667rem !important;
  min-height: 10.826667rem !important;
  height: auto !important;
  margin: 0 auto !important;
  overflow: hidden !important;
  background-color: #F4FAF8 !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
  border-radius: 2px;
}
.jian_kang_guan_li [style*="linear-gradient"] { background-image: none !important; }
.jian_kang_guan_li svg.Rectangle_3465233_1 path,
.jian_kang_guan_li svg.Rectangle_3465233_2 path,
.jian_kang_guan_li svg.Rectangle_3465233_1 rect,
.jian_kang_guan_li svg.Rectangle_3465233_2 rect,
.jian_kang_guan_li svg.ju_xing_933_1 path,
.jian_kang_guan_li svg.ju_xing_933_1 rect {
  fill: #F4FAF8 !important;
}

/* ============ J3) 顶部 Logo + 健康管理标题 ============ */
/* 顶部空容器: w=240 h=48 t=16 l=24 */
.jian_kang_guan_li > [class=""][style*="width: 240px"],
.jian_kang_guan_li > [class=""][style*="width:240px"] {
  position: absolute !important;
  left: 0.32rem !important; top: 0.22rem !important;
  width: 3.2rem !important; height: 0.64rem !important;
  background-image: url("../images/Group%201000007250@1x.png") !important;
  background-size: auto 0.52rem !important; background-repeat: no-repeat !important;
  background-position: left center !important;
  z-index: 30 !important;
}
/* "健康管理" 标题居中 */
.jian_kang_guan_li > [class*="jian_kang_guan_li_zi"]:not(.jian_kang_guan_li),
.jian_kang_guan_li > [class*="__Label"][class*="jian_kang_guan_li"] {
  position: absolute !important;
  left: 50% !important; transform: translateX(-50%) !important;
  top: 0.56rem !important;
  font-size: 0.24rem !important; font-weight: 600 !important;
  color: #0A2540 !important;
  z-index: 32 !important;
}

/* ============ J4) 头像 + 问候语 ============ */
.jian_kang_guan_li .Group_1000007195 {
  position: absolute !important;
  left: 0.26rem !important;
  top: 1.48rem !important;
  width: 0.62rem !important; height: 0.62rem !important;
  border-radius: 50% !important;
  background-image: url("../images/Frame%201739330068.svg") !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  z-index: 20 !important;
  overflow: hidden !important;
  box-shadow: 0 2px 8px rgba(45,174,133,0.25) !important;
  border: 2px solid #FFFFFF !important;
}
.jian_kang_guan_li .Group_1000007195 > * { display: none !important; }
/* 问候语 */
.jian_kang_guan_li .____1 {
  position: absolute !important;
  left: 1.08rem !important;
  top: 1.62rem !important;
  font-size: 0.26rem !important;
  font-weight: 700 !important;
  color: #0A2540 !important;
  width: auto !important;
  height: auto !important;
}

/* ============ J6) 健康建议头部 ============ */
.jian_kang_guan_li svg.Rectangle_3465230_1 path,
.jian_kang_guan_li svg.Rectangle_3465230_1 rect,
.jian_kang_guan_li svg.Rectangle_3465230_1 polygon,
.jian_kang_guan_li svg.Rectangle_3465233 path,
.jian_kang_guan_li svg.Rectangle_3465233 rect,
.jian_kang_guan_li svg.Rectangle_3465233 polygon {
  fill: #2DAE85 !important;
}
/* 中央凹形装饰 Polygon_2 */
.jian_kang_guan_li svg.Polygon_2 path,
.jian_kang_guan_li svg.Polygon_2 polygon {
  fill: #F4FAF8 !important;   /* 与页面背景同色，做凹形效果 */
}
/* 编辑铅笔 (右上角) */
.jian_kang_guan_li .Vector_170 {
  background-image: url("../images/%E8%B7%AF%E5%BE%84%201.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  filter: invert(1) brightness(2) !important;  /* 转白色 */
}
.jian_kang_guan_li .Vector_170 > * { display: none !important; }
/* "健康建议" 文字标签 */
.jian_kang_guan_li .shang_chuan_wen_jian_da_yin_1 {
  position: absolute !important;
  left: 0.38rem !important;
  top: 2.56rem !important;
  color: #FFFFFF !important;
  font-size: 0.24rem !important;
  font-weight: 700 !important;
  z-index: 10 !important;
}
/* 健康建议正文 (引号段落) */
.jian_kang_guan_li .bao_chi_gui_lv_zuo_xi____________________________________________________________ {
  position: absolute !important;
  left: 0.36rem !important;
  right: 0.36rem !important;
  top: 3.16rem !important;
  font-size: 0.18rem !important;
  line-height: 1.7 !important;
  color: #4A5568 !important;
}
/* 健康建议外框背景 */
.jian_kang_guan_li .Rectangle_3465230_1 {
  background-color: #FFFFFF !important;
  border-radius: 0.14rem !important;
  box-shadow: 0 2px 12px rgba(13, 66, 49, 0.04) !important;
  overflow: visible !important;
}

/* ============ J5) 指标提升方案 / 透析评估 ============ */
/* 卡片容器 */
.jian_kang_guan_li .Rectangle_3465239_3,
.jian_kang_guan_li .Rectangle_3465239_4,
.jian_kang_guan_li [class*="Rectangle_3465239"]:not(.Rectangle_3465239_1):not(.Rectangle_3465239_2):not(.Rectangle_3465239_5):not(.Rectangle_3465239_6):not(.Rectangle_3465239_7):not(.Rectangle_3465239_8) {
  background-color: #FFFFFF !important;
  border-radius: 0.14rem !important;
  box-shadow: 0 2px 12px rgba(13, 66, 49, 0.04) !important;
  border: 1px solid rgba(13, 66, 49, 0.05) !important;
  position: relative !important;
  overflow: visible !important;
}
/* 指标提升 蓝色圆 Vector_175 */
.jian_kang_guan_li .Vector_175 {
  background-image: url("../images/Group%201000007254.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-color: transparent !important;
}
.jian_kang_guan_li .Vector_175 > * { display: none !important; }
/* 透析评估 绿色文件 Vector_181 */
.jian_kang_guan_li .Vector_181 {
  background-image: url("../images/Group%201000007257.svg") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-color: transparent !important;
}
.jian_kang_guan_li .Vector_181 > * { display: none !important; }
/* "重要" 绿色标签 (zhong_yao 相关类) */
.jian_kang_guan_li [class*="zhong_yao"] {
  display: inline-block !important;
  background-color: #2DAE85 !important;
  color: #FFFFFF !important;
  font-size: 0.13rem !important;
  padding: 0.03rem 0.1rem !important;
  border-radius: 0.04rem !important;
  font-weight: 600 !important;
}
/* 指标提升方案 - 标题文字 */
.jian_kang_guan_li [class*="zhi_biao_ti_sheng_fang_an"][class*="__Label"],
.jian_kang_guan_li .Rectangle_3465239_3 > [class*="__Label"]:first-of-type {
  position: absolute !important;
  left: 0.72rem !important;
  top: 0.16rem !important;
  font-size: 0.2rem !important;
  font-weight: 700 !important;
  color: #1A2B44 !important;
}
/* 指标提升方案 - 描述文字 */
.jian_kang_guan_li .ge_xing_hua_gan_yu_fang_an_zhen_dui_xing_gai_shan_jian_kang_zhi_biao,
.jian_kang_guan_li .Rectangle_3465239_3 > [class*="__Label"]:nth-of-type(2) {
  position: absolute !important;
  left: 0.36rem !important;
  right: 0.16rem !important;
  bottom: 0.14rem !important;
  font-size: 0.15rem !important;
  color: #7A8BA4 !important;
  line-height: 1.45 !important;
}

/* 透析评估 - 标题 */
.jian_kang_guan_li [class*="tou_xi_ping_gu"][class*="__Label"] {
  position: absolute !important;
  left: 0.72rem !important;   /* 右边卡片内的相对位置：Vector_181 l=204px ≈ 0.27rem 相对于父 */
  top: 0.16rem !important;
  font-size: 0.2rem !important;
  font-weight: 700 !important;
  color: #1A2B44 !important;
}
/* 透析评估 - 描述 */
.jian_kang_guan_li [class*="fan_kui_dang_tian_tou_xi_qing_kuang"] {
  position: absolute !important;
  left: 0.36rem !important;
  right: 0.16rem !important;
  bottom: 0.14rem !important;
  font-size: 0.15rem !important;
  color: #7A8BA4 !important;
  line-height: 1.45 !important;
}

/* ============ J2) 2x2 四个功能卡片 + 图标定位 ============ */
/* 四张卡片背景 + 通用 */
.jian_kang_guan_li .Rectangle_3465239_5,
.jian_kang_guan_li .Rectangle_3465239_6,
.jian_kang_guan_li .Rectangle_3465239_7,
.jian_kang_guan_li .Rectangle_3465239_8 {
  background-color: #FFFFFF !important;
  border-radius: 0.14rem !important;
  box-shadow: 0 2px 12px rgba(13, 66, 49, 0.04) !important;
  border: 1px solid rgba(13, 66, 49, 0.05) !important;
  position: relative !important;
  overflow: visible !important;
}
/* 卡片标题 */
.jian_kang_guan_li [class*="jian_kang_dang_an"][class*="__Label"],
.jian_kang_guan_li [class*="sheng_ming_ti_zheng"][class*="__Label"],
.jian_kang_guan_li [class*="yong_yao_ji_lu"][class*="__Label"],
.jian_kang_guan_li [class*="he_xin_zhi_biao"][class*="__Label"] {
  position: absolute !important;
  left: 0.24rem !important;
  top: 0.22rem !important;
  font-size: 0.2rem !important;
  font-weight: 700 !important;
  color: #1A2B44 !important;
}
/* 卡片描述 */
.jian_kang_guan_li [class*="cha_kan_ge_ren_jian_kang_xin_xi"],
.jian_kang_guan_li [class*="ji_lu_ti_wen_xue_ya_xue_tang"],
.jian_kang_guan_li [class*="guan_li_mei_ri_yong_yao_ti_xing"],
.jian_kang_guan_li [class*="cha_xue_zhi_biao_qu_shi_zhui_zong"] {
  position: absolute !important;
  left: 0.24rem !important;
  top: 0.56rem !important;
  font-size: 0.15rem !important;
  color: #7A8BA4 !important;
}
/* "查看" 按钮 */
.jian_kang_guan_li [class*="Rectangle_3465239_5"] > [class*="__Label"][class*="cha_kan"],
.jian_kang_guan_li [class*="Rectangle_3465239_6"] > [class*="__Label"][class*="cha_kan"],
.jian_kang_guan_li [class*="Rectangle_3465239_7"] > [class*="__Label"][class*="cha_kan"],
.jian_kang_guan_li [class*="Rectangle_3465239_8"] > [class*="__Label"][class*="cha_kan"],
.jian_kang_guan_li [class*="cha_kan_"]:not([class*="xiang_qing"]) {
  position: absolute !important;
  left: 0.24rem !important;
  bottom: 0.18rem !important;
  font-size: 0.15rem !important;
  color: #2DAE85 !important;
  font-weight: 600 !important;
  padding: 0.04rem 0.18rem !important;
  background-color: rgba(45,174,133,0.08) !important;
  border-radius: 0.2rem !important;
}

/* 四个图标 (右下角) */
/* 健康档案 - 蓝色档案夹 矩形2432-2.svg (Vector_204) */
.jian_kang_guan_li .Vector_204 {
  position: absolute !important;
  right: 0.22rem !important;
  bottom: 0.16rem !important;
  left: auto !important; top: auto !important;
  width: 0.56rem !important; height: 0.56rem !important;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202432-2.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  background-color: transparent !important;
}
.jian_kang_guan_li .Vector_204 > * { display: none !important; }

/* 生命体征 - 红色心形 矩形2432.svg (Vector_212) */
.jian_kang_guan_li .Vector_212 {
  position: absolute !important;
  right: 0.22rem !important;
  bottom: 0.16rem !important;
  left: auto !important; top: auto !important;
  width: 0.56rem !important; height: 0.56rem !important;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202432.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  background-color: transparent !important;
  overflow: visible !important;
}
.jian_kang_guan_li .Vector_212 > * { display: none !important; }

/* 用药记录 - 粉色药盒 矩形2432-4.svg (Vector_213) */
.jian_kang_guan_li .Vector_213 {
  position: absolute !important;
  right: 0.22rem !important;
  bottom: 0.16rem !important;
  left: auto !important; top: auto !important;
  width: 0.56rem !important; height: 0.56rem !important;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202432-4.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  background-color: transparent !important;
}
.jian_kang_guan_li .Vector_213 > * { display: none !important; }

/* 核心指标 - 绿色柱状 矩形2432-3.svg (Frame_28 右下) */
.jian_kang_guan_li .Frame_28 {
  position: absolute !important;
  right: 0.22rem !important;
  bottom: 0.16rem !important;
  left: auto !important; top: auto !important;
  width: 0.56rem !important; height: 0.56rem !important;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202432-3.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  background-color: transparent !important;
}
.jian_kang_guan_li .Frame_28 > * { display: none !important; }

/* ============ J1) Tab Bar 修复 (.zu_45205_1 容器内嵌套) ============ */
.jian_kang_guan_li .zu_45205_1 {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 0.773333rem !important;
  background-color: #FFFFFF !important;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.04) !important;
}
/* 所有子元素透明背景 */
.jian_kang_guan_li .zu_45205_1 > * { background-color: transparent !important; }

/* 5 组 Tab，水平排列 1rem 每个 */
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_10,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_11 { left: 0 !important;   bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_12,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_13 { left: 1rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_14,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_15 { left: 2rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_16,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_17 { left: 3rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_18,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_19 { left: 4rem !important; bottom: 0 !important; top: auto !important; width: 1rem !important; height: 0.773333rem !important; }

/* Tab 图标 */
/* Tab1 首页 - 灰色房子 Vector.svg */
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_10 .Frame_6,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_11 .Frame_6 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  top: 0.1rem !important; width: 0.4rem !important; height: 0.4rem !important;
  background-image: url("../images/Vector.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  opacity: 0.55 !important;
}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_10 .Frame_6 > *,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_11 .Frame_6 > * { display: none !important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_10 .____Label_5,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_11 .____Label_5 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  bottom: 0.08rem !important;
  font-size: 0.14rem !important; color: #97A2B5 !important; font-weight: 500 !important;
}

/* Tab2 健康管理 - 绿色选中 矩形2431.svg */
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_12 .Frame_8,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_13 .Frame_8 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  top: 0.1rem !important; width: 0.4rem !important; height: 0.4rem !important;
  background-image: url("../images/%E7%9F%A9%E5%BD%A2%202431.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_12 .Frame_8 > *,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_13 .Frame_8 > * { display: none !important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_12 .____Label_6,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_13 .____Label_6 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  bottom: 0.08rem !important;
  font-size: 0.14rem !important; color: #2DAE85 !important; font-weight: 600 !important;
}

/* Tab3 服务中心 - 灰色人形 我的.svg */
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_14 .Frame_28,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_15 .Frame_28 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  top: 0.1rem !important; width: 0.4rem !important; height: 0.4rem !important;
  background-image: url("../images/%E6%88%91%E7%9A%84.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  opacity: 0.55 !important;
}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_14 .Frame_28 > *,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_15 .Frame_28 > * { display: none !important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_14 .____Label_7,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_15 .____Label_7 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  bottom: 0.08rem !important;
  font-size: 0.14rem !important; color: #97A2B5 !important; font-weight: 500 !important;
}

/* Tab4 互动中心 - 旗帜 Vector-2.svg 灰色 */
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_16 .Frame_32,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_17 .Frame_32 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  top: 0.1rem !important; width: 0.4rem !important; height: 0.4rem !important;
  background-image: url("../images/Vector-2.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  opacity: 0.55 !important;
}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_16 .Frame_32 > *,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_17 .Frame_32 > * { display: none !important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_16 .____Label_8,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_17 .____Label_8 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  bottom: 0.08rem !important;
  font-size: 0.14rem !important; color: #97A2B5 !important; font-weight: 500 !important;
}

/* Tab5 我的 - 灰色 我的-2.svg */
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_18 .Frame_36,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_19 .Frame_36 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  top: 0.1rem !important; width: 0.4rem !important; height: 0.4rem !important;
  background-image: url("../images/%E6%88%91%E7%9A%84-2.svg") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  opacity: 0.55 !important;
}
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_18 .Frame_36 > *,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_19 .Frame_36 > * { display: none !important; }
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_18 .____Label_9,
.jian_kang_guan_li .zu_45205_1 .Tab_Bar_19 .____Label_9 {
  position: absolute !important; left: 50% !important; transform: translateX(-50%) !important;
  bottom: 0.08rem !important;
  font-size: 0.14rem !important; color: #97A2B5 !important; font-weight: 500 !important;
}

/* Tab 通用隐藏 */
.jian_kang_guan_li .zu_45205_1 [class*="Frame_100000673"] {
  background-color: transparent !important; background-image: none !important;
}
.jian_kang_guan_li .zu_45205_1 [class*="Frame_100000673"] > * { opacity: 0 !important; visibility: hidden !important; }
.jian_kang_guan_li .zu_45205_1 .Frame_6, .jian_kang_guan_li .zu_45205_1 .Frame_8,
.jian_kang_guan_li .zu_45205_1 .Frame_28, .jian_kang_guan_li .zu_45205_1 .Frame_32,
.jian_kang_guan_li .zu_45205_1 .Frame_36,
.jian_kang_guan_li .zu_45205_1 [class*="____Label"] { opacity: 1 !important; visibility: visible !important; }

/* 右上导航三个点隐藏 (ju_xing_2424 顶部黑条) */
.jian_kang_guan_li .ju_xing_2424_1 { display: none !important; }
`;

    const marker = '/* 兜底空fill */\n.jian_kang_guan_li svg path[fill=""],';
    if (html.indexOf(marker) >= 0) {
        html = html.replace(marker, rootCss + '\n' + marker);
    } else {
        const styleEnd = html.indexOf('</style>');
        if (styleEnd >= 0) {
            html = html.substring(0, styleEnd) + '\n' + rootCss + '\n' + html.substring(styleEnd);
        }
    }
    ok++;
    console.log('J-ROOT 系统级CSS注入 ✓');

    /* H2 铅笔 Vector_170 内容替换 */
    {
        const inner = `<img src="../images/%E8%B7%AF%E5%BE%84%201.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;filter:invert(1) brightness(2);" />`;
        const nh = replaceInnerContent(html, `class="Vector_170"`, inner);
        if (nh !== html) { html = nh; ok++; console.log('J6 编辑铅笔图标替换 ✓'); }
    }

    /* J4 头像内容替换 */
    {
        const inner = `<img src="../images/Frame%201739330068.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;" />`;
        const nh = replaceInnerContent(html, `class="Group_1000007195"`, inner);
        if (nh !== html) { html = nh; ok++; console.log('J4 头像SVG替换 ✓'); }
    }

    fs.writeFileSync(htmlFile, html, 'utf-8');
    console.log(`健康管理V10补丁完成 成功${ok}项 ✓`);
}

/* ==================== 执行 ==================== */
try {
    console.log('=== V10 终极补丁开始 ===');
    patchHome();
    patchHealth();
    console.log('=== V10 全部完成 ===\n');
} catch (e) {
    console.error('V10 失败:', e.message);
    console.error(e.stack);
    process.exit(1);
}
