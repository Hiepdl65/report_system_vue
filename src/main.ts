import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'

// IMPORTANT: Import order matters!
// 1. First import Element Plus CSS
import 'element-plus/dist/index.css'
// 2. Then import our custom CSS (will override Element Plus)
// Import CSS files in correct order
import './assets/main.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Register Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')