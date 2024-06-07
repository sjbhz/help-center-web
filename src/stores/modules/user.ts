import { checktoken } from '@/api/user'
import { pinia } from '@/stores'
import { defineStore } from 'pinia'
import { ref } from 'vue'
interface UserInfo {
  userId: number
}
export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo>({
    userId: 0
  })
  // 获取用户信息
  function getUserInfo() {
    let token = localStorage.getItem('token')
    let my_token = { token: token }
    return new Promise<UserInfo>((resolve, reject) => {
      checktoken(my_token)
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  return {
    user,
    getUserInfo
  }
})

// 非setup
export function useUserStoreHook() {
  return useUserStore(pinia)
}
