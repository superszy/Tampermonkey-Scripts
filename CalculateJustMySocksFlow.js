// ==UserScript==
// @name         Calculate JustMySocks Flow
// @version      1
// @description  Calculate JustMySocks Flow
// @author       superszy
// @match        https://justmysocks5.net/members/getbwcounter.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let jsonStr = document.querySelector("body").innerText;
    let json = JSON.parse(jsonStr);

    json.monthly_bw_limit_g = json.monthly_bw_limit_b/1000/1000/1000;
    json.bw_counter_g = json.bw_counter_b/1000/1000/1000;
    json.radio = json.bw_counter_b / json.monthly_bw_limit_b;

    document.querySelector("body").innerText += '\n\n流量限制：' + json.monthly_bw_limit_g + ' GB\n已用流量：' + json.bw_counter_g + ' GB\n已用比例：' + json.radio*100 + ' %\n刷新日期：' + json.bw_reset_day_of_month;
})();