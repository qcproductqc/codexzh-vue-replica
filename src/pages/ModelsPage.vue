<script setup>
import { computed, ref } from 'vue'
import { Search, Sparkles } from '@lucide/vue'
import ModelCard from '../components/ModelCard.vue'
import ModelPerformanceDrawer from '../components/ModelPerformanceDrawer.vue'

const filter = ref('全部')
const query = ref('')
const selectedModel = ref(null)
const tabs = ['全部', '标准系列', 'Claude Code 支持系列', '特色系列', '图像生成系列']
const baseModels = [
  { name: 'gpt-6-astra', provider: 'OpenAI', category: '标准系列', description: 'OpenAI 面向高难度端到端任务的旗舰模型，适合复杂推理、编码、计算机操作、研究与文档创作。支持文本与图像输入、文本输出，拥有 1,050,000 Token 上下文窗口，最大输出 128,000 Token，知识截止于 2026 年 4 月 30 日。本站不区分上下文长度，所有请求统一按下方短上下文档价格计费。', depths: ['Low', 'Medium', 'High', 'xhigh', 'Max'], input: '10.00', cached: '1.00', write: '12.50', output: '50.00', status: '正常', tps: '21.5', latency: '26.19', success: '99.7' },
  { name: 'gpt-6-sol', provider: 'OpenAI', category: '标准系列', description: 'GPT-6 系列均衡模型，以接近旗舰模型的推理与编码能力，适合日常编程辅助、智能体任务和生产工作流，也适合兼顾速度与成本的开发需求。', depths: ['Low', 'Medium', 'High', 'xhigh'], input: '2.00', cached: '0.20', write: '2.50', output: '10.00', status: '波动', tps: '24.7', latency: '19.65', success: '97.7' },
  { name: 'gpt-5.6-sol', provider: 'OpenAI', category: '标准系列', description: 'GPT-5.6 系列旗舰模型，在复杂编码、长程任务规划和深度研究方面表现突出。适合需要连续分析多个文件、制定工程计划并完成实施的高难度任务，最大输出 128K Token。', depths: ['Low', 'Medium', 'High', 'xhigh'], input: '4.00', cached: '0.40', write: '5.00', output: '20.00', status: '正常', tps: '21.7', latency: '25.15', success: '99.8' },
  { name: 'gpt-5.6-terra', provider: 'OpenAI', category: '标准系列', description: 'GPT-5.6 系列均衡型模型，在能力、速度与成本之间取得良好平衡，适合作为日常编程辅助的主力模型。', depths: ['Low', 'Medium', 'High', 'xhigh'], input: '2.50', cached: '0.25', write: '3.125', output: '15.00', status: '异常', tps: '25.8', latency: '23.26', success: '84.9' },
  { name: 'gpt-5.6-luna', provider: 'OpenAI', category: '标准系列', description: 'GPT-5.6 系列高性价比模型，响应快、吞吐高，适合摘要提取、分类标注等高频场景。', depths: ['Low', 'Medium', 'High'], input: '1.00', cached: '0.10', write: '1.25', output: '6.00', status: '暂无数据' },
  { name: 'grok-4.5', provider: 'xAI', category: '标准系列', description: 'xAI 旗舰模型，适合编码、智能体任务和知识工作，支持长上下文窗口与可配置推理深度。', depths: ['Low', 'Medium', 'High'], input: '2.00', cached: '0.50', output: '6.00', status: '正常', tps: '50.1', latency: '18.81', success: '99.2' },
  { name: 'grok-4.6', provider: 'xAI', category: '标准系列', description: 'xAI 新一代模型，面向编码、智能体任务和知识工作，支持多档可配置推理深度。', depths: ['Low', 'Medium', 'High'], input: '2.00', cached: '0.50', output: '6.00', status: '异常', tps: '69.2', latency: '12.09', success: '76.7' },
]
const claudeModels = baseModels.map(model => ({ ...model, name: `cc-${model.name}`, category: 'Claude Code 支持系列', description: `映射自 ${model.name}，可在 Claude Code 客户端中使用。`, status: model.name === 'gpt-6-astra' ? '波动' : model.status }))
const others = [
  { name: 'codex-auto-review', provider: 'OpenAI', category: '特色系列', description: 'Codex 远程自动审查专用模型，用于代码审查、风险识别和回归检查。', depths: ['Low', 'Medium', 'High', 'xhigh'], input: '5.00', cached: '0.50', output: '30.00', status: '正常' },
  { name: 'gpt-image-2', provider: 'OpenAI', category: '图像生成系列', description: '支持文生图和图生图，按次扣除额度。', depths: [], imagePrice: '$0.50 / 次', status: '正常' },
  { name: 'gpt-image-2.5', provider: 'OpenAI', category: '图像生成系列', description: '支持高分辨率图像生成与编辑，按次扣除额度。', depths: [], imagePrice: '$0.50 / 次', status: '正常' },
]
const allModels = [...baseModels, ...claudeModels, ...others]
const groups = computed(() => tabs.slice(1).map(title => ({ title, items: allModels.filter(model => (filter.value === '全部' || model.category === filter.value) && model.category === title && model.name.toLowerCase().includes(query.value.trim().toLowerCase())) })).filter(group => group.items.length))
function cardHeight(category, index) { const heights = { '标准系列': [543, 543, 523, 523, 500, 500, 439], 'Claude Code 支持系列': [475, 475, 452, 452, 452, 452, 416], '特色系列': [461], '图像生成系列': [293, 293] }; return heights[category]?.[index] || 468 }
</script>

