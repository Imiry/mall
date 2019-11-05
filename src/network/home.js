import {request} from './request'

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}


export function getHomeGoods(type, page) {   //通过有参数的axios的数据请求，带有参数，params的形式传递两个参数
  return request({
    url: '/home/data',   
    params: {
      type,
      page
    }
  })
}