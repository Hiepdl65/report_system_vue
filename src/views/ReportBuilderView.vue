<template>
  <div class="report-builder">
    <div class="page-header">
      <h1>Report Builder</h1>
      <p>Drag and drop to create powerful reports without writing SQL</p>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <el-button-group>
        <el-button type="primary" @click="previewReport" :loading="isLoading">
          <el-icon><View /></el-icon>
          Preview
        </el-button>
        <el-button @click="runReport" :loading="isLoading" :disabled="!canGenerateReport">
          <el-icon><VideoPlay /></el-icon>
          Run Report
        </el-button>
        <el-button @click="exportReport" :loading="isLoading" :disabled="!canGenerateReport">
          <el-icon><Download /></el-icon>
          Export
        </el-button>
        <el-button @click="saveTemplate" :disabled="!canGenerateReport">
          <el-icon><Document /></el-icon>
          Save Template
        </el-button>
      </el-button-group>

      <el-button @click="clearReport" type="danger" plain>
        <el-icon><Delete /></el-icon>
        Clear
      </el-button>
    </div>

    <!-- Main Builder Layout -->
    <div class="builder-layout">
      <!-- Left Panel - Data Sources -->
      <div class="builder-panel left-panel">
        <div class="panel-header">
          <el-icon><Grid /></el-icon>
          <span>Data Sources</span>
        </div>
        
        <div class="panel-content">
          <div class="data-sources">
            <div
              v-for="table in availableTables"
              :key="table.id"
              class="data-source-item"
              draggable="true"
              @dragstart="onDragStart($event, table)"
            >
              <div class="source-header">
                <el-icon class="source-icon"><Grid /></el-icon>
                <span class="source-name">{{ table.name }}</span>
                <el-tag size="small" type="info">{{ table.alias }}</el-tag>
              </div>
              
              <div class="source-fields">
                <el-tag
                  v-for="field in tableFields[table.name]"
                  :key="field"
                  size="small"
                  class="field-tag"
                >
                  {{ field }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center Panel - Canvas -->
      <div class="builder-panel center-panel">
        <div class="panel-header">
          <el-icon><Edit /></el-icon>
          <span>Report Canvas</span>
          <div class="canvas-actions">
            <el-button size="small" @click="showQueryEditor = !showQueryEditor">
              <el-icon><Document /></el-icon>
              {{ showQueryEditor ? 'Hide' : 'Show' }} SQL
            </el-button>
          </div>
        </div>
        
        <div class="panel-content">
          <!-- Drop Zone -->
          <div
            class="drop-zone"
            :class="{ 'has-tables': hasSelectedTables }"
            @drop="onDrop($event)"
            @dragover.prevent
            @dragenter.prevent
          >
            <div v-if="!hasSelectedTables" class="drop-zone-empty">
              <el-icon class="drop-icon"><Upload /></el-icon>
              <h3>Drag tables here to start building your report</h3>
              <p>Select data sources from the left panel and drag them to this area</p>
            </div>
            
            <div v-else class="selected-tables">
              <div
                v-for="table in selectedTables"
                :key="table.id"
                class="selected-table"
              >
                <div class="table-header">
                  <el-icon><Grid /></el-icon>
                  <span>{{ table.name }}</span>
                  <el-tag size="small" type="info">{{ table.alias }}</el-tag>
                  <el-button
                    size="small"
                    type="danger"
                    circle
                    @click="removeTable(table.id)"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                
                <div class="table-fields">
                  <el-tag
                    v-for="field in getTableFields(table.name)"
                    :key="field"
                    size="small"
                    class="field-tag"
                    :class="{ 'selected': isFieldSelected(table.alias, field) }"
                    @click="toggleField(table.alias, field)"
                  >
                    {{ field }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- Query Editor -->
          <div v-if="showQueryEditor" class="query-editor">
            <div class="query-header">
              <span>Generated SQL Query</span>
              <el-button size="small" @click="copyQuery">
                <el-icon><CopyDocument /></el-icon>
                Copy
              </el-button>
            </div>
            <el-input
              v-model="generatedQuery"
              type="textarea"
              :rows="8"
              readonly
              class="query-textarea"
            />
          </div>

          <!-- Data Preview -->
          <div v-if="reportData.length > 0" class="data-preview">
            <div class="preview-header">
              <span>Data Preview ({{ reportData.length }} rows)</span>
              <el-tag type="success">{{ executionTime }}s</el-tag>
            </div>
            <el-table :data="reportData" style="width: 100%" max-height="400">
              <el-table-column
                v-for="column in reportColumns"
                :key="column"
                :prop="column"
                :label="column"
                min-width="120"
              />
            </el-table>
          </div>
        </div>
      </div>

      <!-- Right Panel - Configuration -->
      <div class="builder-panel right-panel">
        <div class="panel-header">
          <el-icon><Setting /></el-icon>
          <span>Configuration</span>
        </div>
        
        <div class="panel-content">
          <!-- Filters -->
          <div class="config-section">
            <div class="section-header">
              <h4>Filters</h4>
              <el-button size="small" @click="addFilter">
                <el-icon><Plus /></el-icon>
                Add Filter
              </el-button>
            </div>
            
            <div v-if="filters.length === 0" class="empty-state">
              <p>No filters configured</p>
            </div>
            
            <div v-else class="filters-list">
              <div
                v-for="(filter, index) in filters"
                :key="index"
                class="filter-item"
              >
                <el-select v-model="filter.table_alias" placeholder="Table" size="small">
                  <el-option
                    v-for="table in selectedTables"
                    :key="table.alias"
                    :label="table.name"
                    :value="table.alias"
                  />
                </el-select>
                
                <el-select v-model="filter.column" placeholder="Column" size="small">
                  <el-option
                    v-for="field in getTableFields(getTableNameByAlias(filter.table_alias))"
                    :key="field"
                    :label="field"
                    :value="field"
                  />
                </el-select>
                
                <el-select v-model="filter.operator" placeholder="Operator" size="small">
                  <el-option label="Equals" value="=" />
                  <el-option label="Not Equals" value="!=" />
                  <el-option label="Greater Than" value=">" />
                  <el-option label="Less Than" value="<" />
                  <el-option label="Contains" value="LIKE" />
                </el-select>
                
                <el-input v-model="filter.value" placeholder="Value" size="small" />
                
                <el-button
                  size="small"
                  type="danger"
                  circle
                  @click="removeFilter(index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <!-- Sorting -->
          <div class="config-section">
            <div class="section-header">
              <h4>Sorting</h4>
              <el-button size="small" @click="addSort">
                <el-icon><Plus /></el-icon>
                Add Sort
              </el-button>
            </div>
            
            <div v-if="sorts.length === 0" class="empty-state">
              <p>No sorting configured</p>
            </div>
            
            <div v-else class="sorts-list">
              <div
                v-for="(sort, index) in sorts"
                :key="index"
                class="sort-item"
              >
                <el-select v-model="sort.field" placeholder="Field" size="small">
                  <el-option
                    v-for="field in selectedFields"
                    :key="field.alias || field.column"
                    :label="field.alias || field.column"
                    :value="field.alias || field.column"
                  />
                </el-select>
                
                <el-select v-model="sort.direction" placeholder="Direction" size="small">
                  <el-option label="Ascending" value="ASC" />
                  <el-option label="Descending" value="DESC" />
                </el-select>
                
                <el-button
                  size="small"
                  type="danger"
                  circle
                  @click="removeSort(index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <!-- Limit -->
          <div class="config-section">
            <h4>Limit</h4>
            <el-input-number
              v-model="queryLimit"
              :min="1"
              :max="10000"
              size="small"
              style="width: 100%"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Save Template Dialog -->
    <el-dialog v-model="saveDialogVisible" title="Save Template" width="500px">
      <el-form :model="templateForm" label-width="100px">
        <el-form-item label="Template Name">
          <el-input v-model="templateForm.name" placeholder="Enter template name" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input
            v-model="templateForm.description"
            type="textarea"
            :rows="3"
            placeholder="Enter template description"
          />
        </el-form-item>
        <el-form-item label="Tags">
          <el-input v-model="templateForm.tags" placeholder="Enter tags (comma separated)" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="saveDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmSaveTemplate">Save Template</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useReportStore } from '@/stores/report'
import { apiService } from '@/services/api'
import {
  View, VideoPlay, Download, Delete, Grid, Edit,
  Document, Upload, Close, CopyDocument, Setting, Plus
} from '@element-plus/icons-vue'

const reportStore = useReportStore()

// Reactive data
const showQueryEditor = ref(false)
const saveDialogVisible = ref(false)
const templateForm = ref({
  name: '',
  description: '',
  tags: ''
})

// Computed properties
const {
  selectedTables,
  selectedFields,
  filters,
  sorts,
  reportData,
  reportColumns,
  isLoading,
  availableTables,
  tableFields,
  hasSelectedTables,
  hasSelectedFields,
  canGenerateReport,
  queryConfiguration
} = reportStore

const queryLimit = ref(1000)
const executionTime = ref(0)

// Generated query
const generatedQuery = computed(() => {
  if (!hasSelectedTables.value || !hasSelectedFields.value) {
    return '-- Select tables and fields to generate query'
  }

  const selectClause = selectedFields.value
    .map(field => `${field.table_alias}.${field.column} AS "${field.alias || field.column}"`)
    .join(',\n  ')

  const fromClause = selectedTables.value[0]?.name || ''
  
  let joinClause = ''
  if (selectedTables.value.length > 1) {
    // Simple join logic - in real app this would be more sophisticated
    if (selectedTables.value.some(t => t.name === 'orders') && selectedTables.value.some(t => t.name === 'customers')) {
      joinClause = '\nLEFT JOIN customers c ON o.customer_id = c.id'
    }
  }

  let whereClause = ''
  if (filters.value.length > 0) {
    whereClause = '\nWHERE ' + filters.value
      .map(filter => `${filter.table_alias}.${filter.column} ${filter.operator} '${filter.value}'`)
      .join(' AND ')
  }

  let orderClause = ''
  if (sorts.value.length > 0) {
    orderClause = '\nORDER BY ' + sorts.value
      .map(sort => `${sort.field} ${sort.direction}`)
      .join(', ')
  }

  return `SELECT 
  ${selectClause}
FROM ${fromClause}${joinClause}${whereClause}${orderClause}
LIMIT ${queryLimit.value};`
})

// Methods
const onDragStart = (event: DragEvent, table: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(table))
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  const data = event.dataTransfer?.getData('application/json')
  if (data) {
    const table = JSON.parse(data)
    reportStore.addTable(table)
  }
}

