# CodexZH Vue 3 UI 复现

基于 [codexzh.com](https://codexzh.com/) 的公开页面制作的 Vue 3 界面原型。

## 运行

```bash
npm install
npm run dev
```

打开终端输出的本地地址。构建生产文件：

```bash
npm run build
```

## 页面

- `/` 首页
- `/pricing` 套餐定价
- `/docs/getting-started` 接入指南
- `/models` 模型介绍
- `/faq` 常见问题

当前阶段还原公开页面布局及可见交互。首页包含滚动后收拢的导航、轮播客户端名称、终端逐行入场、双向滚动标签、鼠标跟随光晕与卡片倾斜、视频滚动入场及原站 Bilibili 播放器。其余页面包含导航、主题切换、登录弹窗、文档助手面板、代码示例切换与复制、模型筛选和 FAQ 搜索/展开。登录、支付、Google 登录、真实文档问答与动态模型状态尚未连接服务端；页面中的模型状态和价格为静态展示数据。
