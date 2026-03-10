// ==UserScript==
// @name         迅雷验证码助手 / Xunlei Captcha Helper
// @namespace    http://tampermonkey.net/
// @version      2.0.0
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

        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.bottom = "10px";
        container.style.right = "10px";
        container.style.width = "500px";
        container.style.zIndex = "999999";
        container.style.borderRadius = "12px";
        container.style.overflow = "hidden";
        container.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";

        const header = document.createElement("div");
        header.textContent = "控制台日志";
        header.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        header.style.color = "#fff";
        header.style.padding = "10px 15px";
        header.style.fontSize = "14px";
        header.style.fontWeight = "bold";
        header.style.fontFamily = "monospace";

        const textarea = document.createElement("textarea");
        textarea.style.width = "100%";
        textarea.style.height = "300px";
        textarea.style.border = "none";
        textarea.style.background = "#1e1e1e";
        textarea.style.color = "#00ff00";
        textarea.style.fontSize = "12px";
        textarea.style.fontFamily = "monospace";
        textarea.style.padding = "10px";
        textarea.style.boxSizing = "border-box";
        textarea.style.outline = "none";
        textarea.readOnly = true;

        container.appendChild(header);
        container.appendChild(textarea);
        document.body.appendChild(container);

        return textarea;
    }

    function createTopPanel() {

        const container = document.createElement("div");

        container.style.position = "relative";
        container.style.zIndex = "999999";

        container.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        container.style.padding = "12px 20px";
        container.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        container.style.fontSize = "14px";

        const row1 = document.createElement("div");
        row1.style.display = "flex";
        row1.style.gap = "10px";
        row1.style.marginBottom = "10px";
        row1.style.alignItems = "center";

        const label1 = document.createElement("span");
        label1.textContent = "reviewCb:";
        label1.style.color = "#fff";
        label1.style.fontWeight = "bold";
        label1.style.fontSize = "14px";
        label1.style.width = "80px";

        const input = document.createElement("input");
        input.placeholder = "输入 reviewCb 参数";
        input.style.flex = "1";
        input.style.padding = "6px 12px";
        input.style.border = "none";
        input.style.borderRadius = "8px";
        input.style.fontSize = "14px";
        input.style.outline = "none";
        input.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

        input.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                button.click();
            }
        });

        const button = document.createElement("button");
        button.textContent = "执行";
        button.style.padding = "6px 20px";
        button.style.background = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "8px";
        button.style.fontSize = "14px";
        button.style.fontWeight = "bold";
        button.style.color = "#667eea";
        button.style.cursor = "pointer";
        button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        button.style.transition = "all 0.3s";
        button.style.minWidth = "100px";
        button.onmouseover = () => button.style.transform = "translateY(-2px)";
        button.onmouseout = () => button.style.transform = "translateY(0)";

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

        row1.appendChild(label1);
        row1.appendChild(input);
        row1.appendChild(button);

        const row2 = document.createElement("div");
        row2.style.display = "flex";
        row2.style.gap = "10px";
        row2.style.alignItems = "center";

        const label = document.createElement("span");
        label.textContent = "creditkey:";
        label.style.color = "#fff";
        label.style.fontWeight = "bold";
        label.style.fontSize = "14px";
        label.style.width = "80px";

        creditInput = document.createElement("input");
        creditInput.style.flex = "1";
        creditInput.style.padding = "6px 12px";
        creditInput.style.border = "none";
        creditInput.style.borderRadius = "8px";
        creditInput.style.fontSize = "14px";
        creditInput.style.background = "rgba(255,255,255,0.9)";
        creditInput.style.outline = "none";
        creditInput.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        creditInput.readOnly = true;

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "复制";
        copyBtn.style.padding = "6px 20px";
        copyBtn.style.background = "#fff";
        copyBtn.style.border = "none";
        copyBtn.style.borderRadius = "8px";
        copyBtn.style.fontSize = "14px";
        copyBtn.style.fontWeight = "bold";
        copyBtn.style.color = "#667eea";
        copyBtn.style.cursor = "pointer";
        copyBtn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        copyBtn.style.transition = "all 0.3s";
        copyBtn.style.minWidth = "100px";
        copyBtn.onmouseover = () => copyBtn.style.transform = "translateY(-2px)";
        copyBtn.onmouseout = () => copyBtn.style.transform = "translateY(0)";

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

        document.body.insertBefore(container, document.body.firstChild);
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