<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { Activity, Gauge, HeartPulse, Timer, X } from '@lucide/vue'

const props = defineProps({ model: { type: Object, required: true } })
const emit = defineEmits(['close'])
const displayTps = computed(() => props.model.tps ? `${props.model.tps} t/s` : '—')
const displayLatency = computed(() => props.model.latency ? `${props.model.latency}s` : '—')
const displaySuccess = computed(() => props.model.success ? `${props.model.success}%` : '—')
const chartPoints = computed(() => Array.from({ length: 24 }, (_, i) => {
  const value = 2.4 + 1.5 * Math.exp(-i / 5) + Math.sin(i * 1.45 + props.model.name.length) * (i < 7 ? 1.4 : .25)
  return `${25 + i * 22},${150 - Math.max(.6, Math.min(7.2, value)) * 18}`
}).join(' '))
const availabilityPoints = computed(() => Array.from({ length: 24 }, (_, i) => `${25 + i * 22},${52 + ((i * 11 + props.model.name.length) % 9 === 0 ? 17 : (i % 5) * 1.2)}`).join(' '))
let previousOverflow = ''
function onKeydown(event) { if (event.key === 'Escape') emit('close') }
onMounted(() => { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; window.addEventListener('keydown', onKeydown) })
onUnmounted(() => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeydown) })
</script>

<template>
  <div class="performance-backdrop" @click="emit('close')"></div>
  <aside class="performance-drawer" role="dialog" aria-modal="true" :aria-label="`${model.name} 性能详情`">
    <header class="performance-head"><div><h2>{{ model.name }}</h2><p>性能详情（最近 24 小时） · 演示数据</p></div><button type="button" aria-label="关闭性能详情" @click="emit('close')"><X :size="20" /></button></header>
    <div class="performance-body">
      <div class="performance-stats"><div><small><Gauge :size="14" />TPS</small><strong>{{ displayTps }}</strong><span>持续每秒输出 Token 数</span></div><div><small><Timer :size="14" />平均延迟</small><strong>{{ displayLatency }}</strong><span>首 Token 延迟 {{ model.latency ? (Number(model.latency) / 10).toFixed(2) : '—' }}s</span></div><div><small><HeartPulse :size="14" />成功率</small><strong class="success-value">{{ displaySuccess }}</strong><span>最近 24 小时性能概览</span></div></div>
      <section class="performance-section"><h3><HeartPulse :size="15" />各分组性能</h3><p>平均延迟、首 Token 延迟、TPS 和成功率</p><div class="performance-table"><div class="performance-table-head"><span>分组</span><span>TPS</span><span>平均首 Token 延迟</span><span>平均延迟</span><span>成功率</span></div><div class="performance-table-row"><b>default</b><span>{{ displayTps }}</span><span>{{ model.latency ? (Number(model.latency) / 10).toFixed(2) + 's' : '—' }}</span><span>{{ displayLatency }}</span><span class="small-success-bars"><i v-for="i in 16" :key="i"></i><b>{{ displaySuccess }}</b></span></div></div><small class="performance-note">仅展示公开分组；成功率竖条为最近 16 个时段</small></section>
      <section class="performance-section"><h3><Timer :size="15" />延迟趋势（最近 24 小时）</h3><p>平均首 Token 延迟</p><div class="performance-chart"><svg viewBox="0 0 560 180" preserveAspectRatio="none" aria-label="最近 24 小时延迟趋势"><line v-for="y in [20, 65, 110, 155]" :key="y" x1="25" :y1="y" x2="540" :y2="y" stroke="#edf0f3" stroke-dasharray="4 4" /><polyline :points="chartPoints" fill="none" stroke="#de704d" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" /></svg><div class="chart-labels"><span>01:00</span><span>05:00</span><span>09:00</span><span>13:00</span><span>17:00</span><span>21:00</span></div></div></section>
      <section class="performance-section"><h3><Activity :size="15" />可用率（最近 24 小时）</h3><p>请求成功率（按时段）</p><div class="performance-chart availability-chart"><svg viewBox="0 0 560 100" preserveAspectRatio="none" aria-label="最近 24 小时成功率趋势"><line x1="25" y1="55" x2="540" y2="55" stroke="#edf0f3" stroke-dasharray="4 4" /><polyline :points="availabilityPoints" fill="none" stroke="#159b75" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" /></svg></div></section>
    </div>
  </aside>
</template>