<template>
  <main id="main" class="models-page page-top">
    <div class="container models-container">
      <h1>Codex 支持的模型与价格</h1>
      <div class="model-filterbar">
        <div class="model-tabs"><button v-for="tab in tabs" :key="tab" :class="{ selected: filter === tab }" @click="filter = tab">{{ tab }}</button></div>
        <label class="search-field model-search"><Search :size="17" /><input v-model="query" aria-label="搜索模型名称" placeholder="搜索模型名称" /></label>
      </div>
      <div class="models-disclaimer"><strong>以下说明适用于全部模型</strong><div><span>平台是否用于训练<strong>否</strong></span><span>第三方训练规则<strong>已默认关闭用于模型训练</strong></span><span>输入输出保存<strong>默认不长期保存完整输入输出</strong></span></div><p>模型能力、价格、上下文长度、速率限制、内容安全策略、服务可用性和数据处理规则可能受模型服务商影响。平台不保证任何第三方模型永久可用或输出内容完全准确。</p></div>
      <section v-for="group in groups" :key="group.title" :class="['model-group', group.title === '标准系列' ? 'standard-group' : group.title === 'Claude Code 支持系列' ? 'claude-group' : group.title === '特色系列' ? 'special-group' : 'image-group']">
        <h2><span class="model-group-icon"><Sparkles :size="20" /></span>{{ group.title }} <small>{{ group.items.length }}</small></h2>
        <p v-if="group.title === 'Claude Code 支持系列'" class="group-note">通过协议格式适配，可在 Claude Code 客户端中使用。所有 cc- 开头的模型均经过协议转换。</p>
        <p v-if="group.title === '图像生成系列'" class="group-note">通过 gpt-image-2 或 gpt-image-2.5 在 Codex 中生成图片，按次扣除额度，支持文生图和图生图。</p>
        <div class="model-card-grid"><ModelCard v-for="(model, index) in group.items" :key="model.name" :model="model" :min-height="cardHeight(group.title, index)" @show-performance="selectedModel = $event" /></div>
      </section>
      <div v-if="!groups.length" class="model-empty">没有找到匹配的模型。</div>
      <section class="models-next"><h2>下一步</h2><div><RouterLink to="/pricing">查看套餐与价格 →</RouterLink><RouterLink to="/docs/getting-started">接入指南 →</RouterLink><a href="https://docs.codexzh.com/codex/model-selection" target="_blank" rel="noopener noreferrer">如何选择模型与推理深度 ↗</a></div></section>
    </div>
    <ModelPerformanceDrawer v-if="selectedModel" :model="selectedModel" @close="selectedModel = null" />
  </main>
</template>
