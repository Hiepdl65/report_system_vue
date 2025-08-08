<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Moon, User, House, Tools, Files, Clock, DataAnalysis } from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => route.path)

const toggleTheme = () => {
  // Toggle theme logic
  const html = document.documentElement
  const currentTheme = html.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  html.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

// Initialize theme
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
}

initTheme()
</script>

<template>
  <el-container class="app-container">
    <!-- Header -->
    <el-header class="app-header">
      <div class="header-content">
        <div class="logo">
          <el-icon class="logo-icon"><DataAnalysis /></el-icon>
          <span class="logo-text">FlexiReport</span>
        </div>
        
        <div class="header-actions">
          <el-button-group>
            <el-button :icon="Moon" @click="toggleTheme" circle />
          </el-button-group>
          
          <el-dropdown>
            <el-avatar :size="32" class="user-avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Profile</el-dropdown-item>
                <el-dropdown-item>Settings</el-dropdown-item>
                <el-dropdown-item divided>Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- Main Content -->
    <el-container>
      <!-- Sidebar -->
      <el-aside width="250px" class="app-sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          
          <el-menu-item index="/builder">
            <el-icon><Tools /></el-icon>
            <span>Report Builder</span>
          </el-menu-item>
          
          <el-menu-item index="/templates">
            <el-icon><Files /></el-icon>
            <span>Templates</span>
          </el-menu-item>
          
          <el-menu-item index="/history">
            <el-icon><Clock /></el-icon>
            <span>Report History</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Main Content Area -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-container {
  height: 100vh;
}

.app-header {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  background: linear-gradient(135deg, var(--el-color-primary), #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  cursor: pointer;
  background: linear-gradient(135deg, var(--el-color-primary), #7c3aed);
}

.app-sidebar {
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.app-main {
  background: var(--el-bg-color-page);
  padding: 20px;
  overflow-y: auto;
}

/* Dark theme support */
[data-theme="dark"] {
  --el-bg-color: #1a1a1a;
  --el-bg-color-page: #0f0f0f;
  --el-border-color-light: #333;
  --el-text-color-primary: #fff;
}

[data-theme="light"] {
  --el-bg-color: #fff;
  --el-bg-color-page: #f5f5f5;
  --el-border-color-light: #e4e7ed;
  --el-text-color-primary: #303133;
}
</style>
