<template>
  <div class="templates-view">
    <div class="page-header">
      <h1>Template Manager</h1>
      <p>Manage and share report templates</p>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <el-button type="primary" @click="createTemplate">
        <el-icon><Plus /></el-icon>
        Create Template
      </el-button>
      
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="Search templates..."
          prefix-icon="Search"
          clearable
          style="width: 300px"
        />
      </div>
    </div>

    <!-- Templates Grid -->
    <div class="templates-grid">
      <el-card
        v-for="template in filteredTemplates"
        :key="template.id"
        class="template-card"
        :body-style="{ padding: '0px' }"
      >
        <div class="template-header">
          <div class="template-icon">
            <el-icon><Files /></el-icon>
          </div>
          <div class="template-info">
            <h3>{{ template.name }}</h3>
            <p>{{ template.description }}</p>
            <div class="template-meta">
              <el-tag size="small" type="info">{{ template.category }}</el-tag>
              <span class="template-date">Updated {{ formatDate(template.updated_at) }}</span>
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
              <span class="stat-label">Tables</span>
              <span class="stat-value">{{ template.tables_count }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Fields</span>
              <span class="stat-value">{{ template.fields_count }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Usage</span>
              <span class="stat-value">{{ template.usage_count }}</span>
            </div>
          </div>
          
          <div class="template-tags">
            <el-tag
              v-for="tag in template.tags"
              :key="tag"
              size="small"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        
        <div class="template-footer">
          <el-button type="primary" @click="useTemplate(template)">
            <el-icon><VideoPlay /></el-icon>
            Use Template
          </el-button>
          <el-button @click="previewTemplate(template)">
            <el-icon><View /></el-icon>
            Preview
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- Create/Edit Template Dialog -->
    <el-dialog
      v-model="templateDialogVisible"
      :title="isEditing ? 'Edit Template' : 'Create Template'"
      width="600px"
    >
      <el-form :model="templateForm" label-width="100px">
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
          <el-select v-model="templateForm.category" placeholder="Select category">
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
        <el-button @click="templateDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveTemplate">
          {{ isEditing ? 'Update' : 'Create' }} Template
        </el-button>
      </template>
    </el-dialog>

    <!-- Preview Dialog -->
    <el-dialog v-model="previewDialogVisible" title="Template Preview" width="800px">
      <div v-if="selectedTemplate" class="template-preview">
        <div class="preview-header">
          <h3>{{ selectedTemplate.name }}</h3>
          <p>{{ selectedTemplate.description }}</p>
        </div>
        
        <div class="preview-content">
          <el-descriptions title="Template Details" :column="2" border>
            <el-descriptions-item label="Category">
              {{ selectedTemplate.category }}
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
              {{ selectedTemplate.visibility }}
            </el-descriptions-item>
          </el-descriptions>
          
          <div class="preview-tags">
            <h4>Tags:</h4>
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
      
      <template #footer>
        <el-button @click="previewDialogVisible = false">Close</el-button>
        <el-button type="primary" @click="useTemplate(selectedTemplate)">
          Use This Template
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const templateForm = ref({
  name: '',
  description: '',
  category: '',
  tags: '',
  visibility: 'private'
})

// Mock templates data
const templates = ref([
  {
    id: '1',
    name: 'Sales Report - Monthly',
    description: 'Comprehensive monthly sales analysis with customer breakdown',
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
    description: 'Detailed customer behavior and demographics analysis',
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
    description: 'Stock levels and inventory movement tracking',
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
    description: 'Quarterly financial performance and metrics',
    category: 'finance',
    tags: ['finance', 'quarterly', 'performance', 'metrics'],
    visibility: 'private',
    created_at: '2024-03-05T08:00:00Z',
    updated_at: '2024-03-18T10:15:00Z',
    tables_count: 4,
    fields_count: 15,
    usage_count: 12
  }
])

// Computed properties
const filteredTemplates = computed(() => {
  if (!searchQuery.value) {
    return templates.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return templates.value.filter(template => 
    template.name.toLowerCase().includes(query) ||
    template.description.toLowerCase().includes(query) ||
    template.tags.some(tag => tag.toLowerCase().includes(query))
  )
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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
</script>

<style scoped>
.templates-view {
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

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.template-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  border-radius: 8px;
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
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.template-info p {
  margin: 0 0 10px 0;
  color: var(--el-text-color-regular);
  font-size: 0.9rem;
  line-height: 1.4;
}

.template-meta {
  display: flex;
  align-items: center;
  gap: 10px;
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
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
  margin-bottom: 2px;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag-item {
  font-size: 0.8rem;
}

.template-footer {
  padding: 15px 20px;
  border-top: 1px solid var(--el-border-color-light);
  display: flex;
  gap: 10px;
}

.template-preview {
  padding: 20px;
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

@media (max-width: 768px) {
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .search-bar .el-input {
    width: 100%;
  }
}
</style>
