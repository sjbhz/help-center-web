import request from '@/utils/request'

/**
 * getTopTabs获取顶部导航
 * params为请求参数
 */
export function getTopTabs(params) {
  return request({
    url: '/helpt/api/helpcenter/toptab',
    method: 'get',
    data: params,
  })
}

//获取侧边菜单
export function getSideTabs(topId,params) {
  return request({
    url: `/helpt/api/helpcenter/sideTab?topId=${topId}`,
    method: 'get',
    data: params,
  })
}

// 获取内容 articleId:左侧菜单Id
export function getArticleInfo(menuId,params) {
  return request({
    url: `/helpt/api/helpcenter/articleInfo?articleId=${menuId}`,
    method: 'get',
    data: params
  })
}

// 更新内容
export function updateArticle(params) {
  return request({
    url: '/helpt/api/helpcenter/updateArticle',
    method: 'POST',
    data: params
  })
}

// MD使用上传图片
export function uploadImages(params) {
  return request({
    url: `/helpt/api/md/upload`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data;' },
    data: params,
  })
}

// MD使用获取图片
export function getImages(params) {
  return request({
    url: '/helpt/api/md/get',
    method: 'get',
    data: params
  })
}

// MD使用获取video
export function getVideo(params) {
  return request({
    url: '/helpt/api/md/get',
    method: 'get',
    data: params
  })
}

// 新增顶部边栏
export function addFormNavi(params) {
  return request({
    url: '/helpt/api/helpcenter/createTopTab',
    method: 'POST',
    data: params
  })
}

// 新增边栏 包括主边栏和副边栏---不用
export function addFormMenu(params) {
  return request({
    url: '/helpt/api/helpcenter/createSideTab',
    method: 'POST',
    data: params
  })
}

// 新增边栏---主边栏（第一层菜单） 
/**
 * name：新菜单名字
 * topId：主菜单所属导航navi的id
 */
export function addMainFormMenu(params) {
  return request({
    url: '/helpt/api/helpcenter/createSideTab',
    method: 'POST',
    data: params
  })
}

// 新增边栏---副边栏(子菜单)
/**
 * name：新菜单名字
 * parent：上一层菜单的id
 */
export function addChildFormMenu(params) {
  return request({
    url: '/helpt/api/helpcenter/createSideTab/second',
    method: 'POST',
    data: params
  })
}
// 删除侧边菜单栏
export function deleteFormMenu(params) {
  return request({
    url: '/helpt/api/helpcenter/deleteSideTab',
    method: 'POST',
    data: params
  })
}
// 更新侧边菜单栏
export function updateFormMenu(params) {
  return request({
    url: '/helpt/api/helpcenter/updateSideTab',
    method: 'POST',
    data: params
  })
}


