// ==========Tinymce.vue==========
<template>
    <div class="prefixCls" :style="{ width: containerWidth }">
        <textarea :id="tinymceId" ref="elRef" :style="{ visibility: 'hidden' }"></textarea>
    </div>
</template>

<script setup lang="ts">
import tinymce from 'tinymce/tinymce'
// 插件依赖
// import 'tinymce/themes/silver'
import "tinymce/themes/silver/theme"; // 引用主题文件
// import 'tinymce/icons/default/icons'
import "tinymce/icons/default"; // 引用图标文件
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink"; //锚点
import "tinymce/plugins/autoresize";
import "tinymce/plugins/autosave";
import "tinymce/plugins/charmap"; //特殊字符
import "tinymce/plugins/code"; //查看源码
import "tinymce/plugins/codesample"; //插入代码
import "tinymce/plugins/directionality"; //
import "tinymce/plugins/fullpage"; //页面属性编辑
import "tinymce/plugins/fullscreen"; //全屏
import "tinymce/plugins/help"; //帮助
import "tinymce/plugins/hr"; //横线
import "tinymce/plugins/image"; //图片
import "tinymce/plugins/imagetools"; //图片工具
import "tinymce/plugins/importcss"; //图片工具
import "tinymce/plugins/insertdatetime"; //时间插入
import "tinymce/plugins/media"; //媒体插入
import "tinymce/plugins/nonbreaking"; //
import "tinymce/plugins/noneditable"; //不间断空格
import "tinymce/plugins/pagebreak"; //分页
import "tinymce/plugins/paste"; //粘贴
import "tinymce/plugins/preview"; //预览
import "tinymce/plugins/print"; //打印
import "tinymce/plugins/quickbars"; //快捷菜单
import "tinymce/plugins/save"; //保存
import "tinymce/plugins/searchreplace"; //查询替换
import "tinymce/plugins/spellchecker"; //拼写检查
import "tinymce/plugins/tabfocus"; //
import "tinymce/plugins/template"; //插入模板
import "tinymce/plugins/textpattern"; //
import "tinymce/plugins/toc"; //
import "tinymce/plugins/visualblocks"; //
import "tinymce/plugins/visualchars"; //
import "tinymce/plugins/wordcount"; //数字统计


import { computed, nextTick, ref, unref, watch, onDeactivated, onBeforeUnmount, defineProps, defineEmits, getCurrentInstance } from 'vue'
import { toolbar, plugins } from './tinymce'
import { buildShortUUID } from '@/utils/uuid'
import { bindHandlers } from './helper'
import { onMountedOrActivated } from '@/hooks/core/onMountedOrActivated'
import { isNumber } from '@/utils/is'

const props = defineProps({
    options: {
        type: Object,
        default: () => { }
    },
    value: {
        type: String
    },

    toolbar: {
        type: Array,
        default: toolbar
    },
    plugins: {
        type: Array,
        default: plugins
    },
    modelValue: {
        type: String
    },
    height: {
        type: [Number, String],
        required: false,
        default: 400
    },
    width: {
        type: [Number, String],
        required: false,
        default: 'auto'
    },
    showImageUpload: {
        type: Boolean,
        default: true
    }
})
const emits = defineEmits(['change', 'update:modelValue', 'inited', 'init-error'])
const { attrs } = getCurrentInstance()
const tinymceId = ref(buildShortUUID('tiny-vue'))
const containerWidth = computed(() => {
    const width = props.width
    if (isNumber(width)) {
        return `${width}px`
    }
    return width
})
const editorRef = ref(null)
const fullscreen = ref(false)
const elRef = ref(null)
const loading = ref(false);
const tinymceContent = computed(() => props.modelValue)

const initOptions = computed(() => {
    const { height, options, toolbar, plugins } = props
    const publicPath = '@/../'
    return {
        selector: `#${unref(tinymceId)}`,
        height,
        toolbar,
        // menubar: 'file edit insert view format table',
        menubar: '',
        plugins,
        language_url: `${publicPath}public/tinymce/langs/zh_CN.js`,
        language: 'zh_CN',
        branding: false,
        default_link_target: '_blank',
        link_title: false,
        object_resizing: false,
        auto_focus: true,
        skin: 'oxide',
        skin_url: `${publicPath}public/tinymce/skins/ui/oxide`,
        content_css: `${publicPath}public/tinymce/skins/ui/oxide/content.min.css`,
        ...options,
        setup: (editor) => {
            editorRef.value = editor
            editor.on('init', (e) => initSetup(e))
        },
        //图片上传
        // images_upload_handler: handleImgUpload
        images_upload_handler: (blobInfo, progress) =>
            new Promise((resolve, reject) => {
                let file = blobInfo.blob();
                if (file.size / 1024 / 1024 > 200) {
                    reject({
                        message: "上传失败，图片大小请控制在 200M 以内",
                        remove: true,
                    });
                }
                const formData = new FormData();
                formData.append("file", file);
                loading.value = true;
                //   uploadImg(props.knwlgId, formData)
                //     .then((res) => {
                //       loading.value = false;
                //       resolve(
                //         import.meta.env.VITE_APP_BASE_API +
                //           "/ekms/images/v1/preview/" +
                //           res.data.imgId
                //       );
                //     })
                //     .catch(() => {
                //       loading.value = false;
                //     });
            })
    }
})

