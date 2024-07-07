<template>
  <el-menu style="width:100%" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <div class="flex-grow" />
    <el-menu-item :index="String(item.id)" v-for="(item, index) in naviList" :key="index" @click="clickNavi(item)">{{
      item.name }}</el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useNaviInfoStore, usePermissionStore } from '@/stores'
import { storeToRefs } from 'pinia'; 
// import EnumModule from '@/common/module/index.js'


const naviStore = useNaviInfoStore()
const permissionStore = usePermissionStore()

const { naviList } = storeToRefs(naviStore) // 获取导航内容
const { current } = storeToRefs(permissionStore) // 获取激活导航id

// 使用inject+键值接收，与provide键值对应
// const globalEnum = inject("globalConstEnum") 
// const naviList = Object.values(EnumModule.NAVI_LISTS) //navi菜单

let activeIndex = String(current.value.naviInfo.id)


const getSideTabEmit = defineEmits(['getSideTab'])
const clickNavi = (item) => {
  permissionStore.current.naviInfo = item
  // 上报 刷新sideTab
  getSideTabEmit('getSideTab', item.id)

}

</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

.el-menu--horizontal.el-menu {
  height: 50px;
}

.el-menu-item {
  padding: 13px;
  height: 50px;
  /* font-size:13px; */
  /* font-weight: 600; */
}
</style>