const getTableFields = (tableName: string) => {
  return tableFields.value[tableName] || []
}

const getTableNameByAlias = (alias: string) => {
  const table = selectedTables.value.find(t => t.alias === alias)
  return table?.name || ''
}

const isFieldSelected = (tableAlias: string, field: string) => {
  return selectedFields.value.some(f => f.table_alias === tableAlias && f.column === field)
}

const toggleField = (tableAlias: string, field: string) => {
  if (isFieldSelected(tableAlias, field)) {
    reportStore.removeField(tableAlias, field)
  } else {
    reportStore.addField({
      table_alias: tableAlias,
      column: field,
      alias: field,
      visible: true
    })
  }
}

const addFilter = () => {
  reportStore.addFilter({
    table_alias: '',
    column: '',
    operator: '=',
    value: '',
    data_type: 'string'
  })
}

const removeFilter = (index: number) => {
  reportStore.removeFilter(index)
}

const addSort = () => {
  reportStore.addSort({
    field: '',
    direction: 'ASC'
  })
}

const removeSort = (index: number) => {
  reportStore.removeSort(index)
}

const previewReport = async () => {
  if (!canGenerateReport.value) {
    ElMessage.warning('Please select tables and fields first')
    return
  }

  try {
    reportStore.setLoading(true)
    const startTime = Date.now()
    
    const response = await apiService.previewReport({
      query_config: queryConfiguration.value,
      save_as_template: false
    })
    
    executionTime.value = ((Date.now() - startTime) / 1000).toFixed(2)
    
    if (response.success) {
      reportStore.setReportData(response.data || [], response.columns || [])
      ElMessage.success('Preview generated successfully')
    } else {
      ElMessage.error(response.message || 'Failed to generate preview')
    }
  } catch (error) {
    ElMessage.error('Error generating preview')
    console.error(error)
  } finally {
    reportStore.setLoading(false)
  }
}

