<script setup>
import { ref } from 'vue'
import { ChevronDown } from '@lucide/vue'
defineProps({ items: { type: Array, required: true } })
const open = ref(-1)
</script>

<template>
  <div class="faq-accordion"><div v-for="([question, answer], index) in items" :key="question" class="faq-row"><button :aria-expanded="open === index" @click="open = open === index ? -1 : index"><span>{{ question }}</span><ChevronDown :size="17" :class="{ rotated: open === index }" /></button><div :class="['faq-answer-reveal', { open: open === index }]" :aria-hidden="open !== index"><div><div class="faq-answer">{{ answer }}</div></div></div></div></div>
</template>
