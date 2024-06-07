<template>
  <button @click="insertText">insert text</button>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
      @onCreated="handleCreated" @onChange="handleChange" @onDestroyed="handleDestroyed" @onFocus="handleFocus"
      @onBlur="handleBlur" @customAlert="customAlert" @customPaste="customPaste" />
  </div>
</template>
<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  components: { Editor, Toolbar },
  setup() {
    // type InsertFnType = (url: string, alt: string, href: string) => void

    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    // 内容 HTML
    const valueHtml = ref('<p>hello</p>')

    // 模拟 ajax 异步获取内容
    onMounted(() => {
      setTimeout(() => {
        valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
      }, 1500)
    })

    // 工具栏配置
    const toolbarConfig = {
      toolbarKeys: [
        "headerSelect",
        "blockquote",
        "codeBlock",
        "|",
        "bold",
        "underline",
        "italic",
        {
          key: "group-more-style",
          title: "更多",
          iconSvg: "<svg viewBox=\"0 0 1024 1024\">" +
            "<path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path>" +
            "<path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path>" +
            "<path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path>" +
            "</svg>",
          menuKeys: ["through", "code", "sup", "sub", "clearStyle"]
        },
        "color",
        "bgColor",
        "|",
        "fontSize",
        "fontFamily",
        "lineHeight",
        "|",
        "bulletedList",
        "numberedList",
        "todo",
        {
          key: "group-justify",
          iconSvg: "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
          title: "对齐",
          menuKeys: ["justifyLeft", "justifyRight", "justifyCenter", "justifyJustify"]
        },
        {
          key: "group-indent",
          title: "缩进",
          iconSvg: "<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>",
          menuKeys: ["indent", "delIndent"]
        },
        "|",
        "emotion",
        "insertLink",
        {
          key: "group-image",
          title: "图片",
          iconSvg: "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
          menuKeys: ["insertImage", "uploadImage"]
        },
        {
          key: "group-video",
          title: "视频",
          iconSvg: "<svg viewBox=\"0 0 1024 1024\"><path d=\"M981.184 160.096C837.568 139.456 678.848 128 512 128S186.432 139.456 42.816 160.096C15.296 267.808 0 386.848 0 512s15.264 244.16 42.816 351.904C186.464 884.544 345.152 896 512 896s325.568-11.456 469.184-32.096C1008.704 756.192 1024 637.152 1024 512s-15.264-244.16-42.816-351.904zM384 704V320l320 192-320 192z\"></path></svg>",
          menuKeys: ["insertVideo", "uploadVideo"]
        },
        "insertTable",
        "divider",
        "|",
        "undo",
        "redo",
        "|",
        "fullScreen"
      ]
    }
    // 编辑器配置
    const editorConfig = {
      placeholder: '请输入内容...',
      MENU_CONF: {
        // // 上传图片
        uploadImage: {
          // 自定义选择图片
          // async customBrowseAndUpload(insertFn: InsertFnType) {
          async customBrowseAndUpload(insertFn) {
            // 打开图片素材库
            photoGalleryDialogVisible.value = true
          },
        },
        // 上传视频
        uploadVideo: {
          // 自定义选择视频
          // async customBrowseAndUpload(insertFn: InsertFnType) {
          async customBrowseAndUpload(insertFn) {
            // 打开视频素材库
            videoGalleryDialogVisible.value = true
          },
        },
      }
    }
    // editorConfig.readOnly = true

    // 修改 uploadImage 菜单配置
    editorConfig.MENU_CONF['uploadImage'] = {
      server: '/api/upload-image',

      fieldName: 'your-custom-name', // form-data fieldName ，默认值 'wangeditor-uploaded-image'
      maxFileSize: 1 * 1024 * 1024, // 1M  // 单个文件的最大体积限制，默认为 2M
      maxNumberOfFiles: 10, // 最多可上传几个文件，默认为 100
      meta: {
        token: 'xxx',
        otherKey: 'yyy'
      },
      metaWithUrl: false, // 将 meta 拼接到 url 参数中，默认 false

      // 自定义增加 http  header
      headers: {
        Accept: 'text/x-json',
        otherKey: 'xxx'
      },

      timeout: 5 * 1000, // 5 秒  // 超时时间，默认为 10 秒

      // 继续写其他配置...

      //【注意】不需要修改的不用写，wangEditor 会去 merge 当前其他配置

      // 上传之前触发
      onBeforeUpload(file) { // TS 语法
        // file 选中的文件，格式如 { key: file }
        return file

        // 可以 return
        // 1. return file 或者 new 一个 file ，接下来将上传
        // 2. return false ，不上传这个 file
      },

      // 上传进度的回调函数
      onProgress(progress) {  // TS 语法
        // progress 是 0-100 的数字
        console.log('progress', progress)
      },

      // 单个文件上传成功之后
      onSuccess(file, res) {  // TS 语法
        console.log(`${file.name} 上传成功`, res)
      },

      // 单个文件上传失败
      onFailed(file, res) {   // TS 语法
        console.log(`${file.name} 上传失败`, res)
      },

      // 上传错误，或者触发 timeout 超时
      onError(file, err, res) {  // TS 语法
        console.log(`${file.name} 上传出错`, err, res)
      },

    }

    editorConfig.MENU_CONF['insertVideo'] = {
      onInsertedVideo(videoNode) {
        console.log('inserted video', videoNode)
      },
    }

    editorConfig.MENU_CONF['uploadVideo'] = {
      server: '/api/upload-video',

      timeout: 15 * 1000, // 15s
      fieldName: 'custom-fileName',
      meta: { token: 'xxx', a: 100 },
      metaWithUrl: true, // join params to url
      headers: { Accept: 'text/x-json' },

      maxFileSize: 10 * 1024 * 1024, // 10M

      onBeforeUpload(file) {
        console.log('onBeforeUpload', file)

        return file // will upload this file
        // return false // prevent upload
      },
      onProgress(progress) {
        console.log('onProgress', progress)
      },
      onSuccess(file, res) {
        console.log('onSuccess', file, res)
      },
      onFailed(file, res) {
        alert(res.message)
        console.log('onFailed', file, res)
      },
      onError(file, err, res) {
        alert(err.message)
        console.error('onError', file, err, res)
      },

      // customInsert(res, insertFn) {
      //   console.log('customInsert', res)
      //   const videoInfo = res.data || {}
      //   const { url, poster } = videoInfo
      //   if (!url) throw new Error(`Video url is empty`)

      //   console.log('Your video url ', url)
      //   insertFn(url, poster)
      // },

      // customUpload(file, insertFn) {
      //   console.log('customUpload', file)

      //   return new Promise((resolve) => {
      //     // Simulate async insert video
      //     setTimeout(() => {
      //       const src = `https://www.w3school.com.cn/i/movie.ogg`
      //       const poster = 'https://www.baidu.com/img/flexible/logo/pc/result@2.png'
      //       insertFn(src, poster)
      //       resolve('ok')
      //     }, 500)
      //   })
      // },

      // customBrowseAndUpload(insertFn) {
      //   alert('Custom browse and upload')

      //   // Simulate async insert video
      //   setTimeout(() => {
      //     const src = '<iframe src="//player.bilibili.com/player.html?aid=250348909&bvid=BV1Pv411w7Xr&cid=401518678&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>'
      //     insertFn(src, '')
      //   }, 500)
      // },
    }


    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
      console.log('created', editor)
      console.log(editor.getAllMenuKeys())  // 查看所有工具栏key
      // editor.disable()
    }
    const handleChange = (editor) => { console.log('change:', editor.children) }
    const handleDestroyed = (editor) => { console.log('destroyed', editor) }
    const handleFocus = (editor) => { console.log('focus', editor) }
    const handleBlur = (editor) => { console.log('blur', editor) }
    const customAlert = (info, type) => { alert(`【自定义提示】${type} - ${info}`) }
    const customPaste = (editor, event, callback) => {
      console.log('ClipboardEvent 粘贴事件对象', event)
      // const html = event.clipboardData.getData('text/html') // 获取粘贴的 html
      // const text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
      // const rtf = event.clipboardData.getData('text/rtf') // 获取 rtf 数据（如从 word wsp 复制粘贴）

      // 自定义插入内容
      // editor.insertText('xxx')

      // 返回 false ，阻止默认粘贴行为
      // event.preventDefault()
      // callback(false) // 返回值（注意，vue 事件的返回值，不能用 return）

      // 返回 true ，继续默认的粘贴行为
      callback(true)
    }

    const insertText = () => {
      const editor = editorRef.value // 获取 editor ，必须等待它渲染完之后
      if (editor == null) return

      editor.insertText('hello world') // 执行 editor API
    }

    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChange,
      handleDestroyed,
      handleFocus,
      handleBlur,
      customAlert,
      customPaste,
      insertText
    };
  }
}
</script>   
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    /* display: flex; */
    /* align-items: center; */
  }
}
</style>
