<template>
  <el-form :model="searchData" ref="formSearch" label-width="90px" class="order-search">
    <el-form-item label="订单编号" prop="id">
      <el-input v-model="searchData.id" placeholder="请输入订单编号"></el-input>
    </el-form-item>
    <el-form-item label="商品编号" prop="testname">
      <el-input v-model="searchData.testname" placeholder="请输入商品编号"></el-input>
    </el-form-item>



    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, {test} from '../../common/bus.js'
import { dateArrayFmt } from '../../common/utils.js'
export default {
  name: 'test-search',
  data: function () {
    return {
      searchData: { id: '', testname: '' },
      loading: false
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    search: function () { // 点击搜索
      bus.$emit(test.search, Object.assign({}, this.searchData, {start: dateArrayFmt(this.searchData.start)}))
    },

    reset: function () { // 点击重置
      this.$refs['formSearch'].resetFields()
      this.search()
    }
  }
}
</script>

<style scoped>
  .order-search {
    margin: 10px 0;
  }
  .order-search .el-form-item.search-action{
    text-align: center;
  }
  .order-search .el-form-item {
    display: inline-block;
    margin-bottom: 10px;
  }
  .order-search .el-form-item .el-input__inner {
    width: 220px;
  }
</style>
