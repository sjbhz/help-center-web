import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken } from '@/utils/index'
// import { useUserStoreHook } from "@/store/modules/user";

// 创建 axios 实例
const service = axios.create({
  baseURL: '/helpcenter-web/',
  timeout: 120 * 1000,
  // headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getToken()
    if (accessToken) {
      config.headers.Authorization = accessToken
      config.headers['x-access-token'] = accessToken
      config.headers.token = accessToken
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    const old_url = (top as any).location.href

    //2003代表token失效，跳转登陆页面
    if (data.code && data.code == 20003) {
      ElMessage.error(data.message)
      window.setTimeout(() => {
        ElMessageBox.alert('token已过期，请重新登录操作', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            ; (window as any).objWin = window.open(
              '/passport-web/login?return_uri=' + old_url,
              '_top'
            )
          }
        })
      }, 1 * 1000)
      return Promise.reject(data)
    }
    // 成功返回数据
    if (data.code) {
      return data
    }
    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer) {
      return response
    }
    // 单独处理
    return response
    // return Promise.reject(new Error(data.message || 'Error'))
  },
  (error: any) => {
 
    // token过期后请求会变成401，重新登录处理
    const old_url = (top as any).location.href
    if (error.response.status === 401) { // 在error对象中 可以看到状态 是否为401
      ElMessage({
        message: '无效的token，请重新登录',
        type: 'error',
        duration: 2 * 1000
      })
      window.setTimeout(() => {
        ElMessageBox.alert('token已过期，请重新登录操作', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            ; (window as any).objWin = window.open(
              '/passport-web/login?return_uri=' + old_url,
              '_top'
            )
          }
        })
      }, 1 * 1000)


    }
    return ElMessage.error({ message: "系统错误，请联系管理员！", showClose: true });
  }
)

// 导出 axios 实例
export default service
