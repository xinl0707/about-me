# 李想 · 个人主页

> 深色 scrollytelling（滚动叙事）技术作品集 —— 纯静态 HTML / CSS / JS，无框架、无构建。

**在线访问：** Cloudflare Pages（部署后见仓库 Pages 地址）

## 内容

- **Hero 首屏**：巨大淡化的滚动关键词缎带作背景，滚动时收缩、汇入顶部固定横向跑马灯
- **关于我**：简介 + 身份卡 + 技术栈（合并展示，滚动渐入）
- **项目经历**：每个项目「全屏 sticky 配图 + 右侧毛玻璃浮动卡片」，随滚动切换截图
- **教育与特点**：时间线 + 卡片收尾

## 项目

| 项目 | 说明 |
|------|------|
| CampusVerse · 双界校园 | 黑客松 5 人团队队长，四合一 AI 校园应用（[在线演示](https://campusverse-dk0n.onrender.com/)） |
| 健身记录 | 体重 / 饮食 / 运动管理，AI 拍照识别 + SSE 流式分析 |
| 广州旅行规划 | 移动端行程查看器，高德 MCP 地图 + 航班倒计时 |
| B站收藏夹工具 | Python + Flask 收藏夹爬取与可视化浏览 |

## 本地运行

无任何依赖，直接双击 `index.html` 或：

```bash
npx serve .
```

## 结构

```
/            # 网站根目录（可直接部署到 Pages）
├── index.html
├── style.css    # 设计 token：深墨绿纸底 + 玉青 + 暖金
├── script.js    # 跑马灯联动 / 渐入 / sticky 配图切换
└── assets/      # 头像与项目截图（英文命名）
```

---

© 2026 李想 · 一般路过魈上仙 · [github.com/xinl0707](https://github.com/xinl0707)
