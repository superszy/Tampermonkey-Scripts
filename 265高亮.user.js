// ==UserScript==
// @name         265高亮
// @namespace    https://github.com/superszy
// @version      1.0.0
// @description  高亮显示 x265、HEVC、ELiTE、MeGusta、AV1
// @author       superszy
// @match        https://piratebay.live/search/*
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // 需要高亮的关键词及其对应样式
  const keywords = [
    { text: 'x265',  bgColor: '#fff176', textColor: '#333', label: 'x265' },
    { text: 'HEVC',  bgColor: '#ff8a65', textColor: '#fff', label: 'HEVC' },
    { text: 'ELiTE', bgColor: '#81c784', textColor: '#fff', label: 'ELiTE' },
    { text: 'MeGusta', bgColor: '#64b5f6', textColor: '#fff', label: 'MeGusta' },
    { text: 'AV1',    bgColor: '#ce93d8', textColor: '#fff', label: 'AV1' },
  ];

  /**
   * 在文本节点中高亮关键词
   */
  function highlightTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim()) return;

      // 检查是否包含任一关键词（不区分大小写）
      const hasMatch = keywords.some(kw =>
        text.toLowerCase().includes(kw.text.toLowerCase())
      );
      if (!hasMatch) return;

      // 构建正则：匹配所有关键词（不区分大小写，全局）
      const pattern = keywords.map(kw =>
        kw.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      ).join('|');
      const regex = new RegExp(`(${pattern})`, 'gi');

      const parent = node.parentNode;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      let match;
      while ((match = regex.exec(text)) !== null) {
        // 添加匹配前的文本
        if (match.index > lastIndex) {
          fragment.appendChild(
            document.createTextNode(text.substring(lastIndex, match.index))
          );
        }

        // 找到匹配的关键词配置（不区分大小写）
        const matchedText = match[0];
        const kw = keywords.find(k =>
          k.text.toLowerCase() === matchedText.toLowerCase()
        );

        // 创建高亮标记
        const mark = document.createElement('mark');
        mark.textContent = matchedText;
        mark.style.backgroundColor = kw ? kw.bgColor : '#ffff00';
        mark.style.color = kw ? kw.textColor : '#000';
        mark.style.padding = '1px 3px';
        mark.style.borderRadius = '2px';
        mark.style.fontWeight = 'bold';
        mark.title = kw ? `265高亮: ${kw.label}` : '265高亮';

        fragment.appendChild(mark);
        lastIndex = regex.lastIndex;
      }

      // 添加剩余文本
      if (lastIndex < text.length) {
        fragment.appendChild(
          document.createTextNode(text.substring(lastIndex))
        );
      }

      parent.replaceChild(fragment, node);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      // 跳过已处理的高亮标记和脚本/样式标签
      node.tagName !== 'MARK' &&
      node.tagName !== 'SCRIPT' &&
      node.tagName !== 'STYLE' &&
      node.tagName !== 'NOSCRIPT' &&
      node.tagName !== 'TEXTAREA' &&
      node.tagName !== 'INPUT'
    ) {
      // 遍历子节点（使用快照避免 DOM 变化影响遍历）
      Array.from(node.childNodes).forEach(child => highlightTextNodes(child));
    }
  }

  /**
   * 主函数：对整个页面正文进行高亮
   */
  function main() {
    const target = document.body;
    if (!target) return;

    highlightTextNodes(target);

    // 监听动态加载的内容（如 AJAX 翻页）
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            highlightTextNodes(node);
          }
        });
      });
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }

  // 等待 DOM 就绪后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
