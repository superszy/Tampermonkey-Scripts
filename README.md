# Tampermonkey 脚本集合

这是一个个人使用的油猴脚本集合，包含多个实用工具脚本。

## 脚本列表

### 1. 显示星号密码
**文件**: `显示星号密码-1.0.user.js`

在任意网页右上角添加一个"显示密码"按钮，点击后可将页面中所有密码输入框的星号密码转换为明文显示，方便查看和确认密码。

- **适用范围**: 所有网站
- **功能**: 一键显示所有密码框内容

---

### 2. 自动显示 PikPak refresh_token 值
**文件**: `自动显示 pikpak refresh_token 值-1.4.user.js`

在 PikPak 网盘页面自动读取并显示 localStorage 中的 refresh_token 值，提供浮动窗口展示，支持一键复制。

- **适用范围**: https://mypikpak.com/drive/all
- **功能**: 自动提取并显示 refresh_token，方便 API 调用或第三方工具使用

---

### 3. SubHD 右键海盗搜索
**文件**: `subhd 右键海盗搜索-1.0.user.js`

在 SubHD 字幕网站上选中文本后右键，可快速跳转到 PirateBay 搜索该内容，方便查找影视资源。

- **适用范围**: https://subhd.tv
- **功能**: 右键菜单快速搜索 PirateBay

---

### 4. 迅雷验证码助手
**文件**: `Xunlei Captcha Helper.user.js`

在迅雷验证码页面注入辅助工具，提供 reviewCb 参数输入框，并自动捕获控制台中的 creditkey 值，支持一键复制。

- **适用范围**: https://i.xunlei.com/xlcaptcha/android.html
- **功能**:
  - 提供 reviewCb 参数输入和执行功能
  - 自动捕获并显示 creditkey
  - 控制台日志实时显示

---

### 5. JustMySocks用量计算
**文件**: `CalculateJustMySocksFlow.user.js`

自动计算JustMySocks用量计算。

- **适用范围**: https://justmysocks5.net/members/getbwcounter.php*
- **功能**:
  - JustMySocks用量计算

---

### 6. 265高亮
**文件**: `265高亮.user.js`

在 PirateBay 等海盗湾站点的搜索结果页面，自动高亮显示视频编码格式关键词（x265、HEVC、AV1）和优质发布组（ELiTE、MeGusta），并为优先级最高的关键词添加动态光环特效。

- **适用范围**: https://*piratebay*/search*
- **功能**:
  - 高亮显示 x265、HEVC、AV1 编码格式
  - 高亮显示 ELiTE、MeGusta 发布组
  - 为 ELiTE 或 MeGusta 添加动态光环动画
  - 支持动态加载内容的实时高亮

---

### 7. 自动显示 夸克网盘 Cookie
**文件**: `自动显示 夸克网盘 Cookie.user.js`

在夸克网盘页面自动拦截并捕获 API 请求的 Cookie 值，提供浮动窗口展示，支持一键复制。

- **适用范围**: https://pan.quark.cn/*
- **功能**:
  - 自动拦截夸克网盘 API 请求并提取 Cookie
  - 浮动窗口实时显示 Cookie 值
  - 一键复制功能，方便 API 调用或第三方工具使用

---

### 8. SubHD 海盗搜索（多站点版）
**文件**: `subhd 海盗搜索.user.js`

在 SubHD 字幕网站上选中文本后，自动弹出海盗搜索菜单，支持多个站点选择（PirateBay、BTSOW、Torrent Kitty 等），可在新标签页中打开搜索结果。

- **适用范围**: https://subhd.tv/*
- **功能**:
  - 选中文本自动显示搜索菜单
  - 支持多个海盗湾站点和资源搜索站点
  - 悬停主菜单显示二级站点列表
  - 点击主菜单直接使用默认站点搜索
  - 支持的站点：ThePirateBay.org, PirateBay.live, PirateBay.party, BTSOW, Torrent Kitty, Code 搜索等

---

### 9. 修复 QNAP 登录页面自动填充
**文件**: `修复QNAP登录页面自动填充.js`

修复 QNAP 云端登录页面的浏览器自动填充问题，优化用户名输入框类型，并为 OTP 输入框添加自动提交功能。

- **适用范围**: https://*.myqnapcloud.com/*
- **功能**:
  - 将用户名 textarea 替换为 input 元素，支持浏览器自动填充
  - 为 OTP 输入框设置正确的 autocomplete 属性
  - 输入 6 位数字 OTP 后自动提交表单

---

## 安装方法

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击对应的 `.user.js` 文件
3. Tampermonkey 会自动识别并提示安装

## 许可证

MIT License
