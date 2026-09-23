<script setup>
import { computed } from 'vue'
import { ChevronRight, Sparkles, Zap } from '@lucide/vue'

const props = defineProps({ model: { type: Object, required: true }, minHeight: { type: Number, default: 0 } })
const emit = defineEmits(['show-performance'])
const bars = computed(() => Array.from({ length: 24 }, (_, i) => props.model.status === '暂无数据' ? 'empty' : props.model.status === '异常' && [3, 16, 17, 18].includes(i) ? 'bad' : props.model.status === '波动' && i > 19 ? 'warn' : (i * 7 + props.model.name.length) % 17 === 0 ? 'warn' : 'good'))
function discounted(value) {
  if (!value) return '—'
  const amount = Number(value) * 0.25
  const digits = value === '12.50' ? 2 : Number.isInteger(amount * 100) ? 2 : Number.isInteger(amount * 1000) ? 3 : 4
  return `¥${amount.toFixed(digits)}`
}
function showPerformance() { emit('show-performance', props.model) }
</script>

<template>
  <article class="model-card" :style="{ minHeight: minHeight ? `${minHeight}px` : undefined }" tabindex="0" :aria-label="`${model.name}，查看最近 24 小时性能详情`" @click="showPerformance" @keydown.enter.self="showPerformance" @keydown.space.self.prevent="showPerformance">
    <div class="model-card-head">
      <span class="model-avatar"><Zap v-if="model.provider === 'xAI'" :size="20" /><Sparkles v-else :size="20" /></span>
      <span class="model-name"><strong>{{ model.name }}</strong><small>{{ model.provider }}</small></span>
      <button type="button" :class="['status', model.status === '正常' ? 'ok' : model.status === '波动' ? 'warning' : model.status === '异常' ? 'error' : 'none']" :aria-label="`${model.status}，查看 ${model.name} 最近 24 小时性能详情`" @click.stop="showPerformance"><span class="status-dot"></span>{{ model.status }}</button>
      <ChevronRight :size="16" class="model-chevron" />
    </div>
    <div v-if="model.tps" class="model-uptime">
      <div class="uptime-bars"><span v-for="(bar, index) in bars" :key="index" :class="bar"></span></div>
      <div class="uptime-metrics"><span>TPS <b>{{ model.tps }} t/s</b></span><span>延迟 <b>{{ model.latency }}s</b></span><span>成功率 <b>{{ model.success }}%</b></span><span class="uptime-period">近 24 小时</span></div>
    </div>
    <div v-else class="no-uptime">最近 24 小时暂无调用数据</div>
    <p class="model-description">{{ model.description }}</p>
    <div v-if="model.depths.length" class="model-depths"><span>支持深度:</span><b v-for="depth in model.depths" :key="depth">{{ depth }}</b></div>
    <div v-if="model.imagePrice" class="image-model-price">生成价格：<strong>{{ model.imagePrice }}</strong></div>
    <div v-else class="model-price-table">
      <div class="price-caption"><span>价格 / 百万 Token</span><small>DeepSeek 价格仅作对比，本站不提供该模型</small></div>
      <div class="model-table-row heading"><span>计费项</span><span>消费原价</span><span>套餐折扣后</span><span>DS-Flash</span><span>DS-Pro</span></div>
      <div v-for="row in [['输入', model.input], ['缓存输入', model.cached], ['写入缓存', model.write], ['输出', model.output]]" :key="row[0]" v-show="row[1]" class="model-table-row"><span>{{ row[0] }}</span><span>${{ row[1] }}</span><strong>{{ discounted(row[1]) }}</strong><span>{{ row[0] === '输入' ? '¥1/2' : row[0] === '缓存输入' ? '¥0.02/0.04' : row[0] === '输出' ? '¥4/8' : '—' }}</span><span>{{ row[0] === '输入' ? '¥4.5/9' : row[0] === '缓存输入' ? '¥0.15/0.30' : row[0] === '输出' ? '¥13.5/27' : '—' }}</span></div>
    </div>
  </article>
</template>
