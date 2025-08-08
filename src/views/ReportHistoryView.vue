<template>
  <div class="report-history-view">
    <div class="page-header">
      <h1>Report History</h1>
      <p>Track and manage your report executions</p>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="statusFilter" placeholder="Status" clearable style="width: 100%">
            <el-option label="All" value="" />
            <el-option label="Completed" value="completed" />
            <el-option label="Processing" value="processing" />
            <el-option label="Failed" value="failed" />
          </el-select>
        </el-col>
        
        <el-col :span="6">
          <el-select v-model="formatFilter" placeholder="Format" clearable style="width: 100%">
            <el-option label="All" value="" />
            <el-option label="Excel" value="excel" />
            <el-option label="CSV" value="csv" />
            <el-option label="PDF" value="pdf" />
            <el-option label="JSON" value="json" />
          </el-select>
        </el-col>
        
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            style="width: 100%"
          />
        </el-col>
        
        <el-col :span="6">
          <el-input
            v-model="searchQuery"
            placeholder="Search reports..."
            prefix-icon="Search"
            clearable
            style="width: 100%"
          />
        </el-col>
      </el-row>
    </div>

    <!-- Statistics Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon success">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ completedCount }}</div>
              <div class="stat-label">Completed</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon warning">
              <el-icon><Loading /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ processingCount }}</div>
              <div class="stat-label">Processing</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon danger">
              <el-icon><Close /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ failedCount }}</div>
              <div class="stat-label">Failed</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon primary">
              <el-icon><Download /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ totalSize }}</div>
              <div class="stat-label">Total Size</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Reports Table -->
    <el-card class="reports-table-card">
      <template #header>
        <div class="table-header">
          <span>Report History</span>
          <div class="table-actions">
            <el-button size="small" @click="refreshData">
              <el-icon><Refresh /></el-icon>
              Refresh
            </el-button>
            <el-button size="small" @click="exportHistory">
              <el-icon><Download /></el-icon>
              Export
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table
        :data="filteredReports"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="name" label="Report Name" min-width="200">
          <template #default="scope">
            <div class="report-name">
              <el-icon class="report-icon"><Document /></el-icon>
              <div>
                <div class="name">{{ scope.row.name }}</div>
                <div class="description">{{ scope.row.description }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="format" label="Format" width="100">
          <template #default="scope">
            <el-tag :type="getFormatTagType(scope.row.format)">
              {{ scope.row.format.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="Status" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="created_at" label="Created" width="150">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="size" label="Size" width="100">
          <template #default="scope">
            {{ formatFileSize(scope.row.size) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="execution_time" label="Duration" width="100">
          <template #default="scope">
            {{ scope.row.execution_time }}s
          </template>
        </el-table-column>
        
        <el-table-column label="Actions" width="150" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button
                v-if="scope.row.status === 'completed'"
                size="small"
                type="primary"
                @click="downloadReport(scope.row)"
              >
                <el-icon><Download /></el-icon>
              </el-button>
              
              <el-button
                size="small"
                @click="viewDetails(scope.row)"
              >
                <el-icon><View /></el-icon>
              </el-button>
              
              <el-button
                size="small"
                type="danger"
                @click="deleteReport(scope.row)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 25, 50, 100]"
          :total="totalReports"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Report Details Dialog -->
    <el-dialog v-model="detailsDialogVisible" title="Report Details" width="700px">
      <div v-if="selectedReport" class="report-details">
        <el-descriptions title="Report Information" :column="2" border>
          <el-descriptions-item label="Report Name">
            {{ selectedReport.name }}
          </el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="getStatusTagType(selectedReport.status)">
              {{ selectedReport.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Format">
            <el-tag :type="getFormatTagType(selectedReport.format)">
              {{ selectedReport.format.toUpperCase() }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Created">
            {{ formatDate(selectedReport.created_at) }}
          </el-descriptions-item>
          <el-descriptions-item label="File Size">
            {{ formatFileSize(selectedReport.size) }}
          </el-descriptions-item>
          <el-descriptions-item label="Execution Time">
            {{ selectedReport.execution_time }}s
          </el-descriptions-item>
          <el-descriptions-item label="Rows Generated">
            {{ selectedReport.row_count }}
          </el-descriptions-item>
          <el-descriptions-item label="Columns">
            {{ selectedReport.column_count }}
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="details-section">
          <h4>Description</h4>
          <p>{{ selectedReport.description }}</p>
        </div>
        
        <div class="details-section">
          <h4>Query Configuration</h4>
          <el-input
            v-model="selectedReport.query_config"
            type="textarea"
            :rows="6"
            readonly
            class="query-display"
          />
        </div>
        
        <div v-if="selectedReport.error_message" class="details-section">
          <h4>Error Details</h4>
          <el-alert
            :title="selectedReport.error_message"
            type="error"
            :closable="false"
            show-icon
          />
        </div>
      </div>
      
      <template #footer>
        <el-button @click="detailsDialogVisible = false">Close</el-button>
        <el-button
          v-if="selectedReport?.status === 'completed'"
          type="primary"
          @click="downloadReport(selectedReport)"
        >
          Download Report
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Check, Loading, Close, Download, Refresh, Document, View, Delete
} from '@element-plus/icons-vue'

// Reactive data
const loading = ref(false)
const statusFilter = ref('')
const formatFilter = ref('')
const dateRange = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(25)
const detailsDialogVisible = ref(false)
const selectedReport = ref(null)
const selectedReports = ref([])

// Mock reports data
const reports = ref([
  {
    id: '1',
    name: 'Sales Report - March 2024',
    description: 'Monthly sales analysis with customer breakdown',
    format: 'excel',
    status: 'completed',
    created_at: '2024-03-15T10:30:00Z',
    size: 2048576, // 2MB
    execution_time: 1.2,
    row_count: 1250,
    column_count: 8,
    query_config: 'SELECT o.order_number, c.name, o.total_amount FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE o.created_at >= "2024-03-01"',
    error_message: null
  },
  {
    id: '2',
    name: 'Customer Analysis',
    description: 'Customer behavior and demographics analysis',
    format: 'pdf',
    status: 'processing',
    created_at: '2024-03-15T09:45:00Z',
    size: 0,
    execution_time: 0,
    row_count: 0,
    column_count: 0,
    query_config: 'SELECT c.name, c.email, COUNT(o.id) as order_count FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id',
    error_message: null
  },
  {
    id: '3',
    name: 'Inventory Report',
    description: 'Stock levels and inventory movement tracking',
    format: 'csv',
    status: 'failed',
    created_at: '2024-03-14T16:20:00Z',
    size: 0,
    execution_time: 0,
    row_count: 0,
    column_count: 0,
    query_config: 'SELECT p.name, p.sku, p.stock_quantity FROM products p WHERE p.category_id = 1',
    error_message: 'Database connection timeout'
  },
  {
    id: '4',
    name: 'Revenue Summary',
    description: 'Quarterly revenue performance metrics',
    format: 'excel',
    status: 'completed',
    created_at: '2024-03-14T14:15:00Z',
    size: 1536000, // 1.5MB
    execution_time: 0.8,
    row_count: 450,
    column_count: 6,
    query_config: 'SELECT DATE_FORMAT(created_at, "%Y-%m") as month, SUM(total_amount) as revenue FROM orders GROUP BY month ORDER BY month',
    error_message: null
  },
  {
    id: '5',
    name: 'Product Performance',
    description: 'Product sales and performance analysis',
    format: 'json',
    status: 'completed',
    created_at: '2024-03-13T11:30:00Z',
    size: 512000, // 500KB
    execution_time: 0.5,
    row_count: 200,
    column_count: 5,
    query_config: 'SELECT p.name, p.sku, SUM(oi.quantity) as total_sold FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id',
    error_message: null
  }
])

// Computed properties
const filteredReports = computed(() => {
  let filtered = reports.value

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(report => report.status === statusFilter.value)
  }

  // Format filter
  if (formatFilter.value) {
    filtered = filtered.filter(report => report.format === formatFilter.value)
  }

  // Date range filter
  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = dateRange.value[0]
    const endDate = dateRange.value[1]
    filtered = filtered.filter(report => {
      const reportDate = new Date(report.created_at)
      return reportDate >= startDate && reportDate <= endDate
    })
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(report =>
      report.name.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalReports = computed(() => filteredReports.value.length)

const completedCount = computed(() => 
  reports.value.filter(r => r.status === 'completed').length
)

const processingCount = computed(() => 
  reports.value.filter(r => r.status === 'processing').length
)

const failedCount = computed(() => 
  reports.value.filter(r => r.status === 'failed').length
)

const totalSize = computed(() => {
  const total = reports.value
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.size, 0)
  return formatFileSize(total)
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'processing': return 'warning'
    case 'failed': return 'danger'
    default: return 'info'
  }
}

const getFormatTagType = (format: string) => {
  switch (format) {
    case 'excel': return 'success'
    case 'pdf': return 'danger'
    case 'csv': return 'warning'
    case 'json': return 'info'
    default: return 'info'
  }
}

const refreshData = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Data refreshed successfully')
  } catch (error) {
    ElMessage.error('Failed to refresh data')
  } finally {
    loading.value = false
  }
}

const exportHistory = () => {
  ElMessage.info('Export functionality would be implemented here')
}

const handleSelectionChange = (selection: any[]) => {
  selectedReports.value = selection
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const downloadReport = (report: any) => {
  if (report.status !== 'completed') {
    ElMessage.warning('Report is not ready for download')
    return
  }
  
  // Simulate download
  ElMessage.success(`Downloading ${report.name}...`)
  console.log('Downloading report:', report)
}

const viewDetails = (report: any) => {
  selectedReport.value = report
  detailsDialogVisible.value = true
}

const deleteReport = async (report: any) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${report.name}"? This action cannot be undone.`,
      'Delete Report',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    const index = reports.value.findIndex(r => r.id === report.id)
    if (index > -1) {
      reports.value.splice(index, 1)
      ElMessage.success('Report deleted successfully')
    }
  } catch {
    // User cancelled
  }
}

// Initialize
onMounted(() => {
  // Load initial data
  console.log('Report history loaded')
})
</script>

<style scoped>
.report-history-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
  background: linear-gradient(135deg, var(--el-color-primary), #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: var(--el-text-color-regular);
}

.filters-section {
  margin-bottom: 30px;
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}

.stats-row {
  margin-bottom: 30px;
}

.stat-card {
  height: 100px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
  height: 100%;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.stat-icon.success {
  background: var(--el-color-success);
}

.stat-icon.warning {
  background: var(--el-color-warning);
}

.stat-icon.danger {
  background: var(--el-color-danger);
}

.stat-icon.primary {
  background: var(--el-color-primary);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--el-text-color-regular);
  margin-top: 5px;
}

.reports-table-card {
  margin-bottom: 30px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-actions {
  display: flex;
  gap: 10px;
}

.report-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.report-icon {
  color: var(--el-color-primary);
  font-size: 18px;
}

.name {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.description {
  font-size: 0.8rem;
  color: var(--el-text-color-regular);
  margin-top: 2px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.report-details {
  padding: 20px 0;
}

.details-section {
  margin-top: 20px;
}

.details-section h4 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.details-section p {
  margin: 0;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.query-display {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .filters-section .el-row {
    margin: 0;
  }
  
  .filters-section .el-col {
    margin-bottom: 15px;
  }
  
  .stats-row .el-col {
    margin-bottom: 15px;
  }
}
</style>
