// ==UserScript==
// @name         显示星号密码
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面上添加一个按钮，点击后显示密码框中的星号密码
// @author       superszy
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const btn = document.createElement('button');
    btn.textContent = '显示密码';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '9999';
    btn.style.padding = '6px 12px';
    btn.style.backgroundColor = '#007bff';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';

    // 添加点击事件
    btn.onclick = () => {
        document.querySelectorAll('input[type="password"]').forEach(e => e.type = 'text');
    };

    // 添加到页面中
    document.body.appendChild(btn);
})();
