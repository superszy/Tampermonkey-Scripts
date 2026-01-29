// ==UserScript==
// @name         subhd 右键海盗搜索
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  在 subhd.tv 页面右键选中文本，使用“海盗搜索”跳转 piratebay
// @match        https://subhd.tv/*
// @grant        GM_openInTab
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

    // ===== 右键事件 =====
    document.addEventListener("contextmenu", function (e) {
        const text = window.getSelection().toString().trim();

        if (text.length > 0) {
            e.preventDefault(); // 阻止系统右键菜单

            menu.style.left = e.clientX + "px";
            menu.style.top = e.clientY + "px";
            menu.style.display = "block";
            menu.dataset.text = text;
        } else {
            menu.style.display = "none";
        }
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