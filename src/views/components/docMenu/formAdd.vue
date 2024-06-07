<template>
  <!--弹窗，添加菜单 :append-to-body="true" -->
  <div v-dialog-drag="dialogInfo.width">
    <el-dialog title="添加菜单" v-model="dialogInfo.isShow" :modal="true" :width="dialogInfo.width"
      :close-on-click-modal="true" :destroy-on-close="true">
      <el-scrollbar style="height:340px;margin: 2px;">
        <el-form :model="form" label-width="auto" style="max-width: 98%">
          <el-form-item label="当前菜单名称">
            <el-input v-model="form.currentName" disabled="" />
          </el-form-item>
          <el-form-item label="新菜单名称">
            <el-input v-model="form.newName" />
          </el-form-item>
          <el-form-item label="菜单层级">
            <el-radio-group v-model="form.kind">
              <el-radio value="1">同级</el-radio>
              <el-radio value="2">子级</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="插入到指定位置">
            <el-switch v-model="form.delivery" />
            <span style="display:inline-block;margin-left:10px;color:#aaa">* 默认追加到最后</span>
          </el-form-item>
          <el-form-item label="此菜单后" v-if="form.delivery">
            <el-select v-model="form.region" placeholder="新菜单将插入到选中的菜单后">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.desc" type="textarea" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="addOne">保存</el-button>
          <el-button type="primary" plain @click="addMore">保存&添加</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { ElForm, ElButton, ElDialog, ElScrollbar, ElMessage } from 'element-plus'
// import { addMainFormMenu, addChildFormMenu } from '@/api/config'
</script>

<script setup>
// const form = reactive({
//   currentName: '',
//   newName: '',
//   region: '',
//   kind: '1',
//   delivery:false,
// })
const form = reactive({})

const props = defineProps({
  current: Object,
  dialogInfo: Object,
})
const info = props.dialogInfo
const current = props.current
const cmenu = info.menu //info.menu:点击添加的当前menu
form.currentName = ref(info.menu.name)
form.kind = ref('1') //默认同级

// 清空表单
const initForm = () => {
  form.id = ''
  form.currentName = ''
  form.newName = ''
  form.region = ''
  form.kind = ''
  form.delivery = false
  form.icon = 'FolderOpened'
}

// 添加菜单
const addNewMenu = (form) => {
  console.log('cmenu----', cmenu)
  const newMenu = {
    id: form.id,
    name: form.newName,
    parentTopId: info.index,
    sort: info.index + 1,
    type: 0,
  }

  let menu_data = {
    name: newMenu.name,
  }
  // 第一层菜单添加同级菜单，入参有 topId、name
  if (cmenu.parentTopId && form.kind == 1) {
    menu_data.topId = cmenu.parentTopId
    // addMainFormMenu(menu_data).then(res => {
      
    //=======================mock数据
    let res = {
      success: true,
      message: null
    }
    //=======================mock数据

    if (res.success) {
      info.getSideMenu(current.naviInfo.id)  // 刷新这个菜单
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(res.message)
    }
    // })
  } else {
    // 子菜单，入参有 parent、name
    menu_data.parent = form.kind == 1 ? cmenu.parent : cmenu.id
    // addChildFormMenu(menu_data).then(res => {

    //=======================mock数据
    let res = {
      success: true,
      message: null
    }
    //=======================mock数据

    if (res.success) {
      info.getSideMenu(current.naviInfo.id)  // 刷新这个菜单 
      ElMessage.success('保存成功')
      initForm()
    } else {
      ElMessage.error(res.message)
    }
    // })
  }
}


// 添加一个
const addOne = () => {
  addNewMenu(form)

  // 清空表单
  // form.name = ''
  // form.description = ''
  // form.link = ''
  // form.icon = 'FolderOpened'
  info.isShow = false
}

// 连续添加
const addMore = () => {
  addNewMenu(form)
  info.index += 1
}

</script>
