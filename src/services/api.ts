import axios from 'axios'
import type { ReportRunRequest, ReportRunResponse } from '@/stores/report'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const reportApi = {
  // Run report
  runReport: async (request: ReportRunRequest): Promise<ReportRunResponse> => {
    const response = await api.post('/reports/run', request)
    return response.data
  },

  // Preview report
  previewReport: async (request: ReportRunRequest): Promise<ReportRunResponse> => {
    const response = await api.post('/reports/preview', request)
    return response.data
  },

  // Get report history
  getReportHistory: async (skip = 0, limit = 50) => {
    const response = await api.get('/reports/history', {
      params: { skip, limit }
    })
    return response.data
  },

  // Get available tables
  getTables: async () => {
    const response = await api.get('/datasources/tables')
    return response.data
  },

  // Get table fields
  getTableFields: async (tableName: string) => {
    const response = await api.get(`/datasources/tables/${tableName}/fields`)
    return response.data
  },

  // Save template
  saveTemplate: async (template: any) => {
    const response = await api.post('/templates', template)
    return response.data
  },

  // Get templates
  getTemplates: async () => {
    const response = await api.get('/templates')
    return response.data
  },

  // Load template
  loadTemplate: async (templateId: string) => {
    const response = await api.get(`/templates/${templateId}`)
    return response.data
  },

  // Delete template
  deleteTemplate: async (templateId: string) => {
    const response = await api.delete(`/templates/${templateId}`)
    return response.data
  }
}

// Mock API for development (when backend is not available)
export const mockApi = {
  runReport: async (request: ReportRunRequest): Promise<ReportRunResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate mock data based on selected fields
    const mockData = []
    const columns = request.query_config.fields.map(f => f.alias || f.column)
    
    for (let i = 1; i <= 10; i++) {
      const row: any = {}
      columns.forEach((col, index) => {
        if (col.includes('id')) {
          row[col] = i
        } else if (col.includes('name')) {
          row[col] = `Sample ${col} ${i}`
        } else if (col.includes('amount') || col.includes('price')) {
          row[col] = Math.floor(Math.random() * 10000) / 100
        } else if (col.includes('date') || col.includes('created')) {
          row[col] = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        } else if (col.includes('status')) {
          row[col] = ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)]
        } else {
          row[col] = `Value ${i}-${index}`
        }
      })
      mockData.push(row)
    }
    
    return {
      success: true,
      data: mockData,
      columns,
      row_count: mockData.length,
      execution_time: 0.5,
      message: 'Mock data generated successfully'
    }
  },

  previewReport: async (request: ReportRunRequest): Promise<ReportRunResponse> => {
    // Same as runReport but with limited data
    const result = await mockApi.runReport(request)
    result.data = result.data?.slice(0, 5) // Limit to 5 rows for preview
    result.row_count = result.data?.length || 0
    return result
  },

  getTables: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      { id: '1', name: 'orders', alias: 'o', schema: 'public' },
      { id: '2', name: 'customers', alias: 'c', schema: 'public' },
      { id: '3', name: 'products', alias: 'p', schema: 'public' },
      { id: '4', name: 'order_items', alias: 'oi', schema: 'public' },
      { id: '5', name: 'categories', alias: 'cat', schema: 'public' }
    ]
  },

  getTableFields: async (tableName: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const fieldsMap: Record<string, string[]> = {
      orders: ['id', 'order_number', 'customer_id', 'total_amount', 'created_at', 'status'],
      customers: ['id', 'name', 'email', 'phone', 'address', 'created_at'],
      products: ['id', 'name', 'sku', 'price', 'category_id', 'stock_quantity'],
      order_items: ['id', 'order_id', 'product_id', 'quantity', 'unit_price', 'total_price'],
      categories: ['id', 'name', 'description', 'parent_id']
    }
    return fieldsMap[tableName] || []
  }
}

// Export the appropriate API based on environment
export const apiService = import.meta.env.VITE_USE_MOCK_API === 'true' ? mockApi : reportApi

export default api
