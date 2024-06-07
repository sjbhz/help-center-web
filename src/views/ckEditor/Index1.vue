<template>
  <div id="app">
      <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
  </div>
</template>

<script>
// 此方案 直接安装，需要在mian中引入CKEditor == 可展示 
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

  export default {
      name: 'Index',
      data() {
          return {
              editor: ClassicEditor,
              editorData: '<p>Content of the editor.</p>',
              editorConfig: {
                  // The configuration of the editor.
              }
          };
      }
  }
</script>
