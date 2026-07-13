# 家庭碳循环食谱助手

一个面向三人家庭的两日晚餐规划工具。根据设备日期自动判断高碳日、中碳日或低碳日，生成今天与明天的晚餐、完整做法和合并购物清单。

在线体验：[https://gakkiless.github.io/family-carbon-cycle-kitchen/](https://gakkiless.github.io/family-carbon-cycle-kitchen/)

## 功能

- 固定周碳循环：周二、周五高碳；周三、周六低碳；其余日期中碳
- 110 道完整三人份菜谱，覆盖中式、日式和地中海风格
- 按碳循环规则生成两日晚餐，可替换整套菜单或单道菜
- 支持锁定菜品、收藏菜谱和查看完整烹饪步骤
- 自动合并两日食材，并按统一食材 ID 扣除家中库存
- 支持采购勾选、分类折叠和一键复制购物清单
- 菜单、收藏、库存和采购状态均保存在浏览器 `localStorage`
- 无后端、无登录、无 AI 接口、无在线菜谱依赖

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

生产构建与核心规则测试：

```bash
npm test
```

## 技术栈

React、TypeScript、Vite/vinext、Tailwind CSS、Zustand、localStorage。

## 数据说明

所有菜谱、食材主数据和菜单规则均位于 `src/data` 与 `src/algorithms`，每道菜的食材数量已经按三人份存储。
