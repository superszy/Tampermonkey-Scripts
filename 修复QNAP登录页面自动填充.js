// ==UserScript==
// @name         修复QNAP登录页面自动填充
// @version      2
// @description  修复QNAP登录页面的用户名、密码、OTP自动填充问题
// @author       superszy
// @match        https://*.myqnapcloud.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Fix username field - replace textarea with input
    var usernameTextArea = document.getElementById('username');

    if(usernameTextArea != null){
        var usernameInput = document.createElement('input');
        usernameInput.id = 'username';
        usernameInput.placeholder = "用户名";
        usernameInput.className = "qStr";

        usernameTextArea.parentNode.replaceChild(usernameInput, usernameTextArea);
    }

    // Fix OTP field - set autocomplete to one-time-code
    var otpInput = document.getElementById('scyCode');

    if(otpInput != null){
        otpInput.setAttribute('autocomplete', 'one-time-code');
    }
})();