<template>
  <div class="wraper" ref="wraper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import BSscroll from 'better-scroll'
export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },

  mounted() {
    //1.创建BSscroll对象
    this.scroll = new BSscroll(this.$refs.wraper,{
      click: true,   //better-scroll 默认会阻止浏览器的原生 click 事件,所以在这里给click设置true，让在scroll里面的事件可以点击
      probeType: this.probeType,  //这种做法就是封装了，在别的组件中如果不想实时监听位置的改变可以通过动态的传值决定
      pullUpLoad: this.pullUpLoad
    })
    //2.监滚动的位置
    this.scroll.on('scroll',(position) => {
      // console.log(position)   想办法把position传出去   解决办法就是通过监听事件向父组件发送一个$emit()的事件，参数position
      this.$emit('scroll',position)
    })
    // 3.监听上拉加载更多
    this.scroll.on('pullingUp',() => {
      this.$emit('pullingUp')
    })
  },
  
  methods: {
    scrollTo(x,y,time) {
      this.scroll && this.scroll.scrollTo(x,y,time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  },

}
</script>

<style  scoped>

</style>