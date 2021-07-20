// ==UserScript==
// @name        美剧播出时间表 今天
// @namespace   superszy
// @author      superszy
// @description 适用于https://huo720.com/
// @match       https://huo720.com/calendar*
// @run-at document-end
// @version     1.0.5
// ==/UserScript==

{
    const url = location.href;

    const today = new Date().getFullYear() + "-" + ((new Date().getMonth()+1)>9 ? "" : "0") + (new Date().getMonth()+1) + "-" + (new Date().getDate()>9 ? "" : "0") + new Date().getDate();
    const month1 = new Date().getFullYear() + "-" + ((new Date().getMonth()+1)>9 ? "" : "0") + (new Date().getMonth()+1) + "-01";

    const findDate = url.indexOf("date");
    const findMonth1 = url.indexOf("month1");

    var btn = "<a class=\"jump px-1 link-light\" href=";
    if ( findDate > 0 && findMonth1 == -1 ) {
        btn += "?date=" + month1;
    }
    btn += "#" + today;
    btn += " one-link-mark=\"yes\">今天</a>";

    document
        .querySelector('.jump.px-1.link-light')
        .insertAdjacentHTML('beforeBegin', btn);

    if ( findDate == -1 || findMonth1 > 0 ) {
        window.location.href = '#' + today;
    }
}