/* eslint-disable no-undef */
import fetch from './http'
// console.log(fetch.service_head)
// const INTERFACE = process.env.API_ROOT
// console.log(INTERFACE)

// const INTERCHILD = {
//   // 'GETCODE': INTERFACE + '/active/getValidateCode.do',
// }
// export default {
//   INTERCHILD,
//   INTERFACE
// }
export function loginInfo (data) {
  return fetch.service_head({
    url: '/home/v1/login',
    method: 'post',
    data: data
  })
}
export function appList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/app/list',
    method: 'post',
    data: data
  })
}

export function wordList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/app/keyword',
    method: 'post',
    data: data
  })
}

export function regList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/app/alireg',
    method: 'post',
    data: data
  })
}

export function cacheList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/app/cache',
    method: 'post',
    data: data
  })
}

export function cacheDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/app/cachedel',
    method: 'post',
    data: data
  })
}

export function cacheAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/app/cacheadd',
    method: 'post',
    data: data
  })
}

export function wasList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/was/weblist',
    method: 'post',
    data: data
  })
}

export function wasAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/was/add',
    method: 'post',
    data: data
  })
}

export function wasUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/was/update',
    method: 'post',
    data: data
  })
}

export function wasDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/was/delete',
    method: 'post',
    data: data
  })
}

export function dictList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/dict/list',
    method: 'post',
    data: data
  })
}

export function dictAddUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/dict/addandUpdate',
    method: 'post',
    data: data
  })
}

export function dictDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/dict/del',
    method: 'post',
    data: data
  })
}

export function cscList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/csc/csc',
    method: 'post',
    data: data
  })
}

export function cscAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/csc/add',
    method: 'post',
    data: data
  })
}

export function cscDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/csc/delete',
    method: 'post',
    data: data
  })
}

// 定制问答
export function qaList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/qa/list',
    method: 'post',
    data: data
  })
}

export function qaSave (data) {
  return fetch.service_head({
    url: '/lasf-mgr/qa/save',
    method: 'post',
    data: data
  })
}

export function qaDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/qa/del',
    method: 'post',
    data: data
  })
}

// 规则
export function ruleList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/rule/list',
    method: 'post',
    data: data
  })
}

export function ruleAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/rule/save',
    method: 'post',
    data: data
  })
}

export function ruleUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/rule/updatedata',
    method: 'post',
    data: data
  })
}

export function ruleDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/rule/delete',
    method: 'post',
    data: data
  })
}

export function rulePub (data) {
  return fetch.service_head({
    url: '/lasf-mgr/rule/pub',
    method: 'post',
    data: data
  })
}

// 灰度发布功能列表
export function greyList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/grey/funlist',
    method: 'post',
    data: data
  })
}

// 灰度发布功能列表添加、修改
export function greyAddUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/grey/funaddandUpdate',
    method: 'post',
    data: data
  })
}

// 灰度发布功能列表删除
export function greyDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/grey/fundel',
    method: 'post',
    data: data
  })
}

// 灰度发布功能列表配置回显
export function greyOpt (data) {
  return fetch.service_head({
    url: '/lasf-mgr/grey/opt',
    method: 'post',
    data: data
  })
}

// 灰度发布功能列表配置保存
export function greyOptSave (data) {
  return fetch.service_head({
    url: '/lasf-mgr/grey/optsave',
    method: 'post',
    data: data
  })
}

// 灰度发布机型列表
export function devList (data) {
  return fetch.service_head({
    url: 'lasf-mgr/grey/devlist',
    method: 'post',
    data: data
  })
}

// 灰度发布机型列表添加、删除
export function devAddUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/grey/devaddandUpdate',
    method: 'post',
    data: data
  })
}

// 灰度发布机型列表删除
export function devDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/grey/devdel',
    method: 'post',
    data: data
  })
}

// 灰度发布机型列表配置回显
export function devOpt (data) {
  return fetch.service_head({
    url: '/lasf-mgr/grey/optd',
    method: 'post',
    data: data
  })
}

// 灰度发布机型列表配置保存
export function devOptSave (data) {
  return fetch.service_head({
    url: '/lasf-mgr/grey/optdsave',
    method: 'post',
    data: data
  })
}

// 闲聊
export function chatList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/chat/list',
    method: 'post',
    data: data
  })
}

export function chatExport (data) {
  return fetch.service_head({
    url: '/lasf-mgr/chat/export',
    method: 'post',
    data: data
  })
}

// 笑话列表
export function jokeList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/joke/list',
    method: 'post',
    data: data
  })
}

