<template>
  <!-- <div class="menu_edit" v-loading="sideTabLoading"> -->
  <div class="menu_edit">
    <el-menu ref="domMenu" class="el-menu-vertical-demo" unique-opened :default-active="String(activeIndexMenu)"
      v-bind="$attrs" :background-color="backgroundColor">
      <!--递归调用，支持n级菜单 -->
      <menuEditSub :current="current" :subMenu="menuList" :dialogAddInfo="dialogAddInfo" :dialogModInfo="dialogModInfo" />
    </el-menu>
  </div>

  <!--添加的表单-->
  <formAdd v-if="dialogAddInfo.isShow" :current="current" :dialogInfo="dialogAddInfo" />
  <!--修改的表单-->
  <formEdit v-if="dialogModInfo.isShow" :current="current" :dialogInfo="dialogModInfo" />
</template>

<script>
// 模块菜单
import { reactive, ref, defineProps, watch, toRaw } from 'vue'
import { usePermissionStore } from '@/stores'
import { storeToRefs } from 'pinia';
import menuEditSub from './menuEditSub.vue'
import formAdd from './formAdd.vue'
import formEdit from './formEdit.vue'
import { getSideTabs } from '@/api/config'
</script>

<script setup>
const props = defineProps({
  sideTabLoading: Boolean,
  'background-color': {
    tyoe: String,
    default: '#ece5d9'
  },
  'border': {
    tyoe: String,
    default: '1px solid #333'
  }
})

const permissionStore = usePermissionStore()
const { current, menuList } = storeToRefs(permissionStore) // 获取状态和导航内容
// console.log('menuList---', menuList)


// 默认激活第一个type!=-1
let targetmenu = menuList.value.find(imenu => imenu.type != -1)
let activeIndexMenu = ref(targetmenu && targetmenu.id) //默认菜单高亮
permissionStore.current.menuInfo = targetmenu

// 菜单集合
const menus = reactive([])

// 获取左侧菜单--只做左侧菜单变更刷新用  == 可上报处理
const getSideMenu0 = (topId) => {
  let data = {}
  return getSideTabs(topId, data).then((res) => {
    if (res && res.success) {
      if (res.success) {
        let cmenuList = res.data || []
        cmenuList.forEach(ii => {
          if (ii.name == '操作指南' || ii.name == '快速上手' ) {
            ii.type = -1
          }
        })
        permissionStore.menuList = cmenuList
      }
    } else {
      ElMessage.error(res.message)
    }
  })
}

// 上报父级处理
const getSideTabEmit = defineEmits(['getSideTab'])
const getSideMenu = (topId) => {
  // permissionStore.current.naviInfo = item
  getSideTabEmit('getSideTab', topId)

}

// 控制 字段 抽屉的展开收拢
const dialogAddInfo = reactive({
  isShow: false,
  width: '50%',
  index: 1,
  parentMenu: menus,
  menu: {},
  getSideMenu: getSideMenu
})

const dialogModInfo = reactive({
  isShow: false,
  width: '50%',
  menu: {},
  getSideMenu: getSideMenu
})




</script>

<style scoped lang="scss">
.menu_edit {
  position: fixed;
  width: 280px;
  left: 10px;
  top: 90px;
  border: 1px solid #ccc;
  overflow-y: auto;
  // z-index: 100;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  max-width: 320px;
  // min-height: 400px;
  height: calc(100vh - 115px);
}

.el-menu {
  border-right: none
}
</style>
