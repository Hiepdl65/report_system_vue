<template>
  <div class="templates-view">
    <div class="page-header">
      <h1>Template Manager</h1>
      <p>Manage and share report templates</p>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <el-button type="primary" @click="createTemplate" :size="buttonSize">
        <el-icon><Plus /></el-icon>
        <span class="btn-text">Create Template</span>
      </el-button>
      
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="Search templates..."
          prefix-icon="Search"
          clearable
          :style="{ width: searchBarWidth }"
          :size="buttonSize"
        />
      </div>
    </div>

    <!-- Filter Tags (Mobile) -->
    <div v-if="isMobile" class="mobile-filters">
      <el-tag
        v-for="category in categories"
        :key="category"
        :type="selectedCategory === category ? 'primary' : 'info'"
        @click="setCategory(category)"
        class="filter-tag"
        size="small"
      >
        {{ category }}
      </el-tag>
    </div>

    <!-- Templates Grid -->
    <div class="templates-container">
      <div v-if="filteredTemplates.length === 0" class="empty-state">
        <el-icon class="empty-icon"><Files /></el-icon>
        <h3>No templates found</h3>
        <p>{{ searchQuery ? 'Try adjusting your search terms' : 'Create your first template to get started' }}</p>
        <el-button type="primary" @click="createTemplate">
          <el-icon><Plus /></el-icon>
          Create Template
        </el-button>
      </div>
      
      <div v-else class="templates-grid">
        <el-card
          v-for="template in filteredTemplates"
          :key="template.id"
          class="template-card"
          :body-style="{ padding: '0px' }"
          shadow="hover"
        >
          <div class="template-header">
            <div class="template-icon">
              <el-icon><Files /></el-icon>
            </div>
            <div class="template-info">
              <h3>{{ template.name }}</h3>
              <p class="template-description">{{ template.description }}</p>
              <div class="template-meta">
                <el-tag size="small" :type="getCategoryTagType(template.category)">
                  {{ template.category }}
                </el-tag>
                <span class="template-date">
                  Updated {{ formatDate(template.updated_at) }}
                </span>
              </div>
            </div>
            <div class="template-actions">
              <el-dropdown>
                <el-button size="small" circle>
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editTemplate(template)">
                      <el-icon><Edit /></el-icon>
                      Edit
                    </el-dropdown-item>
                    <el-dropdown-item @click="duplicateTemplate(template)">
                      <el-icon><CopyDocument /></el-icon>
                      Duplicate
                    </el-dropdown-item>
                    <el-dropdown-item @click="shareTemplate(template)">
                      <el-icon><Share /></el-icon>
                      Share
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="deleteTemplate(template)">
                      <el-icon><Delete /></el-icon>
                      Delete
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          
          <div class="template-content">
            <div class="template-stats">
              <div class="stat-item">
                <span class="stat-value">{{ template.tables_count }}</span>
                <span class="stat-label">Tables</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ template.fields_count }}</span>
                <span class="stat-label">Fields</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ template.usage_count }}</span>
                <span class="stat-label">Usage</span>
              </div>
            </div>
            
            <div class="template-tags">
              <el-tag
                v-for="tag in template.tags.slice(0, isMobile ? 2 : 3)"
                :key="tag"
                size="small"
                class="tag-item"
              >
                {{ tag }}
              </el-tag>
              <el-tag
                v-if="template.tags.length > (isMobile ? 2 : 3)"
                size="small"
                class="tag-item more-tags"
              >
                +{{ template.tags.length - (isMobile ? 2 : 3) }}
              </el-tag>
            </div>
          </div>
          
          <div class="template-footer">
            <el-button 
              type="primary" 
              @click="useTemplate(template)"
              :size="buttonSize"
              class="use-btn"
            >
              <el-icon><VideoPlay /></el-icon>
              <span class="btn-text">Use Template</span>
            </el-button>
            <el-button 
              @click="previewTemplate(template)"
              :size="buttonSize"
              class="preview-btn"
            >
              <el-icon><View /></el-icon>
              <span class="btn-text">Preview</span>
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Create/Edit Template Dialog -->
    <el-dialog
      v-model="templateDialogVisible"
      :title="isEditing ? 'Edit Template' : 'Create Template'"
      :width="dialogWidth"
      class="template-dialog"
    >
      <el-form :model="templateForm" label-width="100px" :size="buttonSize">
        <el-form-item label="Template Name" required>
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
        
        <el-form-item label="Category">
          <el-select v-model="templateForm.category" placeholder="Select category" style="width: 100%">
            <el-option label="Sales" value="sales" />
            <el-option label="Finance" value="finance" />
            <el-option label="Marketing" value="marketing" />
            <el-option label="Operations" value="operations" />
            <el-option label="Custom" value="custom" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Tags">
          <el-input
            v-model="templateForm.tags"
            placeholder="Enter tags (comma separated)"
          />
        </el-form-item>
        
        <el-form-item label="Visibility">
          <el-radio-group v-model="templateForm.visibility">
            <el-radio label="private">Private</el-radio>
            <el-radio label="team">Team</el-radio>
            <el-radio label="public">Public</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="templateDialogVisible = false" :size="buttonSize">Cancel</el-button>
        <el-button type="primary" @click="saveTemplate" :size="buttonSize">
          {{ isEditing ? 'Update' : 'Create' }} Template
        </el-button>
      </template>
    </el-dialog>

    <!-- Preview Dialog -->
    <el-dialog 
      v-model="previewDialogVisible" 
      title="Template Preview" 
      :width="dialogWidth"
      class="preview-dialog"
    >
      <div v-if="selectedTemplate" class="template-preview">
        <div class="preview-header">
          <h3>{{ selectedTemplate.name }}</h3>
          <p>{{ selectedTemplate.description }}</p>
        </div>
        
        <div class="preview-content">
          <el-descriptions 
            title="Template Details" 
            :column="isMobile ? 1 : 2" 
            border
            :size="buttonSize"
          >
            <el-descriptions-item label="Category">
              <el-tag :type="getCategoryTagType(selectedTemplate.category)" size="small">
                {{ selectedTemplate.category }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Created">
              {{ formatDate(selectedTemplate.created_at) }}
            </el-descriptions-item>
            <el-descriptions-item label="Tables">
              {{ selectedTemplate.tables_count }}
            </el-descriptions-item>
            <el-descriptions-item label="Fields">
              {{ selectedTemplate.fields_count }}
            </el-descriptions-item>
            <el-descriptions-item label="Usage Count">
              {{ selectedTemplate.usage_count }}
            </el-descriptions-item>
            <el-descriptions-item label="Visibility">
              <el-tag size="small">{{ selectedTemplate.visibility }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          
          <div class="preview-tags">
            <h4>Tags:</h4>
            <div class="tags-container">
              <el-tag
                v-for="tag in selectedTemplate.tags"
                :key="tag"
                size="small"
                class="tag-item"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="previewDialogVisible = false" :size="buttonSize">Close</el-button>
        <el-button type="primary" @click="useTemplate(selectedTemplate)" :size="buttonSize">
          Use This Template
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Files, MoreFilled, Edit, CopyDocument, Share, Delete,
  VideoPlay, View, Search
} from '@element-plus/icons-vue'

const router = useRouter()

// Reactive data
const searchQuery = ref('')
const templateDialogVisible = ref(false)
const previewDialogVisible = ref(false)
const isEditing = ref(false)
const selectedTemplate = ref(null)
const selectedCategory = ref('all')
const isMobile = ref(false)

const templateForm = ref({
  name: '',
  description: '',
  category: '',
  tags: '',
  visibility: 'private'
})

// Categories for filtering
const categories = ref(['all', 'sales', 'finance', 'marketing', 'operations', 'custom'])

// Check if mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Computed properties for responsive design
const buttonSize = computed(() => isMobile.value ? 'small' : 'default')
const searchBarWidth = computed(() => isMobile.value ? '100%' : '300px')
const dialogWidth = computed(() => isMobile.value ? '95%' : '600px')

// Mock templates data
const templates = ref([
  {
    id: '1',
    name: 'Sales Report - Monthly',
    description: 'Comprehensive monthly sales analysis with customer breakdown and revenue metrics',
    category: 'sales',
    tags: ['sales', 'monthly', 'revenue', 'customers'],
    visibility: 'team',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-15T14:30:00Z',
    tables_count: 3,
    fields_count: 12,
    usage_count: 45
  },
  {
    id: '2',
    name: 'Customer Analysis',
    description: 'Detailed customer behavior and demographics analysis with segmentation',
    category: 'marketing',
    tags: ['customers', 'behavior', 'demographics', 'analysis'],
    visibility: 'public',
    created_at: '2024-02-15T09:00:00Z',
    updated_at: '2024-03-10T16:20:00Z',
    tables_count: 2,
    fields_count: 8,
    usage_count: 23
  },
  {
    id: '3',
    name: 'Inventory Report',
    description: 'Stock levels and inventory movement tracking with alerts',
    category: 'operations',
    tags: ['inventory', 'stock', 'operations', 'tracking'],
    visibility: 'team',
    created_at: '2024-01-20T11:00:00Z',
    updated_at: '2024-03-12T13:45:00Z',
    tables_count: 2,
    fields_count: 6,
    usage_count: 67
  },
  {
    id: '4',
    name: 'Financial Summary',
    description: 'Quarterly financial performance and key metrics dashboard',
    category: 'finance',
    tags: ['finance', 'quarterly', 'performance', 'metrics'],
    visibility: 'private',
    created_at: '2024-03-05T08:00:00Z',
    updated_at: '2024-03-18T10:15:00Z',
    tables_count: 4,
    fields_count: 15,
    usage_count: 12
  },
  {
    id: '5',
    name: 'Marketing Campaign ROI',
    description: 'Track marketing campaign performance and return on investment',
    category: 'marketing',
    tags: ['marketing', 'roi', 'campaigns', 'performance'],
    visibility: 'team',
    created_at: '2024-02-28T16:00:00Z',
    updated_at: '2024-03-20T11:30:00Z',
    tables_count: 3,
    fields_count: 10,
    usage_count: 31
  },
  {
    id: '6',
    name: 'Product Performance',
    description: 'Analyze product sales trends and performance metrics',
    category: 'sales',
    tags: ['products', 'sales', 'trends', 'performance'],
    visibility: 'public',
    created_at: '2024-03-01T14:00:00Z',
    updated_at: '2024-03-22T09:15:00Z',
    tables_count: 2,
    fields_count: 9,
    usage_count: 28
  }
])

// Computed properties
const filteredTemplates = computed(() => {
  let filtered = templates.value

  // Category filter
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(template => template.category === selectedCategory.value)
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(template => 
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const options = isMobile.value ? 
    { month: 'short', day: 'numeric' } :
    { year: 'numeric', month: 'short', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

const getCategoryTagType = (category: string) => {
  const types = {
    sales: 'success',
    finance: 'warning',
    marketing: 'danger',
    operations: 'info',
    custom: 'primary'
  }
  return types[category] || 'info'
}

const setCategory = (category: string) => {
  selectedCategory.value = category
}

const createTemplate = () => {
  isEditing.value = false
  templateForm.value = {
    name: '',
    description: '',
    category: '',
    tags: '',
    visibility: 'private'
  }
  templateDialogVisible.value = true
}

const editTemplate = (template: any) => {
  isEditing.value = true
  selectedTemplate.value = template
  templateForm.value = {
    name: template.name,
    description: template.description,
    category: template.category,
    tags: template.tags.join(', '),
    visibility: template.visibility
  }
  templateDialogVisible.value = true
}

const duplicateTemplate = (template: any) => {
  const newTemplate = {
    ...template,
    id: Date.now().toString(),
    name: `${template.name} (Copy)`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    usage_count: 0
  }
  templates.value.push(newTemplate)
  ElMessage.success('Template duplicated successfully')
}

const shareTemplate = (template: any) => {
  // In real app, this would open a sharing dialog
  ElMessage.info('Sharing functionality would be implemented here')
}

const deleteTemplate = async (template: any) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
      'Delete Template',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    const index = templates.value.findIndex(t => t.id === template.id)
    if (index > -1) {
      templates.value.splice(index, 1)
      ElMessage.success('Template deleted successfully')
    }
  } catch {
    // User cancelled
  }
}

const useTemplate = (template: any) => {
  // Navigate to report builder with template data
  router.push({
    path: '/builder',
    query: { template: template.id }
  })
  ElMessage.success(`Using template: ${template.name}`)
}

const previewTemplate = (template: any) => {
  selectedTemplate.value = template
  previewDialogVisible.value = true
}

const saveTemplate = () => {
  if (!templateForm.value.name) {
    ElMessage.warning('Please enter a template name')
    return
  }
  
  if (isEditing.value) {
    // Update existing template
    const index = templates.value.findIndex(t => t.id === selectedTemplate.value?.id)
    if (index > -1) {
      templates.value[index] = {
        ...templates.value[index],
        name: templateForm.value.name,
        description: templateForm.value.description,
        category: templateForm.value.category,
        tags: templateForm.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        visibility: templateForm.value.visibility,
        updated_at: new Date().toISOString()
      }
    }
    ElMessage.success('Template updated successfully')
  } else {
    // Create new template
    const newTemplate = {
      id: Date.now().toString(),
      name: templateForm.value.name,
      description: templateForm.value.description,
      category: templateForm.value.category,
      tags: templateForm.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      visibility: templateForm.value.visibility,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tables_count: 0,
      fields_count: 0,
      usage_count: 0
    }
    templates.value.push(newTemplate)
    ElMessage.success('Template created successfully')
  }
  
  templateDialogVisible.value = false
}

// Initialize
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.templates-view {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
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
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
  flex-wrap: wrap;
  gap: 15px;
}

.btn-text {
  margin-left: 4px;
}

.mobile-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}

.filter-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tag:hover {
  transform: translateY(-1px);
}

.templates-container {
  min-height: 400px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--el-text-color-regular);
}

.empty-icon {
  font-size: 4rem;
  color: var(--el-color-primary);
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--el-text-color-primary);
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 1rem;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.template-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
}

