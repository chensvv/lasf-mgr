/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home',
      component: () => import('@/pages/home'),
      children: [
        {
          path: '/home/index',
          component: () => import('@/pages/index'),
          meta: {title: '首页'}
        },
        {
          path: '/home/appList',
          component: () => import('@/pages/appList'),
          meta: {title: '应用列表'}
        },
        {
          path: '/home/keyWord',
          component: () => import('@/pages/keyWord'),
          meta: {title: '应用关键词'}
        },
        {
          path: '/home/aliReg',
          component: () => import('@/pages/aliReg'),
          meta: {title: '应用别名规则'}
        },
        {
          path: '/home/cache',
          component: () => import('@/pages/cache'),
          meta: {title: '应用缓存'}
        },
        {
          path: '/home/was',
          component: () => import('@/pages/was'),
          meta: {title: '网站导航数据'}
        },
        {
          path: '/home/dict',
          component: () => import('@/pages/dict'),
          meta: {title: '热词表'}
        },
        {
          path: '/home/csc',
          component: () => import('@/pages/csc'),
          meta: {title: '常用服务电话'}
        },
        {
          path: '/home/qa',
          component: () => import('@/pages/qa'),
          meta: {title: '定制问答查看'}
        },
        {
          path: '/home/rule',
          component: () => import('@/pages/rule'),
          meta: {title: '小不点规则查看'}
        },
        {
          path: '/home/grey',
          component: () => import('@/pages/grey'),
          meta: {title: '灰度发布-功能列表'}
        },
        {
          path: '/home/devlist',
          component: () => import('@/pages/devlist'),
          meta: {title: '灰度发布-机型列表'}
        },
        {
          path: '/home/chat',
          component: () => import('@/pages/chat'),
          meta: {title: '闲聊上报数据'}
        },
        {
          path: '/home/joke',
          component: () => import('@/pages/joke'),
          meta: {title: '笑话列表'}
        },
        {
          path: '/home/sen',
          component: () => import('@/pages/sen'),
          meta: {title: '敏感词'}
        },
        {
          path: '/home/trigger',
          component: () => import('@/pages/trigger'),
          meta: {title: '唤醒词'}
        },
        {
          path: '/home/kv',
          component: () => import('@/pages/kv'),
          meta: {title: 'KV列表'}
        },
        {
          path: '/home/engine',
          component: () => import('@/pages/engine'),
          meta: {title: 'asr引擎规则'}
        },
        {
          path: '/home/outer',
          component: () => import('@/pages/outer'),
          meta: {title: '三方错误信息'}
        },
        {
          path: '/home/skill',
          component: () => import('@/pages/skill'),
          meta: {title: '应用列表'}
        },
        {
          path: '/home/skill/detail',
          component: () => import('@/pages/detail'),
          meta: {title: '应用详情'}
        },
        {
          path: '/home/skill/detail/speak',
          component: () => import('@/pages/speak'),
          meta: {title: '技能说法列表'}
        },
        {
          path: '/home/skill/detail/sersion',
          component: () => import('@/pages/sersion'),
          meta: {title: '技能答案列表'}
        },
        {
          path: '/home/setting',
          component: () => import('@/pages/setting'),
          meta: {title: '设置'}
        },
        {
          path: '/home',
          redirect: '/home/index'
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/pages/login'),
      meta: {title: '登录'}
    },
    {
      path: '/register',
      component: () => import('@/pages/register')
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  var user_id = localStorage.getItem('user_id')

  if (user_id) {
    next()
  } else {
    if (to.path == '/login' || to.path == '/register') {
      next()
    } else {
      next('/login')
    }
  }
})

// eslint-disable-next-line semi
export default router;
