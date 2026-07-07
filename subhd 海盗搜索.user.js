// ==UserScript==
// @name         subhd 海盗搜索
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  在 subhd.tv 页面选中文本时，自动弹出”海盗搜索”菜单跳转 piratebay
// @match        https://subhd.tv/*
// @grant        GM_openInTab
// @license MIT
// ==/UserScript==

(function () {
    'use strict';

    // ===== 创建自定义右键菜单 =====
    const menu = document.createElement("div");
    menu.id = "pirate-search-menu";
    menu.innerText = "🏴‍☠️ 海盗搜索";
    document.body.appendChild(menu);

    // ===== 菜单样式 =====
    const style = document.createElement("style");
    style.innerHTML = `
        #pirate-search-menu {
            position: fixed;
            z-index: 999999;
            background: #ffffff;
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 8px 14px;
            font-size: 14px;
            color: #333;
            cursor: pointer;
            display: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            user-select: none;
        }
        #pirate-search-menu:hover {
            background: #1677ff;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // ===== 选中文本事件 =====
    document.addEventListener("mouseup", function (e) {
        // 延迟一点获取选中文本，确保选中操作完成
        setTimeout(() => {
            const text = window.getSelection().toString().trim();

            if (text.length > 0) {
                // 不阻止默认行为，保留正常右键菜单

                menu.style.left = e.clientX + "px";
                menu.style.top = e.clientY + "px";
                menu.style.display = "block";
                menu.dataset.text = text;
            } else {
                menu.style.display = "none";
            }
        }, 10);
    });

    // ===== 点击菜单 =====
    menu.addEventListener("click", function () {
        const text = menu.dataset.text;
        if (!text) return;

        const url = "https://piratebay.live/search/" + encodeURIComponent(text);
        GM_openInTab(url, { active: true });

        menu.style.display = "none";
        window.getSelection().removeAllRanges();
    });

    // ===== 点击页面任意位置隐藏 =====
    document.addEventListener("click", function () {
        menu.style.display = "none";
    });

    document.addEventListener("scroll", function () {
        menu.style.display = "none";
    });
})();