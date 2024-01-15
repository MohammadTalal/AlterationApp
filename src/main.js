import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// global styles
import './assets/main.css'


// Initialize Vue app
const app = createApp(App);


// Use router
app.use(router);

app.mount('#app');

