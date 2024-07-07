<template>
  <div>
    <breadcrumb></breadcrumb>
    <WangEditor v-if="current.isView" :isView="current.isView" :weditorH="!current.isView ? weditorH : weditorHR"
      width="100%" :mode="'read'" :htmlContent="current.htmlContent" />
    <WangEditor v-else :isView="current.isView" :weditorH="!current.isView ? weditorH : weditorHR" width="100%"
      :mode="'edit'" :htmlContent="current.htmlContent" @changeEditorAndGetHtml="changeEditorAndGetHtml"
      @submit="submit" />
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'
import breadcrumb from '@/views/components/breadcrumb/breadcrumb.vue'
import WangEditor from '@/components/WangEditor/WangEditor.vue'
import { updateArticle, getArticleInfo } from '@/api/config'
import { usePermissionStore } from '@/stores' // 访问状态
import { storeToRefs } from 'pinia';
import { ElMessage, ElNotification } from 'element-plus'
const permissionStore = usePermissionStore()
const { current } = storeToRefs(permissionStore)  //直接解构

const routerKind = ref('')
const weditorH = ref('calc(100vh - 155px)')
const weditorHR = ref('calc(100vh - 113px)')

const changeEditorAndGetHtml = (html) => {
  // console.log('changeEditorAndGetHtml', html)
  permissionStore.current.htmlContent = html
}
const submit = (html) => {
  console.log('submit', html)
  permissionStore.current.htmlContent = html
  updateHtmlContent()
}

// 更新富文本内容
const updateHtmlContent = () => {
  let data = {
    articleText: current.value.htmlContent,
    id: current.value.menuInfo.id
  }
  // updateArticle(data).then((res) => {

  //=======================mock数据
  let res = {
    success: true,
    message: null
  }
  //=======================mock数据

  console.log('res--', res)
  if (res.success) {
    ElMessage.success('保存成功')
  } else {
    ElMessage.error(res.message)
  }
  // })
}

// 点击菜单获取文章内容
let articleContent = ref('')
const emit = defineEmits(['getArticleContent'])
const clickMenuEdit = (item) => {
  console.log(item)
  if (!item) return
  let data = {}
  // getArticleInfo(item.id, {}).then((res => {

  //=======================mock数据
  let res = {
    success: true,
    data: {
      articleText: '<p>编辑器试用</p><p>1、<a href="vmdEditor" target="_blank">vmdEditor</a> : &nbsp;<a href="vmdEditor" target="_blank">http://localhost:9015/helpcenter-web/vmdEditor</a> </p><p>2、tinyMCE : &nbsp;<a href="tinyView" target="_blank">http://localhost:9015/helpcenter-web/tinyView</a> </p><p>3、ckeditor ： <a href="ckeditor" target="_blank">http://localhost:9015/helpcenter-web/ckeditor </a> </p><p>4、wangEditor : &nbsp;<a href="http://localhost:9015/helpcenter-web/initLayout" target="_blank">http://localhost:9015/helpcenter-web/initLayout</a></p>'
    }
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
    //   message: '文本获取成功',
    //   type: 'success',
    //   duration: 2000
    // })
  } else {
    articleContent.value = ''
    ElMessage.error(res.message)
  }
  // 上报给父级
  // emit('getArticleContent', articleContent)
  permissionStore.current.htmlContent = articleContent // 存到store
  // }))

}

watch(routerKind, (newVal, oldVal) => {
  console.log('监听的routerKind改变了', newVal, oldVal)
  if (newVal == 'save') {
    updateHtmlContent()
  }
})
// 监听reactive对象某个属性变化 () =>xx写法！！
watch(() => current.value.menuInfo, (newVal, oldVal) => {
  // 切换点击左侧菜单
  console.log('监听的menuInfo改变了main', newVal, oldVal)
  if (newVal) {
    clickMenuEdit(newVal)
  }

}, { immediate: true, deep: true })

</script>