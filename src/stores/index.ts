import type { App } from 'vue'
import { createPinia } from 'pinia'
// 引入持久化插件
import persist from 'pinia-plugin-persistedstate'
// 实例化pinia
const pinia = createPinia()

// 全局注册 pinia
export function setupStore(app: App<Element>) {
  app.use(pinia.use(persist)) // 注册插件
  // app.use(pinia) 
}

export * from './modules/user'
export * from './modules/permissions'
export * from './modules/naviInfo'
export { pinia }
