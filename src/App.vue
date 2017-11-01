<template>
  <div id="app">
    <div class="left">
      <div class="top">
        <div class="icon">
          <img src="./assets/user-head.jpg">
        </div>
      </div>
      <div class="center">
        <el-menu default-active="2" class="el-menu-1" :router=true>
          <el-submenu index="1" class="el-menu-2">
            <template slot="title">
              <i class="el-icon-message"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="/hello" class="el-menu-2">选项1</el-menu-item>
            <el-menu-item index="1-2" class="el-menu-2">选项2</el-menu-item>
            <el-menu-item index="1-3" class="el-menu-2">选项3</el-menu-item>
            <el-menu-item index="1-4-1" class="el-menu-2">选项1</el-menu-item>
          </el-submenu>
          <el-menu-item index="/demo">
            <i class="el-icon-menu"></i>
            <span slot="title">商品</span>
          </el-menu-item>
          <el-menu-item index="/manage/banner">
            <i class="el-icon-menu"></i>
            <span slot="title">幻灯片</span>
          </el-menu-item>
          <el-menu-item index="/manage/typeGroup">
            <i class="el-icon-menu"></i>
            <span slot="title">标签管理</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">导航三</template>
            <el-menu-item index="3-1" class="el-menu-2">选项1234</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <!--<div class="bottom">bottom</div>-->
    </div>
    <div class="content">
      <!--<div style="width: 1000px;background: red;">456</div>-->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style scoped lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
    width: 100%;
    height: 100%;
    padding-left: 200px;
    box-sizing: border-box;
  }
  .left, .content {
    height: 100%;
    box-sizing:border-box;
  }
  .left {
    position: absolute;
    left: 0;
    padding-top: 90px;
    width: 200px;
    background: #fff;
    .top {
      position: absolute;
      top: 0;
      width: 100%;
      /*z-index: 1;*/
      background: #545c64;
      padding: 10px 0;
      border-bottom: 1px solid #7e7b7b;
      .icon {
        margin: 0 auto;
        width: 69px;
        height: 69px;
        border-radius: 50px;
        background: white;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }
    .center {
      /*position: absolute;*/
      /*top: 0;*/
      box-sizing:border-box;
      height: 100%;
      width: 100%;
      /*padding-top: 90px;*/
      overflow: auto;
      overflow-x: hidden;
      /*background: #fff;*/
    }
    .bottom {
      position: absolute;
      width: 100%;
      bottom: 0;
      border-top: 1px solid #7e7b7b;
    }
  }
  .content {
    /*background: palevioletred;*/
    width: 100%;
    overflow: auto;
    /*left: 20%;*/
  }


</style>

<style>
  .el-menu {
    /*border-right: 0;*/
    height: 100%;
  }
  .el-menu.el-menu-1>li {
    border-bottom: 1px solid #f0f0f0;
  }
  .el-menu>li.el-menu-2 {
    border-top: 1px solid #f0f0f0;
  }
</style>
