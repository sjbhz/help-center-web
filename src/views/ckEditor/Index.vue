<template>
  <div class="about">
    <h1>This is a ck-editor page</h1>
    <div id="ck-editor"></div>
    <button @click="handleClick">获取内容</button>
  </div>
</template>

<script lang="ts">
// 直接引入build文件下的ckeditor文件（来自于github中ckeditor5-build-classic源码）
import { defineComponent, reactive, toRefs, onMounted, toRaw } from 'vue';
import UploadAdapter from './UploadAdapter.js';

export default defineComponent({
  setup() {
    const state = reactive({});
    let editor: any = null;

    onMounted(() => {
      (window as any).ClassicEditor.create(document.getElementById("ck-editor"),
      { ckfinder: { uploadUrl: '/' } }
      ).then((_editor: any) => {
        _editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
          return new UploadAdapter(loader);
        };

        editor = _editor;
      })
    })

    const handleClick = () => {
      console.log(editor.data.get())
    }

    return {
      ...toRefs(state),
      handleClick,
    }
  }
});


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
