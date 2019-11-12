import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()     //利用原型的方式设置一个事件总线

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
