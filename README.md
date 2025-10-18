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

## 🚀 How to Use

### Step 1: Login as Admin
1. Go to http://localhost:3000
2. Enter access code: `admin`
3. Click "Login"
4. You'll be taken to the Admin Dashboard

### Step 2: Seed Test Data (One-Time Setup)
1. On the Admin Dashboard, you'll see an "Initialize Test Data" card
2. Click the blue "Seed Test Data" button
3. Wait a few seconds for the data to be created
4. You'll see a success message when done

**Note:** If you get a "Permission Denied" error, see the Firebase Rules section below.

### Step 3: Test Client Logins
After seeding data, log out and try these test users:
- Login with `testuser1` to see an active user with projects
- Login with `testuser2` to see a new user with draft quotations
- Login with `testuser3` to see a user with completed projects

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

## 🐛 Troubleshooting

### "Permission Denied" when seeding data
**Cause:** Firebase Database rules don't allow writes.
**Solution:** Update Firebase Realtime Database rules (see Firebase Rules section above).

### Dashboard shows all zeros
**Cause:** Test data hasn't been seeded yet.
**Solution:** Click the "Seed Test Data" button on the Admin Dashboard.

---

For detailed testing instructions, see [TEST_USER_GUIDE.md](./TEST_USER_GUIDE.md)
