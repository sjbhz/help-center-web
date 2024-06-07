<template>
  <!--菜单项、导航项的操作按钮组-->
  <el-dropdown style="vertical-align: middle;">
    <span class="el-dropdown-link">
      <el-icon class="el-icon--right">
        <tools style="width: 1.0em; height: 1.0em; margin-right: 0px;color:#666" @click="clickTool" />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="addMenu" v-if="menu.subList ? true : false">添加</el-dropdown-item>
        <el-dropdown-item @click="modMenu">修改</el-dropdown-item>
        <el-dropdown-item @click="delMenu">删除</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
// import { reactive } from 'vue'
import { Tools } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { deleteFormMenu } from '@/api/config'
</script>

<script setup>

const props = defineProps({
  subMenu: Array,
  current: Object,
  dialogAddInfo: Object,
  dialogModInfo: Object,
  menu: Object,
  index: Number
})

const {
  subMenu,
  menu,
  dialogAddInfo,
  dialogModInfo
} = props

// 点击tool按钮
const clickTool = (e) => {
  e.stopPropagation() 
}

// 添加菜单项
const addMenu = (e) => {
  e.stopPropagation()
  dialogAddInfo.parentMenu = subMenu
  dialogAddInfo.menu = menu
  dialogAddInfo.index = props.index
  dialogAddInfo.isShow = true
}

// 修改菜单项
const modMenu = (e) => {
  e.stopPropagation()
  dialogModInfo.menu = menu
  dialogModInfo.isShow = true
}

// 删除菜单项 
const delMenu = (e) => {
  e.stopPropagation()
  let mess = menu && menu.subList && menu.subList.length > 0 ? '如果是父级菜单，将连同子菜单一同删除，请确认' : '正在删除本菜单，请确认'
  ElMessageBox.alert(mess, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    callback: (action) => {
      let data = {
        id: menu.id
      }
      // deleteFormMenu(data).then(res => {
      //=======================mock数据
      let res = {
        success: true,
        message: null
      }
      //=======================mock数据
      if (res.success) {
        ElMessage.success(`删除成功`)
        dialogAddInfo.getSideMenu(current.naviInfo.id) // 刷新菜单栏 
      } else {
        ElMessage.error(res.message)
      }
      // })

    },
  })
}


</script>