const runReport = async () => {
  if (!canGenerateReport.value) {
    ElMessage.warning('Please select tables and fields first')
    return
  }

  try {
    reportStore.setLoading(true)
    const startTime = Date.now()
    
    const response = await apiService.runReport({
      query_config: queryConfiguration.value,
      save_as_template: false
    })
    
    executionTime.value = ((Date.now() - startTime) / 1000).toFixed(2)
    
    if (response.success) {
      reportStore.setReportData(response.data || [], response.columns || [])
      ElMessage.success('Report generated successfully')
    } else {
      ElMessage.error(response.message || 'Failed to generate report')
    }
  } catch (error) {
    ElMessage.error('Error generating report')
    console.error(error)
  } finally {
    reportStore.setLoading(false)
  }
}

const exportReport = async () => {
  if (!canGenerateReport.value) {
    ElMessage.warning('Please select tables and fields first')
    return
  }

  try {
    reportStore.setLoading(true)
    
    const response = await apiService.runReport({
      query_config: queryConfiguration.value,
      export_format: 'excel',
      save_as_template: false
    })
    
    if (response.success && response.export_file_url) {
      // Download file
      const link = document.createElement('a')
      link.href = response.export_file_url
      link.download = 'report.xlsx'
      link.click()
      ElMessage.success('Report exported successfully')
    } else {
      ElMessage.error(response.message || 'Failed to export report')
    }
  } catch (error) {
    ElMessage.error('Error exporting report')
    console.error(error)
  } finally {
    reportStore.setLoading(false)
  }
}

