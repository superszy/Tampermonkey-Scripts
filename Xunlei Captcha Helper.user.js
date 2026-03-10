// ==UserScript==
// @name         迅雷验证码助手 / Xunlei Captcha Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在迅雷验证码页面注入 reviewCb 输入框，并捕获控制台中的 creditkey 值
// @author       superszy
// @license       MIT
// @match        https://i.xunlei.com/xlcaptcha/android.html*
// @grant        GM_setClipboard
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const w = unsafeWindow || window;

    let panel;
    let creditInput;

    function createLogPanel() {

        const textarea = document.createElement("textarea");

        textarea.style.position = "fixed";
        textarea.style.bottom = "10px";
        textarea.style.right = "10px";
        textarea.style.width = "500px";
        textarea.style.height = "300px";
        textarea.style.zIndex = "999999";

        textarea.style.background = "black";
        textarea.style.color = "#00ff00";
        textarea.style.fontSize = "12px";
        textarea.style.fontFamily = "monospace";

        textarea.style.border = "1px solid #555";
        textarea.style.padding = "5px";
        textarea.readOnly = true;

        document.body.appendChild(textarea);

        return textarea;
    }

    function createTopPanel() {

        const container = document.createElement("div");

        container.style.position = "fixed";
        container.style.top = "10px";
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
        container.style.zIndex = "999999";

        container.style.background = "white";
        container.style.padding = "10px";
        container.style.border = "1px solid #aaa";
        container.style.boxShadow = "0 0 5px rgba(0,0,0,0.2)";
        container.style.fontSize = "12px";

        const row1 = document.createElement("div");

        const input = document.createElement("input");
        input.placeholder = "输入 reviewCb 参数";
        input.style.width = "200px";
        input.style.marginRight = "10px";

        const button = document.createElement("button");
        button.textContent = "执行 reviewCb";

        button.onclick = function () {

            const value = input.value.trim();

            if (!value) {
                console.warn("reviewCb 参数为空");
                return;
            }

            try {

                if (typeof w.reviewCb === "function") {
                    w.reviewCb(value);
                    console.log("调用 reviewCb:", value);
                } else {
                    console.error("reviewCb 未定义");
                }

            } catch (e) {
                console.error("调用 reviewCb 出错:", e);
            }
        };

        row1.appendChild(input);
        row1.appendChild(button);

        const row2 = document.createElement("div");
        row2.style.marginTop = "8px";

        const label = document.createElement("span");
        label.textContent = "creditkey:";
        label.style.marginRight = "5px";

        creditInput = document.createElement("input");
        creditInput.style.width = "420px";
        creditInput.readOnly = true;

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "复制";
        copyBtn.style.marginLeft = "5px";

        copyBtn.onclick = function () {

            const value = creditInput.value;

            if (!value) return;

            if (typeof GM_setClipboard !== "undefined") {
                GM_setClipboard(value);
            } else {
                navigator.clipboard.writeText(value);
            }

            console.log("已复制 creditkey");
        };

        row2.appendChild(label);
        row2.appendChild(creditInput);
        row2.appendChild(copyBtn);

        container.appendChild(row1);
        container.appendChild(row2);

        document.body.appendChild(container);
    }

    function format(args) {

        return args.map(a => {

            if (typeof a === "object") {

                try {
                    return JSON.stringify(a);
                } catch {
                    return "[object]";
                }

            }

            return String(a);

        }).join(" ");
    }

    function extractCreditKey(text) {

        if (!text.includes("nativeRecvOperationResult")) return;

        try {

            const jsonStart = text.indexOf("{");

            if (jsonStart === -1) return;

            const jsonStr = text.substring(jsonStart);

            const obj = JSON.parse(jsonStr);

            if (obj?.roData?.creditkey) {

                const key = obj.roData.creditkey;

                creditInput.value = key;

                console.log("捕获 creditkey:", key);
            }

        } catch (e) {

        }
    }

    function logToPanel(type, args) {

        if (!panel) return;

        const text = `[${type}] ${format(args)}\n`;

        panel.value += text;

        panel.scrollTop = panel.scrollHeight;

        extractCreditKey(text);
    }

    function hookConsole() {

        ["log", "warn", "error", "info", "debug"].forEach(type => {

            const old = w.console[type];

            w.console[type] = function (...args) {

                logToPanel(type, args);

                if (old) {
                    old.apply(this, args);
                }
            };

        });
    }

    hookConsole();

    window.addEventListener("DOMContentLoaded", () => {

        panel = createLogPanel();

        createTopPanel();

    });

})();