# API Integration Guide

## Overview

This document provides detailed instructions on how to integrate the Vue 3 frontend with the FastAPI backend for the FlexiReport system.

## Backend API Endpoints

### 1. Report Execution

#### Run Report
```http
POST /api/v1/reports/run
Content-Type: application/json
Authorization: Bearer <token>

{
  "query_config": {
    "datasource_id": "default",
    "tables": [
      {
        "id": "1",
        "name": "orders",
        "alias": "o",
        "schema": "public"
      }
    ],
    "fields": [
      {
        "table_alias": "o",
        "column": "id",
        "alias": "order_id",
        "visible": true
      }
    ],
    "filters": [],
    "order_by": [],
    "limit": 1000
  },
  "export_format": "excel",
  "save_as_template": false
}
```

#### Preview Report
```http
POST /api/v1/reports/preview
Content-Type: application/json
Authorization: Bearer <token>

{
  "query_config": {
    // Same structure as run report
  }
}
```

### 2. Data Sources

#### Get Available Tables
```http
GET /api/v1/datasources/tables
Authorization: Bearer <token>
```

Response:
```json
[
  {
    "id": "1",
    "name": "orders",
    "alias": "o",
    "schema": "public"
  }
]
```

#### Get Table Fields
```http
GET /api/v1/datasources/tables/{table_name}/fields
Authorization: Bearer <token>
```

Response:
```json
[
  "id",
  "order_number",
  "customer_id",
  "total_amount",
  "created_at",
  "status"
]
```

### 3. Templates

#### Save Template
```http
POST /api/v1/templates
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Sales Report",
  "description": "Monthly sales analysis",
  "query_config": {
    // Report configuration
  },
  "tags": ["sales", "monthly"],
  "visibility": "team"
}
```

#### Get Templates
```http
GET /api/v1/templates
Authorization: Bearer <token>
```

#### Load Template
```http
GET /api/v1/templates/{template_id}
Authorization: Bearer <token>
```

### 4. Report History

#### Get Report History
```http
GET /api/v1/reports/history?skip=0&limit=50
Authorization: Bearer <token>
```

## Frontend Integration

### 1. API Service Configuration

The frontend uses Axios for HTTP requests. Configure the API service in `src/services/api.ts`:

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Development Settings
VITE_USE_MOCK_API=false

# Authentication
VITE_AUTH_ENABLED=true
```

### 3. State Management

The Pinia store (`src/stores/report.ts`) manages the application state:

```typescript
import { defineStore } from 'pinia'
import { apiService } from '@/services/api'

export const useReportStore = defineStore('report', () => {
  // State
  const selectedTables = ref([])
  const selectedFields = ref([])
  const isLoading = ref(false)
  
  // Actions
  const runReport = async (config) => {
    try {
      setLoading(true)
      const response = await apiService.runReport(config)
      return response
    } catch (error) {
      console.error('Error running report:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  return {
    selectedTables,
    selectedFields,
    isLoading,
    runReport
  }
})
```

### 4. Component Integration

Example of how to use the API in a Vue component:

```vue
<template>
  <div>
    <el-button @click="generateReport" :loading="isLoading">
      Generate Report
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useReportStore } from '@/stores/report'
import { apiService } from '@/services/api'

const reportStore = useReportStore()
const { isLoading } = storeToRefs(reportStore)

const generateReport = async () => {
  try {
    const config = reportStore.queryConfiguration
    const response = await apiService.runReport(config)
    
    if (response.success) {
      ElMessage.success('Report generated successfully')
      // Handle success
    } else {
      ElMessage.error(response.message || 'Failed to generate report')
    }
  } catch (error) {
    ElMessage.error('Error generating report')
    console.error(error)
  }
}
</script>
```

## Error Handling

### 1. HTTP Error Interceptor

Add error handling in the API service:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      router.push('/login')
    } else if (error.response?.status === 403) {
      ElMessage.error('Access denied')
    } else if (error.response?.status >= 500) {
      ElMessage.error('Server error occurred')
    }
    return Promise.reject(error)
  }
)
```

### 2. Component Error Handling

```typescript
const handleApiError = (error: any) => {
  if (error.response?.data?.detail) {
    ElMessage.error(error.response.data.detail)
  } else if (error.message) {
    ElMessage.error(error.message)
  } else {
    ElMessage.error('An unexpected error occurred')
  }
}
```

## Authentication

### 1. Token Management

```typescript
// Store token after login
const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  localStorage.setItem('auth_token', response.data.access_token)
}

// Remove token on logout
const logout = () => {
  localStorage.removeItem('auth_token')
  router.push('/login')
}
```

### 2. Route Guards

```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})
```

## CORS Configuration

Ensure your FastAPI backend has CORS properly configured:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Development vs Production

### Development
- Use mock API for testing: `VITE_USE_MOCK_API=true`
- Local backend: `VITE_API_BASE_URL=http://localhost:8000/api/v1`
- Enable hot reload and debugging

### Production
- Disable mock API: `VITE_USE_MOCK_API=false`
- Production backend URL
- Enable error tracking and monitoring
- Use HTTPS for all API calls

## Testing API Integration

### 1. Unit Tests

```typescript
// tests/api.test.ts
import { apiService } from '@/services/api'

describe('API Service', () => {
  it('should run report successfully', async () => {
    const mockConfig = {
      query_config: {
        tables: [],
        fields: []
      }
    }
    
    const response = await apiService.runReport(mockConfig)
    expect(response.success).toBe(true)
  })
})
```

### 2. Integration Tests

```typescript
// tests/integration/report-builder.test.ts
import { mount } from '@vue/test-utils'
import ReportBuilderView from '@/views/ReportBuilderView.vue'

describe('Report Builder Integration', () => {
  it('should generate report when form is submitted', async () => {
    const wrapper = mount(ReportBuilderView)
    
    // Simulate user actions
    await wrapper.find('[data-test="run-report"]').trigger('click')
    
    // Assert API call was made
    expect(mockApiService.runReport).toHaveBeenCalled()
  })
})
```

## Performance Optimization

### 1. Request Caching

```typescript
const cache = new Map()

const getTablesWithCache = async () => {
  if (cache.has('tables')) {
    return cache.get('tables')
  }
  
  const response = await apiService.getTables()
  cache.set('tables', response)
  return response
}
```

### 2. Debounced API Calls

```typescript
import { debounce } from 'lodash-es'

const debouncedSearch = debounce(async (query) => {
  const results = await apiService.searchReports(query)
  // Update UI
}, 300)
```

## Security Considerations

1. **Token Storage**: Use secure storage for authentication tokens
2. **Input Validation**: Validate all user inputs before sending to API
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for API calls
5. **Error Messages**: Don't expose sensitive information in error messages

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS configuration
2. **Authentication Errors**: Verify token format and expiration
3. **Network Errors**: Check API URL and network connectivity
4. **Data Format Errors**: Ensure request/response format matches API specification

### Debug Tools

1. **Browser DevTools**: Network tab for API calls
2. **Vue DevTools**: Component state inspection
3. **API Documentation**: Swagger UI at `/docs` endpoint
4. **Logging**: Enable detailed logging in development
