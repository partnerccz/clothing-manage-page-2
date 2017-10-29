<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <el-form-item label="类型" prop="type">
      <el-select v-model=searchData.type>
        <el-option label="不限" value=""></el-option>
        <el-option v-for="item in types" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model=searchData.status>
        <el-option label="不限" value=""></el-option>
        <el-option label="禁用" value=0></el-option>
        <el-option label="启用" value=1></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker v-model="searchData.startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" :editable=false placeholder="创建开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker v-model="searchData.endTime" type="datetime" :editable=false placeholder="创建结束时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, { setting } from '../../common/bus.js'
import { dateFmt } from '../../common/utils.js'
import { INIT_TYPE } from '../../store/action-types'
import { mapState, mapActions } from 'vuex'
// import { createNamespacedHelpers } from 'vuex'

// const { mapState, mapActions } = createNamespacedHelpers('types')

export default {
  name: 'setting-search',
  created: function () {
    bus.$on(setting.refreshListForAdd, () => { // 监听数据添加后的类型数据刷新
      this.getTypes()
    })
  },
  data: function () {
    return {
      searchData: {type: '', status: '', startTime: '', endTime: ''}
    }
  },
  mounted: function () {
    this.search()
    this.getTypes()
  },
  computed: mapState([
    'types'
  ]),
//  computed: mapState({
//    types: state => state.types.types
//  }),
  methods: {
    search: function () { // 点击搜索
      bus.$emit(setting.search, Object.assign({}, this.searchData, {startTime: dateFmt(this.searchData.startTime), endTime: dateFmt(this.searchData.endTime)}))
    },
    reset: function () { // 点击重置
      this.$refs['formSearch'].resetFields()
      this.search()
    },
//    getTypes: function () { // 获取类型数据
//      this.$http.post('/getType', {}).then((response) => {
//        this.types = response.data || []
//      })
//    },
    ...mapActions({
      getTypes: INIT_TYPE
    })
  }
}
</script>

<style scoped>
</style>
