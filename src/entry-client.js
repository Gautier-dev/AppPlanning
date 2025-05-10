import './style.css'
import { createApp } from './main'
import router from './router'

const { app } = createApp()
app.use(router)
app.mount('#app')

