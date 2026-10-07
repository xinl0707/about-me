# 李想 · 个人主页

> Apple 风格滚动叙事（scrollytelling）技术作品集 —— 纯静态 HTML / CSS / JS，无框架、无构建。

**在线访问：** https://xinl0707.github.io/about-me/

## 设计

视觉语言基于 Apple 设计规范（HIG）落地：

- **单一强调色** Action Blue `#0066cc`（深底切换 `#2997ff`），全站无第二品牌色
- **明暗色块交替**：白 `#ffffff` / 羊皮纸 `#f5f5f7` / 近黑 `#272729` 整屏切换，色块即分隔线
- **SF Pro 字体阶梯**：标题 600 + 负字距（Apple tight），正文 17px；字重只用 300 / 400 / 600 / 700
- **无装饰渐变、无卡片阴影**——全站唯一阴影只给产品截图 `rgba(0,0,0,.22) 3px 5px 30px`
- 尊重系统「减少动态效果」偏好（`prefers-reduced-motion`）

## 内容

- **Hero 首屏**：巨大关键词缎带作背景，滚动时收缩、汇入顶部黑色跑马灯，蓝色进度条指示滚动位置
- **关于我**：五层递进排版（身份 → 主张 → 蓝色流程链 `需求 › 开发 › 审查 › 文档` → 交付/场景行条 → 收尾）+ 头像身份卡 + 技术栈
- **数据成就带**：大数字滚动计数（4 项目 / 1 提名 / 5 人队长 / 3 平台）
- **项目经历**：每个项目「sticky 配图 + 右侧毛玻璃卡片」，随滚动切换截图 + 进度圆点，配图 crossfade 呼吸切换
- **深色金句瓷砖**：暗底白字 slogan + 单一蓝 CTA
- **教育与特点**：时间线 + 卡片收尾
- **双层导航**：黑色跑马灯 global-nav + 毛玻璃 sub-nav（锚点跳转 + 章节高亮 + 联系 pill）

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
├── index.html   # 单页结构 + 无 FOUC 的 js 标记
├── style.css    # Apple 设计 token（色板 / 字阶 / 圆角 / 间距）+ 明暗瓷砖
├── script.js    # 跑马灯联动 / 进度条 / 渐入 / sticky 配图 + 圆点 / count-up / scrollspy
└── assets/      # 头像与项目截图（WebP，共约 1.4MB；PNG 原图留作备份）
```

## 性能

- 截图全部转 WebP 并限制 1600px 宽（15MB → 1.4MB），`loading="lazy"` 按需加载
- 原生 `IntersectionObserver` 驱动动画，`requestAnimationFrame` 节流滚动，零依赖

---

© 2026 李想 · 一般路过魈上仙 · [github.com/xinl0707](https://github.com/xinl0707)
