import {PRODUCT_TYPE_LIST} from '../action-types'
import {PRODUCT_SET_TYPE_LIST} from '../mutation-types'
import axiosIntence from '../../common/axiosIntence'

// 针对需后台请求的数据，初始值为null，针对本地数据，直接赋值
const state = {
  typeList: null,
  fruitTypeList: ['苹果', '梨', '柑橘'],
  measureUnitList: ['斤', '个', '箱', '柜'],
  productionInfoList: [
    {country: '中国', province: ['新疆', '云南', '四川']},
    {country: '智利', province: []},
    {country: '南非', province: []}],
  freshMinuteList: [7 * 24 * 60, 10 * 24 * 60, 15 * 24 * 60, 20 * 24 * 60, 25 * 24 * 60, 30 * 24 * 60],
  marketFeedbackList: [{id: 1, name: '供货平稳'}, {id: 2, name: '抢购'}],
  supplyGoodsList: [{id: 1, name: '充足'}, {id: 2, name: '紧张'}],
  recommendList: [
    {id: 1, name: '低价热销'}, {id: 2, name: '最常购'},
    {id: 3, name: '进口好货'}, {id: 4, name: '今日上新'},
    {id: 5, name: '国产精品'}],
  status: [{id: 1, name: '上架'}, {id: 0, name: '下架'}]
}

// 执行异步获取数据，如ajax
const actions = {
  [PRODUCT_TYPE_LIST] ({ commit, state }) {
    if (state.typeList !== null) { // 已初始化过，不需要再获取数据
      return
    }
    axiosIntence.post('/getType').then((response) => {
      commit(PRODUCT_SET_TYPE_LIST, {typeList: response.data}) // 提交设置类型的变更
    })
  }
}
// 必须同步更改数据
const mutations = {
  [PRODUCT_SET_TYPE_LIST] (state, { typeList }) {
    state.typeList = typeList || []
  }
}

export default {
  state,
  actions,
  mutations
}
