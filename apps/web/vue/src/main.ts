import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { containerKey } from './di/useContainer';
import { container } from './di/container';
import { authKey, createAuth } from './app/useAuth';
import './index.css';

const app = createApp(App);

app.provide(containerKey, container);
app.provide(authKey, createAuth());
app.use(router);
app.mount('#app');