const saveTemplate = () => {
  if (!canGenerateReport.value) {
    ElMessage.warning('Please select tables and fields first')
    return
  }
  saveDialogVisible.value = true
}

const confirmSaveTemplate = () => {
  if (!templateForm.value.name) {
    ElMessage.warning('Please enter a template name')
    return
  }
  
  reportStore.saveAsTemplate(templateForm.value.name)
  saveDialogVisible.value = false
  templateForm.value = { name: '', description: '', tags: '' }
  ElMessage.success('Template saved successfully')
}

const clearReport = () => {
  reportStore.clearReport()
  ElMessage.success('Report cleared')
}

const copyQuery = () => {
  navigator.clipboard.writeText(generatedQuery.value)
  ElMessage.success('Query copied to clipboard')
}

// Initialize
onMounted(() => {
  // Load available tables
  apiService.getTables().then(tables => {
    // In real app, this would update the store
    console.log('Available tables:', tables)
  })
})
</script>

<style scoped>
.report-builder {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 20px;
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

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}

.builder-layout {
  display: grid;
  grid-template-columns: 300px 1fr 350px;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 600px;
}

.builder-panel {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background: linear-gradient(135deg, var(--el-color-primary), #7c3aed);
  color: white;
  font-weight: 600;
}

.panel-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.data-source-item {
  background: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  cursor: grab;
  transition: all 0.3s ease;
}

.data-source-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-source-item:active {
  cursor: grabbing;
}

.source-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.source-icon {
  color: var(--el-color-primary);
}

.source-name {
  font-weight: 600;
  flex: 1;
}

.source-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.field-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.field-tag.selected {
  background: var(--el-color-primary);
  color: white;
}

.drop-zone {
  min-height: 200px;
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.drop-zone.has-tables {
  border-style: solid;
  border-color: var(--el-color-primary);
  background: rgba(64, 158, 255, 0.05);
}

.drop-zone-empty {
  text-align: center;
  color: var(--el-text-color-regular);
}

.drop-icon {
  font-size: 3rem;
  color: var(--el-color-primary);
  margin-bottom: 15px;
}

.selected-tables {
  width: 100%;
}

.selected-table {
  background: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
}

.table-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.table-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.query-editor {
  margin-top: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  overflow: hidden;
}

.query-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: var(--el-bg-color-page);
  border-bottom: 1px solid var(--el-border-color-light);
  font-weight: 600;
}

.query-textarea {
  font-family: 'Courier New', monospace;
}

.data-preview {
  margin-top: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
}

.config-section {
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  color: var(--el-text-color-regular);
  padding: 20px;
}

.filter-item,
.sort-item {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  align-items: center;
}

.filter-item .el-select,
.sort-item .el-select {
  flex: 1;
}

.filter-item .el-input {
  flex: 1;
}

.canvas-actions {
  margin-left: auto;
}

@media (max-width: 1200px) {
  .builder-layout {
    grid-template-columns: 250px 1fr 300px;
  }
}

@media (max-width: 768px) {
  .builder-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
}
</style>
