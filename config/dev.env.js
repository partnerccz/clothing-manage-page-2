'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // ����ǰ�˵Ķ˿ں�
  DEV_PORT: 8085,
  // ���������Ŀ¼��ָ���˵�webappĿ¼
  BUILD_PATH: 'E:\\workspace\\neo\\fruit-manage\\src\\main\\webapp',
  // ��˷���ķ��ʵ�ַ�����ڴ���ajax��������
  BACKEND_SERVER: 'http://localhost:8081'
})
