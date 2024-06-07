import { pinia } from '@/stores'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Current {
  isView: Boolean,
  ver: number,
  breadcrumb: any[],
  naviInfo: {},
  htmlContent: String,
  menuInfo: {},
  docInfo: {},
}

// defineStore第三个参数中启用持久化配置
//  当启用持久化后，pinia数据发生改变时，会自动将数据存到localStorage中
//  当页面刷新后，会自动读取localStorage
export const usePermissionStore = defineStore('permissions', () => {
  const current = ref<Current>({
    isView: true, // true：浏览状态；false：编辑状态
    ver: new Date().valueOf(), // 版本信息 
    // 面包屑，存放激活的每一级菜单的ID和名称，以及path
    breadcrumb: [],
    // 当前导航项信息
    naviInfo: {
      id: 1,
      naviId: 1, //当前导航项ID，据此加载菜单列表
      name: '',
      sort: 1,
    },
    menuInfo: { // 当前激活的菜单项
      id: 1,
      name: "操作指南",
      parent: 0,
      parentTopId: 1,
      sort: 1,
      subList: [],
      type: 0,
    },
    htmlContent: '',
    docInfo: { // 当前激活的文档内容
      md: '# 这是标题', // 编辑文档的内容
      ver: 1.0,
      time: '', // 发布时间
      lastTime: '', // 最后修改时间
      code: [{
        id: '',
        js: '',
        template: '',
        style: ''
      }], // 一个文档包含的可以运行的代码，js 和 template
      comp: {} // 一个文档包含的可以运行的组件 上一步、下一步
    }
  })
  const menuList = ref<any[]>([
    {
      "id": "10_introduce",
      "name": "介绍11111111111111111111",
      "description": "描述",
      "icon": "Document",
      "subList": []
    },
    {
      "id": "11_quick_start",
      "name": "快速上手",
      "description": "描述",
      "icon": "FolderOpened",
      "subList": [
        {
          "id": "11_quick_start_1",
          "name": "编辑文档项目",
          "description": "",
          "icon": "Document",
        },
        {
          "id": "11_quick_start_2",
          "name": "展示文档项目",
          "description": "",
          "icon": "Document"
        }
      ]
    },
    {
      "id": "12_config",
      "name": "配置",
      "description": "描述",
      "icon": "Document",
      "subList":[]
    },
    {
      "id": "13_page",
      "name": "页面",
      "description": "",
      "icon": "Document",
      "subList":[]
    },
    {
      "id": "14_markdown",
      "name": "Markdown",
      "description": "",
      "icon": "Document",
      "subList":[]
    },
    {
      "id": "15_assets",
      "name": "静态资源",
      "description": "",
      "icon": "Document",
      "subList":[]
    },
    {
      "id": "16_package",
      "name": "打包方式",
      "description": "",
      "icon": "Document",
      "subList":[]
    },
    {
      "id": "17_loadcomp",
      "name": "加载组件",
      "description": "",
      "icon": "Document",
      "kind": 1,
      "subList":[]
    },
    {
      "id": "18_runcode",
      "name": "加载图片",
      "description": "",
      "icon": "Document",
      "kind": 1,
      "subList":[]
    }
  ])
  const counter = ref(100)

  // 定义计算属性
  const counterComputer = computed(() => {
    return counter.value * 2
  })

  // 定义方法
  const add = () => {
    counter.value++
  }

  // 定义根据导航获取菜单的方法
  // const 

  return {
    current,
    menuList,
    counterComputer,
    add
  }
}, {
  persist: true // 开启pinia数据持久化
})

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(pinia)
}
