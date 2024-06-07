<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index" @click="myClick(item)">
      <h1 style="cursor:pointer;">{{ item.text }}</h1>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { usePermissionStore } from '@/stores'
import { storeToRefs } from 'pinia';

const store = usePermissionStore()

</script>

<script setup>

const { current } = storeToRefs(store)

const breadcrumb = current.breadcrumb
// const { loadDocById } = mdController()

const myClick = (menu) => {
  // loadDocById(menu.id)
  //   .then((res) => {
  //     // 找到了文档
  //     Object.assign(current.docInfo, res)
  //   }).catch((res) => {
  //     // 没有文档
  //     Object.assign(current.docInfo, res)
  //   })
}
</script>