<template>
  <div>
    <div class="menu_edit">
      <el-menu ref="domMenu" class="el-menu-vertical-demo" :default-active="String(activeIndexMenu)" v-bind="$attrs"
        :background-color="backgroundColor">
        <!--递归调用，支持n级菜单 -->
        <menuEditSub :current="current" :subMenu="menuList" :dialogAddInfo="dialogAddInfo"
          :dialogModInfo="dialogModInfo" />
      </el-menu>
    </div>
    <!--添加的表单-->
    <formAdd v-if="dialogAddInfo.isShow" :current="current" :dialogInfo="dialogAddInfo" />
    <!--修改的表单-->
    <formEdit v-if="dialogModInfo.isShow" :current="current" :dialogInfo="dialogModInfo" />
  </div>
</template>

<script>
// 模块菜单
import { reactive, ref, watch, toRaw } from 'vue'
import { usePermissionStore } from '@/stores'
import { storeToRefs } from 'pinia';
import menuEditSub from './menuEditSub.vue'
import formAdd from './formAdd.vue'
import formEdit from './formEdit.vue'
// import { getSideTabs } from '@/api/config'
</script>

<script setup>
const props = defineProps({
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
console.log('menuList---', menuList)


// 默认激活第一个type!=-1
let targetmenu = menuList.value.find(imenu => imenu.type != -1)
let activeIndexMenu = ref(targetmenu.id) //默认菜单高亮
permissionStore.current.menuInfo = targetmenu


// 菜单集合
const menus = reactive([])

// 获取左侧菜单--只做左侧菜单变更刷新用
const getSideMenu = (topId) => {
  let data = {}
  // getSideTabs(topId, data).then((res) => {
  //=======================mock数据
  let res = {
    suceess: true,
    data: []
  }
  //=======================mock数据
  if (res && res.success) {
    if (res.success) {
      let cmenuList = res.data || []
      permissionStore.menuList = cmenuList
    }
  } else {
    ElMessage.error(res.message)
  }
  // })
}

// 控制 字段 抽屉的展开收拢
const dialogAddInfo = reactive({
  isShow: false,
  width: '50%',
  index: 1,
  parentMenu: menus,
  menu: {},
  getSideMenu: getSideMenu,
})

const dialogModInfo = reactive({
  isShow: false,
  width: '50%',
  menu: {},
  getSideMenu: getSideMenu,
})



// // 根据当前导航项ID，获取菜单列表
// watch(() => current.naviId, (id) => {
//   if (!id) return
//   let mm = menuList.find(item => item.naviId === id)
//   if (!mm){
//     // 添加
//     const newMenu = {
//       naviId: id,
//       ver: current.ver,
//       menus: [{
//         id: '999_temp',
//         ver: current.ver,
//         name: '默认', // 激活的菜单名称
//       }]
//     }
//     mm = newMenu
//     menuList.push(newMenu)
//   }
//   // 可能会找不到对应的菜单
//   menus.length = 0
//   menus.push(...mm.menus)
//   // 设置URL地址、菜单、加载文档等
//   watchNaviId()
// }, {immediate: true})

// // 保存当前导航项对应的菜单组
// const savaMenuList = () => {
//   const _menus = {
//     naviId: current.naviId,
//     ver: current.ver,
//     menus: toRaw(menus)
//   }
//   // console.log('保存菜单的事件：', _menus)
//   const { saveMenu } = menuService()
//   saveMenu(_menus)

//   // 修改状态
//   const index = menuList.findIndex(item => item.naviId === current.naviId)
//   menuList[index] = _menus
// }

</script>

<style scoped lang="scss">
.menu_edit {
  position: fixed;
  width: 280px;
  left: 10px;
  top: 90px;
  border: 1px solid #ccc;
  z-index: 100;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  max-width: 320px;
  // min-height: 400px;
  height: calc(100vh - 130px);
}

.el-menu {
  border-right: none
}
</style>
