import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CityView from '../views/CityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Поиск'
      }
    },
    {
      path: '/weather/:state/:city',
      name: 'cityView',
      component: CityView,
      meta: {
        title: 'Местность'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.params.state ?
    `${to.params.city}, ${to.params.state}` :
    to.meta.title} | Календарь погоды`
  next()
})

export default router
