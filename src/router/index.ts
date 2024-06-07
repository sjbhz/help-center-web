import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/helpcenter-web/'),
  routes: [
    {
      path: '/',
      redirect: '/initLayout',
      meta: {
        title: '帮助中心'
      },
    },
    // {
    //   path: '/welcome',
    //   name: 'welcome',
    //   component: () => import('../views/HomeView.vue')
    // },
    {
      path: '/ckeditor',
      name: 'ckeditor',
      component: () => import('../views/ckEditor/Index.vue')
    },
    {
      path: '/tinyView',
      name: 'tinyView',
      component: () => import('../views/tinyView/TinyView.vue')
    },
    {
      path: '/vmdEditor',
      name: 'VMdEditor',
      component: () => import('../views/vmEditor/VMdEditor.vue')
    },
    {
      path: '/initLayout',
      name: 'initEdit',
      component: () => import('../views/initLayout/Index.vue')
    },

  ]
})

export default router
