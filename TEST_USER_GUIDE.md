# Toiral Estimate - Test User Guide

## 🎯 Overview
Toiral Estimate is a quotation builder application with pre-configured test users and sample data for easy testing.

## 🚀 Quick Start

### First Time Setup
The application will automatically initialize test data on first load. This includes:
- ✅ 3 test client users with sample data
- ✅ 1 admin user
- ✅ Sample quotations (various statuses)
- ✅ Sample projects (active, pending, completed)
- ✅ Service packages and add-ons

**Note:** The initialization happens only once and takes a few seconds.

## 🔑 Test Access Codes

### Admin Access
- **Access Code:** `admin`
- **User:** Admin User
- **Description:** Full admin access with:
  - User management dashboard
  - Quotation management
  - Service package configuration
  - Analytics overview
  - Real-time statistics

### Test Client 1: John Smith
- **Access Code:** `testuser1`
- **Email:** john.smith@example.com
- **Phone:** +1 (555) 123-4567
- **Sample Data:**
  - ✅ 2 Quotations:
    - E-commerce Website (Approved, $1,390)
    - Portfolio Website (Sent, $237.50)
  - ✅ 1 Active Project:
    - E-commerce Website Development (65% complete)
    - Next Milestone: Payment Gateway Integration
- **Use Case:** Test active user workflow with ongoing projects

### Test Client 2: Sarah Johnson
- **Access Code:** `testuser2`
- **Email:** sarah.johnson@example.com
- **Phone:** +1 (555) 234-5678
- **Sample Data:**
  - ✅ 1 Draft Quotation:
    - Social Media Campaign ($675)
- **Use Case:** Test new user experience and quotation creation

### Test Client 3: Michael Chen
- **Access Code:** `testuser3`
- **Email:** michael.chen@example.com
- **Phone:** +1 (555) 345-6789
- **Sample Data:**
  - ✅ 1 Approved Quotation:
    - Corporate Website Redesign ($637.50)
  - ✅ 2 Projects:
    - Corporate Website Redesign (100% complete)
    - Website Maintenance (Pending, starts in 7 days)
- **Use Case:** Test completed project workflow and project history

## 📋 Testing Scenarios

### 1. Admin Testing
Login with `admin` and verify:
- [ ] View all users in User Management
- [ ] See all quotations across users
- [ ] View analytics and statistics
- [ ] Manage service packages
- [ ] View real-time dashboard updates

### 2. Active User Testing (testuser1)
Login with `testuser1` and verify:
- [ ] Dashboard shows active project progress (65%)
- [ ] View 2 quotations in My Quotations page
- [ ] Check project details in My Projects
- [ ] Next payment date is displayed
- [ ] Can create new quotations

### 3. New User Testing (testuser2)
Login with `testuser2` and verify:
- [ ] Dashboard shows draft quotation
- [ ] Services page displays available packages
- [ ] Can edit draft quotation
- [ ] Can create new quotations
- [ ] Empty projects section

### 4. Completed Project Testing (testuser3)
Login with `testuser3` and verify:
- [ ] Dashboard shows completed project
- [ ] View pending project starting soon
- [ ] Project history is visible
- [ ] Can view past quotations
- [ ] Analytics show completed work

## 🔧 Features to Test

### Client Features
1. **Dashboard**
   - User profile section
   - Project progress indicators
   - Recent quotations
   - Quick action buttons

2. **Services Page**
   - Browse service packages
   - View package details
   - Select add-ons
   - Calculate pricing

3. **Quotations**
   - Create new quotations
   - Edit draft quotations
   - View quotation history
   - Download PDF (if implemented)

4. **Projects**
   - View active projects
   - Check project progress
   - See milestones
   - Payment schedule

5. **Analytics**
   - View personal statistics
   - Quotation history
   - Spending overview

### Admin Features
1. **Admin Dashboard**
   - User statistics
   - Revenue overview
   - Quotation metrics
   - Active projects count

2. **User Management**
   - View all users
   - User details
   - Activity tracking

3. **Quotation Management**
   - View all quotations
   - Filter by status
   - Update quotation status

4. **Service Management**
   - Add/Edit services
   - Configure pricing
   - Manage add-ons

## 🐛 Troubleshooting

### Data Not Loading
- **Solution:** Refresh the page. The data initializes on first load.
- **Check:** Browser console for any Firebase errors

### Can't Login
- **Check:** Make sure you're using one of the valid access codes
- **Try:** Clear browser cache and reload

### Missing Sample Data
- **Solution:** Clear localStorage and refresh the page to reinitialize:
  ```javascript
  // Run in browser console
  localStorage.clear();
  location.reload();
  ```

## 📱 Responsive Testing
Test the application on:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## 🔒 Security Notes
- This is a demo/testing environment
- Access codes are for testing purposes only
- Firebase authentication is set to anonymous mode
- Data persists in Firebase Realtime Database

## 📞 Support
For issues or questions:
- Check browser console for errors
- Verify Firebase configuration in `/src/config/firebase.ts`
- Ensure all dependencies are installed: `yarn install`

## 🎨 UI Components Tested
- Login page with access code input
- Protected routes
- Admin-only routes
- Navigation sidebar
- Dashboard widgets
- Data tables
- Forms
- Modals
- Charts and analytics

---

**Happy Testing! 🚀**
