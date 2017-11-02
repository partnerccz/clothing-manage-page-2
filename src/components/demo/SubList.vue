<template>
  <div class="product-standard">
    <div class="action">
      <i @click="visibleList(false)" class="el-icon-circle-close-outline"></i>
      <el-button type="danger" size="small" @click="setStatus(-1)">批量删除</el-button>
      <!--<el-button size="small" @click="setStatus(0)">批量下架</el-button>-->
      <!--<el-button type="success" size="small" @click="setStatus(1)">批量上架</el-button>-->
      <el-button type="primary" size="small" @click="add">添加</el-button>
    </div>
    <el-table :data="tableData" @row-dblclick="edit" @selection-change="selectChange" :default-sort="orderInfo"
              @sort-change="sortChange" highlight-current-row>
      <el-table-column type="selection"></el-table-column>
      <!--<el-table-column type="index" label="序号"></el-table-column>-->
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="规格"></el-table-column>
      <el-table-column prop="original_price" label="原价"></el-table-column>
      <el-table-column prop="sell_price" label="售价"></el-table-column>
      <el-table-column prop="weight_price" label="现售称重单价"></el-table-column>
      <el-table-column prop="shipping_fee" label="基础运费"></el-table-column>
      <el-table-column prop="purchase_quantity_min" label="最小采购数量"></el-table-column>
      <el-table-column prop="purchase_quantity_max" label="最大采购数量"></el-table-column>
      <el-table-column prop="buy_start_time" label="购买开始时间" width="110px"></el-table-column>
      <el-table-column prop="buy_end_time" label="购买结束时间" width="110px"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value=1 :inactive-value=0 @change="val => changeStatus(val, scope.row)"></el-switch>
          <!--{{scope.row.status === 1 ? '启用' :  '禁用'}}-->
        <!--<el-tag :type="scope.row.status === 1 ? 'success' : 'gray'" close-transition>{{scope.row.status === 1 ? '启用' :  '禁用'}}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <!--<el-button @click="setStatus(scope.row.status === 1 ? 0 : 1, [scope.row.id])" type="text" size="small" :class="scope.row.status === 1 ? 'disable' : 'enable'">{{scope.row.status === 1 ? '禁用' : '启用'}}</el-button>-->
          <el-button @click="setStatus(-1, [scope.row.id])" type="text" size="small" class="delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <component :is="editCompName" :showDialog.sync="showEdit" :editRowId="editRowId"></component>
  </div>
</template>

<script>
import bus, {productStandard} from '../../common/bus.js'

export default {
  name: 'standard',
  props: ['showStandard'],
  created: function () {
    bus.$on(productStandard.search, (productId) => { // 监听外部查询数据事件
      this.search({productId: productId})
      this.visibleList(true)
    })
    bus.$on(productStandard.edit, () => { // 监听数据更改后的列表刷新（刷新当前页）
      this.getData()
    })
    bus.$on(productStandard.add, () => { // 监听数据添加后的列表刷新
      this.orderInfo.prop = 'create_time'
      this.orderInfo.order = 'descending'
      this.getData()
    })
  },
  data: function () {
    return {
      editCompName: '', // 用于动态加载编辑组件
      showEdit: false, // 是否展示编辑弹窗
      editRowId: null, // 编辑的记录ID
      searchData: {},
      orderInfo: {prop: 'create_time', order: 'descending'},
      tableData: [],
      selectIds: []
    }
  },
  methods: {
    search: function (data) { // 点击搜索时执行
      this.searchData = data
      this.getData()
    },
    getData: function () { // 获取服务器数据
      this.$http.post('/productStandard/getData', Object.assign({}, this.searchData, this.orderInfo)).then((response) => {
        this.tableData = response.data
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
    add: function () { // 添加记录
//      bus.$emit(setting.showAddOrEdit)
      this.editCompName = 'tableForm'
      this.editRowId = null
      this.showEdit = true
    },
    selectChange: function (selectRows) { // 每次选择行时，更新选择的记录ID
      this.selectIds.splice(0, this.selectIds.length) // 清空选择的id
      for (let i = 0; i < selectRows.length; i++) {
        this.selectIds.push(selectRows[i].id)
      }
    },
    sortChange: function ({column, prop, order}) { // 排序改变
      this.getData()
    },
    visibleList: function (visible) {
      this.$emit('update:standard', visible)
    },
    changeStatus: function (enable, row) {
      console.info(enable)
      console.info(row)
      if (enable) {
//        row.status = 0
      } else {
//        row.status = 1
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .product-standard {
    position: absolute;
    background: white;
    top:0;
    overflow-y: auto;
    height: 100%;
    width: 80%;
    left: 20%;
    z-index: 5;
    /* border-left: 1px solid #d7dee7; */
    box-shadow: -1px 0px 10px 0 rgba(0,0,0,0.3);
    .action {
      i {
        font-size: 32px;
        color: #a2a2a2;
        cursor: pointer;
      }
      button {
        float: right;
        margin: auto 10px;
      }
    }
  }
</style>

<style lang="scss">
  .product-standard > .el-table {
    width: 100%;
    height: 100%;
    .el-table__header-wrapper {
      width: 100%;
    }
    .el-switch {
      height: 25px;
    }
    table.el-table__header, table.el-table__body,.el-table__empty-block {
      width: auto !important;
    }
  }
</style>
