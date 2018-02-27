<template>
  <div class="table-list">
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <el-button type="danger" size="small" @click="deleteRec()">批量删除</el-button>
    <el-table :data="tableData" @selection-change="selectChange"  border highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="测试ID"></el-table-column>
      <el-table-column prop="testname" label="测试名称"></el-table-column>
      <el-table-column prop="createtime" label="创建时间"></el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <!--<el-button @click="setStatus(scope.row.status === 1 ? 0 : 1, [scope.row.id])" type="text" size="small" :class="scope.row.status === 1 ? 'disable' : 'enable'">{{scope.row.status === 1 ? '禁用' : '启用'}}</el-button>-->
          <el-button @click="deleteRec([scope.row.id])" type="text" size="small" class="delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
    <component :is="editCompName" :showDialog.sync="showEdit" :editRowId="editRowId"></component>
  </div>
</template>

<script>
import bus, {test} from '../../common/bus.js'
import {localStorageKeys} from '../../common/const.js'

export default {
  components: {
    // productEdit: resolve => require(['./AddOrEdit'], resolve) // ）必须用下面的方式加载，否则会出现组件加载完成后立即销毁（一闪而过
    testEdit: resolve => {
      require(['./AddOrEdit'], resolve)
    }
  },
  created: function () {
    bus.$on(test.search, (searchData) => { // 监听外部查询数据事件
      this.search(searchData)
    })
    bus.$on(test.refreshListForEdit, () => { // 监听数据更改后的列表刷新（刷新当前页）
      this.getData()
    })
    bus.$on(test.refreshListForAdd, () => { // 监听数据添加后的列表刷新
      this.resetPageInfo()
      this.orderInfo.prop = 'order_time'
      this.orderInfo.order = 'descending'
      this.getData()
    })
  },
  data: function () {
    let pageSize = localStorage.getItem(localStorageKeys.testPageSize)
    return {
      editCompName: '', // 用于动态加载编辑组件
      showEdit: false, // 是否展示编辑弹窗
      editRowId: null, // 编辑的记录ID
      pageInfo: {
        pageNum: 1,
        totalRec: 0,
        pageSize: pageSize == null ? 10 : parseInt(pageSize)
      },
      searchData: {},
      orderInfo: {prop: 'order_time', order: 'descending'},
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
    edit: function (row) { // 编辑某条记录
      this.editCompName = 'testEdit'
      this.editRowId = row.id
      this.showEdit = true
    },
    resetPageInfo: function () { // 重置分页参数
      this.pageInfo.totalRec = 0
      this.pageInfo.pageNum = 1
    },
    getData: function () { // 获取服务器数据
      this.$http.post('/manage/test/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
        this.pageInfo.totalRec = response.data.totalRow
        this.tableData = response.data.list
      })
    },
    deleteRec: function (selectIds) { // 删除数据
      selectIds = selectIds || this.selectIds
      if (selectIds.length === 0) {
        this.$alert('未选择记录', '提示', {confirmButtonText: '确定', closeOnClickModal: true, type: 'warning'})
        return
      }
      this.$confirm('确认要删除数据（不可恢复）?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/manage/test/delete', {ids: selectIds}).then((response) => {
          this.getData()
        })
      }).catch(() => { })
    },
    selectChange: function (selectRows) { // 每次选择行时，更新选择的记录ID
      this.selectIds.splice(0, this.selectIds.length) // 清空选择的id
      for (let i = 0; i < selectRows.length; i++) {
        this.selectIds.push(selectRows[i].id)
      }
    },
    add: function () { // 添加记录
      this.editCompName = 'testEdit'
      this.editRowId = null
      this.showEdit = true
    },
    handleSizeChange: function (val) { // 每页条数改变时重新加载记录
      this.pageInfo.pageSize = val
      localStorage.setItem(localStorageKeys.orderPageSize, val)
      this.getData()
    },
    handleCurrentChange: function (val) { // 页码改变时重新加载记录
      this.pageInfo.pageNum = val
      this.getData()
    }
  }
}
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
