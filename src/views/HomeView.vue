<script setup lang="ts">
import { ref } from 'vue'
import { Files, Clock, Star, DataAnalysis, Plus, Download, Share } from '@element-plus/icons-vue'

const recentReports = ref([
  { name: 'Sales Report - March 2024', created: '2024-03-15', status: 'Completed' },
  { name: 'Customer Analysis', created: '2024-03-14', status: 'Completed' },
  { name: 'Inventory Report', created: '2024-03-13', status: 'Processing' },
  { name: 'Revenue Summary', created: '2024-03-12', status: 'Completed' }
])
</script>

<template>
  <div class="home-view">
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Welcome to FlexiReport - Advanced Report Builder</p>
    </div>

    <!-- Quick Stats -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><Files /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">24</div>
              <div class="stat-label">Total Reports</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">8</div>
              <div class="stat-label">This Week</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">12</div>
              <div class="stat-label">Templates</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
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

    <!-- Quick Actions -->
    <el-row :gutter="20" class="actions-row">
      <el-col :span="12">
        <el-card class="action-card">
          <template #header>
            <div class="card-header">
              <span>Quick Actions</span>
            </div>
          </template>
          
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="$router.push('/builder')">
              <el-icon><Plus /></el-icon>
              Create New Report
            </el-button>
            
            <el-button size="large" @click="$router.push('/templates')">
              <el-icon><Files /></el-icon>
              Browse Templates
            </el-button>
            
            <el-button size="large" @click="$router.push('/history')">
              <el-icon><Clock /></el-icon>
              View History
            </el-button>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="action-card">
          <template #header>
            <div class="card-header">
              <span>Recent Reports</span>
            </div>
          </template>
          
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
        </el-card>
      </el-col>
    </el-row>

    <!-- Features -->
    <el-row :gutter="20" class="features-row">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Features</span>
            </div>
          </template>
          
          <el-row :gutter="20">
            <el-col :span="8">
                              <div class="feature-item">
                  <el-icon class="feature-icon"><DataAnalysis /></el-icon>
                  <h3>Drag & Drop Builder</h3>
                  <p>Create reports visually with our intuitive drag and drop interface. No SQL knowledge required.</p>
                </div>
            </el-col>
            
            <el-col :span="8">
              <div class="feature-item">
                <el-icon class="feature-icon"><Download /></el-icon>
                <h3>Multiple Export Formats</h3>
                <p>Export your reports in Excel, CSV, PDF, or JSON formats with just one click.</p>
              </div>
            </el-col>
            
            <el-col :span="8">
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
  </div>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, var(--el-color-primary), #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  font-size: 1.1rem;
  color: var(--el-text-color-regular);
}

.stats-row {
  margin-bottom: 30px;
}

.stat-card {
  height: 120px;
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
  background: linear-gradient(135deg, var(--el-color-primary), #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-info {
  flex: 1;
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

.action-card {
  height: 300px;
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
}

.action-buttons .el-button {
  height: 50px;
  font-size: 1rem;
}

.features-row {
  margin-bottom: 30px;
}

.feature-item {
  text-align: center;
  padding: 20px;
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
}
</style>
