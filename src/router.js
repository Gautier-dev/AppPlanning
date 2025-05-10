import { createMemoryHistory, createRouter } from 'vue-router'

import CurrentWeek from './components/CurrentWeek.vue'
import NextWeek from './components/NextWeek.vue'
import InstanceSelection from './components/InstanceSelection.vue'

const routes = [
  { path: '/', component: InstanceSelection },
  { path: '/current-week', component: CurrentWeek },
  { path: '/next-week', component: NextWeek },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router

