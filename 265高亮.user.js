// ==UserScript==
// @name         265高亮
// @namespace    https://github.com/superszy
// @version      1.2.0
// @description  高亮显示 x265、HEVC、ELiTE、MeGusta、AV1
// @author       superszy
// @match        https://thepiratebay.org/search/*
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
   * 为所有 ELiTE 或 MeGusta 添加光环动画
   */
  function addAnimationToAllMatches() {
    // 优先查找 ELiTE，其次 MeGusta
    const priorityKeywords = ['ELiTE', 'MeGusta'];

    let foundKeyword = null;
    let targetMarks = [];

    // 查找优先级最高的关键词
    for (const keyword of priorityKeywords) {
      const marks = Array.from(document.querySelectorAll('mark'));
      const matchedMarks = marks.filter(mark =>
        mark.textContent.toLowerCase() === keyword.toLowerCase()
      );

      if (matchedMarks.length > 0) {
        foundKeyword = keyword;
        targetMarks = matchedMarks;
        break; // 找到优先级更高的就停止
      }
    }

    if (targetMarks.length > 0) {
      // 找到对应的关键词配置以获取颜色
      const kw = keywords.find(k =>
        k.text.toLowerCase() === foundKeyword.toLowerCase()
      );

      if (kw) {
        // 创建光环动画样式（只添加一次）
        const style = document.createElement('style');
        style.textContent = `
          @keyframes halo-shrink-${foundKeyword} {
            0% {
              box-shadow: 0 0 0 0 ${kw.bgColor}88,
                          0 0 600px 300px ${kw.bgColor}66,
                          0 0 1200px 600px ${kw.bgColor}44;
              transform: scale(5);
            }
            100% {
              box-shadow: 0 0 0 0 ${kw.bgColor}00,
                          0 0 0 0 ${kw.bgColor}00,
                          0 0 0 0 ${kw.bgColor}00;
              transform: scale(1);
            }
          }
          .halo-animated-${foundKeyword} {
            animation: halo-shrink-${foundKeyword} 1s ease-out forwards;
            position: relative;
            display: inline-block;
          }
        `;
        document.head.appendChild(style);

        // 为所有匹配的 mark 添加动画类
        targetMarks.forEach(mark => {
          mark.classList.add(`halo-animated-${foundKeyword}`);
        });
      }
    }
  }

  /**
   * 主函数：对整个页面正文进行高亮
   */
  function main() {
    const target = document.body;
    if (!target) return;

    highlightTextNodes(target);

    // 高亮完成后添加动画
    setTimeout(() => addAnimationToAllMatches(), 100);

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
