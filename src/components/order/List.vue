<template>
  <div class="table-list">
    <el-table :data="tableData" :default-sort="orderInfo" @sort-change="sortChange" border highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="收货人">
              <span>{{ props.row.consignee }}</span>
            </el-form-item>
            <el-form-item label="收货手机">
              <span>{{ props.row.consignee_phone }}</span>
            </el-form-item>
            <el-form-item label="收货地址">
              <span>{{ props.row.consignee_address }}</span>
            </el-form-item>
            <el-form-item label="配送时间">
              <span>{{ props.row.delivery_time }}</span>
            </el-form-item>
            <el-form-item label="配送方式">
              <span>{{ props.row.delivery_type }}</span>
            </el-form-item>
            <el-form-item label="实际发货时间">
              <span>{{ props.row.send_product_time }}</span>
            </el-form-item>
            <el-form-item label="实际收货时间">
              <span>{{ props.row.get_product_time }}</span>
            </el-form-item>
            <el-form-item label="退款时间">
              <span>{{ props.row.refund_time }}</span>
            </el-form-item>
            <el-form-item label="退款金额">
              <span>{{ props.row.refund_amount }}</span>
            </el-form-item>
            <el-form-item label="撤单时间">
              <span>{{ props.row.cancel_time }}</span>
            </el-form-item>
            <el-form-item label="撤单原因">
              <span>{{ props.row.cancel_reason }}</span>
            </el-form-item>
            <el-form-item label="支付失败原因">
              <span>{{ props.row.pay_fail_msg }}</span>
            </el-form-item>
            <el-form-item label="商品单价">
              <span>{{ props.row.product_single_price }}</span>
            </el-form-item>
            <el-form-item label="单件商品数量">
              <span>{{ props.row.product_single_number }}</span>
            </el-form-item>
            <el-form-item label="商品原价">
              <span>{{ props.row.product_original_price }}</span>
            </el-form-item>
            <el-form-item label="购买数量">
              <span>{{ props.row.product_count }}</span>
            </el-form-item>
            <el-form-item label="订单修改时间">
              <span>{{ props.row.modify_time }}</span>
            </el-form-item>
            <el-form-item label="订单原价">
              <span>{{ props.row.order_amount }}</span>
            </el-form-item>
            <el-form-item label="订单实际支付价格">
              <span>{{ props.row.order_pay_amount }}</span>
            </el-form-item>
            <el-form-item label="是否支付">
              <span>{{ props.row.order_pay_amount }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="order_id" label="订单号"></el-table-column>
      <el-table-column prop="product_id" label="商品号"></el-table-column>
      <el-table-column prop="product_name" label="商品名称"></el-table-column>
      <el-table-column prop="buyuser_uid" label="买家UID"></el-table-column>
      <el-table-column prop="order_status" label="订单状态" :formatter="fmtType"></el-table-column>
      <el-table-column prop="order_ispay" label="是否支付" :formatter="fmtType"></el-table-column>
      <el-table-column prop="order_isrefund" label="是否退款" :formatter="fmtType"></el-table-column>
      <el-table-column prop="order_time" sortable label="下单时间"></el-table-column>
      <el-table-column prop="order_pay_success_time" sortable label="支付完成时间"></el-table-column>
      <el-table-column prop="order_finish_time" sortable label="订单完成时间"></el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
  </div>
</template>

<script>
import bus, {order} from '../../common/bus.js'
import {localStorageKeys} from '../../common/const.js'

export default {
  created: function () {
    bus.$on(order.search, (searchData) => { // 监听外部查询数据事件
      this.search(searchData)
    })
  },
  data: function () {
    let pageSize = localStorage.getItem(localStorageKeys.orderPageSize)
    return {
      pageInfo: {
        pageNum: 1,
        totalRec: 0,
        pageSize: pageSize == null ? 10 : parseInt(pageSize)
      },
      searchData: {},
      orderInfo: {prop: 'order_time', order: 'descending'},
      tableData: []
    }
  },
  methods: {
    fmtType: function (row, column) { // 格式化某列
      let typeName = ''
      if (row.status === 0) {
        typeName = '下线'
      } else if (row.status === 1) {
        typeName = '上线'
      } else {
        typeName = row.status
      }
      return typeName
    },
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
      this.$http.post('/manage/order/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
        this.pageInfo.totalRec = response.data.totalRow
        this.tableData = response.data.list
      })
    },
    handleSizeChange: function (val) { // 每页条数改变时重新加载记录
      this.pageInfo.pageSize = val
      localStorage.setItem(localStorageKeys.orderPageSize, val)
      this.getData()
    },
    handleCurrentChange: function (val) { // 页码改变时重新加载记录
      this.pageInfo.pageNum = val
      this.getData()
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
