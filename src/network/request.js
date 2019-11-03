import axios from 'axios'

export function request(config) {
    //1.创建axios实例
    const instance = axios.create({
      baseURL: 'http://106.54.54.237:8000/api/v1',
      timeout: 5000
    })
    //2.axios的拦截器
    //2.请求拦截
    instance.interceptors.request.use(config => {
      return config
    },err => {
      // console.log(err)
    })

    //2.2响应拦截
    instance.interceptors.response.use(res => {
      return res.data
    },err => {
      console.log((err))
    })

   return instance(config)   
    //config就相当于url       这时本省返回promise
    //>这种方式就是相当于把axios放到一个函数里面，然后调用这个函数，
    //通过调用这个函数执行axios实例的方法  实例({url})  其中url时通过函数的参数传递过来的  
}
