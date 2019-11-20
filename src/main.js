import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import Toast from 'components/common/toast'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false
//安装插件
Vue.use(Toast)

//解决移动端300ms的延迟y
FastClick.attach(document.body)

//解决图片的懒加载   也可以加参数为图片给个占位
Vue.use(VueLazyLoad)

Vue.prototype.$bus = new Vue()     //利用原型的方式设置一个事件总线

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
