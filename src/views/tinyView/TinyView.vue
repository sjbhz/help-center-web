<template>
  <div class="about">
    <h1>This is a tinyMCE page</h1>
    <Tinymce v-model="content" @change="handleChange" width="100%" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Tinymce from '@/components/Tinymce/Tinymce.vue'

defineOptions({
  name: 'TinyView',
  inheritAttrs: false
})
// 引入tinymce
let content = ref('')
function handleChange (item) {
    console.log('change', item)
}

</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    /* display: flex; */
    /* align-items: center; */
  }
}
</style>
