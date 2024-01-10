import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// global styles
import './assets/main.css'

// import font awesome styles 
import '@fortawesome/fontawesome-free/css/all.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Initialize Vue app
const app = createApp(App);
library.add(fas)

// Use router
app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');

