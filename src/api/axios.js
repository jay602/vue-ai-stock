import axios from 'axios'
import { toast } from '@/utils/tips'
import { ERR_OK, ERR_OK_AI, HOST } from './config'

const Axios = axios.create({
  baseURL: HOST, // 前缀
  responseType: 'json', // 数据格式
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/json;charset=UTF-8' // json格式数据
  }
})

// http请求拦截器<pendding>
Axios.interceptors.request.use(
  config => {
    // 防止get请求获取数据304缓存，必须保证状态为200
    if (config.method === 'get') {
      if (config.params) {
        config.params['_'] = +new Date()
      } else {
        config.params = { '_': +new Date() }
      }
    }
    return config
  },
  error => {
    toast({ type: 'error', txt: error.data.message })
    return Promise.reject(error)
  }
)

// http响应拦截器<done>
Axios.interceptors.response.use(
  response => {
    let data = response.data

    // 如返回数据为空对象，需要抛出再次请求，不显示提示框
    if (Object.values(data).length) {
      if (data.code === ERR_OK || data.code === ERR_OK_AI) {
        // 判断返回数据格式
        if (typeof data === 'string' && data !== '') {
          data = JSON.parse(data)
        }
        return data.result
      } else {
        const msg = data.message || '请求异常'
        toast({ type: 'error', txt: msg })
        return Promise.reject(data)
      }
    } else {
      return Promise.reject(data)
    }
  },
  error => {
    let message = error.message
    // 超时错误
    if (error.code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
      message = '网络请求超时，请稍后重试'
    }
    toast({ type: 'error', txt: message })
    return Promise.reject(error)
  }
)

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default Axios
