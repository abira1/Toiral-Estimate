# Toiral Estimate - Quotation Builder Application

## 🎉 Overview

Toiral Estimate is a comprehensive web application for creating and managing website development quotations. Built with React, TypeScript, and Firebase, it provides both client and admin interfaces with full accessibility support.

## ✨ Features

### Core Functionality
- **Client Portal**: Create and manage quotations, track project progress
- **Admin Dashboard**: Manage users, services, and view analytics
- **Real-time Data**: Firebase integration for live updates
- **Test Environment**: Pre-configured test users and sample data

### Accessibility & UX (Phase 4 Complete)
- **🎯 WCAG 2.1 AA Compliant**: Full screen reader support and keyboard navigation
- **📱 Mobile-First**: Responsive design tested at all breakpoints (320px, 375px, 768px+)
- **⌨️ Keyboard Shortcuts**: 
  - `Ctrl/Cmd + K` - Open search modal
  - `Esc` - Close any modals
  - `?` - Show keyboard shortcuts help
- **🔍 Smart Search**: Quick navigation across all app sections
- **♿ Semantic HTML**: Proper heading hierarchy and landmark roles

### Technical Features  
- **TypeScript**: Full type safety and developer experience
- **Modern React**: Hooks, Context API, and component composition
- **Tailwind CSS**: Utility-first styling with custom design system
- **Testing Suite**: Comprehensive accessibility and functionality tests
- **Hot Reload**: Development server with instant updates

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and Yarn package manager
- Firebase project configured for Realtime Database

### Installation & Setup
```bash
# Clone and install dependencies
cd /app
yarn install

# Start development server
yarn dev
```

The application will be available at `http://localhost:3000`

## 👤 User Access

### Test Access Codes
- **`admin`** - Admin panel with full system access
- **`testuser1`** - John Smith (active projects)  
- **`testuser2`** - Sarah Johnson (new user)
- **`testuser3`** - Michael Chen (completed projects)

### Admin Setup (One-Time)
1. Login with `admin` access code
2. Click "Seed Test Data" button on dashboard
3. Sample data will populate automatically

## 🎯 Accessibility Features

### Keyboard Navigation
- **Tab Navigation**: Navigate through all interactive elements
- **Focus Indicators**: Clear visual focus states on all controls
- **Skip Links**: Jump to main content areas
- **Arrow Key Support**: Navigate through search results and lists

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy (`<h1>` to `<h6>`)
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Landmark Roles**: `<nav>`, `<main>`, `<aside>`, `<section>` elements
- **Live Regions**: Dynamic content announcements

### Mobile Accessibility
- **Touch Targets**: Minimum 44px size for all interactive elements
- **Responsive Navigation**: Bottom navigation bar on mobile devices
- **Zoom Support**: Works properly up to 200% zoom level
- **No Horizontal Scroll**: Content adapts to all screen sizes

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Open smart search modal |
| `Esc` | Close any open modals |
| `?` | Display keyboard shortcuts help |
| `Enter` | Activate focused element |
| `Arrow Keys` | Navigate search results |

## 📱 Responsive Design

### Tested Breakpoints
- **320px**: Small mobile devices (iPhone SE)
- **375px**: Standard mobile devices (iPhone X)  
- **768px**: Tablet devices (iPad)
- **1024px+**: Desktop and large screens

### Mobile Features
- **Progressive Enhancement**: Mobile-first approach
- **Touch Optimized**: Larger touch targets and spacing
- **Navigation**: Bottom navigation bar for easy thumb access
- **Performance**: Optimized images and lazy loading

## 🧪 Testing

### Running Tests
```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests with UI
yarn test:ui
```

### Test Coverage
- **Accessibility**: ARIA compliance and keyboard navigation
- **Component Logic**: User interactions and state management
- **Responsive Design**: Layout behavior at different breakpoints
- **Keyboard Shortcuts**: All shortcut combinations and edge cases

## 🚀 Usage Guide

### Admin Workflow
1. **Login**: Use `admin` access code
2. **Initialize**: Click "Seed Test Data" for sample data
3. **Manage**: Access user management, services, and analytics
4. **Monitor**: View quotation status and project progress

### Client Workflow  
1. **Login**: Use any `testuser#` access code
2. **Browse**: Explore available services and packages
3. **Quote**: Create custom quotations with selected services
4. **Track**: Monitor project progress and milestones
5. **Review**: Leave feedback and reviews

## 🔥 Firebase Database Rules

If seeding data fails with "Permission Denied", you need to update Firebase Realtime Database rules:

### Option 1: Open Access (for Development/Testing Only)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Option 2: Authenticated Access (Recommended)
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### How to Update Firebase Rules:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `toiral-estimate`
3. Click "Realtime Database" in the left menu
4. Click the "Rules" tab
5. Paste one of the rule sets above
6. Click "Publish"

## 🧪 Sample Test Data

See TEST_USER_GUIDE.md for detailed information about sample users and testing scenarios.

## 🔧 Development

### Available Scripts
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn test         # Run test suite
yarn test:coverage # Run tests with coverage report
yarn lint         # Run ESLint
yarn preview      # Preview production build
```

### Project Structure
```
/app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API and data services
│   └── test/           # Test setup and utilities
├── public/             # Static assets
├── vitest.config.ts    # Test configuration
└── tailwind.config.js  # Tailwind CSS config
```

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth (anonymous)
- **Testing**: Vitest + React Testing Library
- **Icons**: Lucide React
- **Charts**: Recharts for analytics

## 🐛 Troubleshooting

### Common Issues

#### "Permission Denied" when seeding data
**Cause**: Firebase Database rules don't allow writes  
**Solution**: Update Firebase Realtime Database rules (see Firebase Rules section)

#### Dashboard shows all zeros  
**Cause**: Test data hasn't been seeded yet  
**Solution**: Click "Seed Test Data" button on Admin Dashboard

#### Keyboard shortcuts not working
**Cause**: Modal or input focus conflict  
**Solution**: Press `Esc` first, then try the shortcut again

#### Screen reader issues
**Cause**: Missing or incorrect ARIA labels  
**Solution**: All components now include proper accessibility attributes

#### Mobile navigation issues
**Cause**: JavaScript not loaded or CSS conflicts  
**Solution**: Check browser console and ensure JavaScript is enabled

### Firebase Configuration

#### Database Rules (Development)
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

#### Database Rules (Production)  
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "quotations": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## 📚 Additional Resources

- **[TEST_USER_GUIDE.md](./TEST_USER_GUIDE.md)** - Detailed testing scenarios
- **[IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md)** - Development roadmap  
- **[Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/)** - WCAG 2.1 compliance
- **[Firebase Documentation](https://firebase.google.com/docs)** - Database setup

## 🎯 Accessibility Compliance

This application meets **WCAG 2.1 AA** standards:
- ✅ Keyboard navigation
- ✅ Screen reader compatibility  
- ✅ Color contrast ratios
- ✅ Focus management
- ✅ Semantic HTML structure
- ✅ Alternative text for images
- ✅ Descriptive link text
- ✅ Form labels and validation

---

**Last Updated**: January 18, 2025  
**Version**: 2.0 (Phase 4 Complete - Accessibility & UX Improvements)
