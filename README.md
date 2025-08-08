# FlexiReport - Advanced Report Builder

A modern Vue 3 application for building and managing database reports with a drag-and-drop interface.

## Features

- 🎯 **Visual Report Builder**: Drag and drop interface for creating reports without SQL knowledge
- 📊 **Multiple Export Formats**: Export reports in Excel, CSV, PDF, and JSON formats
- 📋 **Template Management**: Save and share report templates with your team
- 🔍 **Advanced Filtering**: Powerful filtering and sorting capabilities
- 📈 **Real-time Preview**: Preview reports before generating final output
- 🎨 **Modern UI**: Built with Element Plus for a beautiful and responsive interface
- 🌙 **Dark/Light Theme**: Toggle between dark and light themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Vue 3 + TypeScript
- **State Management**: Pinia
- **UI Framework**: Element Plus
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Router**: Vue Router 4

## Project Structure

```
src/
├── components/          # Reusable Vue components
├── views/              # Page components
│   ├── HomeView.vue    # Dashboard
│   ├── ReportBuilderView.vue  # Main report builder
│   ├── TemplatesView.vue      # Template management
│   └── ReportHistoryView.vue  # Report history
├── stores/             # Pinia stores
│   └── report.ts       # Report state management
├── services/           # API services
│   └── api.ts          # HTTP client and API calls
├── router/             # Vue Router configuration
├── assets/             # Static assets
└── main.ts             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd report_system_vue
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_USE_MOCK_API=true
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

### Creating a Report

1. Navigate to the **Report Builder** page
2. Drag tables from the left panel to the canvas
3. Select fields by clicking on them
4. Configure filters and sorting in the right panel
5. Click **Preview** to see the results
6. Click **Run Report** to generate the final report
7. Export in your preferred format

### Managing Templates

1. Go to the **Templates** page
2. Create new templates from existing reports
3. Edit, duplicate, or delete templates
4. Share templates with your team
5. Use templates to quickly create similar reports

### Viewing History

1. Visit the **Report History** page
2. Filter reports by status, format, or date range
3. Download completed reports
4. View detailed information about each report execution

## API Integration

The application is designed to work with a FastAPI backend. The API endpoints include:

- `POST /api/v1/reports/run` - Execute a report
- `POST /api/v1/reports/preview` - Preview a report
- `GET /api/v1/reports/history` - Get report history
- `GET /api/v1/datasources/tables` - Get available tables
- `POST /api/v1/templates` - Save templates
- `GET /api/v1/templates` - Get templates

### Mock API

For development, the application includes a mock API that simulates backend responses. Enable it by setting:

```env
VITE_USE_MOCK_API=true
```

## Customization

### Adding New Data Sources

1. Update the `availableTables` array in `src/stores/report.ts`
2. Add corresponding fields in the `tableFields` object
3. Update the mock API in `src/services/api.ts`

### Styling

The application uses Element Plus with custom CSS variables. You can customize the theme by modifying:

- CSS variables in component styles
- Element Plus theme configuration
- Global styles in `src/assets/main.css`

### Adding New Export Formats

1. Update the export format options in the UI
2. Add corresponding API endpoints
3. Update the export logic in the report builder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
