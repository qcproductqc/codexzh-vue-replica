import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import PricingPage from './pages/PricingPage.vue'
import DocsPage from './pages/DocsPage.vue'
import ModelsPage from './pages/ModelsPage.vue'
import FaqPage from './pages/FaqPage.vue'
import './style.css'
import './pages.css'
import './responsive.css'
import './home-motion.css'
import './other-pages.css'

const routes = [
  { path: '/', component: HomePage, meta: { title: 'CodexZH - Codex 中文包月接入' } },
  { path: '/pricing', component: PricingPage, meta: { title: 'Codex 价格与套餐 - CodexZH' } },
  { path: '/docs/getting-started', component: DocsPage, meta: { title: 'Codex 接入指南 - CodexZH' } },
  { path: '/models', component: ModelsPage, meta: { title: 'Codex 支持的模型与价格 - CodexZH' } },
  { path: '/faq', component: FaqPage, meta: { title: 'CodexZH 常见问题解答' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({ history: createWebHistory(), routes, scrollBehavior(to) { return to.hash ? { el: to.hash, behavior: 'smooth' } : { top: 0 } } })
router.afterEach(to => { document.title = to.meta.title || 'CodexZH' })
createApp(App).use(router).mount('#app')
