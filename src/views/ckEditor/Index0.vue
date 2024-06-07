<script setup>
// 打包定制 'full-classic-editor'

    import { ref,reactive } from 'vue'
    // 从full-classic-editor包中导入我们定制的ClassicEditor
    import Editor from 'full-classic-editor'

    import { onMounted } from 'vue'
    // 导入代码高亮库
    import hljs from "highlight.js"
    // 导入我们之前在full-classic-editor项目中自定义的图片上传适配器
    import {ImageUploadAdapter} from 'full-classic-editor/src/plugin/ImageUploadAdapter'
    
    const editor = Editor
    // 编辑器响应式数据
    let editorData = ref('<p>Content of the editor</p>');
    // 代码块字符串数组
    let codeBlocks = reactive([])
    // 编辑器配置变量
    let editorConfig = reactive({
        language: 'zh-cn'
    })
    onMounted(()=>{
        
    })

    const editorReady = (editor)=>{
        window.ckeditor = editor
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            const uploadOptions = {
                // 文件上传路径
                uploadUrl: import.meta.env.VITE_BASE_URL+'/upload/ckEditor/simpleUploadAdapter',
                withCredentials: true,
                headers: {
                  // 身份认证请求头
                  Authorization: sessionStorage.getItem('authToken')
                }
            }
            return new ImageUploadAdapter(loader, uploadOptions)
        }
    }
    // 代码高亮显示
    const highlightCode = ()=> {
        codeBlocks.value = []
        var editorMain = document.getElementsByClassName('ck ck-content ck-editor__editable')[0]
        let blocks = editorMain.querySelectorAll("pre code")
        for(var i=0; i<blocks.length;i++){
             var block = blocks[i]
             var dataLanguage =  block.parentNode.getAttribute('data-language')
             var className = block.getAttribute('class') + ' hljs'
            if(block.innerText==null || block.innerText=='' || block.innerText=='\n'){
                return
            }
            var highlightCode = hljs.highlightAuto(block.innerText).value;
            // 代码高亮后的字符串'双引号'被替换成了'&quot;', 单引号被替换成了'&#x27;', 所以需要将其还原回来
            highlightCode = highlightCode.replaceAll('&quot;', '"').replaceAll('&#x27;', '\'')
            console.log(highlightCode)
            block.innerText = ''
            block.innerHTML = highlightCode
            codeBlocks.value.push({
                dataLanguage: dataLanguage,
                className: className,
                codeBlock: highlightCode
            })
            console.log(codeBlocks)
        }
    }

</script>
<template>
   <div id="editor-container">
        <Ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="editorReady"></Ckeditor>
        <el-button type="primary" @click="highlightCode" style="margin-top: 10px;margin-bottom: 10px;">代码高亮显示</el-button>
        <div class="code-area">
            <!--遍历语法高亮后的代码数组-->
            <pre v-for="(item, index) in codeBlocks.value" :key="index" :data-language="item.dataLanguage">
                <code :class="item.className" style="text-align: left;" v-html="item.codeBlock"></code>
            </pre>
        </div>
   </div>
</template>
