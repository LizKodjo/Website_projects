# COVID-19 Data Visualization Dashboard

A comprehensive, interactive dashboard for tracking and analyzing global COVID-19 statistics with advanced data visualization and export capabilities.

![Dashboard](image.png)

## 🚀 Live Demo

[Add your live demo link here]

## 📁 Repository

[DataVisualiser](https://github.com/LizKodjo/Website_projects/tree/main/DataVisualiser)

## 🎯 Features

### 📊 Data Visualization

- **Interactive Charts**: Line charts for historical trends, bar charts for country comparisons
- **World Map**: Choropleth map with color-coded case intensity
- **Real-time Data**: Live data from disease.sh COVID-19 API
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### 🔧 Advanced Functionality

- **Multi-format Data Export**: CSV, Excel (XLSX), and PNG exports
- **Chart Export**: Download visualizations as high-quality images
- **Country Drill-down**: Click countries on map to view detailed data
- **Theme Support**: Light/dark mode toggle
- **Cross-filtering**: Interactive data exploration

### 💼 Professional Features

- **Error Handling**: Graceful error states and retry mechanisms
- **Loading States**: Smooth loading animations and user feedback
- **Accessibility**: Screen reader support and keyboard navigation
- **Performance**: Optimized API calls and efficient re-renders

## 🛠️ Tech Stack

### Frontend

- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Composable charting library built on React
- **React Simple Maps**: Geographic visualization library

### Data & APIs

- **disease.sh COVID-19 API**: Real-time pandemic data
- **XLSX**: Excel file generation and parsing
- **D3-scale**: Color scaling for data visualization

### Development Tools

- **ESLint**: Code linting and quality
- **PostCSS**: CSS processing
- **Git**: Version control

## 📈 Key Technical Achievements

### Performance Optimization

- Implemented efficient data fetching with error boundaries
- Used React memo and useCallback for optimized re-renders
- Lazy loading for map components and large datasets

### Data Processing

- Real-time API data transformation and normalization
- Custom formatting utilities for international number display
- Efficient data structures for large historical datasets

### User Experience

- Implemented comprehensive loading states and error handling
- Created intuitive navigation and interactive controls
- Built responsive design that works across all devices

## 🚀 Installation & Setup

```bash
# Clone repository
git clone [your-repo-link]
cd covid-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📊 API Integration

The dashboard integrates with multiple endpoints from the disease.sh COVID-19 API:

- **Global Statistics:** `/v3/covid-19/all`
- **Country Data:** `/v3/covid-19/countries`
- **Historical Data:** `/v3/covid-19/historical`
- **Country-specific Historical:** `/v3/covid-19/historical/{country}`

## 🎨 UI/UX Features

- **Dark/Light Theme:** System-aware theme switching
- **Responsive Grid:** CSS Grid and Flexbox layouts
- **Interactive Elements:** Hover effects, smooth transitions
- **Accessible Design:** ARIA labels and keyboard navigation

## 🔮 Future Enhancements

- Real-time notifications for significant data changes
- Advanced filtering and custom date ranges
- Data forecasting and predictive analytics
- Mobile app version using React Native
- User accounts for saving preferences and bookmarks

## 📝 License

MIT License - feel free to use this project for learning and development purposes.

## 👩‍💻 Developer

**Elizabeth Kodjo**

- **Portfolio**
- **LinkedIn**
- [GitHub](https://github.com/LizKodjo/Website_projects)
