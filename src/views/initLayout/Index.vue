<template>
  <div>
    <el-container class="all_main">
      <el-header style="border-bottom:1px solid var(--el-menu-border-color);height:50px;">
        <!--导航-->
        <div style="float: left;margin:10px;font-size:18px;font-weight:bold;">
          <div>帮助中心</div>
        </div>
        <div style="float: right;min-width: 50px;height: 50px;padding-top: 8px;">
          <span v-if="!current.isView">
            <el-dropdown style="vertical-align: middle;">
              <span class="el-dropdown-link" style="margin-right:25px;margin-left:3px">
                <el-icon>
                  <tools style="width: 0.9em; height: 0.9em; color:#666;cursor:pointer" />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="addNavi">新建</el-dropdown-item>
                  <el-dropdown-item @click="editNavi">编辑</el-dropdown-item>
                  <el-dropdown-item @click="delNavi">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
          <el-switch v-model="current.isView" v-bind="itemProps" v-if="user.isAdmin == 1"></el-switch>
        </div>

        <div style="float: right;min-width: 600px;height: 50px;">
          <!--网站导航-->
          <docNavi @getSideTab="getSideTab"></docNavi>
        </div>
      </el-header>

      <el-container class="main_container"> <!--左侧边栏-->
        <el-aside width="275px">
          <menuEdit @getSideTab="getSideTab" :sideTabLoading="sideTabLoading" />
        </el-aside>
        <el-main class="content_editor">
          <!--文档区域-->
          <!-- <component :is="docControl[current.isView]" :htmlContent="current.htmlContent"/> -->
          <docViewMain @getArticleContent="getArticleContent" />
        </el-main>

      </el-container>
    </el-container>

    <dialogAddNavi ref="dialogChildAddNavi" :current="current" :dialogNaviInfo="dialogNaviInfo" />
  </div>
</template>

<script setup>
import { Tools } from '@element-plus/icons-vue'
import docNavi from "@/views/components/docNavi/docNavi.vue"; //顶层导航
import menuEdit from "@/views/components/docMenu/menuEdit.vue"; //左侧菜单编辑  
import docViewMain from "./docViewMain.vue"; // 显示文档

import dialogAddNavi from "@/views/components/docNavi/dialogAddNavi.vue"; //顶层导航

import { getSideTabs } from '@/api/config'
import { watch, reactive, ref } from 'vue'
import { useNaviInfoStore, usePermissionStore, useUserStore } from '@/stores'
import { storeToRefs } from 'pinia';

const naviStore = useNaviInfoStore()
const permissionStore = usePermissionStore()
const userStore = useUserStore()
const { current } = storeToRefs(permissionStore) // 获取激活导航id
const { user } = storeToRefs(userStore) // 获取用户信息
// const containerH = window.innerHeight || document.documentElement.clientHeight - 280 

const itemProps = {
  "inline-prompt": true,
  "active-text": "看",
  "inactive-text": "写",
  "active-color": "#EA9712",
  "inactive-color": "#378FEB"
};

const sideTabLoading = ref(false)

const getArticleContent = (htmlcontent) => {
  // console.log('htmlcontent--', htmlcontent)
}

const getSideTab = (topId) => {
  console.log('getSideTab--', topId)
  getSideTabLists(topId)
}

// 获取侧边菜单
const getSideTabLists = (topId) => {
  let data = {}
  sideTabLoading.value = true
  // getSideTabs(topId, data).then((res) => {

  //=======================mock数据
  let res = {
    success: true,
    data: []
  }
  //=======================mock数据


  if (res && res.success) {
    let cmenuList = res.data || []
    cmenuList.forEach(ii => {
      if (ii.name == '操作指南' || ii.name == '快速上手') {
        ii.type = -1
      }
    })
    permissionStore.menuList = cmenuList
    permissionStore.current.htmlContent = ''

    // 通过topId更新的sideTab之后，默认将菜单栏第一个菜单激活
    let firstActiveMenu = cmenuList.find(item => item.type != -1)
    if (firstActiveMenu) {
      permissionStore.current.menuInfo = firstActiveMenu
    }
    sideTabLoading.value = false
  } else {
    ElMessage.error(res.message)
  }
  // })
}



const dialogNaviInfo = reactive({
  isShow: false,
  width: '50%',
  flag: '',
  // getSideMenu: getSideMenu
})

// 新建导航
const dialogChildAddNavi = ref(null);

const addNavi = () => {
  dialogNaviInfo.isShow = true
  dialogNaviInfo.flag = 'add'
  dialogChildAddNavi.value.initForm();
}
// 编辑导航
const editNavi = () => {
  dialogNaviInfo.isShow = true
  dialogNaviInfo.flag = 'edit'
  dialogChildAddNavi.value.initForm();
}
// 删除导航
const delNavi = () => {
  dialogNaviInfo.isShow = true
  dialogNaviInfo.flag = 'delete'
  dialogChildAddNavi.value.initForm();
}


</script>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .all_main {
    min-height: 100vh;

    .el-icon {
      font-size: 18px;
      margin-right: 5px;
      text-align: center;
      vertical-align: middle;
      width: var(--el-menu-icon-width);
    }

    .main_container {
      height: calc(100vh - 100px);

      // border:1px solid red;
      .content_editor {
        // border:1px solid red;
        // margin-top:-20px;
      }
    }
  }
}
</style>
