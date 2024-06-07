<template>
  <div class="about">
    <!-- <h1>This is a VMdEditor page</h1> -->
    <!-- <VMdTextareaEditor v-model="content" :mode="`preview`" /> -->
    <VMdTextareaEditor 
      :toolbar="toolbar"
      left-toolbar="undo redo clear | tip emoji code | customToolbar | h bold italic strikethrough quote | ul ol table hr | link image  | save "
      :include-level="[1, 2, 3, 4]" 
      v-model="content" 
      :height="editHeight + 'px'"
       @save="submit"
    >
    </VMdTextareaEditor>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import VMdTextareaEditor from "@kangc/v-md-editor"

defineOptions({
  name: 'VMdEditor',
  inheritAttrs: false
})
let content = ref('hello')

// 可见的高度
const editHeight = document.documentElement.clientHeight - 200

// 设置工具栏
const toolbar = {
  customToolbar: {
    icon: 'v-md-icon-tip',
    title: '加载组件、图片和代码定位',
    menus: [
      {
        name: 'addcomp',
        text: '插入组件',
        action(editor) {
          // toolbar点击时触发的函数
          editor.insert(function (selected) {
            const prefix = `<div 
                id="yourId"
                data-key="compKey"
                data-title="标题"
                data-props='{"msg":"组件的属性，可以不设置"}'
              >\n  `;
            const suffix = '\n</div>';
            const placeholder = '加载中';
            const content = selected || placeholder;

            return {
              text: `${prefix}${content}${suffix}`,
              selected: content,
            }
          })
        }
      },
      {
        name: 'addcode',
        text: '代码定位',
        action(editor) {
          // toolbar点击时触发的函数
          editor.insert(function (selected) {
            const prefix = '<div id="';
            const suffix = '">加载中</div>';
            const placeholder = 'codeID';
            const content = selected || placeholder;

            return {
              text: `${prefix}${content}${suffix}`,
              selected: content,
            }
          })
        }
      },
      {
        name: 'addimg',
        text: '插入本地图片',
        action(editor) {
          // toolbar点击时触发的函数
          editor.insert(function (selected) {
            const prefix = '![图片描述]({_baseUrl_}img/';
            const suffix = ')';
            const placeholder = '图片名称';
            const content = selected || placeholder;

            return {
              text: `${prefix}${content}${suffix}`,
              selected: content,
            }
          })
        }
      }
    ]
  }
}

function handleChange(item) {
  console.log('change', item)
}
function submit(html) {
  //  保存成md

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
