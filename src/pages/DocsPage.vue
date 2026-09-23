<script setup>
import { BookOpen, Boxes, CircleHelp, ExternalLink, ListChecks, MonitorSmartphone, Settings2, TriangleAlert, Wrench } from '@lucide/vue'
const steps = [
  { tag: '第 1 步', title: '购买套餐', desc: '选择固定周期套餐并开通，控制台会生成你的专属 API Key。', href: 'https://docs.codexzh.com/codex/activate' },
  { tag: '第 2 步', title: '安装与环境检查', desc: '安装 Node.js 与客户端，确认版本满足要求，避免后续配置报错。', href: 'https://docs.codexzh.com/codex/install' },
  { tag: '第 3 步', title: '配置接入并启动', desc: '写入配置文件并启动客户端，发送一条测试请求确认接入成功。', href: 'https://docs.codexzh.com/codex/getting-started' },
]
const clients = [
  { title: 'Codex CLI', desc: '在终端中使用 Codex，配置 config.toml 与 auth.json。', href: 'https://docs.codexzh.com/codex/cli' },
  { title: 'VS Code / Cursor / Trae', desc: '在编辑器插件中使用 Codex，与 CLI 共用同一份配置。', href: 'https://docs.codexzh.com/codex/vscode' },
  { title: 'Codex App', desc: '在桌面应用中接入 Codex 并选择模型。', href: 'https://docs.codexzh.com/codex/app' },
  { title: 'OpenCode', desc: '在 OpenCode 中添加 CodexZH 作为模型提供商。', href: 'https://docs.codexzh.com/codex/opencode' },
  { title: 'Claude Code 客户端', desc: '在 Claude Code 中调用 CodexZH 提供的模型，注意地址不带 /v1。', href: 'https://docs.codexzh.com/codex/claude-code-integration' },
  { title: 'OpenClaw', desc: '让 AI 自动完成 OpenClaw 的安装与配置。', href: 'https://docs.codexzh.com/codex/openclaw-codex' },
]
const configs = [
  { tag: '首推', title: '一键脚本', desc: '自动检测环境、安装客户端并写入配置文件，适合大多数用户。', href: 'https://docs.codexzh.com/codex/setup-script' },
  { tag: '可视化', title: 'CC-Switch', desc: '在图形界面中导入配置，方便在多个提供商之间切换。', href: 'https://docs.codexzh.com/codex/cc-switch' },
  { tag: '手动', title: '手动配置 config.toml', desc: '自己编写配置文件，适合需要精细控制参数的用户。', href: 'https://docs.codexzh.com/codex/setup' },
]
const troubleshooting = [
  { title: '错误排查指南', desc: '按报错信息查找原因与处理方法。', href: 'https://docs.codexzh.com/codex/troubleshooting' },
  { title: '排障与指南', desc: 'stream disconnected 报错、对话记录恢复、模型与推理深度选择等问题的解决办法。', href: 'https://codexzh.com/docs/troubleshooting' },
  { title: '常见问题', desc: '套餐限制、额度刷新、支付与配置等问答。', local: '/faq' },
  { title: '不知道选 CodexZH 还是 ccodezh？', desc: '按任务选择产品，了解包月与按量计费的区别。', href: 'https://docs.codexzh.com/choose' },
]
</script>

<template>
  <main id="main" class="docs-page page-top"><div class="page-glow"></div><div class="container docs-container"><div class="center-intro docs-intro"><span class="section-kicker">Codex 接入指南</span><h1>三步把 Codex 接进你的开发环境</h1><p>先选你正在使用的客户端，再选配置方式。每个入口都会带你到对应的最新教程，完成第一次调用。</p><div class="intro-note"><BookOpen :size="15" />详细步骤以文档站为准，文档站随客户端版本实时更新。</div></div>
    <section class="docs-section step-guides"><div class="docs-heading"><span><ListChecks :size="20" /></span><div><h2>三步完成接入</h2><p>按顺序完成以下三步，大多数用户可以在几分钟内发出第一次请求。</p></div></div><div class="docs-grid three"><a v-for="item in steps" :key="item.title" class="docs-card" :href="item.href" target="_blank" rel="noopener noreferrer"><span class="mini-tag">{{ item.tag }}</span><h3>{{ item.title }}</h3><p>{{ item.desc }}</p><span class="card-link">查看教程 ↗</span></a></div></section>
    <section class="docs-section client-guides"><div class="docs-heading"><span><MonitorSmartphone :size="20" /></span><div><h2>按客户端选择教程</h2><p>不同客户端的配置位置与地址写法不同，请进入与你实际使用的客户端对应的教程。</p></div></div><div class="docs-grid three"><a v-for="item in clients" :key="item.title" class="docs-card" :href="item.href" target="_blank" rel="noopener noreferrer"><h3>{{ item.title }}</h3><p>{{ item.desc }}</p><span class="card-link">查看教程 ↗</span></a></div></section>
    <section class="docs-section config-guides"><div class="docs-heading"><span><Wrench :size="20" /></span><div><h2>选择配置方式</h2><p>三种方式效果相同，任选其一即可。</p></div></div><div class="docs-grid three"><a v-for="item in configs" :key="item.title" class="docs-card" :href="item.href" target="_blank" rel="noopener noreferrer"><span class="mini-tag">{{ item.tag }}</span><h3>{{ item.title }}</h3><p>{{ item.desc }}</p><span class="card-link">查看教程 ↗</span></a></div></section>
    <section class="docs-section"><div class="docs-heading"><span><TriangleAlert :size="20" /></span><div><h2>容易填错的服务地址</h2><p>接入失败最常见的原因是地址写法与客户端不匹配，配置前请先核对。</p></div></div><div class="address-table"><div class="table-head"><span>使用场景</span><span>正确地址</span><span>注意</span></div><div><span>Codex CLI / VS Code / Cursor</span><code>https://api.codexzh.com/v1</code><strong>必须带 /v1</strong></div><div><span>Claude Code 使用 CodexZH</span><code>https://api.codexzh.com</code><strong>不要带 /v1</strong></div><p>CodexZH 的域名是 codexzh.com，与按量计费的 Claude Code 服务 ccodezh.com 只差一个字母，两者账号与额度不互通。</p></div></section>
    <section class="docs-section trouble-guides"><div class="docs-heading"><span><CircleHelp :size="20" /></span><div><h2>遇到问题</h2><p>配置后仍无法使用时，可以按下面的顺序排查。</p></div></div><div class="docs-grid four"><template v-for="item in troubleshooting" :key="item.title"><RouterLink v-if="item.local" class="docs-card" :to="item.local"><h3>{{ item.title }}</h3><p>{{ item.desc }}</p><span class="card-link">查看教程 ↗</span></RouterLink><a v-else class="docs-card" :href="item.href" target="_blank" rel="noopener noreferrer"><h3>{{ item.title }}</h3><p>{{ item.desc }}</p><span class="card-link">查看教程 ↗</span></a></template></div></section>
  </div></main>
</template>
