<template>
  <!-- :indent-with-tab="true" 是否自动获取焦点-->
  <codemirror
    v-model="code"
    placeholder="请输入"
    :style="{ height: '100%' }"
    :autofocus="true"
    :tabSize="2"
    :extensions="extensions"
  />
</template>

<script lang="ts" setup>
import { Codemirror } from 'vue-codemirror'
import { ref, defineProps } from 'vue'

// 接受的参数
const props = withDefaults(defineProps(), {
  height: '400px'
})
const code = ref(``)
const extensions = []
const Change = () => {}
</script>
