// ==UserScript==
// @name         自动显示 夸克网盘 Cookie
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取夸克网盘 API 请求的 Cookie 值
// @author       superszy
// @match        https://pan.quark.cn/*
// @grant        GM_setClipboard
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let capturedCookie = null;

    // 创建浮动窗口
    function createFloatingWindow() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            max-height: 300px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: Arial, sans-serif;
            overflow: hidden;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            background: #1890ff;
            color: white;
            padding: 12px 15px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.textContent = 'Cookie 获取器';

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            cursor: pointer;
            font-size: 18px;
        `;
        closeBtn.onclick = () => container.remove();
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.style.cssText = `
            padding: 15px;
            max-height: 200px;
            overflow-y: auto;
        `;

        const status = document.createElement('div');
        status.id = 'cookie-status';
        status.style.cssText = `
            color: #666;
            margin-bottom: 10px;
            font-size: 13px;
        `;
        status.textContent = '等待捕获请求...';

        const cookieDisplay = document.createElement('textarea');
        cookieDisplay.id = 'cookie-display';
        cookieDisplay.style.cssText = `
            width: 100%;
            min-height: 80px;
            padding: 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 12px;
            font-family: monospace;
            resize: vertical;
            display: none;
        `;
        cookieDisplay.readOnly = true;

        const copyBtn = document.createElement('button');
        copyBtn.id = 'cookie-copy-btn';
        copyBtn.textContent = '复制 Cookie';
        copyBtn.disabled = true;
        copyBtn.style.cssText = `
            margin-top: 10px;
            padding: 8px 16px;
            background: #d9d9d9;
            color: #999;
            border: none;
            border-radius: 4px;
            cursor: not-allowed;
        `;
        copyBtn.onclick = async () => {
            const cookieValue = cookieDisplay.value;
            if (!cookieValue) return;

            try {
                // 尝试使用现代 Clipboard API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(cookieValue);
                } else if (typeof GM_setClipboard !== 'undefined') {
                    // 使用 Tampermonkey 的 API
                    GM_setClipboard(cookieValue);
                } else {
                    // 降级到传统方法
                    cookieDisplay.select();
                    document.execCommand('copy');
                }
                copyBtn.textContent = '✓ 已复制!';
                copyBtn.style.background = '#52c41a';
                setTimeout(() => {
                    copyBtn.textContent = '复制 Cookie';
                    copyBtn.style.background = '#1890ff';
                }, 2000);
            } catch (err) {
                copyBtn.textContent = '复制失败';
                copyBtn.style.background = '#ff4d4f';
                setTimeout(() => {
                    copyBtn.textContent = '复制 Cookie';
                    copyBtn.style.background = '#1890ff';
                }, 2000);
            }
        };

        content.appendChild(status);
        content.appendChild(cookieDisplay);
        content.appendChild(copyBtn);

        container.appendChild(header);
        container.appendChild(content);

        document.body.appendChild(container);

        return { status, cookieDisplay, copyBtn };
    }

    // 拦截 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        if (this._url && this._url.startsWith('https://drive-pc.quark.cn/1/clouddrive/file/sort?pr')) {
            const cookie = document.cookie;
            if (cookie && !capturedCookie) {
                capturedCookie = cookie;
                updateDisplay(cookie);
            }
        }
        return originalSend.apply(this, arguments);
    };

    // 拦截 fetch
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.startsWith('https://drive-pc.quark.cn/1/clouddrive/file/sort?pr')) {
            const cookie = document.cookie;
            if (cookie && !capturedCookie) {
                capturedCookie = cookie;
                updateDisplay(cookie);
            }
        }
        return originalFetch.apply(this, arguments);
    };

    // 更新显示
    function updateDisplay(cookie) {
        setTimeout(() => {
            const status = document.getElementById('cookie-status');
            const cookieDisplay = document.getElementById('cookie-display');
            const copyBtn = document.getElementById('cookie-copy-btn');

            if (status && cookieDisplay && copyBtn) {
                status.textContent = '✓ Cookie 已捕获';
                status.style.color = '#52c41a';
                cookieDisplay.value = cookie;
                cookieDisplay.style.display = 'block';

                // 启用复制按钮
                copyBtn.disabled = false;
                copyBtn.style.background = '#1890ff';
                copyBtn.style.color = 'white';
                copyBtn.style.cursor = 'pointer';
            }
        }, 100);
    }

    // 页面加载完成后创建浮动窗口
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingWindow);
    } else {
        window.addEventListener('load', createFloatingWindow);
    }
})();
