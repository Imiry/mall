<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{totalPrice}}
    </div>

    <div class="calculate">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkbutton/CheckButton";
import {mapGetters} from 'vuex'
export default {
  name: 'CartBottomBar',
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if(this.cartList.length === 0) return false
      //1.利用fliter，不过性能有点差
      // return !(this.cartList.filter(item => !item.checked).length)
      //2.利用find
      // return !(this.cartList.find(item => !item.checked))

      //普通遍历
      for(let item of this.cartList){
        if(!item.checked){  //没有被选中就return false
          return false  
        }
      }
      return true
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) { //全选中
        this.cartList.forEach(item => item.checked = false)
      } else { //部分或全部不选中
        this.cartList.forEach(item => item.checked = true)
      }
    }
  },
}
</script>

<style  scoped>
  .bottom-bar {
    position: relative;
    height: 40px;
    line-height: 40px;
    background-color: #eee;
    display: flex;
    font-size: 15px;
  }
  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price {
    margin-left: 20px;
    flex: 1;
  }
  .calculate {
    width: 90px;
    background-color: var(--color-tint);
    color: #eee;
    text-align: center;
  }
</style>