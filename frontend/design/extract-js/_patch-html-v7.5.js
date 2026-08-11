/**
 * Patch V7.5 - 用design目录下的高质量SVG切片替换解析错误的矢量图标
 * 
 * 需要修复：
 * 1) 首页盾牌3D图标(.Simple_3D)：sketch-to-html解析成很多layer SVG path叠加为黑色
 *    → 替换为 <img src="../images/Simple 3D.svg"> 引用MasterGo原始切片
 * 2) 健康管理头像(.Frame_1739330068_1)：解析可能不理想
 *    → 替换为 <img src="../images/Frame 1739330068.svg">
 */
const fs = require('fs');
const path = require('path');

const PAGE_DIR = path.resolve(__dirname, 'output', 'html', 'page-Page_1');

/**
 * 在HTML中找整块div（含任意嵌套），正则匹配其内部从开始标签到匹配结束</div>的全部内容
 * 并将内部内容替换为newInnerHtml（保留外层div的id/class/style和定位）
 */
function replaceInnerContent(html, marker, newInnerHtml) {
    // marker: 比如 class="Simple_3D"
    const attrMatch = /^(\w+)="([^"]+)"$/.exec(marker);
    if (!attrMatch) return html;
    const attrName = attrMatch[1]; // class 或 id
    const attrValue = attrMatch[2];

    // 找到该标签起始位置
    const openRegex = new RegExp(`<div\\s+([^>]*?${attrName}="${attrValue}"[^>]*)>`, 'g');
    let m, lastIdx = -1, attrs = '';
    while ((m = openRegex.exec(html)) !== null) {
        lastIdx = m.index;
        attrs = m[1];
    }
    if (lastIdx < 0) return html;

    // 从lastIdx开始往后寻找匹配的结束</div>
    let i = lastIdx;
    const firstClose = html.indexOf('>', lastIdx);
    if (firstClose < 0) return html;
    let depth = 1;
    i = firstClose + 1;
    const tagRe = /<\/?div[^>]*>/gi;
    tagRe.lastIndex = i;
    let tm, startInner = firstClose + 1, endInner = -1;
    while ((tm = tagRe.exec(html)) !== null) {
        const isClose = tm[0].startsWith('</');
        if (isClose) depth--; else depth++;
        if (depth === 0) {
            endInner = tm.index;
            break;
        }
    }
    if (endInner < 0) return html;

    // 原内部: html.substring(startInner, endInner)
    // 新: newInnerHtml（在外层div里面）
    const openTag = `<div ${attrs}>`;
    const newBlock = openTag + newInnerHtml + '</div>';
    return html.substring(0, lastIdx) + newBlock + html.substring(tm.index + tm[0].length);
}

function patchHomeIcons() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-shou_ye.html');
    let html = fs.readFileSync(htmlFile, 'utf-8');

    // 1) 盾牌3D图标 - Simple_3D
    const shieldImg = `<img src="../images/Simple%203D.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;" />`;
    const newHtml1 = replaceInnerContent(html, `class="Simple_3D"`, shieldImg);
    if (newHtml1 !== html) {
        html = newHtml1;
        console.log('首页盾牌图标 已替换为 Simple 3D.svg ✓');
    } else {
        console.log('警告: 首页盾牌图标未匹配');
    }

    fs.writeFileSync(htmlFile, html, 'utf-8');
}

function patchHealthIcons() {
    const htmlFile = path.join(PAGE_DIR, 'artboard-jian_kang_guan_li.html');
    let html = fs.readFileSync(htmlFile, 'utf-8');

    // 1) 头像: Frame_1739330068_1
    const avatarImg = `<img src="../images/Frame%201739330068.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;" />`;
    const newHtml1 = replaceInnerContent(html, `class="Frame_1739330068_1"`, avatarImg);
    if (newHtml1 !== html) {
        html = newHtml1;
        console.log('健康管理头像 已替换为 Frame 1739330068.svg ✓');
    } else {
        console.log('警告: 健康管理头像未匹配');
    }

    fs.writeFileSync(htmlFile, html, 'utf-8');
}

try {
    console.log('=== Patch V7.5 (切片SVG替换) 开始 ===');
    patchHomeIcons();
    patchHealthIcons();
    console.log('=== Patch V7.5 完成 ===');
} catch (e) {
    console.error('V7.5 失败:', e.message, e.stack);
    process.exit(1);
}
