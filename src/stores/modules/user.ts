import { checktoken } from '@/api/user'
import { pinia } from '@/stores'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken } from '@/utils/index'
interface UserInfo {
  roleId: number
  roleName:string
  userId: number
  isAdmin: number
  chName:string
}
export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo>({
    roleId:0,
    roleName:'',
    userId: 0,
    isAdmin:0,
    chName:''
  })
  // 获取用户信息
  function getUserInfo() {
    let token = getToken()
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
}, {
  persist: true // 开启pinia数据持久化
})

// 非setup
export function useUserStoreHook() {
  return useUserStore(pinia)
}
