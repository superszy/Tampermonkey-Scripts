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

  /* ─── 1. 拦截 console，捕获 creditkey ─── */
  const _originalLog = console.log.bind(console);
  const _originalInfo = console.info.bind(console);
  const _originalWarn = console.warn.bind(console);
  const _originalError = console.error.bind(console);

  function extractCreditKey(args) {
    for (const arg of args) {
      if (arg === null || arg === undefined) continue;
      const str = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
      // 匹配 creditkey: "xxx" 或 creditkey:"xxx" 或 "creditkey":"xxx"
      const match = str.match(/creditkey["']?\s*[=:]\s*["']?([A-Za-z0-9_\-+/=.]+)["']?/i);
      if (match) return match[1];
      // 也尝试直接作为对象取值
      if (typeof arg === 'object' && arg !== null && arg.creditkey) {
        return String(arg.creditkey);
      }
    }
    return null;
  }

  function hookConsole(original, level) {
    return function (...args) {
      original(...args);
      const key = extractCreditKey(args);
      if (key) {
        window.__xlCreditKey = key;
        showCreditKey(key);
      }
    };
  }

  console.log   = hookConsole(_originalLog,   'log');
  console.info  = hookConsole(_originalInfo,  'info');
  console.warn  = hookConsole(_originalWarn,  'warn');
  console.error = hookConsole(_originalError, 'error');

  /* ─── 2. 注入 UI ─── */
  function injectUI() {
    if (document.getElementById('__xl_helper_root')) return;

    // 字体
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Sora:wght@400;600&display=swap';
    document.head.appendChild(fontLink);

    const root = document.createElement('div');
    root.id = '__xl_helper_root';
    root.innerHTML = `
      <style>
        #__xl_helper_root * { box-sizing: border-box; font-family: 'Sora', sans-serif; }
        #__xl_helper_bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 999999;
          background: linear-gradient(135deg, #0f0c29, #1a1a3e, #0f0c29);
          border-bottom: 1px solid rgba(99,102,241,.4);
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 24px rgba(0,0,0,.5);
        }
        #__xl_helper_bar .label {
          color: #a5b4fc;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          letter-spacing: .05em;
        }
        #__xl_helper_input {
          flex: 1;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(99,102,241,.5);
          border-radius: 8px;
          color: #e0e7ff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          padding: 6px 12px;
          outline: none;
          transition: border-color .2s;
          min-width: 0;
        }
        #__xl_helper_input:focus { border-color: #818cf8; }
        #__xl_helper_submit {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          padding: 7px 16px;
          cursor: pointer;
          transition: opacity .2s, transform .1s;
          white-space: nowrap;
        }
        #__xl_helper_submit:hover { opacity: .85; }
        #__xl_helper_submit:active { transform: scale(.96); }

        /* creditkey 展示区 */
        #__xl_creditkey_box {
          position: fixed;
          top: 60px; left: 50%; transform: translateX(-50%);
          z-index: 999999;
          background: linear-gradient(135deg, #064e3b, #065f46);
          border: 1px solid #34d399;
          border-radius: 12px;
          padding: 14px 20px;
          display: none;
          align-items: center;
          gap: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,.6), 0 0 0 1px rgba(52,211,153,.2);
          max-width: 90vw;
          animation: __xl_slideIn .3s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes __xl_slideIn {
          from { opacity:0; transform: translateX(-50%) translateY(-10px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
        #__xl_creditkey_box .ck-label {
          color: #6ee7b7;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        #__xl_creditkey_value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #d1fae5;
          word-break: break-all;
          max-width: 60vw;
        }
        #__xl_copy_btn {
          background: rgba(52,211,153,.15);
          border: 1px solid #34d399;
          border-radius: 6px;
          color: #34d399;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          cursor: pointer;
          transition: background .2s;
          white-space: nowrap;
        }
        #__xl_copy_btn:hover { background: rgba(52,211,153,.3); }
        #__xl_copy_btn.copied { color: #6ee7b7; border-color: #6ee7b7; }

        /* toast */
        #__xl_toast {
          position: fixed;
          bottom: 24px; left: 50%; transform: translateX(-50%);
          z-index: 9999999;
          background: #1e1b4b;
          color: #a5b4fc;
          font-size: 13px;
          padding: 8px 20px;
          border-radius: 999px;
          border: 1px solid rgba(99,102,241,.4);
          pointer-events: none;
          opacity: 0;
          transition: opacity .2s;
        }
        #__xl_toast.show { opacity: 1; }
      </style>

      <!-- 顶部工具栏 -->
      <div id="__xl_helper_bar">
        <span class="label">reviewCb</span>
        <input id="__xl_helper_input" type="text" placeholder="输入参数，包括外层大括号" autocomplete="off" />
        <button id="__xl_helper_submit">提 交</button>
      </div>

      <!-- creditkey 展示 -->
      <div id="__xl_creditkey_box">
        <span class="ck-label">creditkey</span>
        <span id="__xl_creditkey_value"></span>
        <button id="__xl_copy_btn">复制</button>
      </div>

      <!-- toast -->
      <div id="__xl_toast"></div>
    `;

    document.documentElement.appendChild(root);

    // 给页面 body 留出顶部空间
    function ensureBodyPadding() {
      if (document.body) {
        document.body.style.paddingTop = '52px';
      }
    }
    ensureBodyPadding();
    const bodyObs = new MutationObserver(ensureBodyPadding);
    bodyObs.observe(document.documentElement, { childList: true });

    /* 提交按钮逻辑 */
    document.getElementById('__xl_helper_submit').addEventListener('click', () => {
      const val = document.getElementById('__xl_helper_input').value.trim();
      if (!val) { showToast('请先输入参数'); return; }

      // 尝试执行 reviewCb(val)
      // val 可能是数字或字符串，直接作为标识符传入
      try {
        // 先尝试把 val 当作变量名 / 表达式
        // 用 Function 构造器在页面作用域执行
        const fn = new Function(`return reviewCb(${val})`);
        const result = fn();
        showToast('reviewCb 执行成功');
        _originalLog('[XL Helper] reviewCb result:', result);
      } catch (e) {
        // 若失败，当作字符串传入
        try {
          const fn2 = new Function(`return reviewCb("${val.replace(/"/g, '\\"')}")`);
          const result2 = fn2();
          showToast('reviewCb 执行成功（字符串模式）');
          _originalLog('[XL Helper] reviewCb result:', result2);
        } catch (e2) {
          showToast('执行失败: ' + e2.message);
          _originalError('[XL Helper] reviewCb error:', e2);
        }
      }
    });

    /* 输入框回车提交 */
    document.getElementById('__xl_helper_input').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('__xl_helper_submit').click();
    });

    /* 复制按钮 */
    document.getElementById('__xl_copy_btn').addEventListener('click', () => {
      const val = document.getElementById('__xl_creditkey_value').textContent;
      if (!val) return;
      // 优先使用 GM_setClipboard，回退到 clipboard API
      if (typeof GM_setClipboard !== 'undefined') {
        GM_setClipboard(val);
        flashCopied();
      } else {
        navigator.clipboard.writeText(val).then(flashCopied).catch(() => {
          // 最终回退
          const ta = document.createElement('textarea');
          ta.value = val;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          flashCopied();
        });
      }
    });
  }

  function showCreditKey(key) {
    const box = document.getElementById('__xl_creditkey_box');
    const valEl = document.getElementById('__xl_creditkey_value');
    if (!box || !valEl) {
      // UI 还没就绪，稍后重试
      setTimeout(() => showCreditKey(key), 300);
      return;
    }
    valEl.textContent = key;
    box.style.display = 'flex';
    showToast('✅ 检测到 creditkey！');
  }

  function flashCopied() {
    const btn = document.getElementById('__xl_copy_btn');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = '已复制 ✓';
    btn.classList.add('copied');
    showToast('已复制到剪贴板');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
  }

  let _toastTimer;
  function showToast(msg) {
    const t = document.getElementById('__xl_toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
  }

  /* ─── 3. 等待 DOM 就绪后注入 ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUI);
  } else {
    injectUI();
  }

})();