export function jokeAddUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/joke/save',
    method: 'post',
    data: data
  })
}

export function jokeDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/joke/del',
    method: 'post',
    data: data
  })
}

export function jokeVeri (data) {
  return fetch.service_head({
    url: '/lasf-mgr/joke/veri',
    method: 'post',
    data: data
  })
}

// 敏感词
export function senList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/sen/list',
    method: 'post',
    data: data
  })
}

export function senAddUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/sen/save',
    method: 'post',
    data: data
  })
}

export function senDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/sen/del',
    method: 'post',
    data: data
  })
}

// 敏感词发布
export function senPub (data) {
  return fetch.service_head({
    url: '/lasf-mgr/sen/pub',
    method: 'post',
    data: data
  })
}

export function triggerList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/trigger/list',
    method: 'post',
    data: data
  })
}

export function kvList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/kv/list',
    method: 'post',
    data: data
  })
}

export function kvAddUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/kv/editsave',
    method: 'post',
    data: data
  })
}

export function engineView (data) {
  return fetch.service_head({
    url: '/lasf-mgr/kv/engine/view',
    method: 'post',
    data: data
  })
}

export function engineUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/kv/engine/edit',
    method: 'post',
    data: data
  })
}

export function outerList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/outer/list',
    method: 'post',
    data: data
  })
}

export function outerInfo (data) {
  return fetch.service_head({
    url: '/lasf-mgr/outer/detail',
    method: 'post',
    data: data
  })
}

export function skillList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/applist',
    method: 'post',
    data: data
  })
}

export function skillAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/appadd',
    method: 'post',
    data: data
  })
}

export function skillUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/appupdate',
    method: 'post',
    data: data
  })
}

export function skillDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/appdelete',
    method: 'post',
    data: data
  })
}

export function skillInfo (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/appdetail',
    method: 'post',
    data: data
  })
}

export function skillDetailAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/functionadd',
    method: 'post',
    data: data
  })
}

export function skillDetailDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/functiondelete',
    method: 'post',
    data: data
  })
}

export function skillDetailUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/functionupdate',
    method: 'post',
    data: data
  })
}

// 说法列表
export function speakList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/speaklist',
    method: 'post',
    data: data
  })
}

export function speakAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/speakadd',
    method: 'post',
    data: data
  })
}

export function speakUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/speakupdate',
    method: 'post',
    data: data
  })
}

export function speakDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/speakdelete',
    method: 'post',
    data: data
  })
}

// 答案列表
export function versionList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/versionlist',
    method: 'post',
    data: data
  })
}

export function versionAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/versionadd',
    method: 'post',
    data: data
  })
}

export function versionUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/versionupdate',
    method: 'post',
    data: data
  })
}

export function versionDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/versiondelete',
    method: 'post',
    data: data
  })
}

export function versionStr (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/versionstrategy',
    method: 'post',
    data: data
  })
}

// 技能视频管理
export function videoList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/videolist',
    method: 'post',
    data: data
  })
}

export function videoSelect (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/videoaddpage',
    method: 'post',
    data: data
  })
}

export function videoAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/videoadd',
    method: 'post',
    data: data
  })
}

export function videoUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/videoupdate',
    method: 'post',
    data: data
  })
}

export function videoDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/videodelete',
    method: 'post',
    data: data
  })
}

// 音乐列表
export function singerList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/singerlist',
    method: 'post',
    data: data
  })
}

export function singerAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/addsinger',
    method: 'post',
    data: data
  })
}

export function singerUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/updatesinger',
    method: 'post',
    data: data
  })
}

export function singerDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/deletesinger',
    method: 'post',
    data: data
  })
}

export function singerPub (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/singerpublish',
    method: 'post',
    data: data
  })
}

// 专辑
export function albumList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/albumlist',
    method: 'post',
    data: data
  })
}

export function albumAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/addalbum',
    method: 'post',
    data: data
  })
}

export function albumUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/updatealbum',
    method: 'post',
    data: data
  })
}

export function albumDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/deletealbum',
    method: 'post',
    data: data
  })
}

// 歌曲
export function songList (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/songlist',
    method: 'post',
    data: data
  })
}

export function songSelect (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/songaddpage',
    method: 'post',
    data: data
  })
}

export function songAdd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/addsong',
    method: 'post',
    data: data
  })
}

export function songUpd (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/updatesong',
    method: 'post',
    data: data
  })
}

export function songDel (data) {
  return fetch.service_head({
    url: '/lasf-mgr/skill/music/deletesong',
    method: 'post',
    data: data
  })
}
