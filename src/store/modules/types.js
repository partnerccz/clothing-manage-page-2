import {INIT_TYPE} from '../action-types'
import {SET_TYPE} from '../mutation-types'
import axiosIntence from '../../common/axiosIntence'

const state = {
  types: null
}

const actions = {
  [INIT_TYPE] ({ commit, state }) {
    if (state.types !== null) { // 已初始化过，不需要再获取数据
      return
    }
    axiosIntence.post('/getType').then((response) => {
      commit(SET_TYPE, {types: response.data}) // 提交设置类型的变更
    })
  }
}
const mutations = {
  [SET_TYPE] (state, { types }) { // 设置类型
    state.types = types || []
  }
}

export default {
  state,
  actions,
  mutations
}
