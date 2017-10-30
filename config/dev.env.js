'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 启动前端的端口号
  DEV_PORT: 8085,
  // 打包发布的目录，指向后端的webapp目录
  BUILD_PATH: 'E:\\workspace\\neo\\fruit-manage\\src\\main\\webapp',
  // 后端服务的访问地址，用于代理ajax数据请求
  BACKEND_SERVER: 'http://localhost:8080'
})
