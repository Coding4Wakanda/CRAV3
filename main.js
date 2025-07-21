
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Chatbot from './components/Chatbot.vue'
import Dashboard from './components/Dashboard.vue'
import './style.css'

const routes = [
  { path: '/', component: Chatbot },
  { path: '/admin', component: Dashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
