import './assets/main.css';

import App from './App.vue';
import router from './router';
import BootstrapVue3 from 'bootstrap-vue-3';

import App from './App.vue'
import router from './router'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';


const app = createApp(App);

app.use(createPinia())
app.use(router)
app.use(VCalendar, {});

app.mount('#app');

