<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Moon, User, House, Tools, Files, Clock, DataAnalysis, Menu } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
const isMobile = ref(false)
const sidebarCollapsed = ref(false)

const toggleTheme = () => {
  const html = document.documentElement
  const currentTheme = html.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  html.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  console.log('Screen width:', window.innerWidth, 'isMobile:', isMobile.value)
  
  // Auto collapse sidebar on mobile
  if (isMobile.value) {
    sidebarCollapsed.value = true
  } else {
    sidebarCollapsed.value = false
  }
}

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
}

onMounted(() => {
  initTheme()
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Add debug info
  console.log('App mounted. Initial isMobile:', isMobile.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <el-container class="app-container">
    <!-- Debug info - remove this in production -->
    <div v-if="isMobile" class="debug-mobile-indicator">
      📱 MOBILE MODE ({{ window.innerWidth }}px)
    </div>
    
    <!-- Header -->
    <el-header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <!-- Mobile menu button -->
          <el-button 
            v-if="isMobile"
            class="mobile-menu-btn"
            @click="toggleSidebar" 
            circle
            size="small"
            type="primary"
          >
            <el-icon><Menu /></el-icon>
          </el-button>
          
          <div class="logo">
            <el-icon class="logo-icon"><DataAnalysis /></el-icon>
            <span class="logo-text" v-show="!isMobile || !sidebarCollapsed">FlexiReport</span>
          </div>
        </div>
        
        <div class="header-actions">
          <el-button :icon="Moon" @click="toggleTheme" circle size="small" />
          
          <el-dropdown>
            <el-avatar :size="isMobile ? 28 : 32" class="user-avatar">
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
      <el-aside 
        :width="isMobile ? '100%' : '250px'" 
        class="app-sidebar"
        :class="{ 
          'sidebar-mobile': isMobile,
          'sidebar-hidden': isMobile && sidebarCollapsed
        }"
      >
        <!-- Mobile overlay -->
        <div 
          v-if="isMobile && !sidebarCollapsed" 
          class="sidebar-overlay" 
          @click="toggleSidebar"
        ></div>
        
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
          @select="isMobile && toggleSidebar()"
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
      <el-main class="app-main" :class="{ 'main-mobile': isMobile }">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.debug-mobile-indicator {
  position: fixed;
  top: 0;
  left: 0;
  background: #ff4444;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  z-index: 9999;
  font-weight: bold;
}

.app-container {
  height: 100vh;
  overflow: hidden;
}

.app-header {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-menu-btn {
  background: var(--el-color-primary) !important;
  color: white !important;
  border: none !important;
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
  transition: opacity 0.3s ease;
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
  transition: all 0.3s ease;
  position: relative;
  z-index: 999;
}

.sidebar-mobile {
  position: fixed !important;
  top: 60px !important;
  left: 0 !important;
  height: calc(100vh - 60px) !important;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  z-index: 1001 !important;
}

.sidebar-hidden {
  transform: translateX(-100%) !important;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.app-main {
  background: var(--el-bg-color-page);
  padding: 20px;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.main-mobile {
  padding: 15px !important;
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

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .header-content {
    padding: 0 15px !important;
  }
  
  .logo {
    font-size: 18px !important;
  }
  
  .logo-icon {
    font-size: 20px !important;
  }
  
  .app-main {
    padding: 15px !important;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 10px !important;
  }
  
  .app-main {
    padding: 10px !important;
  }
  
  .header-actions {
    gap: 8px !important;
  }
  
  .logo {
    font-size: 16px !important;
  }
}
</style>