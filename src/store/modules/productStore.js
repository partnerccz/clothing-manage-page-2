import {PRODUCT_TYPE_LIST} from '../action-types'
import {PRODUCT_TYPE_LIST_SET} from '../mutation-types'
import axiosIntence from '../../common/axiosIntence'

// 针对需后台请求的数据，初始值为null，针对本地数据，直接赋值
const state = {
  typeList: null, // 类型列表
  // keywordsList: null, // 关键字
  fruitTypeList: ['苹果', '梨', '柑橘'],
  measureUnitList: ['箱', '斤'],
  productionInfoList: [
    {value: '中国',
      label: '中国',
      children: [
        {value: '新疆', label: '新疆'},
        {value: '云南', label: '云南'}, {value: '四川', label: '四川'}]},
    {value: '智利', label: '智利'},
    {value: '南非', label: '南非'}],
  freshMinuteList: [
    {id: 7 * 24 * 60, name: '7天'},
    {id: 10 * 24 * 60, name: '10天'},
    {id: 15 * 24 * 60, name: '15天'},
    {id: 20 * 24 * 60, name: '20天'},
    {id: 25 * 24 * 60, name: '25天'},
    {id: 30 * 24 * 60, name: '30天'}],
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
    axiosIntence.post('/manage/type/getTypes').then((response) => {
      commit(PRODUCT_TYPE_LIST_SET, {typeList: response.data}) // 提交设置类型的变更
    })
  // },
  // [PRODUCT_KEYWORDS_LIST] ({ commit, state }) {
  //   if (state.keywordsList !== null) { // 已初始化过，不需要再获取数据
  //     return
  //   }
  //   axiosIntence.post('/getType').then((response) => {
  //     commit(PRODUCT_KEYWORDS_LIST_SET, {keywordsList: response.data}) // 提交设置类型的变更
  //   })
  }
}
// 必须同步更改数据
const mutations = {
  [PRODUCT_TYPE_LIST_SET] (state, { typeList }) {
    state.typeList = typeList || []
  // },
  // [PRODUCT_KEYWORDS_LIST_SET] (state, { keywordsList }) {
  //   state.keywordsList = keywordsList || []
  }
}

export default {
  state,
  actions,
  mutations
}
