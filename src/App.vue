<script setup>
import { onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight, BookOpen, ChevronDown, ExternalLink, Globe2, Mail, Menu, Moon, Send, Sun, X } from '@lucide/vue'

const route = useRoute()
const menuOpen = ref(false)
const moreOpen = ref(false)
const langOpen = ref(false)
const language = ref('中文')
const dark = ref(false)
const loginOpen = ref(false)
const loginMode = ref('code')
const email = ref('')
const password = ref('')
const notice = ref('')
const assistantOpen = ref(false)
const headerScrolled = ref(false)
const navShell = ref(null)
const question = ref('')
const chatMessages = ref([])
const suggestions = ['如何使用 CodexZH?', '我已经运行一键脚本配置了，为什么还需要登录、输入 API Key?', '我用着用着就报 401 开头的错误了，怎么办?']
const nav = [
  { label: '首页', to: '/' },
  { label: '教程', to: '/docs/getting-started', external: true },
  { label: '套餐定价', to: '/pricing' },
  { label: '模型介绍', to: '/models' },
  { label: '常见问题', to: '/faq' },
]
function openLogin() { loginOpen.value = true; menuOpen.value = false }
function syncHeader() { headerScrolled.value = window.scrollY > 40 }
function syncNavShift() {
  const shell = navShell.value
  if (!shell || window.innerWidth < 1200) return
  const [brand, center, login] = shell.children
  const freeSpace = shell.clientWidth - brand.offsetWidth - center.offsetWidth - login.offsetWidth
  shell.style.setProperty('--nav-shift', `${Math.max(0, freeSpace / 2 - 12)}px`)
}
onMounted(() => {
  syncNavShift()
  syncHeader()
  document.fonts?.ready.then(syncNavShift)
  window.addEventListener('scroll', syncHeader, { passive: true })
  window.addEventListener('resize', syncNavShift, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', syncHeader)
  window.removeEventListener('resize', syncNavShift)
})
function closeMenus() { menuOpen.value = false; moreOpen.value = false; langOpen.value = false }
function toggleTheme() { dark.value = !dark.value; document.documentElement.classList.toggle('dark', dark.value) }
function showNotice(text) { notice.value = text; setTimeout(() => { if (notice.value === text) notice.value = '' }, 3500) }
function selectLanguage(item) { language.value = item; langOpen.value = false; if (item === 'English') showNotice('英文版内容将在后续阶段接入') }
function submitLogin() {
  if (!/^\S+@\S+\.\S+$/.test(email.value)) return showNotice('请输入有效的邮箱地址')
  if (loginMode.value === 'password' && !password.value) return showNotice('请输入密码')
  showNotice('登录界面已还原，账号服务尚未接入')
}
function askAssistant(text = question.value) {
  const clean = text.trim()
  if (!clean) return
  chatMessages.value.push({ role: 'user', text: clean })
  const reply = /401/.test(clean) ? '请先核对 API Key、接口地址与配置文件是否一致。Codex CLI 的地址应包含 /v1。' : /脚本|登录|API Key/.test(clean) ? '一键脚本负责写入配置，仍需登录控制台开通套餐并生成专属 API Key。' : '建议先阅读接入指南：选择客户端、开通套餐并写入配置文件，再发送一条测试请求。'
  chatMessages.value.push({ role: 'assistant', text: reply })
  question.value = ''
}
watch(() => route.fullPath, closeMenus)
provide('openLogin', openLogin)
provide('showNotice', showNotice)
</script>

<template>
  <a class="skip-link" href="#main">跳转到主内容</a>
  <header :class="['site-header', { 'is-scrolled': headerScrolled }]">
    <nav ref="navShell" class="nav-shell" aria-label="主导航">
      <RouterLink class="brand" to="/" @click="closeMenus"><span class="brand-mark">CZ</span><strong>CodexZH</strong></RouterLink>
      <div class="desktop-nav">
        <RouterLink v-for="item in nav" :key="item.to" :to="item.to" :class="['nav-link', { active: route.path === item.to }]">{{ item.label }}<ExternalLink v-if="item.external" :size="12" /></RouterLink>
        <div class="dropdown-wrap">
          <button class="nav-link nav-button" :aria-expanded="moreOpen" @click="moreOpen = !moreOpen; langOpen = false">更多中转 <ChevronDown :size="14" /></button>
          <div v-if="moreOpen" class="nav-popover more-popover">
            <a href="https://ccodezh.com/" target="_blank" rel="noopener noreferrer">Claude Code 按量中转 <ExternalLink :size="13" /></a>
            <RouterLink to="/docs/getting-started">接入指南 <ArrowRight :size="13" /></RouterLink>
          </div>
        </div>
        <span class="nav-separator"></span>
        <div class="dropdown-wrap">
          <button class="icon-button" aria-label="切换语言" :aria-expanded="langOpen" @click="langOpen = !langOpen; moreOpen = false"><Globe2 :size="17" /></button>
          <div v-if="langOpen" class="nav-popover language-popover"><button v-for="item in ['中文', 'English']" :key="item" @click="selectLanguage(item)">{{ item }} <span v-if="language === item">✓</span></button></div>
        </div>
        <button class="icon-button" :aria-label="dark ? '切换浅色主题' : '切换深色主题'" @click="toggleTheme"><Moon v-if="dark" :size="18" /><Sun v-else :size="18" /></button>
      </div>
      <button class="header-login btn btn-primary" @click="openLogin">登录</button>
      <div class="mobile-actions"><button class="mobile-login" @click="openLogin">登录</button><button class="mobile-menu-button" :aria-expanded="menuOpen" aria-label="菜单" @click="menuOpen = !menuOpen"><X v-if="menuOpen" :size="21" /><Menu v-else :size="21" /></button></div>
    </nav>
    <div v-if="menuOpen" class="mobile-menu"><RouterLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</RouterLink><a href="https://ccodezh.com/" target="_blank">更多中转</a><div class="mobile-menu-tools"><button @click="toggleTheme">{{ dark ? '浅色主题' : '深色主题' }}</button><button @click="selectLanguage(language === '中文' ? 'English' : '中文')">语言：{{ language }}</button></div></div>
  </header>

  <RouterView />

  <footer class="site-footer">
    <div class="footer-main container">
      <div class="footer-about"><RouterLink class="brand" to="/"><span class="brand-mark">CZ</span><strong>CodexZH</strong></RouterLink><p>面向开发团队和企业客户的 AI 模型接入网关，提供统一 API、模型路由、费用统计、调用审计和安全控制能力。</p><a class="mail-icon" href="mailto:support@codexzh.com" aria-label="发送邮件"><Mail :size="17" /></a></div>
      <div class="footer-links"><h3>产品</h3><RouterLink to="/pricing">定价方案</RouterLink><RouterLink to="/models">模型说明</RouterLink><RouterLink to="/faq">常见问题</RouterLink></div>
      <div class="footer-links"><h3>资源</h3><RouterLink to="/docs/getting-started">接入指南</RouterLink><a href="https://codexzh.com/docs/troubleshooting" target="_blank">排障与指南</a><a href="https://docs.codexzh.com/codex/" target="_blank">完整教程（文档站）</a><a href="https://docs.codexzh.com/choose" target="_blank">不知道选哪个？</a><a href="https://codexzh.com/data-security" target="_blank">数据安全说明</a><a href="https://codexzh.com/acceptable-use" target="_blank">可接受使用政策</a></div>
      <div class="footer-links"><h3>支持</h3><a href="mailto:support@codexzh.com">安全事件反馈</a><a href="mailto:support@codexzh.com">联系我们</a></div>
    </div>
    <div class="footer-bottom container"><span>© 2025 CodexZH. 版权所有</span><div><a href="https://codexzh.com/privacy">隐私政策</a><a href="https://codexzh.com/terms">服务条款</a><a href="https://codexzh.com/cookies">Cookie 政策</a><a href="https://codexzh.com/data-security">数据安全说明</a><a href="mailto:support@codexzh.com">安全事件反馈</a></div><a class="service-ok" href="https://status.codexzh.com" target="_blank"><span></span>服务正常 ↗</a></div>
  </footer>

  <button class="assistant-fab" :aria-expanded="assistantOpen" @click="assistantOpen = !assistantOpen"><BookOpen :size="16" /><span>文档助手</span></button>
  <div v-if="assistantOpen" class="assistant-panel" role="dialog" aria-label="文档助手"><div class="assistant-panel-head"><span><BookOpen :size="17" />文档助手</span><button aria-label="关闭文档助手" @click="assistantOpen = false"><X :size="18" /></button></div><div class="assistant-panel-body"><div class="assistant-welcome"><BookOpen :size="21" /><div><p>你好！</p><p>我是基于文档站内容回答问题的 AI 助手，安装配置、模型使用、计费套餐、常见故障都可以问我。</p><p>尽管问我关于 <strong>CodexZH 文档</strong> 的问题。</p></div></div><div v-for="(message, index) in chatMessages" :key="index" :class="['assistant-message', message.role]">{{ message.text }}</div></div><div class="assistant-panel-bottom"><template v-if="!chatMessages.length"><small>示例问题</small><button v-for="suggestion in suggestions" :key="suggestion" class="assistant-suggestion" @click="askAssistant(suggestion)">{{ suggestion }}</button></template><form @submit.prevent="askAssistant()"><input v-model="question" aria-label="输入你的问题" placeholder="输入你的问题..." /><button type="submit" aria-label="发送问题"><Send :size="17" /></button></form><small class="assistant-disclaimer">回答由 AI 生成，请以文档原文为准</small></div></div>
  <div v-if="notice" class="toast" role="status">{{ notice }}</div>

  <div v-if="loginOpen" class="modal-backdrop" @click.self="loginOpen = false">
    <div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title"><button class="modal-close" aria-label="关闭" @click="loginOpen = false"><X :size="20" /></button><h2 id="login-title">登录</h2><p>我们将向您的邮箱发送验证码进行登录</p>
      <div class="login-tabs"><button :class="{ selected: loginMode === 'code' }" @click="loginMode = 'code'">验证码登录</button><button :class="{ selected: loginMode === 'password' }" @click="loginMode = 'password'">密码登录</button></div>
      <form @submit.prevent="submitLogin"><label for="login-email">邮箱地址</label><div class="field-with-icon"><Mail :size="19" /><input id="login-email" v-model="email" type="email" placeholder="输入您的邮箱地址" autocomplete="email" /></div><template v-if="loginMode === 'password'"><label for="login-password">密码</label><input id="login-password" v-model="password" type="password" placeholder="输入密码" autocomplete="current-password" /></template><button class="btn btn-primary submit-login" type="submit">{{ loginMode === 'code' ? '发送验证码' : '登录' }}</button></form>
      <div class="or-divider">或</div><button class="google-button" @click="showNotice('第三方登录尚未接入')"><span class="google-g">G</span>使用 Google 账号登录</button><small>登录即表示您同意我们的<a href="https://codexzh.com/terms">服务条款</a>和<a href="https://codexzh.com/privacy">隐私政策</a></small>
    </div>
  </div>
</template>
