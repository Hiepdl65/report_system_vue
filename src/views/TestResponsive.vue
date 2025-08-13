<template>
  <div class="test-responsive">
    <div class="debug-info">
      <h2>Responsive Test Page</h2>
      <p>Screen Width: {{ screenWidth }}px</p>
      <p>Is Mobile: {{ isMobile }}</p>
      <p>Current Breakpoint: {{ currentBreakpoint }}</p>
    </div>

    <!-- Test Grid -->
    <el-row :gutter="20" class="test-grid">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-card class="test-card">
          <h3>Card 1</h3>
          <p>This should be full width on mobile, half width on tablet, and 1/3 width on desktop.</p>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-card class="test-card">
          <h3>Card 2</h3>
          <p>Testing responsive grid behavior.</p>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-card class="test-card">
          <h3>Card 3</h3>
          <p>Should stack on mobile.</p>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-card class="test-card">
          <h3>Card 4</h3>
          <p>Last card in the grid.</p>
        </el-card>
      </el-col>
    </el-row>

    <!-- Test Buttons -->
    <div class="test-buttons">
      <h3>Button Test</h3>
      <el-button-group>
        <el-button type="primary">
          <el-icon><Plus /></el-icon>
          <span class="btn-text">Add Item</span>
        </el-button>
        <el-button>
          <el-icon><Edit /></el-icon>
          <span class="btn-text">Edit</span>
        </el-button>
        <el-button type="danger">
          <el-icon><Delete /></el-icon>
          <span class="btn-text">Delete</span>
        </el-button>
      </el-button-group>
    </div>

    <!-- Test Table -->
    <div class="test-table">
      <h3>Table Test</h3>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="Name" width="150" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="role" label="Role" width="120" />
        <el-table-column prop="status" label="Status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'Active' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Mobile vs Desktop Content -->
    <div class="visibility-test">
      <h3>Visibility Test</h3>
      <div class="mobile-only">
        <el-alert title="Mobile Only" type="info" :closable="false">
          This content only shows on mobile devices (≤768px)
        </el-alert>
      </div>
      
      <div class="desktop-only">
        <el-alert title="Desktop Only" type="success" :closable="false">
          This content only shows on desktop devices (>768px)
        </el-alert>
      </div>
    </div>

    <!-- Force Mobile Test -->
    <div class="force-mobile-test">
      <h3>Force Mobile Test</h3>
      <el-button @click="toggleForceMobile" :type="forceMobile ? 'danger' : 'primary'">
        {{ forceMobile ? 'Disable' : 'Enable' }} Force Mobile Layout
      </el-button>
      
      <div v-if="forceMobile" class="force-mobile" style="margin-top: 20px;">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6">
            <el-card>
              <h4>Forced Mobile Card 1</h4>
              <p>This should behave like mobile even on desktop.</p>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card>
              <h4>Forced Mobile Card 2</h4>
              <p>Testing forced mobile layout.</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

const screenWidth = ref(window.innerWidth)
const forceMobile = ref(false)

const tableData = ref([
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive' },
])

const isMobile = computed(() => screenWidth.value <= 768)

const currentBreakpoint = computed(() => {
  if (screenWidth.value <= 480) return 'xs'
  if (screenWidth.value <= 768) return 'sm'
  if (screenWidth.value <= 1024) return 'md'
  if (screenWidth.value <= 1280) return 'lg'
  return 'xl'
})

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

const toggleForceMobile = () => {
  forceMobile.value = !forceMobile.value
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth)
})
</script>

<style scoped>
.test-responsive {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.debug-info {
  background: #f0f2f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: center;
}

.debug-info h2 {
  margin: 0 0 15px 0;
  color: #333;
}

.debug-info p {
  margin: 5px 0;
  font-weight: 600;
}

.test-grid {
  margin-bottom: 40px;
}

.test-card {
  margin-bottom: 20px;
  min-height: 150px;
}

.test-card h3 {
  margin: 0 0 10px 0;
  color: var(--el-color-primary);
}

.test-buttons {
  margin-bottom: 40px;
  text-align: center;
}

.test-buttons h3 {
  margin-bottom: 20px;
}

.test-table {
  margin-bottom: 40px;
}

.test-table h3 {
  margin-bottom: 20px;
}

.visibility-test {
  margin-bottom: 40px;
}

.visibility-test h3 {
  margin-bottom: 20px;
}

.force-mobile-test h3 {
  margin-bottom: 20px;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .test-responsive {
    padding: 15px;
  }
  
  .debug-info {
    padding: 15px;
  }
  
  .debug-info h2 {
    font-size: 1.5rem;
  }
  
  .test-buttons {
    text-align: left;
  }
  
  .test-buttons .el-button-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .test-buttons .el-button-group .el-button {
    width: 100%;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .test-responsive {
    padding: 10px;
  }
  
  .debug-info {
    padding: 10px;
  }
  
  .debug-info h2 {
    font-size: 1.3rem;
  }
  
  .debug-info p {
    font-size: 0.9rem;
  }
}
</style>