// ==UserScript==
// @name         subhd 海盗搜索
// @namespace    https://tampermonkey.net/
// @version      1.3.1
// @description  在 subhd.tv 页面选中文本时，自动弹出"海盗搜索"菜单跳转 piratebay（支持多站点选择）
// @match        https://subhd.tv/*
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564421/subhd%20%E6%B5%B7%E7%9B%97%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/564421/subhd%20%E6%B5%B7%E7%9B%97%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 海盗湾站点列表 =====
    const pirateUrls = [
        { name: "ThePirateBay.org", url: "https://thepiratebay.org/search/" },
        { name: "PirateBay.live", url: "https://piratebay.live/search/" },
        { name: "PirateBay.party", url: "https://piratebay.party/search/" },
        { name: "PirateBayProxy.live", url: "https://piratebayproxy.live/search/" },
        { name: "BTSOW", url: "https://btsow.live/search/" },
        { name: "Torrent Kitty", url: "https://www.torrentkitty.tv/search/" },
        { name: "Code", url: "https://so.techlife.app/code/" }
    ];

    let menu, submenu;

    // 等待DOM加载完成
    function init() {
        console.log('[海盗搜索] 脚本初始化开始');

        // ===== 创建主菜单 =====
        menu = document.createElement("div");
        menu.id = "pirate-search-menu";
        menu.innerHTML = `<div class="main-item">🏴‍☠️ 海盗搜索 <span class="arrow">▶</span></div>`;
        document.body.appendChild(menu);

        // ===== 创建二级菜单 =====
        submenu = document.createElement("div");
        submenu.id = "pirate-search-submenu";
        submenu.innerHTML = pirateUrls.map((site, index) =>
            `<div class="submenu-item" data-index="${index}">${site.name}</div>`
        ).join('');
        document.body.appendChild(submenu);

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
            #pirate-search-menu .main-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
            }
            #pirate-search-menu .arrow {
                font-size: 10px;
                opacity: 0.6;
            }
            #pirate-search-menu:hover {
                background: #1677ff;
                color: white;
            }
            #pirate-search-submenu {
                position: fixed;
                z-index: 1000000;
                background: #ffffff;
                border: 1px solid #ccc;
                border-radius: 6px;
                font-size: 14px;
                display: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                user-select: none;
                min-width: 160px;
            }
            #pirate-search-submenu .submenu-item {
                padding: 8px 14px;
                cursor: pointer;
                color: #333;
                border-bottom: 1px solid #f0f0f0;
            }
            #pirate-search-submenu .submenu-item:last-child {
                border-bottom: none;
            }
            #pirate-search-submenu .submenu-item:hover {
                background: #1677ff;
                color: white;
            }
        `;
        document.head.appendChild(style);

        console.log('[海盗搜索] 菜单元素已创建');

        // ===== 选中文本事件 =====
        document.addEventListener("mouseup", function (e) {
            setTimeout(() => {
                const text = window.getSelection().toString().trim();
                console.log('[海盗搜索] 检测到选中文本:', text);

                if (text.length > 0) {
                    menu.style.left = (e.pageX || e.clientX) + "px";
                    menu.style.top = (e.pageY || e.clientY) + "px";
                    menu.style.display = "block";
                    menu.dataset.text = text;
                    submenu.style.display = "none";
                    console.log('[海盗搜索] 显示主菜单');
                } else {
                    menu.style.display = "none";
                    submenu.style.display = "none";
                }
            }, 10);
        }, true);

        // ===== 主菜单点击 - 使用第一个站点搜索 =====
        menu.addEventListener("click", function (e) {
            e.stopPropagation();
            const text = menu.dataset.text;
            if (!text) return;

            const url = pirateUrls[0].url + encodeURIComponent(text);
            console.log('[海盗搜索] 打开链接:', url);
            GM_openInTab(url, { active: true });

            menu.style.display = "none";
            submenu.style.display = "none";
            window.getSelection().removeAllRanges();
        });

        // ===== 主菜单悬停 - 显示二级菜单 =====
        menu.addEventListener("mouseenter", function () {
            const menuRect = menu.getBoundingClientRect();
            submenu.style.left = (menuRect.right + 5) + "px";
            submenu.style.top = menuRect.top + "px";
            submenu.style.display = "block";
            console.log('[海盗搜索] 显示二级菜单');
        });

        // ===== 离开菜单区域隐藏二级菜单 =====
        menu.addEventListener("mouseleave", function () {
            setTimeout(() => {
                if (!submenu.matches(':hover') && !menu.matches(':hover')) {
                    submenu.style.display = "none";
                }
            }, 100);
        });

        submenu.addEventListener("mouseleave", function () {
            setTimeout(() => {
                if (!submenu.matches(':hover') && !menu.matches(':hover')) {
                    submenu.style.display = "none";
                }
            }, 100);
        });

        // ===== 二级菜单项点击 =====
        submenu.addEventListener("click", function (e) {
            if (e.target.classList.contains('submenu-item')) {
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                const text = menu.dataset.text;
                if (!text) return;

                const url = pirateUrls[index].url + encodeURIComponent(text);
                console.log('[海盗搜索] 打开链接:', url);
                GM_openInTab(url, { active: true });

                menu.style.display = "none";
                submenu.style.display = "none";
                window.getSelection().removeAllRanges();
            }
        });

        // ===== 点击页面任意位置隐藏 =====
        document.addEventListener("click", function (e) {
            if (!menu.contains(e.target) && !submenu.contains(e.target)) {
                menu.style.display = "none";
                submenu.style.display = "none";
            }
        }, true);

        document.addEventListener("scroll", function () {
            menu.style.display = "none";
            submenu.style.display = "none";
        }, true);

        console.log('[海盗搜索] 所有事件监听器已绑定');
    }

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
