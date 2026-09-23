<script setup>
import { inject } from 'vue'
import { CalendarDays, CircleHelp, Info, TrendingUp, Wallet } from '@lucide/vue'
import { plans, pricingFaq } from '../data'
import FaqAccordion from '../components/FaqAccordion.vue'
const openLogin = inject('openLogin')
</script>

<template>
  <main id="main" class="pricing-page page-top"><div class="page-glow"></div><div class="container pricing-container"><div class="center-intro"><h1>Codex 价格与套餐</h1><p>日卡与月卡均为固定价，月卡按周限额度使用、每周一 0 点重置；额度按实际调用模型的定价规则扣减。余额、用量和扣费明细以控制台展示为准。</p><div class="intro-note"><Info :size="15" />支持 GPT、Grok 等多系列模型，型号与价格见 <RouterLink to="/models">/models 页面</RouterLink>；第三方模型服务边界见<a href="https://codexzh.com/data-security#third-party-models" target="_blank">数据安全说明</a></div></div>
    <div class="plan-grid"><article v-for="plan in plans" :key="plan.name" :class="['plan-card', { featured: plan.featured }]"><span class="plan-badge">{{ plan.badge }}</span><h2>{{ plan.name }}</h2><p v-if="plan.intro" class="plan-intro">{{ plan.intro }}</p><p v-if="plan.note" class="plan-note">请勿购买加油包，加油包只在套餐时长内有效。</p><div class="plan-price"><strong>¥{{ plan.price }}</strong><span>/{{ plan.unit }}</span></div><div class="plan-details"><div v-if="plan.weekly"><span class="detail-icon"><CalendarDays :size="18" /></span><span>周限额度：{{ plan.weekly }}</span></div><div v-if="!plan.weekly"><span class="detail-icon"><Wallet :size="18" /></span><span>总额度：{{ plan.total }}</span></div><div><span class="detail-icon"><CalendarDays :size="18" /></span><span>套餐时长：{{ plan.duration }}</span></div><div v-if="plan.weekly"><span class="detail-icon"><TrendingUp :size="18" /></span><span>总额度：{{ plan.total }} <CircleHelp :size="13" class="muted-icon" title="在套餐有效期内可使用的总额度" /></span></div><small v-if="plan.note">{{ plan.note }}</small></div><button class="btn btn-primary plan-button" @click="openLogin">立即购买</button><p class="payment-note">支付渠道 · 透明价格</p></article></div>
    <section class="pricing-faq"><div><h2>价格常见问题</h2><p>购买前最常被问到的额度、计时与支付问题。</p><RouterLink to="/faq">查看全部问题 →</RouterLink></div><FaqAccordion :items="pricingFaq" /></section>
  </div></main>
</template>
