<template>
  <RouterView />
</template>

<script lang="ts" setup>
import { ref, defineProps, watch } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { getTopTabs, getSideTabs } from '@/api/config'
import { ElMessage } from 'element-plus'
import { useNaviInfoStore, usePermissionStore, useUserStore } from '@/stores'
import { storeToRefs } from 'pinia';
import AES from "@/utils/AES";
// import router from './router'
import EnumModule from '@/common/module/index.js' //引入navlist常量


const naviStore = useNaviInfoStore()
const permissionStore = usePermissionStore()
const UserStore = useUserStore()
const { getUserInfo, user } = UserStore
const { current } = storeToRefs(permissionStore) // 获取激活导航id

// 获取模块导航列表并存到store
const getTopTabLists = () => {
  let data = {}
  // return getTopTabs(data).then((res: any) => {

      // mock数据=============================
  // 使用inject+键值接收，与provide键值对应
  // const globalEnum = inject("globalConstEnum") 
  const naviList = Object.values(EnumModule.NAVI_LISTS) //navi菜单
  console.log('11111',naviList)
  let res = {
    success: true,
    data: naviList
  }

  // ====================================
    if (res && res.success) {
      let topLists = (res.data || [])
      topLists.map(item => { item.naviId = item.id })
      naviStore.naviList = topLists
      // console.log('naviList--', naviStore)
      
      // 如果第一次进入 =>store中无值----则默认为第一个nav,否则不做处理
      if (permissionStore.current.naviInfo) return

      if (topLists.length > 0) {
        // 保存导航第一个为激活态
        permissionStore.current.naviInfo = topLists[0]
        // 获取激活态的菜单列表
        getSideTabLists(topLists[0].id)
      }
    } else {
      ElMessage.error(res.message)
    }
  // })
}

const getSideTabLists = (topId: any) => {
  let data = {}
  return getSideTabs(topId, data).then((res: any) => {
    if (res && res.success) {
      if (res.success) {
        let cmenuList = res.data || []
        cmenuList.forEach(ii => {
          if (ii.name == '操作指南' || ii.name == '快速上手' ) {
            ii.type = -1
          }
        })
        permissionStore.menuList = cmenuList
        // 保存当前菜单的第一个tab为激活态
        if (cmenuList.length > 0) {
          permissionStore.current.menuInfo = cmenuList[0]
        }
      }
    } else {
      ElMessage.error(res.message)
    }
  })
}

// 校验权限
// getUserInfo().then(res => {
  // let resultcheck = JSON.parse(AES.decrypt(res))   // 先AES解密
  // console.log('resultcheck--', resultcheck)

  //mock数据============================================
 let resultcheck = {
    code: 20000,
    data:{
      isAdmin:1,
      userId:208,
      roleId:1,
      roleName:'管理员'
    }
  }
  //===========================================

  if (resultcheck && resultcheck.code != 20000) {
    ElMessage.error("token信息已过期"); // 退出登录
    permissionStore.current.isView = true
    setTimeout(() => {
      let href = window.location.href;

      if (!href.includes('localhost')) { // 本地联调
        let origin = window.location.origin
        window.location.href = `${origin}/passport-web/login?return_uri=${href}`
      }
    }, 2 * 1000);
    // return
  } else {
    user.isAdmin = resultcheck.data.isAdmin
    user.userId = resultcheck.data.userId
    user.roleId = resultcheck.data.roleId
    user.roleName = resultcheck.data.roleName
    console.log('user.isAdmin---', user.isAdmin)
    // 非管理员时只读
    if (user.isAdmin != 1) {
      permissionStore.current.isView = true
    }
  }



  // checktoken正常时获取接口
  getTopTabLists()

// })

// 监听状态变化，提示保存
watch(current.value.naviInfo, (newVal, oldVal) => {
  console.log('监听的current.naviInfo改变了aaapp', newVal)
  // 更新菜单
  if (newVal) {
    // getSideTabLists()
  }

}, { immediate: true, deep: true })

// 监听路由变化，初始化读写状态
const router = useRouter()
watch(() =>
  router.currentRoute.value.path,
  (toPath, oldPath) => {
    console.log('router---', router, toPath, oldPath)
    permissionStore.current.isView = true   // 初始化

  }, { immediate: true, deep: true })


</script>

<style scoped></style>
