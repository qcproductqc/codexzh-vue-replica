<script setup>
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { Activity, ArrowRight, BookOpen, Check, CheckCircle2, CirclePlay, Code2, Copy, FileText, KeyRound, LockKeyhole, Mail, Network, Receipt, ShieldCheck, Sparkles, TriangleAlert, Workflow, Wrench, Zap } from '@lucide/vue'

const openLogin = inject('openLogin')
const showNotice = inject('showNotice')
const codeTab = ref('Codex')
const copied = ref('')
const rotatingTools = ['Codex CLI', 'VS Code 插件', 'Cursor', 'Windsurf', 'Claude Code']
const rotatingIndex = ref(0)
const videoFrame = ref(null)
const videoVisible = ref(false)
let wordTimer
let videoObserver
const tiltStates = new Map()
onMounted(() => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wordTimer = window.setInterval(() => { rotatingIndex.value = (rotatingIndex.value + 1) % rotatingTools.length }, 2500)
  }
  videoObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      videoVisible.value = true
      videoObserver?.disconnect()
    }
  }, { threshold: 0.12 })
  if (videoFrame.value) videoObserver.observe(videoFrame.value)
})
onUnmounted(() => {
  clearInterval(wordTimer)
  videoObserver?.disconnect()
  for (const state of tiltStates.values()) cancelAnimationFrame(state.frame)
  tiltStates.clear()
})

function animateTilt(element, time) {
  const state = tiltStates.get(element)
  if (!state) return
  const elapsed = Math.min((time - (state.lastTime || time - 16)) / 1000, 0.04)
  state.lastTime = time
  const stiffness = state.hero ? 110 : 150
  const damping = state.hero ? 20 : 24
  state.velocityX = (state.velocityX + (state.targetX - state.x) * stiffness * elapsed) * Math.exp(-damping * elapsed)
  state.velocityY = (state.velocityY + (state.targetY - state.y) * stiffness * elapsed) * Math.exp(-damping * elapsed)
  state.x += state.velocityX * elapsed
  state.y += state.velocityY * elapsed
  element.style.transform = `${state.hero ? '' : 'perspective(900px) '}rotateX(${state.x.toFixed(3)}deg) rotateY(${state.y.toFixed(3)}deg)`
  const settled = Math.abs(state.targetX - state.x) + Math.abs(state.targetY - state.y) < 0.015 && Math.abs(state.velocityX) + Math.abs(state.velocityY) < 0.05
  if (settled) {
    state.frame = 0
    if (!state.hovering) element.style.transform = state.hero ? '' : 'perspective(900px)'
  } else state.frame = requestAnimationFrame(nextTime => animateTilt(element, nextTime))
}
function startTilt(element, state) {
  if (!state.frame) state.frame = requestAnimationFrame(time => animateTilt(element, time))
}
function pointerTilt(event, amountX = 6, amountY = 6) {
  if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const element = event.currentTarget
  let state = tiltStates.get(element)
  if (!state) {
    state = { x: 0, y: 0, velocityX: 0, velocityY: 0, targetX: 0, targetY: 0, frame: 0, lastTime: 0, hovering: false, hero: element.classList.contains('hero-art'), rect: null }
    tiltStates.set(element, state)
  }
  if (!state.hovering) state.rect = element.getBoundingClientRect()
  state.hovering = true
  const rect = state.rect
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  state.targetX = -y * amountX
  state.targetY = x * amountY
  startTilt(element, state)
}
function resetTilt(event) {
  const element = event.currentTarget
  const state = tiltStates.get(element)
  if (!state) return
  state.hovering = false
  state.rect = null
  state.targetX = 0
  state.targetY = 0
  startTilt(element, state)
}
function moveFeatureGlow(event) {
  if (event.pointerType === 'touch') return
  const element = event.currentTarget
  const rect = element.getBoundingClientRect()
  element.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
  element.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
  element.style.setProperty('--glow-o', '1')
}
function resetFeatureGlow(event) { event.currentTarget.style.setProperty('--glow-o', '0') }
const features = [
  { icon: Network, title: '统一 API 接入', desc: '兼容 Codex 与 Claude Code 的官方协议，一个 Key 调用多个模型系列。' },
  { icon: Workflow, title: '模型路由', desc: '按模型与档位路由请求到对应服务通道，实际调用的模型以控制台记录为准。' },
  { icon: Activity, title: '调用日志', desc: '每次调用的请求时间、模型、用时与 Token 都有记录，支持按日期和模型筛选、导出。' },
  { icon: Receipt, title: '费用统计', desc: 'Token 用量与费用逐条可查，并在统计图中汇总，账单清清楚楚。' },
  { icon: KeyRound, title: '权限管理', desc: '独立 API Key 与团队成员管理，额度与权限按人分配。' },
  { icon: LockKeyhole, title: '安全控制', desc: 'HTTPS 传输、最小必要日志留存，不主动将客户数据用于通用模型训练。' },
]
const steps = [
  { icon: Mail, title: '登录控制台', desc: '使用邮箱验证码登录，无需额外注册流程。' },
  { icon: KeyRound, title: '开通套餐', desc: '兑换激活码或在线购买套餐，生成专属 API Key。' },
  { icon: Wrench, title: '一键配置', desc: '下载一键脚本，或手动写入 config.toml 与 auth.json。' },
]
const models = ['codex-auto-review', 'gpt-image-2', 'gpt-image-2.5', 'gpt-6-astra', 'gpt-6-sol', 'gpt-5.6-sol', 'gpt-5.6-terra', 'gpt-5.6-luna', 'grok-4.5', 'grok-4.6', 'cc-gpt-6-astra', 'cc-gpt-6-sol', 'cc-gpt-5.6-sol', 'cc-gpt-5.6-terra', 'cc-gpt-5.6-luna']
const tools = ['Codex CLI', 'VS Code 插件', 'Cursor', 'Windsurf', 'Claude Code', 'macOS', 'Windows', 'Linux', 'WSL']
const codexCode = `model_provider = "codexzh"
model = "gpt-5.6-terra"
model_reasoning_effort = "high"
disable_response_storage = false

# Cache optimization
cache_size_mb = 512
cache_ttl = "30m"
smart_cache = true
cache_compression = true

[model_providers.codexzh]
name = "codexzh"
base_url = "https://api.codexzh.com/v1"
wire_api = "responses"
requires_openai_auth = true
web_search = "live"`
const claudeCode = `{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.codexzh.com",
    "ANTHROPIC_AUTH_TOKEN": "你的 API Key"
  }
}`
const authCode = `{
  "OPENAI_API_KEY": "sk-RTK0y...K8X"
}`
async function copyCode(key, value) {
  try { await navigator.clipboard.writeText(value); copied.value = key; setTimeout(() => copied.value = '', 2000) }
  catch { showNotice('复制失败，请手动选择代码') }
}
</script>

