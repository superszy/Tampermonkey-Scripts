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
## 安装方法

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击对应的 `.user.js` 文件
3. Tampermonkey 会自动识别并提示安装

## 许可证

MIT License
