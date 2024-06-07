import './assets/main.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import Cookies from 'js-cookie'
import App from './App.vue'
import router from './router'
import { setupStore } from '@/stores'
// 样式
import '@/styles/element-customize.scss'
import '@/styles/index.scss'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


// 引入常量
import Enum from '@/common/enum';
import EnumModule from '@/common/module';

// 引入CKEditor5
// import CKEditor from '@ckeditor/ckeditor5-vue';  //直接安装官网提供的，插件功能不够，不完全满足需求
import '@/components/ckEditor5/build/ckeditor' //自定义dist

// 富文本 v-md-editor 导入
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";

// highlightjs
import hljs from "highlight.js";

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn }) //element图标注册
// app.use(CKEditor)
Object.keys(Icons).forEach((key) => {  // 注册所有图标
  app.component(key, Icons[key])
})
app.use(router)

app.use(VMdEditor)

app.use(Enum, EnumModule);

//获取token,从cookie中获取
let token = Cookies.get('x-access-token') || null
if (token) {
  localStorage.setItem('token', token)
} else {
  token = localStorage.getItem('token')
}

//用户id
const params = new URLSearchParams(new URL(window.location as any).search)
let userId = params.get('ccuserId')
if (userId) {
  localStorage.setItem('ccuserId', userId)
  localStorage.setItem('userId', userId)
} else {
  userId = localStorage.getItem('ccuserId') || localStorage.getItem('userId')
}

// 全局注册 状态管理(store)
setupStore(app)
app.mount('#app')
