import { createApp } from 'vue'; // createApp을 import
import { createPinia } from 'pinia'; // createPinia을 import
import App from './App.vue';
import router from './router';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

import './assets/main.css'; // CSS 파일을 import하는 위치는 상관없음

const app = createApp(App);

app.use(createPinia()); // createPinia 사용
app.use(router);
app.use(VCalendar, {});

app.mount('#app');
