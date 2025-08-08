import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

// Types based on backend schemas
export interface QueryTable {
  id: string
  name: string
  alias: string
  schema?: string
}

export interface QueryField {
  table_alias: string
  column: string
  alias?: string
  aggregation?: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'GROUP_CONCAT'
  visible: boolean
}

export interface QueryFilter {
  table_alias: string
  column: string
  operator: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN' | 'IS NULL' | 'IS NOT NULL' | 'BETWEEN'
  value: any
  data_type: string
}

export interface QuerySort {
  field: string
  direction: 'ASC' | 'DESC'
}

export interface QueryJoin {
  left_table: string
  right_table: string
  join_type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL'
  condition: string
}

export interface QueryConfiguration {
  datasource_id: string
  tables: QueryTable[]
  joins: QueryJoin[]
  fields: QueryField[]
  filters: QueryFilter[]
  group_by: string[]
  order_by: QuerySort[]
  limit?: number
}

export interface ReportRunRequest {
  query_config: QueryConfiguration
  export_format?: string
  template_name?: string
  save_as_template: boolean
}

export interface ReportRunResponse {
  success: boolean
  data?: any[]
  columns?: string[]
  row_count: number
  execution_time: number
  export_file_url?: string
  message?: string
}

export const useReportStore = defineStore('report', () => {
  // State
  const selectedTables: Ref<QueryTable[]> = ref([])
  const selectedFields: Ref<QueryField[]> = ref([])
  const filters: Ref<QueryFilter[]> = ref([])
  const sorts: Ref<QuerySort[]> = ref([])
  const joins: Ref<QueryJoin[]> = ref([])
  const reportData: Ref<any[]> = ref([])
  const reportColumns: Ref<string[]> = ref([])
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const currentTemplate: Ref<string> = ref('')
  const datasourceId: Ref<string> = ref('default')

  // Available tables (mock data - in real app this would come from API)
  const availableTables: Ref<QueryTable[]> = ref([
    { id: '1', name: 'orders', alias: 'o', schema: 'public' },
    { id: '2', name: 'customers', alias: 'c', schema: 'public' },
    { id: '3', name: 'products', alias: 'p', schema: 'public' },
    { id: '4', name: 'order_items', alias: 'oi', schema: 'public' },
    { id: '5', name: 'categories', alias: 'cat', schema: 'public' }
  ])

  // Available fields for each table (mock data)
  const tableFields: Ref<Record<string, string[]>> = ref({
    orders: ['id', 'order_number', 'customer_id', 'total_amount', 'created_at', 'status'],
    customers: ['id', 'name', 'email', 'phone', 'address', 'created_at'],
    products: ['id', 'name', 'sku', 'price', 'category_id', 'stock_quantity'],
    order_items: ['id', 'order_id', 'product_id', 'quantity', 'unit_price', 'total_price'],
    categories: ['id', 'name', 'description', 'parent_id']
  })

  // Getters
  const hasSelectedTables = computed(() => selectedTables.value.length > 0)
  const hasSelectedFields = computed(() => selectedFields.value.length > 0)
  const canGenerateReport = computed(() => hasSelectedTables.value && hasSelectedFields.value)
  const queryConfiguration = computed((): QueryConfiguration => ({
    datasource_id: datasourceId.value,
    tables: selectedTables.value,
    joins: joins.value,
    fields: selectedFields.value,
    filters: filters.value,
    group_by: [],
    order_by: sorts.value,
    limit: 1000
  }))

  // Actions
  const addTable = (table: QueryTable) => {
    if (!selectedTables.value.find(t => t.id === table.id)) {
      selectedTables.value.push(table)
      // Auto-add some common fields
      const commonFields = tableFields.value[table.name] || []
      commonFields.slice(0, 3).forEach(field => {
        addField({
          table_alias: table.alias,
          column: field,
          alias: `${table.alias}_${field}`,
          visible: true
        })
      })
    }
  }

  const removeTable = (tableId: string) => {
    const tableIndex = selectedTables.value.findIndex(t => t.id === tableId)
    if (tableIndex > -1) {
      const table = selectedTables.value[tableIndex]
      selectedTables.value.splice(tableIndex, 1)
      
      // Remove related fields
      selectedFields.value = selectedFields.value.filter(f => f.table_alias !== table.alias)
      
      // Remove related filters
      filters.value = filters.value.filter(f => f.table_alias !== table.alias)
      
      // Remove related sorts
      sorts.value = sorts.value.filter(s => !s.field.startsWith(table.alias))
      
      // Remove related joins
      joins.value = joins.value.filter(j => j.left_table !== table.alias && j.right_table !== table.alias)
    }
  }

  const addField = (field: QueryField) => {
    if (!selectedFields.value.find(f => f.table_alias === field.table_alias && f.column === field.column)) {
      selectedFields.value.push(field)
    }
  }

  const removeField = (tableAlias: string, column: string) => {
    const fieldIndex = selectedFields.value.findIndex(f => f.table_alias === tableAlias && f.column === column)
    if (fieldIndex > -1) {
      selectedFields.value.splice(fieldIndex, 1)
    }
  }

  const addFilter = (filter: QueryFilter) => {
    filters.value.push(filter)
  }

  const removeFilter = (index: number) => {
    if (index >= 0 && index < filters.value.length) {
      filters.value.splice(index, 1)
    }
  }

  const addSort = (sort: QuerySort) => {
    // Remove existing sort for the same field
    sorts.value = sorts.value.filter(s => s.field !== sort.field)
    sorts.value.push(sort)
  }

  const removeSort = (field: string) => {
    sorts.value = sorts.value.filter(s => s.field !== field)
  }

  const addJoin = (join: QueryJoin) => {
    joins.value.push(join)
  }

  const removeJoin = (index: number) => {
    if (index >= 0 && index < joins.value.length) {
      joins.value.splice(index, 1)
    }
  }

  const clearReport = () => {
    selectedTables.value = []
    selectedFields.value = []
    filters.value = []
    sorts.value = []
    joins.value = []
    reportData.value = []
    reportColumns.value = []
    error.value = null
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const setReportData = (data: any[], columns: string[]) => {
    reportData.value = data
    reportColumns.value = columns
  }

  const saveAsTemplate = (name: string) => {
    currentTemplate.value = name
    // In real app, this would save to backend
    console.log('Saving template:', name, queryConfiguration.value)
  }

  const loadTemplate = (templateName: string) => {
    // In real app, this would load from backend
    console.log('Loading template:', templateName)
  }

  return {
    // State
    selectedTables,
    selectedFields,
    filters,
    sorts,
    joins,
    reportData,
    reportColumns,
    isLoading,
    error,
    currentTemplate,
    datasourceId,
    availableTables,
    tableFields,

    // Getters
    hasSelectedTables,
    hasSelectedFields,
    canGenerateReport,
    queryConfiguration,

    // Actions
    addTable,
    removeTable,
    addField,
    removeField,
    addFilter,
    removeFilter,
    addSort,
    removeSort,
    addJoin,
    removeJoin,
    clearReport,
    setLoading,
    setError,
    setReportData,
    saveAsTemplate,
    loadTemplate
  }
})
