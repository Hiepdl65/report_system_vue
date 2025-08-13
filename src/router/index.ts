import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ReportBuilderView from '../views/ReportBuilderView.vue'
import TemplatesView from '../views/TemplatesView.vue'
import ReportHistoryView from '../views/ReportHistoryView.vue'
import TestResponsive from '../views/TestResponsive.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/builder',
      name: 'report-builder',
      component: ReportBuilderView
    },
    {
      path: '/templates',
      name: 'templates',
      component: TemplatesView
    },
    {
      path: '/history',
      name: 'report-history',
      component: ReportHistoryView
    },
    {
      path: '/test-responsive',
      name: 'test-responsive',
      component: TestResponsive
    }
  ]
})

export default router