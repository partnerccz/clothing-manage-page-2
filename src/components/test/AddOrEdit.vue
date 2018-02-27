<template>
  <el-dialog title="商品添加/编辑" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @open="show" @close="reset">
    <el-form ref="form" :model="test" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item v-if="1!=2" label="商品ID" prop="id">{{test.id }}</el-form-item>
      <el-form-item label="商品名" prop="testname">
        <el-input v-model="test.testname"></el-input>
      </el-form-item>


    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import bus, { test } from '../../common/bus.js'
import { objNullToBlank } from '../../common/utils.js'
// import { createNamespacedHelpers } from 'vuex'

// const { mapState, mapActions } = createNamespacedHelpers('types')

export default {
  name: 'testAddOrEdit',
  props: ['showDialog', 'editRowId'],
//  created: function () {
//    // 监听外部查询数据事件
//    bus.$on(setting.showAddOrEdit, (id) => {
//      this.reset()
//      if (id !== undefined) {
//        this.getData(id)
//      } else {
//        this.showForm = true
//      }
//    })
//  },
  mounted: function () {
    this.show()
  },
  data: function () {
    return {
      isAddKeywordsShow: false,
      addKeywords: '',
      resetForm: {
        id: '',
        testname: '',
        createtime: ''
      },
      test: {}, // 这里使用resetForm作为添加数据时的初始数据，不要指望数据框架去重置数据，因为该组件挂载后，即使弹窗关闭，组件不会销毁，下次使用同样的组件，所以需要重置数据，当然也可以每次关闭弹窗后销毁组件
//      showForm: false,
//      types: [],
//      topMenu: [],
//      typeDisable: false,
//      topMenuDisable: false,
//      resetForm: {id: '', type: '', parent_id: 0, parent_name: '', name: '', url: '', icon: '', weight: 99, is_hot: false, ext: '', remark: '', status: 1},
      rules: {
        testname: [
          {required: true, message: '请输入商品名', trigger: 'blur'},
          {min: 2, max: 50, message: '长度在 2 到50 个字符之间'}
        ]
      }
    }
  },

//  computed: mapState({
//    types: state => state.types.types // 如果使用了模块，但是没指定命名空间，则使用该方式将状态树种的数据混合到组件中
//  }),
  methods: {

    reset: function () {
      if (this.$refs['form']) { // 重置校验错误，必须执行，否则页面组件有问题
        this.$refs['form'].resetFields()
      }
      this.test = Object.assign({}, this.resetForm)
    },
    show: function () { // 首次显示dialog时，show方法不会执行，所以需要在mounted中调用，后续直接通过dialog的open方法调用
      this.reset()
      if (this.editRowId !== null) {
        this.$http.post('/manage/test/info', {id: this.editRowId}, {showLoading: true}).then((response) => {
          this.test = Object.assign({}, objNullToBlank(response.data))
        }).catch(() => {
          this.$emit('test:showDialog', false) // 关闭弹窗，这里的处理方式不太好，应该在加载完成数据后显示弹窗，这里是先显示弹窗，异常后关闭弹窗，所以会出现弹窗闪过的问题，但是因为是异步加载编辑页面的，所以无法使用事件通知弹窗
        })
      }
    },
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }

        let postData = Object.assign(this.resetForm, this.test)
        this.$http.post('/manage/test/save', postData, {showLoading: true}).then((response) => {
          this.$emit('update:showDialog', false) // 关闭弹窗
          if (this.test.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '编辑数据成功'})
            bus.$emit(test.refreshListForEdit, postData)
          } else { // 新增完成（跳到第一页）
            this.$message({type: 'success', message: '添加数据成功'})
            bus.$emit(test.refreshListForAdd, postData)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.avatar-uploader-icon{
  font-size: 15px;
  border: 1px solid #bfcbd9;
  padding: 14px 17px;
  border-radius: 5px;
}
.avatar-img{
  max-width: 60px;
}
</style>

<style>
  .el-select,.el-cascader {
    width: 100%;
  }
  .input-new-tag.el-input {
    width: auto;
  }
  span.el-tag {
    margin-right: 10px;
  }
  .el-upload-list--picture-card .el-upload-list__item,.el-upload--picture-card {
    width: 150px;
    height: 150px;
  }
  .el-upload--picture-card {
    line-height: 150px;
  }
</style>
