<template>
  <el-container class="all_main">
    <el-header style="border-bottom:1px solid var(--el-menu-border-color)">
      <!--导航-->
      <div style="float: left;margin:10px">
        <h2>帮助中心</h2>
      </div>
      <div style="float: right;min-width: 80px;height: 60px;padding-top: 13px;">
        <el-switch v-model="current.isView" v-bind="itemProps"></el-switch>
      </div>
      <div style="float: right;min-width: 600px;height: 60px;">
        <!--网站导航-->
        <docNavi></docNavi>
      </div>
    </el-header>

    <el-container class="main_container"> <!--左侧边栏-->
      <el-aside width="300px">
        <menuEdit />
      </el-aside>
      <el-main class="content_editor">
        <!--文档区域-->
        <!-- <component :is="docControl[current.isView]" /> -->
        <docViewMain @getArticleContent="getArticleContent" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import docNavi from "@/views/components/docNavi/docNavi.vue"; //顶层导航
import menuEdit from "@/views/components/docMenu/menuEdit.vue"; //左侧菜单编辑
// import docPreview from "./docPreview.vue";
import { getSideTabs } from '@/api/config'
import docViewMain from "./docViewMain.vue";
import { defineAsyncComponent, watch } from 'vue'
import { useNaviInfoStore, usePermissionStore } from '@/stores' // 访问状态
import { storeToRefs } from 'pinia';


const naviStore = useNaviInfoStore()
const permissionStore = usePermissionStore()
const { current } = storeToRefs(permissionStore) // 获取激活导航id
// const containerH = window.innerHeight || document.documentElement.clientHeight - 280 

// 加载菜单子控件
// const docControl = {
//   true: docPreview,
//   false: defineAsyncComponent(() => import("./docViewMain.vue"))
// };

const itemProps = {
  "inline-prompt": true,
  "active-text": "看",
  "inactive-text": "写",
  "active-color": "#378FEB",
  "inactive-color": "#EA9712"
};

// 监听状态变化，提示保存
watch(current, () => {
  console.log('监听的current改变了')
})

const getArticleContent = (htmlcontent) => {
  // console.log('htmlcontent--', htmlcontent)
}

const getSideTabLists = (topId) => {
  let data = {}
  // return getSideTabs(topId, data).then((res) => {

  //=======================mock数据
  let res = {
    success: true,
    data: []
  }
  //=======================mock数据

  if (res && res.success) {
    if (res.success) {
      let cmenuList = res.data || []
      permissionStore.menuList = cmenuList
      // 保存当前菜单的第一个tab为激活态
      if (cmenuList.length > 0) {
        permissionStore.current.menuInfo = cmenuList[0]
      }
    }
  } else {
    ElMessage.error(res.message)
  }
  // })
}

</script>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .all_main {
    min-height: 100vh;

    .main_container {
      height: calc(100vh - 100px);

      // border:1px solid red;
      .content_editor {}
    }
  }
}
</style>
