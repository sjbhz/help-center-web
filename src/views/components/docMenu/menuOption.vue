<template>
  <!--菜单项、导航项的操作按钮组-->
  <el-dropdown style="vertical-align: middle;">
    <span class="el-dropdown-link">
      <el-icon class="el-icon--right">
        <tools style="width: 0.9em; height: 0.9em; margin-right: 0px;color:#666" @click="clickTool" />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="addMenu" v-if="menu.subList ? true : false">添加</el-dropdown-item>
        <el-dropdown-item @click="modMenu">修改</el-dropdown-item>
        <el-dropdown-item @click="delMenu">删除</el-dropdown-item>
        <el-dropdown-item @click="upMove">上移</el-dropdown-item>
        <el-dropdown-item @click="downMove">下移</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { defineProps } from 'vue'
import { Tools } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteFormMenu, moveSideTabs } from '@/api/config'
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
  current,
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
      if (action == 'confirm') {
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
      }

    },
  })
}

const upMove = (e) => {
  e.stopPropagation()
  let data = {
    id: menu.id,
    upordown: "up"
  }
  moveSideTabs(data).then(res => {
    if (res.success) {
      ElMessage.success(`上移成功`)
      dialogAddInfo.getSideMenu(current.naviInfo.id) // 刷新菜单栏 
    } else {
      ElMessage.error(res.message)
    }
  })
}

const downMove = (e) => {
  e.stopPropagation()
  let data = {
    id: menu.id,
    upordown: "down"
  }
  moveSideTabs(data).then(res => {
    if (res.success) {
      ElMessage.success(`下移成功`)
      dialogAddInfo.getSideMenu(current.naviInfo.id) // 刷新菜单栏 
    } else {
      ElMessage.error(res.message)
    }
  })
}


</script>