// ==UserScript==
// @name         修复QNAP登录页面自动填充
// @namespace    https://github.com/superszy
// @version      4
// @description  修复QNAP登录页面的用户名、密码、OTP自动填充问题
// @author       superszy
// @match        https://*.myqnapcloud.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let usernameFixed = false;
    let otpFixed = false;

    // Main fix function
    function applyFixes() {
        // Fix username field - replace textarea with input
        if (!usernameFixed) {
            var usernameTextArea = document.getElementById('username');
            if (usernameTextArea != null && usernameTextArea.tagName.toLowerCase() === 'textarea') {
                var usernameInput = document.createElement('input');
                usernameInput.id = 'username';
                usernameInput.placeholder = "用户名";
                usernameInput.className = "qStr";
                usernameInput.type = 'text';
                usernameInput.name = usernameTextArea.name;
                usernameInput.autocomplete = 'username';

                usernameTextArea.parentNode.replaceChild(usernameInput, usernameTextArea);
                usernameFixed = true;
                console.log('[QNAP Fix] Username field fixed');
            }
        }

        // Fix OTP field - set autocomplete to one-time-code
        if (!otpFixed) {
            var otpInput = document.getElementById('scyCode');
            if (otpInput != null) {
                otpInput.setAttribute('autocomplete', 'one-time-code');

                // Auto-submit when 6-digit OTP is entered
                otpInput.addEventListener('input', function() {
                    var value = this.value.trim();
                    if(/^\d{6}$/.test(value)){
                        var submitBtn = document.getElementById('scySubmit');
                        if(submitBtn != null){
                            submitBtn.click();
                        }
                    }
                }, { once: false });

                otpFixed = true;
                console.log('[QNAP Fix] OTP field fixed');
            }
        }

        // If both fixed, stop observing
        if (usernameFixed && otpFixed && observer) {
            observer.disconnect();
            console.log('[QNAP Fix] All fixes applied, observer disconnected');
        }
    }

    // Setup MutationObserver for dynamically loaded content
    let observer = null;
    function setupObserver() {
        observer = new MutationObserver(function(mutations) {
            applyFixes();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('[QNAP Fix] MutationObserver started');
    }

    // Execute when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[QNAP Fix] DOMContentLoaded fired');
            applyFixes();
            setupObserver();
        });
    } else {
        // DOM already loaded
        console.log('[QNAP Fix] DOM already loaded, applying fixes immediately');
        applyFixes();
        setupObserver();
    }
})();