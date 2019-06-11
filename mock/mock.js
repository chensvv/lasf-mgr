/* eslint-disable no-undef */
import Mock from 'mockjs'
// 模拟数据列表
const count = 50
let dataList = []
for (let i = 0; i < count; i++) {
  let arr = {
    id: Mock.Random.increment(),
    applicationName: Mock.Random.csentence(2, 3),
    classnames: Mock.Random.csentence(2, 5),
    refreshTime: Mock.mock('@date(T)'),
    state: Mock.Random.integer(0, 1),
    platform: Mock.Random.last(3, 5),
    downloads: Mock.Random.natural(1, 9999),
    cost: Mock.Random.integer(100, 9999),
    integral: Mock.Random.float(1, 9, 1, 1),
    from: Mock.Random.last(3, 5),
    putTime: Mock.mock('@date(T)'),
    matchRule: Mock.mock('@string("symbol", 10)'),
    outputType: Mock.mock('@cword("零一二三四五六七八九十", 5, 7)'),
    ruleDes: Mock.mock('@ctitle()'),
    joke_con: Mock.Random.cparagraph(),
    url: Mock.mock('@url'),
    was_from: Mock.mock('@protocol()'),
    biem: Mock.Random.string(0),
    mobile_url: Mock.Random.url(),
    inc: Mock.Random.string('number', 1, 1),
    type: Mock.Random.boolean(),
    vdm: Mock.Random.string('lower', 3),
    mobile_num: Mock.Random.natural(1000),
    kuoz: Mock.Random.csentence(3, 7)
  }
  dataList.push(arr)
}

Mock.mock('/api/data', /post|get/i, dataList)
