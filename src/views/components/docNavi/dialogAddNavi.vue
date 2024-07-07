
<template>
  <el-dialog :title="dialogNaviInfo.flag == 'add' ? '新建导航' : dialogNaviInfo.flag == 'edit' ? '编辑导航' : '删除导航'"
    v-model="dialogNaviInfo.isShow" :modal="true" :width="dialogNaviInfo.width" :close-on-click-modal="true"
    :destroy-on-close="true" v-if="dialogNaviInfo.isShow">
    <el-scrollbar style="height:200px;margin: 2px;">
      <el-form :model="form" label-width="auto" style="max-width: 98%">
        <span v-if="dialogNaviInfo.flag == 'add'">
          <el-form-item label="新导航名称">
            <el-input v-model="form.newName" />
          </el-form-item>

          <el-form-item label="插入到此导航后">
            <el-select v-model="form.insertId" placeholder="新导航将插入到选中的导航后">
              <el-option v-for="(item, index) in naviList" :key="item + index" :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </span>
        <span v-if="dialogNaviInfo.flag == 'delete'">
          <el-form-item label="选择导航">
            <el-select v-model="form.deleteId" placeholder="将删除选中导航">
              <el-option v-for="(item, index) in naviList" :key="item + index" :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </span>
        <span v-if="dialogNaviInfo.flag == 'edit'">
          <el-form-item label="选择导航">
            <el-select v-model="form.editId" placeholder="选中需要编辑的导航">
              <el-option v-for="(item, index) in naviList" :key="item + index" :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="导航新名称">
            <el-input v-model="form.newEditName" />
          </el-form-item>
        </span>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="addOne" v-if="dialogNaviInfo.flag == 'add'">新增</el-button>
        <el-button type="primary" @click="delOne" v-if="dialogNaviInfo.flag == 'delete'">确认删除</el-button>
        <el-button type="primary" @click="editOne" v-if="dialogNaviInfo.flag == 'edit'">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, defineProps, ref } from 'vue'
import { ElForm, ElButton, ElDialog, ElScrollbar, ElMessage } from 'element-plus'
import { addTopTabs, delTopTabs, getTopTabs, editTopTabs } from '@/api/config'
import { useNaviInfoStore, usePermissionStore } from '@/stores'
import { storeToRefs } from 'pinia';



const naviStore = useNaviInfoStore()
const permissionStore = usePermissionStore()
const { naviList } = storeToRefs(naviStore) // 导航列表
// const { current } = storeToRefs(permissionStore) // 获取激活导航id

const form = reactive({})

const props = defineProps({
  current: Object,
  dialogNaviInfo: Object,
})

const info = props.dialogNaviInfo
const current = props.current

// 获取顶部导航
const getTopTabLists = () => {
  let data = {}
  return getTopTabs(data).then((res) => {
    if (res && res.success) {
      let topLists = (res.data || [])
      topLists.map(item => { item.naviId = item.id })
      naviStore.naviList = topLists
    } else {
      ElMessage.error(res.message)
    }
  })
}

// 添加导航
const addOne = () => {
  let menu_data = {
    name: form.newName,
    insertId: form.insertId
  }
  addTopTabs(menu_data).then(res => {
    if (res.success) {
      getTopTabLists() // 刷新这个菜单
      ElMessage.success('添加成功')
      info.isShow = false
    } else {
      ElMessage.error(res.message)
    }
  })

}

// 编辑导航
const editOne = () => {
  let menu_data = {
    name: form.newEditName,
    id: form.editId
  }
  editTopTabs(menu_data).then(res => {
    if (res.success) {
      getTopTabLists() // 刷新这个菜单
      ElMessage.success('编辑成功')
      info.isShow = false
    } else {
      ElMessage.error(res.message)
    }
  })

}
// 删除导航--限制不能删除当前选中状态的navi
const delOne = () => {
  // console.log('form==current',form, current)
  if (form.deleteId == current.naviInfo.id) {
    ElMessage.warning('当前导航下有菜单内容正在展示，不支持删除，请确认')
    return
  }
  let menu_data = {
    id: form.deleteId
  }
  delTopTabs(menu_data).then(res => {
    if (res.success) {
      getTopTabLists() // 刷新这个菜单
      ElMessage.success('删除成功')
      info.isShow = false
    } else {
      ElMessage.error(res.message)
    }
  })
}

// 清空表单
const initForm = () => {
  form.newName = ''
  form.insertId = ''
  form.deleteId = ''
  form.editId = ''
  form.newEditName = ''
}
// 暴露方法
defineExpose({ initForm })


</script>
