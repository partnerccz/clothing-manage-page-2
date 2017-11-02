<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="add">添加</el-button>
      <el-button type="success" size="small" @click="setStatus(1)">批量上架</el-button>
      <el-button size="small" @click="setStatus(0)">批量下架</el-button>
      <el-button type="danger" size="small" @click="setStatus(-1)">批量删除</el-button>
    </div>
    <el-table :data="tableData" @row-dblclick="showStandardList" @selection-change="selectChange" :default-sort="orderInfo" @sort-change="sortChange"  highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <!--<el-table-column fixed type="index" label="序号" width="70"></el-table-column>-->
      <el-table-column fixed prop="id" label="ID" min-width="30"></el-table-column>
      <el-table-column fixed prop="name" label="名称" min-width="70"></el-table-column>
      <el-table-column prop="country" label="国家" min-width="70"></el-table-column>
      <el-table-column prop="brand" label="品牌" min-width="70"></el-table-column>
      <el-table-column prop="fruit_type" label="水果类型" show-overflow-tooltip min-width="100"></el-table-column>
      <el-table-column sortable prop="sort" label="排序" min-width="50"></el-table-column>
      <el-table-column sortable prop="fresh_time" label="保鲜时长" width="90"></el-table-column>
      <el-table-column sortable prop="fresh_expire_time" label="保鲜过期时间" width="180"></el-table-column>
      <el-table-column prop="fruit_des" label="果品特征" width="180"></el-table-column>
      <el-table-column prop="store_way" label="存储方式" width="180"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="180"></el-table-column>
      <el-table-column fixed="right" prop="total_sell_num" label="总销量" width="70"></el-table-column>
      <el-table-column fixed="right" prop="week_sell_num" label="周销量" width="70"></el-table-column>
      <el-table-column fixed="right" prop="status" label="状态" width="70">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'gray'" close-transition>{{scope.row.status === 1 ? '启用' :  '禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="setStatus(scope.row.status === 1 ? 0 : 1, [scope.row.id])" type="text" size="small" :class="scope.row.status === 1 ? 'disable' : 'enable'">{{scope.row.status === 1 ? '禁用' : '启用'}}</el-button>
          <el-button @click="setStatus(-1, [scope.row.id])" type="text" size="small" class="delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
    <!--layout="total, sizes, prev, pager, next, jumper"-->
    <transition name="standard" mode="out-in">
      <sub-list v-show="showStandard" :standard.sync="showStandard"></sub-list>
    </transition>
    <component :is="editCompName" :showDialog.sync="showEdit" :editRowId="editRowId"></component>
  </div>
</template>

<script>
import bus, {setting, productStandard} from '../../common/bus.js'
import {localStorageKeys} from '../../common/const.js'
import subList from './SubList'

