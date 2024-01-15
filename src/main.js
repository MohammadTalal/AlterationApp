import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// global styles
import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(fas)


// Initialize Vue app
const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon)


// Use router
app.use(router);

app.mount('#app');

