# CafeVerse Frontend

This is the frontend application for CafeVerse, a cafe management system.

## Recent Changes

### Dynamic Menu Data (Latest Update)
- **Removed static menu data**: The Menu component no longer uses hardcoded menu items
- **Added API integration**: Menu items are now fetched dynamically from the Django backend
- **Maintained UI consistency**: All styling, layout, and functionality remain exactly the same
- **Added error handling**: Includes loading states and error messages for better user experience

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. **Important**: Make sure the Django backend is running at `http://127.0.0.1:8000` before testing the menu functionality.

## Backend Requirements

The frontend now requires the Django backend to be running with the following:
- API endpoint: `http://127.0.0.1:8000/api/menu/`
- CORS properly configured (already done in backend settings)
- Menu data populated in the database

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dynamic Menu**: Real-time menu data from database
- **Search & Filter**: Search by name and filter by price
- **Shopping Cart**: Add/remove items with quantity management
- **Modern UI**: Beautiful, intuitive interface with smooth animations

## Technology Stack

- React 19
- Vite
- Tailwind CSS
- Axios for API calls
- React Router for navigation
