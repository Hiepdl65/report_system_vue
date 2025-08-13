<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Files, Clock, Star, DataAnalysis, Plus, Download, Share } from '@element-plus/icons-vue'

const screenWidth = ref(window.innerWidth)
const isMobile = computed(() => screenWidth.value <= 768)

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
  console.log('Screen width updated:', screenWidth.value, 'isMobile:', isMobile.value)
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
  console.log('HomeView mounted. Screen width:', screenWidth.value)
})

const recentReports = ref([
  { name: 'Sales Report - March 2024', created: '2024-03-15', status: 'Completed' },
  { name: 'Customer Analysis', created: '2024-03-14', status: 'Completed' },
  { name: 'Inventory Report', created: '2024-03-13', status: 'Processing' },
  { name: 'Revenue Summary', created: '2024-03-12', status: 'Completed' }
])
</script>

<template>
  <div class="home-view">
    <!-- Debug info -->
    <div class="debug-info">
      <h2>📊 Dashboard</h2>
      <p>Screen: {{ screenWidth }}px | Mode: {{ isMobile ? 'MOBILE' : 'DESKTOP' }}</p>
      <p>Welcome to FlexiReport - Advanced Report Builder</p>
    </div>

    <!-- Quick Stats -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon files">
              <el-icon><Files /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">24</div>
              <div class="stat-label">Total Reports</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon clock">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">8</div>
              <div class="stat-label">This Week</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon star">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">12</div>
              <div class="stat-label">Templates</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon analysis">
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">1.2s</div>
              <div class="stat-label">Avg Query Time</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Quick Actions & Recent Reports -->
    <el-row :gutter="20" class="actions-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="action-card">
          <template #header>
            <div class="card-header">
              <span>🚀 Quick Actions</span>
            </div>
          </template>
          
          <div class="action-buttons">
            <el-button 
              type="primary" 
              size="large" 
              @click="$router.push('/builder')"
              class="action-btn"
            >
              <el-icon><Plus /></el-icon>
              <span>Create New Report</span>
            </el-button>
            
            <el-button 
              size="large" 
              @click="$router.push('/templates')"
              class="action-btn"
            >
              <el-icon><Files /></el-icon>
              <span>Browse Templates</span>
            </el-button>
            
            <el-button 
              size="large" 
              @click="$router.push('/history')"
              class="action-btn"
            >
              <el-icon><Clock /></el-icon>
              <span>View History</span>
            </el-button>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="recent-reports-card">
          <template #header>
            <div class="card-header">
              <span>📋 Recent Reports</span>
            </div>
          </template>
          
          <!-- Desktop Table View -->
          <div v-if="!isMobile" class="desktop-table">
            <el-table :data="recentReports" style="width: 100%">
              <el-table-column prop="name" label="Report Name" />
              <el-table-column prop="created" label="Created" width="120" />
              <el-table-column prop="status" label="Status" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 'Completed' ? 'success' : 'warning'">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- Mobile Card View -->
          <div v-else class="mobile-reports">
            <div 
              v-for="report in recentReports"
              :key="report.name"
              class="mobile-report-item"
            >
              <div class="report-name">{{ report.name }}</div>
              <div class="report-meta">
                <span class="report-date">{{ report.created }}</span>
                <el-tag 
                  :type="report.status === 'Completed' ? 'success' : 'warning'"
                  size="small"
                >
                  {{ report.status }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Features -->
    <el-row :gutter="20" class="features-row">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>✨ Features</span>
            </div>
          </template>
          
          <el-row :gutter="20" class="features-grid">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
              <div class="feature-item">
                <el-icon class="feature-icon"><DataAnalysis /></el-icon>
                <h3>Drag & Drop Builder</h3>
                <p>Create reports visually with our intuitive drag and drop interface. No SQL knowledge required.</p>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
              <div class="feature-item">
                <el-icon class="feature-icon"><Download /></el-icon>
                <h3>Multiple Export Formats</h3>
                <p>Export your reports in Excel, CSV, PDF, or JSON formats with just one click.</p>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
              <div class="feature-item">
                <el-icon class="feature-icon"><Share /></el-icon>
                <h3>Template Sharing</h3>
                <p>Save and share report templates with your team for consistent reporting.</p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- Mobile/Desktop Test -->
    <div class="responsive-test">
      <el-alert 
        :title="`Current Mode: ${isMobile ? 'MOBILE' : 'DESKTOP'} (${screenWidth}px)`"
        :type="isMobile ? 'warning' : 'success'"
        :closable="false"
        show-icon
      />
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.debug-info {
  margin-bottom: 30px;
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.debug-info h2 {
  margin: 0 0 10px 0;
  font-size: 2rem;
  font-weight: 700;
}

.debug-info p {
  margin: 5px 0;
  opacity: 0.9;
}

.stats-row {
  margin-bottom: 30px;
}

.stat-card {
  height: 120px;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-icon.files { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-icon.clock { background: linear-gradient(135deg, #f093fb, #f5576c); }
.stat-icon.star { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.stat-icon.analysis { background: linear-gradient(135deg, #43e97b, #38f9d7); }

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--el-text-color-regular);
  margin-top: 5px;
}

.actions-row {
  margin-bottom: 30px;
}

.action-card,
.recent-reports-card {
  min-height: 320px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.card-header {
  font-weight: 600;
  font-size: 1.1rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  justify-content: center;
  padding: 20px 0;
}

.action-btn {
  height: 50px;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.mobile-reports {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-report-item {
  padding: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color-page);
}

.report-name {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.report-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.report-date {
  color: var(--el-text-color-secondary);
}

.features-row {
  margin-bottom: 30px;
}

.features-grid {
  margin: 0;
}

.feature-item {
  text-align: center;
  padding: 20px;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-bottom: 20px;
}

.feature-item:hover {
  background: var(--el-bg-color-page);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 3rem;
  color: var(--el-color-primary);
  margin-bottom: 15px;
}

.feature-item h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--el-text-color-primary);
}

.feature-item p {
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin: 0;
}

.responsive-test {
  margin-top: 30px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .debug-info h2 {
    font-size: 1.8rem;
  }
  
  .stat-content {
    gap: 15px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .stat-number {
    font-size: 1.6rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
  
  .action-card,
  .recent-reports-card {
    min-height: auto;
    margin-bottom: 20px;
  }
  
  .action-btn {
    height: 45px;
    font-size: 0.9rem;
  }
  
  .feature-item {
    padding: 15px;
  }
  
  .feature-icon {
    font-size: 2.5rem;
  }
  
  .feature-item h3 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .debug-info {
    padding: 15px;
    margin-bottom: 20px;
  }
  
  .debug-info h2 {
    font-size: 1.6rem;
  }
  
  .stat-card {
    height: 100px;
  }
  
  .stat-content {
    gap: 12px;
  }
  
  .stat-icon {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .stat-number {
    font-size: 1.4rem;
  }
  
  .action-btn {
    height: 42px;
    font-size: 0.85rem;
  }
  
  .feature-item {
    padding: 12px;
  }
  
  .feature-icon {
    font-size: 2.2rem;
  }
}
</style>