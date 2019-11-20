<template>
  <div>
    <nav-bar class="navbar">
      <div slot="left"><img src="~assets/img/profile/avatar.svg" alt=""></div>
      <div slot="center"><div class="font">登录/注册</div></div>
      <div slot="right"></div>
    </nav-bar>
  </div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar'
export default {
  name: 'ProfileNavBar',
  components: {
    NavBar
  }
}
</script>
<style  scoped>
  .navbar{
    height: 90px;
    display: flex;
    align-items: center
  }
  .navbar img{
    width: 50px;
    height: 50px;
    margin-left: 20px;
    margin-top: 10px
  }
  .font{
    font-size: 20px;
    margin-left: -100px
  }
</style>