import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  [ADD_COUNTER](state,payload) {
    payload.count ++
  },
  [ADD_TO_CART](state,payload) {
    payload.checked = true   //对象模型中加了一个checked
    state.cartList.push(payload)
  }
}