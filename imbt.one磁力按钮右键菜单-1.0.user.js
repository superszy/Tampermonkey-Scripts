// ==UserScript==
// @name         imbt.one磁力按钮右键菜单
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  恢复https://imbt.one/磁力按钮右键菜单
// @author       superszy
// @match        https://imbt.one/a/*
// @icon         https://imbt.one/favicon.ico
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const targetSelector = '#magnet-link';
    const checkInterval = 500;

    // 解除右键限制
    function restoreRightClick() {
        const btn = document.querySelector(targetSelector);
        if (!btn) return;

        // 移除oncontextmenu事件绑定
        btn.oncontextmenu = null;

        // 解除事件监听器（使用捕获阶段覆盖）
        btn.addEventListener('contextmenu', e => {
            e.stopImmediatePropagation();
        }, true);
    }

    // 自动检测动态加载
    let timer = setInterval(() => {
        if (document.querySelector(targetSelector)) {
            restoreRightClick();
            clearInterval(timer);
        }
    }, checkInterval);

    // DOM变更监听
    const observer = new MutationObserver(mutations => {
        if (document.querySelector(targetSelector)) {
            restoreRightClick();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    window.addEventListener('load', restoreRightClick);
})();