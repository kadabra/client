import client from './client'

export default (Vue) => {
  Vue.prototype.$K = client
}