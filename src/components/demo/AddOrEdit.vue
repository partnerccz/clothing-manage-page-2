<template>
  <el-dialog title="添加/编辑配置" :visible="showDialog" @update:visible="(val) => $emit('update:showDialog', val)" :close-on-click-modal=false @open="show" @close="reset">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item label="父菜单" prop="parent_id">
        <el-select v-model="form.parent_id" @change="topMenuChange" :disabled="topMenuDisable" filterable placeholder="请择父菜单">
          <el-option v-for="item in topMenu" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" @change="typeChange" :disabled="typeDisable" filterable allow-create placeholder="请输入或选择类型">
          <el-option v-for="item in types" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="链接地址" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-upload class="avatar-uploader"
          :action="_uploadFilePath"
          :show-file-list="false"
          :on-success="handleAvatarScucess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.icon" :src="form.icon" class="avatar-img" @error="imgError">
          <i v-else class="el-icon-plus avatar-uploader-icon">&nbsp;&nbsp;&nbsp;添加图标</i>
        </el-upload>
        <!-- <el-input v-model="form.icon"></el-input> -->
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input-number v-model="form.weight" :min="1" :max="9999999"></el-input-number>
      </el-form-item>
      <el-form-item label="热" prop="is_hot">
        <el-switch v-model="form.is_hot" on-color="#ff4949" on-text="热" off-text=""></el-switch>
      </el-form-item>
      <el-form-item label="扩展值" prop="ext">
        <el-input v-model="form.ext"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status">
          <el-option label="启用" :value=1></el-option>
          <el-option label="禁用" :value=0></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import bus, { setting } from '../../common/bus.js'
import { objNullToBlank } from '../../common/utils.js'
import { INIT_TYPE } from '../../store/action-types'
import { mapState, mapActions } from 'vuex'
// import { createNamespacedHelpers } from 'vuex'

// const { mapState, mapActions } = createNamespacedHelpers('types')

export default {
  name: 'settingAddOrEdit',
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
    this.reset()
    this.getTypes()
    this.getTopMenu()
  },
  data: function () {
    return {
//      showForm: false,
//      types: [],
      topMenu: [],
      typeDisable: false,
      topMenuDisable: false,
      resetForm: {id: '', type: '', parent_id: 0, parent_name: '', name: '', url: '', icon: '', weight: 99, is_hot: false, ext: '', remark: '', status: 1},
      form: {},
      rules: {
        type: [
          {required: true, message: '请输入或选择类型', trigger: 'blur,change'},
          {min: 2, max: 40, message: '长度在 2 到40 个字符', trigger: 'blur,change'}
        ],
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        url: [
          {type: 'url', message: '必须为URL格式', trigger: 'blur'}
        ]
      }
    }
  },
  computed: mapState([
    'types'
  ]),
//  computed: mapState({
//    types: state => state.types.types // 如果使用了模块，但是没指定命名空间，则使用该方式将状态树种的数据混合到组件中
//  }),
  methods: {
    imgError: function () {
      this.form.icon = ''
    },
    show: function () { // 首次显示dialog时，show方法不会执行，所以需要在mounted中添加reset，否则初始化页面的数据有问题
      this.reset()
      if (this.editRowId !== null) {
        this.$http.post('/manage/setting/info', {id: this.editRowId}).then((response) => {
          this.form = Object.assign({}, objNullToBlank(response.data), {is_hot: response.data.is_hot === 1})
//          this.showForm = true
          this.typeDisable = true
          this.topMenuDisable = true
        })
      }
    },
    ...mapActions({
      getTypes: INIT_TYPE
    }),
//    getTypes: function () { // 获取类型数据
//      this.$http.post('/getType', {}).then((response) => {
//        this.types = response.data
//      })
//    },
    getTopMenu: function () { // 获取一级菜单
      this.$http.post('/getTopMenu', {}).then((response) => {
        this.topMenu = response.data
        this.topMenu.splice(0, 0, {id: 0, name: '无'})
      })
    },
    typeChange: function (type) {
      if (type === '') {
        return
      }
      let selectItem = this.types.filter((thisType) => { // 判断是否存在该类型
        return thisType === type
      })
      let topMenuItem = this.topMenu.filter((menu) => { // 判断父菜单中是否存在该类型
        return menu.type === type
      })
      if (selectItem.length === 0) { // 如果不存在则添加
        this.types.push(type)
        this.form.type = type
      }
      if (this.typeDisable) { // 如果是编辑的情况下，不级联
        return
      }
      if (topMenuItem.length > 0) { // 如果存在就在父菜单改变相应的名字
        this.form.parent_name = topMenuItem[0].name
        this.form.parent_id = topMenuItem[0].id
      } else { // 不存在则在父菜单下拉框显示无
        this.form.parent_id = 0
      }
    },
    topMenuChange: function (id) {
      // this.typeDisable = false
      if (id === 0) {
        this.form.parent_name = ''
        return
      }
      let selectItem = this.topMenu.filter((menu) => {
        return menu.id === id
      })
      if (selectItem.length > 0) {
        this.form.parent_name = selectItem[0].name
        this.form.type = selectItem[0].type
        // this.typeDisable = true
      }
    },
    handleAvatarScucess: function (res, file) {
      if (res) {
        this.form.icon = res
      } else {
        this.$message.error('该图片不支持上传，请更换一张！')
      }
    },
    beforeAvatarUpload: function (file) {
      const isRightType = file.type.indexOf('image/') === 0
      const isRightSize = file.size / 1024 / 1024 < 1
      if (!isRightType) {
        this.$message.error('上传图标必须为图片格式!')
      }
      if (!isRightSize) {
        this.$message.error('上传图标大小不能超过 1MB!')
      }
      return isRightSize && isRightType
    },
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        this.$http.post('/manage/setting/save', Object.assign({}, this.form, {is_hot: this.form.is_hot ? 1 : 0}), {showLoading: true}).then((response) => {
//          this.showForm = false
          this.$emit('update:showDialog', false)
          if (this.form.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '编辑数据成功'})
            bus.$emit(setting.refreshListForEdit, this.form)
          } else { // 新增完成（跳到第一页）
            this.$message({type: 'success', message: '添加数据成功'})
            bus.$emit(setting.refreshListForAdd, this.form)
          }
        })
      })
    },
    reset: function () {
      if (this.$refs['form']) { // 重置校验错误，必须执行，否则页面组件有问题
        this.$refs['form'].resetFields()
      }
      this.form = Object.assign({}, this.resetForm)
      this.typeDisable = false
      this.topMenuDisable = false
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
