import request from '@/utils/request'
import { AxiosPromise } from 'axios'

/**
 * checktoken获取用户信息以及菜单栏等
 * params为请求参数token
 */
export function checktoken(params) {
  return request({
    url: '/microS/api/user/checkToken',
    method: 'get',
    params: params
  })
}