const disabled = computed(() => {
    const { options } = props
    const getdDisabled = options && Reflect.get(options, 'readonly')
    const editor = unref(editorRef)
    if (editor) {
        editor.setMode(getdDisabled ? 'readonly' : 'design')
    }
    return getdDisabled ?? false
})

watch(
    () => attrs.disabled,
    () => {
        const editor = unref(editorRef)
        if (!editor) {
            return
        }
        editor.setMode(attrs.disabled ? 'readonly' : 'design')
    }
)

onMountedOrActivated(() => {
    if (!initOptions.value.inline) {
        tinymceId.value = buildShortUUID('tiny-vue')
    }
    // 如果使用 tinymce.activeEditor.setContent发现没办法为编辑器赋值的话可以考虑使用setTimeout等编辑器init初始化完后再赋值内容
    nextTick(() => {
        setTimeout(() => {
            initEditor()
        }, 30)
    })
})

onBeforeUnmount(() => {
    destory()
})

onDeactivated(() => {
    destory()
})

function destory() {
    if (tinymce !== null) {
        // tinymce?.remove?.(unref(initOptions).selector!);
    }
}

function initSetup(e) {
    const editor = unref(editorRef)
    if (!editor) {
        return
    }
    const value = props.modelValue || ''

    editor.setContent(value)
    bindModelHandlers(editor)
    bindHandlers(e, attrs, unref(editorRef))
}

function initEditor() {
    const el = unref(elRef)
    if (el) {
        el.style.visibility = ''
    }
    tinymce
        .init(unref(initOptions))
        .then((editor) => {
            emits('inited', editor)
        })
        .catch((err) => {
            emits('init-error', err)
        })
}

function setValue(editor, val, prevVal) {
    if (
        editor &&
        typeof val === 'string' &&
        val !== prevVal &&
        val !== editor.getContent({ format: attrs.outputFormat })
    ) {
        editor.setContent(val)
    }
}

function bindModelHandlers(editor) {
    const modelEvents = attrs.modelEvents ? attrs.modelEvents : null
    const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents

    watch(
        () => props.modelValue,
        (val, prevVal) => {
            setValue(editor, val, prevVal)
        }
    )

    watch(
        () => props.value,
        (val, prevVal) => {
            setValue(editor, val, prevVal)
        },
        {
            immediate: true
        }
    )

    editor.on(normalizedEvents || 'change keyup undo redo', () => {
        const content = editor.getContent({ format: attrs.outputFormat })
        emits('update:modelValue', content)
        emits('change', content)
    })

    editor.on('FullscreenStateChanged', (e) => {
        fullscreen.value = e.state
    })
}

function handleImageUploading(name) {
    const editor = unref(editorRef)
    if (!editor) {
        return
    }
    editor.execCommand('mceInsertContent', false, getUploadingImgName(name))
    const content = editor?.getContent() ?? ''
    setValue(editor, content)
}

function handleDone(name, url) {
    const editor = unref(editorRef)
    if (!editor) {
        return
    }
    const content = editor?.getContent() ?? ''
    const val = content?.replace(getUploadingImgName(name), `<img src="${url}"/>`) ?? ''
    setValue(editor, val)
}

function getUploadingImgName(name) {
    return `[uploading:${name}]`
}

// 图片上传自定义逻辑
function handleImgUpload(blobInfo, success, failure, progress) {
    var xhr, formData;
    var file = blobInfo.blob();//转化为易于理解的file对象
    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', '/demo/upimg.php');
    xhr.onload = function() {
        var json;
        if (xhr.status != 200) {
            // failFun('HTTP Error: ' + xhr.status);
            failure('HTTP Error: ' + xhr.status);
            return;
        }
        json = JSON.parse(xhr.responseText);
        if (!json || typeof json.location != 'string') {
            // failFun('Invalid JSON: ' + xhr.responseText);
            failure('Invalid JSON: ' + xhr.responseText);
            return;
        }
        // succFun(json.location);
        success(json.location);
    };
    formData = new FormData();
    formData.append('file', file, file.name );
    xhr.send(formData);
}

</script>

<style lang="scss" scoped>
.prefixCls {
    position: relative;
    line-height: normal;
}

textarea {
    z-index: -1;
    visibility: hidden;
}
</style>

