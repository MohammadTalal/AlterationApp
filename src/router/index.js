import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import SignupView from '@/views/auth/SignupView.vue'
import CreateCustomer from '@/views/customers/CreateCustomer.vue'
import OrdersView from '@/views/orders/OrdersView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView
  },
  {
    path: '/customers/create',
    name: 'CreateCustomer',
    component: CreateCustomer
  },
  {
    path: '/orders/:customerID?',
    name: 'Orders',
    component: OrdersView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