<template>
  <main id="main" class="home-page">
    <section class="home-hero dotted-bg"><div class="stage-wash stage-wash-left" aria-hidden="true"></div><div class="stage-wash stage-wash-right" aria-hidden="true"></div>
      <div class="container">
        <div class="hero-grid">
          <div class="hero-copy">
            <span class="eyebrow"><span class="eyebrow-dot"></span>Codex CLI · VS Code · Cursor · 包月套餐</span>
            <h1><span>CodexZH</span><br />把 Codex 接进你的开发环境</h1>
            <p class="hero-lead">一个 API Key，直接接入 <span class="rotating-word" aria-live="off"><span class="word-sizer" aria-hidden="true">Claude Code</span><Transition name="word-shift" mode="out-in"><em :key="rotatingTools[rotatingIndex]">{{ rotatingTools[rotatingIndex] }}</em></Transition></span></p>
            <p class="hero-description">选择客户端、写入配置，完成第一次调用。固定周期套餐，包含明确的周限额度与请求速率限制；同时提供统一 API、调用审计与费用统计。</p>
            <div class="hero-actions"><button class="btn btn-primary" @click="openLogin">申请接入 <ArrowRight :size="18" /></button><RouterLink class="btn btn-outline" to="/docs/getting-started">查看接入方式</RouterLink><RouterLink class="text-link" to="/pricing">查看套餐与价格</RouterLink></div>
          </div>
          <div class="hero-art" aria-label="Codex 命令行、配置文件及使用日志预览" @pointermove="pointerTilt($event, 15, 22)" @pointerleave="resetTilt">
            <div class="terminal-window"><div class="terminal-bar"><span class="traffic"><i></i><i></i><i></i></span><span>~/project — codex</span><span class="terminal-tag">示例会话</span></div><div class="terminal-lines"><p class="muted">$ codex</p><p>› 给 api.ts 的请求加上 30 秒超时</p><p class="peach">• Read src/lib/api.ts</p><p class="peach">• Update src/lib/api.ts (+6 −1)</p><p class="green">✓ 已添加 AbortController 超时控制</p><p class="cursor">› ▌</p></div></div>
            <div class="config-window"><div class="config-title">~/.codex/config.toml <span></span></div><div class="config-body"><p><b>model_provider</b> = <b>"codexzh"</b></p><p>model = "gpt-5.6-terra"</p><p>model_reasoning_effort = "high"</p><p>disable_response_storage = false</p><br /><p><b>[model_providers.codexzh]</b></p><p><b>base_url = "https://api.codexzh.com/v1"</b></p></div></div>
            <div class="usage-window"><strong><span></span>使用日志</strong><div><label>模型<b>gpt-5.6-terra</b></label><label>用时<b>3.2s</b></label><label>TOKENS<b>12.4k</b></label><label>费用<b>$0.031</b></label></div></div>
          </div>
        </div>
        <div class="hero-policies">
          <div class="policy-box service-boundary"><h3><ShieldCheck :size="16" />服务边界</h3><ul><li v-for="item in ['不主动将客户输入、输出、代码内容或业务数据用于通用模型训练、微调或蒸馏','不出售、出租、倒卖客户数据','不主动将客户数据用于广告营销、客户画像或对外案例展示','模型标识、Token 和费用以控制台使用日志为准','提供必要调用日志、费用统计、安全审计和异常核查能力','涉及第三方模型服务商、境外模型或境外节点的调用，以控制台展示和对应服务商规则为准']" :key="item"><CheckCircle2 :size="14" />{{ item }}</li></ul></div>
          <div class="policy-box warning-box"><h3><TriangleAlert :size="16" />高风险数据提示</h3><p>请勿通过平台提交国家秘密、工作秘密、核心数据、未履行合规手续的重要数据、未授权个人信息、敏感个人信息、未成年人个人信息、医疗健康信息、金融账户信息、账号密码、API Key、私钥、未脱敏客户名单或依法不得通过第三方模型服务处理的数据。</p></div>
        </div>
      </div>
    </section>

    <section class="model-marquee" aria-label="支持的模型和工具"><h2>覆盖主流编码模型与开发工具</h2><div class="marquee-row"><div class="marquee-track model-track"><div v-for="copy in 2" :key="copy" class="marquee-set" :aria-hidden="copy === 2"><span v-for="model in models" :key="model" class="model-pill"><Sparkles :size="15" />{{ model }}</span></div></div></div><div class="marquee-row tools-marquee"><div class="marquee-track tool-track"><div v-for="copy in 2" :key="copy" class="marquee-set" :aria-hidden="copy === 2"><span v-for="tool in tools" :key="tool" class="tool-pill"><Code2 :size="14" />{{ tool }}</span></div></div></div></section>

    <section class="features-section container"><span class="section-kicker">01 — 06</span><h2>把调用交给网关，六件事一次解决</h2><p class="section-subtitle">不改代码习惯，只换一个接入地址。路由、计费、审计与安全都在同一层完成。</p><div class="feature-grid"><article v-for="(feature, index) in features" :key="feature.title" class="feature-card" @pointermove="moveFeatureGlow" @pointerleave="resetFeatureGlow"><div class="feature-glow" aria-hidden="true"></div><div class="feature-top"><span class="feature-icon"><component :is="feature.icon" :size="21" /></span><span>{{ String(index + 1).padStart(2, '0') }}</span></div><h3>{{ feature.title }}</h3><p>{{ feature.desc }}</p></article></div></section>

    <section class="quick-section container"><div class="quick-copy"><span class="section-kicker">快速开始</span><h2>三步完成接入，继续用你熟悉的工具</h2><p class="section-subtitle">官方插件与 CLI 照常使用，只需要写入两份配置文件。</p><div class="steps"><article v-for="(step, index) in steps" :key="step.title" class="step-card" @pointermove="pointerTilt($event, 6, 6)" @pointerleave="resetTilt"><span class="step-number">{{ index + 1 }}</span><div><h3><component :is="step.icon" :size="17" />{{ step.title }}</h3><p>{{ step.desc }}</p></div></article></div><RouterLink class="arrow-link" to="/docs/getting-started">查看完整接入文档 <ArrowRight :size="17" /></RouterLink></div>
      <div class="code-panel"><div class="code-tabs"><button :class="{ selected: codeTab === 'Codex' }" @click="codeTab = 'Codex'">Codex</button><button :class="{ selected: codeTab === 'Claude Code' }" @click="codeTab = 'Claude Code'">Claude Code</button></div><div class="code-label">{{ codeTab === 'Codex' ? '~/.codex/config.toml' : '~/.claude/settings.json' }}</div><div class="code-block"><button :aria-label="copied === 'main' ? '已复制' : '复制代码'" @click="copyCode('main', codeTab === 'Codex' ? codexCode : claudeCode)"><Check v-if="copied === 'main'" :size="15" /><Copy v-else :size="15" /></button><pre>{{ codeTab === 'Codex' ? codexCode : claudeCode }}</pre></div><template v-if="codeTab === 'Codex'"><div class="code-label">~/.codex/auth.json</div><div class="code-block auth-block"><button :aria-label="copied === 'auth' ? '已复制' : '复制代码'" @click="copyCode('auth', authCode)"><Check v-if="copied === 'auth'" :size="15" /><Copy v-else :size="15" /></button><pre>{{ authCode }}</pre></div></template></div>
    </section>

    <section class="demo-section container"><span class="section-kicker"><CirclePlay :size="14" /> 视频教程 · Bilibili</span><h2><span>CodexZH</span> 功能演示</h2><p>从零到上手，跟着视频掌握 CodexZH 的核心功能与最佳实践。</p><div class="demo-pills"><span><Zap :size="17" />10 分钟快速上手</span><span><Code2 :size="17" />实战代码场景演示</span><span><BookOpen :size="17" />完整功能全覆盖</span></div><div ref="videoFrame" :class="['video-frame', { 'is-visible': videoVisible }]"><iframe title="CodexZH 功能演示视频" src="https://player.bilibili.com/player.html?bvid=BV1FwoFB3EH8&autoplay=0&danmaku=0" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div></section>
  </main>
</template>
