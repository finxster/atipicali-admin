# AtipicALI Admin Panel

A modern, bilingual admin panel built with Vue 3, featuring a clean design, robust authentication, and internationalization support.

![Vue 3](https://img.shields.io/badge/Vue-3.4.21-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1.5-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Build for Production](#build-for-production)
- [API Integration](#api-integration)
- [Internationalization](#internationalization)
- [Authentication Flow](#authentication-flow)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

AtipicALI Admin Panel is a production-ready administrative interface designed for modern web applications. It provides a complete authentication system, intuitive navigation, and a responsive layout that works seamlessly across desktop and tablet devices.

The application is built with a focus on developer experience, featuring:
- **Type-safe** state management with Pinia
- **Composition API** for clean, reusable logic
- **Internationalization** out of the box
- **Environment-based** configuration
- **Protected routes** with navigation guards

## ✨ Features

### Authentication
- ✅ User login with email and password
- ✅ User registration with password confirmation
- ✅ JWT token management
- ✅ Automatic token injection in API requests
- ✅ Session persistence via localStorage
- ✅ Automatic logout on 401 (unauthorized) responses
- ✅ Protected route guards

### User Interface
- ✅ Clean, modern design with AtipicALI branding
- ✅ Responsive layout (desktop & tablet optimized)
- ✅ Top navigation bar with user info
- ✅ Collapsible sidebar navigation
- ✅ Dashboard with statistics cards
- ✅ Gradient backgrounds on auth pages
- ✅ Smooth transitions and hover effects

### Internationalization
- ✅ English and Portuguese support
- ✅ Automatic browser language detection
- ✅ Language switcher component
- ✅ Persistent language selection
- ✅ Easy to add more languages

### Developer Experience
- ✅ Hot module replacement (HMR)
- ✅ Fast build times with Vite
- ✅ Component-based architecture
- ✅ Centralized API configuration
- ✅ Environment variable support
- ✅ Clean code structure

## 🛠 Tech Stack

### Core Framework
- **[Vue 3](https://vuejs.org/)** (v3.4.21) - Progressive JavaScript framework
- **[Vite](https://vitejs.dev/)** (v5.1.5) - Next generation frontend tooling
- **[Vue Router](https://router.vuejs.org/)** (v4.3.0) - Official router for Vue.js

### State Management
- **[Pinia](https://pinia.vuejs.org/)** (v2.1.7) - Intuitive, type-safe state management

### Styling
- **[TailwindCSS](https://tailwindcss.com/)** (v3.4.1) - Utility-first CSS framework
- **[PostCSS](https://postcss.org/)** (v8.4.35) - CSS transformation tool
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** (v10.4.18) - PostCSS plugin

### HTTP Client
- **[Axios](https://axios-http.com/)** (v1.6.7) - Promise-based HTTP client

### Internationalization
- **[Vue I18n](https://vue-i18n.intlify.dev/)** (v9.10.1) - Internationalization plugin

## 📁 Project Structure

```
atipicali-admin/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images, fonts, etc.
│   ├── components/              # Reusable Vue components
│   │   ├── layout/
│   │   │   ├── Navbar.vue      # Top navigation bar
│   │   │   └── Sidebar.vue     # Side navigation menu
│   │   └── LanguageSwitcher.vue # Language toggle component
│   ├── views/                   # Page-level components
│   │   ├── LoginView.vue       # Login page
│   │   ├── RegisterView.vue    # Registration page
│   │   └── DashboardView.vue   # Main dashboard
│   ├── router/
│   │   └── index.js            # Vue Router configuration
│   ├── store/
│   │   └── auth.js             # Pinia authentication store
│   ├── locales/                 # Translation files
│   │   ├── en.json             # English translations
│   │   └── pt.json             # Portuguese translations
│   ├── utils/
│   │   └── axios.js            # Axios configuration & interceptors
│   ├── App.vue                  # Root component
│   ├── main.js                  # Application entry point
│   └── style.css                # Global styles & Tailwind imports
├── .env.development             # Development environment variables
├── .env.production              # Production environment variables
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.js               # Vite configuration
└── README.md                    # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** (v7.x or higher) - Comes with Node.js

Check your versions:
```bash
node --version
npm --version
```

## 🚀 Installation

### Option 1: Using the Setup Script

1. **Save the setup script** as `setup-atipicali.sh`

2. **Make it executable:**
```bash
chmod +x setup-atipicali.sh
```

3. **Run the script:**
```bash
./setup-atipicali.sh
```

The script will create the project structure, generate all files, and install dependencies automatically.

### Option 2: Manual Installation

1. **Clone or create the project directory:**
```bash
mkdir atipicali-admin
cd atipicali-admin
```

2. **Install dependencies:**
```bash
npm install
```

3. **Copy all project files** from the provided structure into their respective locations.

## ⚙️ Environment Configuration

The application uses environment variables to configure the API base URL for different environments.

### Development Environment

Create or modify `.env.development`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

This is used when running `npm run dev`.

### Production Environment

Create or modify `.env.production`:
```env
VITE_API_BASE_URL=https://fly.oieusouofinx.dev
```

This is used when running `npm run build`.

### Accessing Environment Variables

In your code, access environment variables using:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

**Note:** All environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

## 🎮 Running the Application

### Development Server

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at:
```
http://localhost:5173
```

Features in development mode:
- Hot Module Replacement (HMR)
- Detailed error messages
- Vue DevTools support
- Source maps enabled

### Development with Custom Port

```bash
npm run dev -- --port 3000
```

### Development with Network Access

```bash
npm run dev -- --host
```

This allows you to access the app from other devices on your network.

## 🏗 Build for Production

### Create Production Build

```bash
npm run build
```

This will:
- Use `.env.production` configuration
- Minify and optimize code
- Generate static files in the `dist/` directory
- Tree-shake unused code
- Optimize assets

### Preview Production Build

After building, preview the production build locally:

```bash
npm run preview
```

The production build will be served at:
```
http://localhost:4173
```

## 🔌 API Integration

### Backend Requirements

The application expects the following API endpoints:

#### Authentication Endpoints

**1. Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**2. Register**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully"
}
```

### Axios Configuration

The Axios instance is configured with:

**Request Interceptor:**
- Automatically attaches JWT token to all requests
- Sets `Authorization: Bearer <token>` header

**Response Interceptor:**
- Handles 401 (Unauthorized) responses
- Automatically logs out user and redirects to login
- Preserves error details for debugging

### Making API Calls

Example of making an API call:

```javascript
import apiClient from '@/utils/axios'

// GET request
const response = await apiClient.get('/api/users')

// POST request
const response = await apiClient.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
})

// The token is automatically included!
```

## 🌍 Internationalization

### Supported Languages

- **English (en)** - Default fallback language
- **Portuguese (pt)** - Brazilian Portuguese

### Adding a New Language

1. **Create translation file:**
```bash
touch src/locales/es.json
```

2. **Add translations:**
```json
{
  "app": {
    "title": "AtipicALI",
    "subtitle": "Panel Administrativo"
  },
  "auth": {
    "login": "Iniciar sesión",
    "email": "Correo electrónico",
    "password": "Contraseña"
  }
}
```

3. **Import in main.js:**
```javascript
import es from './locales/es.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || defaultLanguage,
  fallbackLocale: 'en',
  messages: {
    en,
    pt,
    es  // Add new language
  }
})
```

4. **Add to LanguageSwitcher.vue:**
```javascript
const languages = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' }  // Add new option
]
```

### Using Translations in Components

```vue
<template>
  <h1>{{ t('app.title') }}</h1>
  <p>{{ t('auth.welcome') }}</p>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
```

## 🔐 Authentication Flow

### Login Flow

1. User enters email and password
2. Form submits to `/auth/login` endpoint
3. Backend validates credentials
4. Backend returns JWT token and user data
5. Frontend stores token and user in:
   - Pinia store (reactive state)
   - localStorage (persistence)
6. User is redirected to dashboard
7. All subsequent API calls include the token

### Route Protection

Routes are protected using navigation guards:

```javascript
// Public route (guest only)
{
  path: '/login',
  meta: { requiresGuest: true }
}

// Protected route (authenticated only)
{
  path: '/dashboard',
  meta: { requiresAuth: true }
}
```

**Guard Logic:**
- If user tries to access protected route without auth → Redirect to `/login`
- If authenticated user tries to access guest route → Redirect to `/dashboard`

### Logout Flow

1. User clicks logout button
2. Pinia store clears user data and token
3. localStorage is cleared
4. User is redirected to login page
5. All auth state is reset

## 🎨 Customization

### Color Palette

The AtipicALI color palette is defined in `tailwind.config.js`:

```javascript
colors: {
  atipical: {
    blue: '#3B82F6',
    red: '#EF4444',
    green: '#10B981',
    yellow: '#F59E0B',
  }
}
```

**Usage in components:**
```html
<div class="bg-atipical-blue text-white">...</div>
<button class="text-atipical-green hover:bg-green-50">...</button>
```

### Adding Custom Styles

Global utility classes are defined in `src/style.css`:

```css
@layer components {
  .btn-primary {
    @apply bg-atipical-blue text-white px-4 py-2 rounded-lg;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}
```

### Adding New Routes

1. **Create the view component:**
```bash
touch src/views/SettingsView.vue
```

2. **Add route in `src/router/index.js`:**
```javascript
{
  path: '/settings',
  name: 'Settings',
  component: () => import('@/views/SettingsView.vue'),
  meta: { requiresAuth: true }
}
```

3. **Add navigation link:**
```vue
<router-link to="/settings">Settings</router-link>
```

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**

Error: `Port 5173 is already in use`

Solution:
```bash
# Use a different port
npm run dev -- --port 3000

# Or kill the process using the port
lsof -ti:5173 | xargs kill -9
```

**2. Module Not Found**

Error: `Cannot find module '@/...'`

Solution:
- Ensure `vite.config.js` has the correct alias configuration
- Restart the dev server
- Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

**3. API Connection Failed**

Error: `Network Error` or `CORS Error`

Solution:
- Verify `.env.development` has correct API URL
- Ensure backend server is running
- Check backend CORS configuration
- Verify API endpoint paths match backend routes

**4. Translations Not Loading**

Error: Missing translations or English showing everywhere

Solution:
- Check JSON syntax in locale files
- Verify imports in `main.js`
- Clear browser localStorage:
```javascript
localStorage.clear()
```
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

**5. Build Fails**

Error: Build process fails with errors

Solution:
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Getting Help

If you encounter issues not covered here:

1. Check the browser console for error messages
2. Check the terminal for build/server errors
3. Verify all dependencies are installed correctly
4. Ensure Node.js version is compatible (v16+)

## 📝 License

This project is provided as-is for use with the AtipicALI application.

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ using Vue 3, Vite, and TailwindCSS**