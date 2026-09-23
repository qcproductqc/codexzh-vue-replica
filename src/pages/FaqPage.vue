<script setup>
import { computed, ref } from 'vue'
import { Box, CircleHelp, Coins, Search, Settings2 } from '@lucide/vue'
import { faqGroups } from '../data'
import FaqAccordion from '../components/FaqAccordion.vue'
const query = ref('')
const icons = [Box, Coins, Settings2, CircleHelp]
const categoryIds = ['product', 'pricing', 'configuration', 'errors']
const filteredGroups = computed(() => faqGroups.map(group => ({ ...group, items: group.items.filter(([q, a]) => (q + a).toLowerCase().includes(query.value.trim().toLowerCase())) })).filter(group => group.items.length))
</script>

<template>
  <main id="main" class="faq-page page-top"><div class="page-glow"></div><div class="container faq-container"><div class="center-intro faq-intro"><span class="section-kicker">帮助中心</span><h1>CodexZH 常见问题解答</h1><p>基于真实用户反馈，解答产品功能、价格额度、配置接入与常见报错等问题。</p><div class="faq-metadata"><span>32 个问题</span><span>4 个分类</span><span>更新于 2026-09</span></div><label class="search-field faq-search"><Search :size="18" /><input v-model="query" aria-label="搜索问题" placeholder="搜索问题或关键词，例如 401、额度、插件" /></label></div>
    <div class="faq-layout"><aside class="faq-sidebar"><h2>问题分类</h2><a v-for="(group, index) in faqGroups" :key="group.title" :href="`#faq-category-${categoryIds[index]}`"><component :is="icons[index]" :size="16" /><span>{{ group.title }}</span><small>{{ group.items.length }}</small></a></aside><div id="faq-content" class="faq-content"><section v-for="group in filteredGroups" :id="`faq-category-${categoryIds[faqGroups.findIndex(g => g.title === group.title)]}`" :key="group.title" class="faq-group"><h2><span><component :is="icons[faqGroups.findIndex(g => g.title === group.title)]" :size="19" /></span>{{ group.title }} <small>{{ group.items.length }}</small></h2><FaqAccordion :items="group.items" /></section><div v-if="!filteredGroups.length" class="faq-empty">没有找到相关问题，请尝试其他关键词。</div><p class="faq-end">如有其他问题，请登录后在控制台底部联系客服获取帮助</p></div></div>
  </div></main>
</template>
