import { pinia } from '@/stores'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNaviInfoStore = defineStore('naviInfo', () => {
  const naviList = ref([
    { "naviId": "1010", "text": "加载中", "link": "menu" },
    { "naviId": "1080", "text": "Gitee", "link": "menu" },
    { "naviId": "1090", "text": "在线演示", "link": "menu" }
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
