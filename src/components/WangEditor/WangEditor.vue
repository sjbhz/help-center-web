<template>
  <div>
    <div style="margin-top:-5px;margin-bottom:1px;">
      <!-- <button @click="disableHandler">修改</button> -->
      <el-button type="primary" plain @click="submit" size="small" v-if="!isView">保存文本</el-button>
      <span v-if="!isView" style="color:#aaa;font-size:13px;display:inline-block;margin-left:20px">*文本编辑后请记得及时保存</span>
      <span v-else>&nbsp;</span>
    </div>
    <div style="border: 1px solid #ccc;" v-loading="uploading" element-loading-text="文件上传中...">
      <!-- 工具栏 -->
      <Toolbar :style="mode == 'edit' ? 'border-bottom:1px solid #ccc' : 'none'" :editor="editor"
        :defaultConfig="toolbarConfig" :mode="mode" />
      <!-- 编辑器 -->
      <Editor ref="edit" :style="{ 'height': weditorH, 'overflow-y': 'hidden' }" :defaultConfig="editorConfig"
        :mode="mode" v-model="html" @onChange="onChange" @onCreated="onCreated" />
    </div>
  </div>
</template>

<script>
import { ref, inject } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import axios from 'axios'
import EnumModule from '@/common/module/index.js'
import { uploadImages } from '@/api/config'
import { getUUID } from "@/utils/uuid";
import { ElMessage } from 'element-plus'

const toolbarConfigGlobal = Object.values(EnumModule.TOOLBARCONFIGLIST) //编辑器菜单配置

export default {
  name: 'WangEditor',
  components: { Editor, Toolbar },
  props: {
    isView: {
      type: Boolean,
      default: false
    },
    weditorH: {
      type: String,
      default: '400px'
    },
    mode: {
      type: String,
      default: 'read'
    },
    htmlContent: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      uploading: false,
      editor: null,
      html: '',
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        // excludeKeys: [ /* 隐藏哪些菜单 */ ],
      },
      editorConfig: {
        placeholder: '无内容',
        // autoFocus: false,
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          // 自定义上传图片
          uploadImage: {
            maxNumberOfFiles: 1,
            async customUpload(file, insertFn) {
              // file 即选中的文件
              if (!file.type.includes("image")) {
                return ElMessage.warning("请上传图片格式的文件！");
              }
              // 处理数据并调用接口
              let fileUid = getUUID().substring(0, 8);
              let param = {
                fileName: file.name,
                id: fileUid
              };
              const formData = new FormData();
              formData.append("file", file)
              if (file.length > 0) {
                files.forEach((f) => {
                  formData.append("files", f);
                });
              }
              formData.append("request", new Blob([JSON.stringify(param)], { type: "application/json" }))
              await uploadImages(formData).then((result) => {
                if (result.success) {
                  ElMessage.success('上传成功')
                  // 最后插入图片-回显
                  // insertFn("/helpcenter-web/helpt/api/md/get/" + fileUid + "_" + file.name);
                  insertFn("/helpcenter-web/helpt/api/md/get/" + fileUid);
                } else {
                  ElMessage.error(result.message)
                }
              });

            },
          },
          // 自定义上传视频
          uploadVideo: {
            maxNumberOfFiles: 1,
            async customUpload(file, insertFn) {
              // file 即选中的文件
              // console.log("自定义上传视频====", file);
              if (!file.type.includes("video")) {
                return ElMessage.warning("请上传视频格式的文件！");
              }
              // if (file.size / 1024 / 1024 > 200) {
              //   return ElMessage.warning("请上传200M以内的文件！");
              // }

              // 处理数据并调用接口
              let fileUid = getUUID().substring(0, 8);
              let param = {
                fileName: file.name,
                id: fileUid
              };
              const formData = new FormData();
              formData.append("file", file)
              formData.append("request", new Blob([JSON.stringify(param)], { type: "application/json" }))
              console.log('formData--', formData)
              await uploadImages(formData).then((result) => {
                console.log('result===124345', result)
                if (result.success) {
                  ElMessage.success('上传成功')
                  // 最后插入视频-回显成功
                  // insertFn("/helpcenter-web/helpt/api/md/get/" + fileUid + "_" + file.name);
                  insertFn("/helpcenter-web/helpt/api/md/get/" + fileUid);
                } else {
                  ElMessage.error(result.message)
                }
              }).catch(() => {
                // this.uploading = false;
              });

            },
          }
        }
      },
    }
  },
  watch: {
    htmlContent: {
      handler(newVal, oldVal) {
        console.log(newVal)
        // 更新editor展示
        this.html = newVal
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    //获取初始化数据
    this.html = this.htmlContent

    const editor = this.editor

    if (editor == null) return
    // editor.disable()     // ==未到这里
  },
  mounted() {
  },
  methods: {
    checkImageSize(fileTypeList = ["image/jpeg", "image/jpg", "image/png"]) {
      const flag = fileTypeList.some((item) => file.type === item);
      if (!flag) return false;
      return true;
    },
    checkImageType(size = 1024 * 1024 * 1) {
      if (file.size > size) return false;
      return true;
    },

    onCreated(editor) {
      this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
      if (this.mode == 'read') {
        editor.disable()
        // 不能编辑且隐藏所有菜单栏
        this.toolbarConfig.excludeKeys = toolbarConfigGlobal
        this.toolbarConfig.toolbarKeys = []
      } else {
        editor.enable()
        // 能编辑且展示所有菜单栏
        this.toolbarConfig.excludeKeys = []
        this.toolbarConfig.toolbarKeys = toolbarConfigGlobal
      }
    },
    // 修改
    disableHandler() {
      const editor = this.editor
      if (editor == null) return
      //启用修改
      editor.enable()
    },
    submit() {
      this.$emit('submit', this.html)
    },
    // 编辑器内容变动
    onChange(editor) {
      // console.log('onChange', editor.getHtml()) // onChange 时获取编辑器最新内容
      this.html = editor.getHtml()
      // 上报上一级保存处理
      this.$emit('changeEditorAndGetHtml', this.html)
    },
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁 editor ，重要！！！
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
:-webkit-any(article,aside,nav,section) h1 {
    font-size: 2em;
}

</style>