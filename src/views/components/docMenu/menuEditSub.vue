<template>
  <div>
    <template v-for="(item, index) in subMenu" :key="item.id">
      <template v-if="item.type === -1">
        <!-- 提示 指南/快速上手 -->
        <div style="margin:20px;font-size:17px;font-weight:bold">{{ item.name }}</div>
      </template>
      <template v-else>

        <!--树枝-->
        <template v-if="item.subList && item.subList.length > 0">
          <el-sub-menu :key="'subMenu_' + item.id" :index="String(item.id)" style="vertical-align: middle;">
            <template #title>
              <div style="display:inline;width: 100%;">
                <span class="left_menu_list" :title="item.name">{{ item.name }}</span> &nbsp; &nbsp;
                <span class="optionBtn">
                  <!--操作按钮-->
                  <menu-option v-show="!current.isView" :subMenu="subMenu" :current="current" :menu="item" :index="index"
                    :dialogAddInfo="dialogAddInfo" :dialogModInfo="dialogModInfo">
                  </menu-option>
                </span>
              </div>
            </template>
            <!--递归子菜单-->
            <my-sub-menu2 :subMenu="item.subList" :dialogAddInfo="dialogAddInfo" :dialogModInfo="dialogModInfo" />
          </el-sub-menu>
        </template>

        <!--树叶-->
        <el-menu-item v-else :index="String(item.id)" :key="'menuItem_' + item.id" @click="clickMenuEdit(item, index)">
          <template #title>
            <div style="display:inline;width: 100%;">
              <span class="left_menu_list" :title="item.name">{{ item.name }}</span> &nbsp; &nbsp;
              <span class="optionBtn">
                <!--操作按钮-->
                <menuOption v-show="!current.isView" :subMenu="subMenu" :current="current" :menu="item" :index="index"
                  :dialogAddInfo="dialogAddInfo" :dialogModInfo="dialogModInfo">
                </menuOption>
              </span>
            </div>
          </template>
        </el-menu-item>

      </template>
    </template>


  </div>
</template>

<script setup>
import mySubMenu2 from './menuEditSub.vue'
import menuOption from './menuOption.vue'
import { getArticleInfo } from '@/api/config'
import { reactive, ref, defineProps, watch, toRaw } from 'vue'
import { useNaviInfoStore, usePermissionStore } from '@/stores'
import { storeToRefs } from 'pinia';
import { ElMessage, ElNotification } from 'element-plus'
const props = defineProps({
  current: Object,
  subMenu: Array, // 要显示的菜单，可以n级
  dialogAddInfo: Object, // 添加菜单
  dialogModInfo: Object, // 修改菜单
})

const {
  dialogAddInfo,
  dialogModInfo
} = props

const naviStore = useNaviInfoStore()
const permissionStore = usePermissionStore()
const { current, menuList } = storeToRefs(permissionStore) // 获取激活导航id
const submenu = current.menuList

// 点击菜单获取文章内容
const articleContent = ref('')
const getArticle = (item) => {
  console.log(item)
  if (!item) return
  let data = {}
  // getArticleInfo(item.id, {}).then((res => {
    
  //=======================mock数据
  let res = {
    success: true,
    data: {
      articleText: 'mock结果，文章内容区'
    },
    message: '11'
  }
  //=======================mock数据
  if (res && res.success) {
    if (res.data) {
      articleContent.value = res.data.articleText ? res.data.articleText : ''
    } else {
      articleContent.value = ''
    }
    // ElMessage.success('文本内容获取成功')

    // ElNotification({
    //   message: '文本内容获取成功',
    //   type: 'success',
    //   duration: 2000
    // })
  } else {
    articleContent.value = ''
    ElMessage.error(res.message)
  }
  permissionStore.current.htmlContent = articleContent // 存到store
  // }))

}

// 编辑状态下，点击菜单--更新右侧内容区
const clickMenuEdit = (item, index) => {
  getArticle(item)
  // permissionStore.current.menuInfo = item
  permissionStore.current.menuInfo = {
    id: item.id,
    name: item.name,
    parent: item.parent ? item.parent : null,
    parentTopId: item.parentTopId ? item.parentTopId : null,
    sort: item.sort,
    subList: item.subList ? item.subList : null,
    type: item.type
  }
}

</script>

<style scoped>
.menu_edit_icon {
  width: 1.5em;
  height: 1.5em;
  margin-right: 8px;
  vertical-align: middle;
}

.left_menu_list {
  display: inline-block;
  vertical-align: middle;
  width: 150px;
  /* max-width: calc(100%-0.9em); */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}



.optionBtn {
  float: right;
  /* padding-right: 1px; */
}
</style> 