export default {
  name: 'product',
  components: {
    // tableForm: resolve => require(['./AddOrEdit'], resolve) // 必须用下面的方式加载，否则会出现组件加载完成后立即销毁（一闪而过）
    tableForm: resolve => {
      require(['./AddOrEdit'], resolve)
    },
    subList
  },
  created: function () {
    bus.$on(setting.search, (searchData) => { // 监听外部查询数据事件
      this.search(searchData)
    })
    bus.$on(setting.refreshListForEdit, () => { // 监听数据更改后的列表刷新（刷新当前页）
      this.getData()
    })
    bus.$on(setting.refreshListForAdd, () => { // 监听数据添加后的列表刷新
      this.resetPageInfo()
      this.orderInfo.prop = 'create_time'
      this.orderInfo.order = 'descending'
      this.getData()
    })
  },
  data: function () {
    let pageSize = localStorage.getItem(localStorageKeys.settingPageSize)
    return {
      editCompName: '', // 用于动态加载编辑组件
      showEdit: false, // 是否展示编辑弹窗
      editRowId: null, // 编辑的记录ID
      showStandard: false, // 是否展示规格
      pageInfo: {
        pageNum: 1,
        totalRec: 0,
        pageSize: pageSize == null ? 10 : parseInt(pageSize)
      },
      searchData: {
      },
      orderInfo: {prop: 'create_time', order: 'descending'},
      tableData: [],
      selectIds: []
    }
  },
  methods: {
    search: function (data) { // 点击搜索时执行
      this.resetPageInfo()
      this.searchData = data
      this.getData()
    },
    resetPageInfo: function () { // 重置分页参数
      this.pageInfo.totalRec = 0
      this.pageInfo.pageNum = 1
    },
    getData: function () { // 获取服务器数据
      this.$http.post('/product/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
        this.pageInfo.totalRec = response.data.totalRow
        this.tableData = response.data.list
      })
    },
    setStatus: function (status, selectIds) { // 请求服务器设置状态
      selectIds = selectIds || this.selectIds
      if (selectIds.length === 0) {
        this.$alert('未选择记录', '提示', {confirmButtonText: '确定', closeOnClickModal: true, type: 'warning'})
        return
      }
      if (status === -1) { // 如果是删除，则提示
        this.$confirm('确认要删除数据（不可恢复）?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._setStatus(status, selectIds)
        }).catch(() => { })
      } else {
        this._setStatus(status, selectIds)
      }
    },
    _setStatus: function (status, selectIds) {
      // let testObj = {id: 1, name: 'test', mark: 'test'}
      // let testObj = [{id: 1, name: 'test', mark: 'test'}, [id: 2, name: 'test2', mark: 'test2'], [id: 3, name: 'test3', mark: 'test3']}
      this.$http.post('/manage/setting/changeStatus', {ids: selectIds, status: status}).then((response) => {
        this.getData()
      })
    },
    edit: function (row) { // 编辑某条记录
//      bus.$emit(setting.showAddOrEdit, row.id)
      this.editCompName = 'tableForm'
      this.editRowId = row.id
      this.showEdit = true
    },
    showStandardList: function (row) {
      bus.$emit(productStandard.search, row.id)
    },
    add: function () { // 添加记录
//      bus.$emit(setting.showAddOrEdit)
      this.editCompName = 'tableForm'
      this.editRowId = null
      this.showEdit = true
    },
    handleSizeChange: function (val) { // 每页条数改变时重新加载记录
      this.pageInfo.pageSize = val
      localStorage.setItem(localStorageKeys.settingPageSize, val)
      this.getData()
    },
    handleCurrentChange: function (val) { // 页码改变时重新加载记录
      this.pageInfo.pageNum = val
      this.getData()
    },
    selectChange: function (selectRows) { // 每次选择行时，更新选择的记录ID
      this.selectIds.splice(0, this.selectIds.length) // 清空选择的id
      for (let i = 0; i < selectRows.length; i++) {
        this.selectIds.push(selectRows[i].id)
      }
    },
    sortChange: function ({column, prop, order}) { // 排序改变
      if (prop === this.orderInfo.prop && order === this.orderInfo.order) {
        return
      }
      this.orderInfo.prop = prop
      this.orderInfo.order = order
      this.resetPageInfo()
      this.getData()
    }
  }
}
</script>

<style scoped>
  .table-list {
    position: relative;
    overflow: hidden;
  }
  /*.standard-enter-active {*/
    /*transition: width 1s;*/
    /*transition: background 0.5s ease-in,color 0.3s ease-out;*/
    /*transition: all 0.5s ease-in;*/
    /*animation: bounce-in .5s;*/
    /*left: 101px;*/
  /*}*/
  /*.standard-leave-active {*/
    /*transition: background 0.5s ease-in,color 0.3s ease-out;*/
    /*transition: all 0.5s ease-in;*/
    /*left: 1000px;*/
    /*transition: width 1s;*/

    /*animation: bounce-in .5s reverse;*/
  /*}*/
  /*.standard-enter, .standard-leave-to{*/
    /*transition: all 0.5s ease-in;*/
    /*opacity: 0;*/
    /*left: 1000px;*/
  /*}*/

  .standard-enter-active, .standard-leave-active {
    /*transition: opacity .5s;*/
    transition: all 0.3s ease;
    left: 20% !important;
    /*opacity: 0;*/
  }

  .standard-enter, .standard-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    /*opacity: 0;*/
    /*transition: all 0.5s ease;*/
    left: 100% !important;
    /*opacity: 1;*/
  }
</style>
