# 🚀 Quick Start Guide - FlexiReport Vue 3

## 📋 Yêu cầu hệ thống

- **Node.js**: 18.x hoặc cao hơn
- **npm**: 8.x hoặc cao hơn
- **Git**: Để clone repository

## ⚡ Cài đặt nhanh

### 1. Clone và cài đặt
```bash
# Clone repository
git clone <repository-url>
cd report_system_vue

# Cài đặt dependencies
npm install
```

### 2. Cấu hình môi trường
```bash
# Tạo file .env
echo "VITE_API_BASE_URL=http://localhost:8000/api/v1" > .env
echo "VITE_USE_MOCK_API=true" >> .env
```

### 3. Chạy ứng dụng
```bash
# Development server
npm run dev

# Hoặc build production
npm run build
npm run preview
```

## 🎯 Sử dụng nhanh

### 1. Dashboard
- Truy cập: `http://localhost:3000`
- Xem thống kê và quick actions
- Click "Create New Report" để bắt đầu

### 2. Report Builder
- **Kéo thả bảng**: Từ panel bên trái vào canvas
- **Chọn trường**: Click vào các field tags
- **Cấu hình**: Thêm filters, sorting trong panel bên phải
- **Preview**: Click "Preview" để xem kết quả
- **Export**: Click "Export" để tải xuống

### 3. Templates
- **Tạo template**: Từ Report Builder, click "Save Template"
- **Quản lý**: Vào trang Templates để xem, sửa, xóa
- **Sử dụng**: Click "Use Template" để load

### 4. History
- **Xem lịch sử**: Tất cả báo cáo đã tạo
- **Filter**: Lọc theo status, format, date
- **Download**: Tải xuống báo cáo đã hoàn thành

## 🔧 Troubleshooting

### Lỗi thường gặp

#### 1. Node version không tương thích
```bash
# Kiểm tra version
node --version

# Nếu < 18, cập nhật Node.js
nvm install 18
nvm use 18
```

#### 2. Port 3000 đã được sử dụng
```bash
# Kill process trên port 3000
lsof -ti:3000 | xargs kill -9

# Hoặc sử dụng port khác
npm run dev -- --port 3001
```

#### 3. Build lỗi
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### 4. API không kết nối được
```bash
# Kiểm tra backend
curl http://localhost:8000/api/v1/health

# Sử dụng mock API
echo "VITE_USE_MOCK_API=true" > .env
```

## 📱 Responsive Testing

### Desktop (1200px+)
- Layout 3 cột đầy đủ
- Drag & drop hoạt động tốt
- Tất cả tính năng có sẵn

### Tablet (768px - 1200px)
- Layout 2 cột
- Touch-friendly controls
- Responsive navigation

### Mobile (< 768px)
- Layout 1 cột
- Touch gestures
- Optimized for mobile

## 🎨 Customization

### Thay đổi theme
```css
/* src/assets/main.css */
:root {
  --el-color-primary: #your-color;
  --el-color-success: #your-color;
  --el-color-warning: #your-color;
  --el-color-danger: #your-color;
}
```

### Thêm data sources
```typescript
// src/stores/report.ts
const availableTables = ref([
  // Thêm bảng mới
  { id: '6', name: 'new_table', alias: 'nt', schema: 'public' }
])

const tableFields = ref({
  // Thêm fields cho bảng mới
  new_table: ['id', 'name', 'description']
})
```

### Tùy chỉnh API
```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: 'your-api-url',
  timeout: 30000
})
```

## 🔍 Debug

### Vue DevTools
```bash
# Cài đặt Vue DevTools extension
# Chrome: Vue.js devtools
# Firefox: Vue.js devtools
```

### Console Logs
```javascript
// Trong component
console.log('Debug info:', data)

// Trong store
console.log('Store state:', state)
```

### Network Tab
- Mở DevTools > Network
- Xem API calls
- Kiểm tra request/response

## 📊 Performance

### Build Optimization
```bash
# Analyze bundle
npm run build -- --analyze

# Production build
npm run build -- --mode production
```

### Runtime Performance
- Lazy load components
- Virtual scrolling cho large datasets
- Debounce API calls

## 🚀 Deployment

### Netlify
```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build image
docker build -t flexireport .

# Run container
docker run -p 3000:3000 flexireport
```

## 📞 Support

### Documentation
- `README.md` - Setup chi tiết
- `API_INTEGRATION.md` - API documentation
- `PROJECT_SUMMARY.md` - Project overview

### Issues
- GitHub Issues
- Stack Overflow
- Vue.js Discord

---

**Happy Coding! 🎉**

*FlexiReport Vue 3 - Modern Report Builder*
