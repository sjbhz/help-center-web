import { pinia } from '@/stores'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNaviInfoStore = defineStore('naviInfo', () => {
  // const naviList = ref<any[]>([]) 
  // 测试用
  const naviList = ref<any[]>([
    { "id": "1010", "name": "加载中", "link": "menu" },
    { "id": "1080", "name": "Gitee", "link": "menu" },
    { "id": "1090", "name": "在线演示", "link": "menu" },
    {
      "id": "22",
      "name": "快速上手",
      "link": "menu"
    },
    {
      "id": "1010",
      "name": "通用能力",
      "link": "menu"
    },
    {
      "id": "1354",
      "name": "常见问题",
      "link": "menu"
    },
    {
      "id": "1395",
      "name": "法律条款",
      "link": "menu"
    },
    {
      "id": "1396",
      "name": "联系我们",
      "link": "menu"
    }
  ])

  return {
    naviList,
  }
}, {
  persist: true // 开启pinia数据持久化
})

// 非setup
export function useNaviInfoStoreHook() {
  return useNaviInfoStore(pinia)
}
