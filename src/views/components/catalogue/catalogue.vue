<template>
  <div
    style="position:fixed;width: 250px;right: 30px;top:120px;z-index: 100;"
  >
    <el-card class="box-card" style="margin-bottom: 20px;">
      <template #header>
        <div class="card-header">
          <span>目录导航</span>
        </div>
      </template>
      <!--目录导航-->
      <div
        v-for="(anchor, index) in titles"
        :key="index"
        :style="{ padding: `8px 0 8px ${anchor.indent * 20}px`, 'font-size':'14px'}"
        style="cursor: pointer"
        @click="handleAnchorClick(anchor)"
      >
        <!--目录连接-->
        <a style="cursor: pointer">{{ anchor.title }}</a>
      </div>
   </el-card>
  </div>
</template>

<script setup>
  // import { ElCard } from 'element-plus'

  /**
   * 文档的导航
   */
  const props = defineProps({
    titles: Object,
    handleAnchorClick: Function,
    preview: Object // 文档容器
  })

</script>