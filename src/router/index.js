import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta:{
      title:'成大學代會'
    }
  },
  {
    path: '/conference',
    name: 'conference',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ConferenceChoose" */ '../views/ConferenceChoose.vue'),
    meta:{
      title:'登入會議'
    }
  },
  {
    path: '/conference/:delibrationID',
    name: 'schedule',
    component: () => import(/* webpackChunkName: "ConferenceSchedule" */ '../views/ConferenceSchedule.vue'),
  },
  {
    path: '/vote',
    name: 'vote',
    component: () => import(/* webpackChunkName: "ConferenceSchedule" */ '../components/VoteDetailWindow.vue'),
  },
  {
    path: '/conference/:delibrationID/proposal/:proposalID',
    name: 'detail',
    component: () => import(/* webpackChunkName: "ConferenceDetail" */ '../views/ConferenceDetail.vue'),
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if(savedPosition){
      return savedPosition
    } else {
      return { x:0 ,y:0 }
    }
  }
})

// router.beforeEach((to, from, next) => {
//   next()
// })

export default router
