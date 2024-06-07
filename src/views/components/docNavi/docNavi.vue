<template>
  <el-menu style="width:100%" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <div class="flex-grow" />
    <el-menu-item :index="String(index + 1)" v-for="(item, index) in naviList" :key="index" @click="clickNavi(item)">{{
      item.text }}</el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useNaviInfoStore, usePermissionStore } from '@/stores'
import { storeToRefs } from 'pinia';
import EnumModule from '@/common/module/index.js'
import { getSideTabs } from '@/api/config'

const naviStore = useNaviInfoStore()
const permissionStore = usePermissionStore()

// const { naviList } = storeToRefs(naviStore) // 获取导航内容
const { current, menuList } = storeToRefs(permissionStore) // 获取激活导航id

// 使用inject+键值接收，与provide键值对应
// const globalEnum = inject("globalConstEnum") 
const naviList = Object.values(EnumModule.NAVI_LISTS) //navi菜单
// const activeIndex = ref(null)
let activeIndex = String(current.value.naviInfo.id)




// 获取侧边菜单
const getSideTabLists = (topId) => {
  let data = {}
  // return getSideTabs(topId, data).then((res) => {

  //=======================mock数据
  let res = {
    success: true,
    data: menuList
  }
  //=======================mock数据

  if (res.success) {
    let cmenuList = res.data || []
    permissionStore.menuList = cmenuList
    permissionStore.current.htmlContent = ''

    // 找到第一个type！=-1的菜单作为激活态
    let firstActiveMenu = cmenuList.value.find(item => item.type != -1)
    if (firstActiveMenu) {
      permissionStore.current.menuInfo = firstActiveMenu
    }
  } else {
    ElMessage.error(res.message)
  }

  // })
}

const clickNavi = (item) => {
  permissionStore.current.naviInfo = item
  getSideTabLists(item.id)

}

</script>

<style>
.flex-grow {
  flex-grow: 1;
}

.el-menu--horizontal.el-menu {}
</style>