<template>
  <!--弹窗，添加菜单 :append-to-body="true" -->
  <!-- v-dialog-drag="dialogInfo.width" -->
  <div>
    <el-dialog title="修改菜单" v-model="dialogInfo.isShow" :modal="true" :width="dialogInfo.width"
      :close-on-click-modal="true" :destroy-on-close="true">
      <el-scrollbar style="height:200px;margin: 2px;">
        <el-form :model="form" label-width="auto" style="max-width: 98%">
          <el-form-item label="当前菜单名称" v-if="false">
            <el-input v-model="form.currentName" disabled="" />
          </el-form-item>
          <el-form-item label="新菜单名称">
            <el-input v-model="form.newName" />
          </el-form-item>
          <el-form-item label="菜单层级" v-if="false">
            <el-radio-group v-model="form.resource">
              <el-radio value="1">同级</el-radio>
              <el-radio value="2">子级</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="插入到指定位置" v-if="false">
            <el-switch v-model="form.delivery" />
            <span style="display:inline-block;margin-left:10px;color:#aaa">* 默认追加到最后</span>
          </el-form-item>
          <el-form-item label="此菜单后" v-if="form.delivery">
            <el-select v-model="form.region" placeholder="新菜单将插入到选中的菜单后">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, defineProps, watch } from 'vue'
import {ElForm, ElButton, ElDialog, ElScrollbar, ElMessage } from 'element-plus'
import { updateFormMenu } from '@/api/config'
</script>

<script setup>

const form = reactive({})

const props = defineProps({
  current: Object,
  dialogInfo: Object,
})
const info = props.dialogInfo
const current = props.current
const cmenu = info.menu //info.menu:点击添加的当前menu
form.currentName = ref(cmenu.name)

// 编辑菜单名称
const editMenu = (form) => {
  console.log('cmenu--', current, cmenu)
  let menu_data = {
    id: cmenu.id,
    name: form.newName
  }
  // updateFormMenu(menu_data).then(res => {
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

// 清空表单
const initForm = () => {
  form.id = ''
  form.currentName = ''
  form.newName = ''
  form.region = ''
  form.kind = ''
  form.delivery = false
}
// 保存 
const save = () => {
  console.log('form---save', form)
  editMenu(form)
  info.isShow = false
}

watch(props.dialogInfo, (newVal, oldVal) => {
  console.log('监听的props.dialogInfo.isShow改变了', newVal, oldVal)
  if (newVal) {
    form.currentName = ref(cmenu.name)
  }
}, { immediate: true, deep: true })
</script>