.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.template-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.template-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--el-color-primary), #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
}

.template-info {
  flex: 1;
  min-width: 0;
}

.template-info h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.3;
}

.template-description {
  margin: 0 0 12px 0;
  color: var(--el-text-color-regular);
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.template-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.template-date {
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
}

.template-actions {
  flex-shrink: 0;
}

.template-content {
  padding: 15px 20px;
}

.template-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--el-color-primary);
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-item {
  font-size: 0.8rem;
}

.more-tags {
  background: var(--el-bg-color-page);
  color: var(--el-text-color-secondary);
}

.template-footer {
  padding: 15px 20px;
  border-top: 1px solid var(--el-border-color-light);
  display: flex;
  gap: 10px;
}

.use-btn {
  flex: 1;
}

.preview-btn {
  flex: 1;
}

.template-preview {
  padding: 20px 0;
}

.preview-header {
  margin-bottom: 20px;
  text-align: center;
}

.preview-header h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.preview-header p {
  margin: 0;
  color: var(--el-text-color-regular);
}

.preview-content {
  margin-bottom: 20px;
}

.preview-tags {
  margin-top: 20px;
}

.preview-tags h4 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 600;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.template-dialog,
.preview-dialog {
  margin: 5vh auto;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 15px;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .template-header {
    padding: 15px;
  }
  
  .template-icon {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .template-info h3 {
    font-size: 1rem;
  }
  
  .template-description {
    font-size: 0.85rem;
  }
  
  .template-content {
    padding: 12px 15px;
  }
  
  .template-footer {
    padding: 12px 15px;
    flex-direction: column;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .btn-text {
    display: none;
  }
  
  .template-dialog,
  .preview-dialog {
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.6rem;
  }
  
  .page-header {
    margin-bottom: 20px;
  }
  
  .action-bar {
    padding: 12px;
  }
  
  .mobile-filters {
    padding: 12px;
  }
  
  .templates-grid {
    gap: 12px;
  }
  
  .template-header {
    padding: 12px;
    gap: 12px;
  }
  
  .template-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .template-info h3 {
    font-size: 0.95rem;
  }
  
  .template-description {
    font-size: 0.8rem;
  }
  
  .template-content {
    padding: 10px 12px;
  }
  
  .template-footer {
    padding: 10px 12px;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .empty-state {
    padding: 40px 15px;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .empty-state h3 {
    font-size: 1.3rem;
  }
}

/* Tablet Responsive */
@media (max-width: 1024px) and (min-width: 769px) {
  .templates-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

/* Large screens */
@media (min-width: 1440px) {
  .page-header h1 {
    font-size: 2.2rem;
  }
  
  .templates-grid {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 25px;
  }
  
  .template-card:hover {
    transform: translateY(-6px);
  }
}

/* Extra wide screens */
@media (min-width: 1920px) {
  .templates-view {
    max-width: 1600px;
  }
  
  .templates-grid {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 30px;
  }
}
</style>