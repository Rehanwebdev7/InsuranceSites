Complete prompt for React Js application
Create react js project name as "Bharat Insurance"
## Project Overview
Create a **production-ready Single Page Application (SPA)** for **Bharat Insurance** - A lead generation website for an insurance agent. The website will have 7 service-specific forms, Firebase integration for future backend, and a beautiful, modern UI.

## Core Requirements

### 1. Technology Stack
```javascript
{
  "frontend": {
    "framework": "React 18.2.0",
    "styling": "Tailwind CSS + Bootstrap 5.2.3",
    "routing": "React Router DOM 6.8.1",
    "forms": "React Hook Form + Yup validation",
    "animations": "Framer Motion / Lottie React",
    "icons": "React Icons / Font Awesome",
    "notifications": "React Toastify",
    "datePicker": "React DatePicker",
    "select": "React Select",
    "maps": "@react-google-maps/api (optional)",
    "excel": "XLSX (for export)"
  },
  "backend": {
    "database": "Firebase Firestore (structure ready)",
    "auth": "Firebase Authentication (for admin)",
    "notifications": "Firebase Cloud Messaging",
    "storage": "Firebase Storage (for images)"
  }
}
```

### 2. Project Structure (Follow Murgaroma Pattern)
```
bharat-insurance/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── firebase-messaging-sw.js
│   ├── logo.png
│   ├── favicon.ico
│   └── animations/
│       ├── success.json
│       ├── loading.json
│       └── insurance-animation.json
│
├── src/
│   ├── App.js                    # Root with role-based routing
│   ├── index.js
│   ├── index.css
│   │
│   ├── api/
│   │   └── apiClient.js          # Axios instance (for future API)
│   │
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── firebase.js       # Firebase config
│   │   │   ├── firestore.js       # Firestore operations
│   │   │   └── fcm.js            # FCM notification setup
│   │   ├── leadService.js        # Lead management (localStorage/Firebase)
│   │   ├── themeService.js        # Dynamic theme management
│   │   └── dummyData.js           # JSON dummy data
│   │
│   ├── contexts/
│   │   ├── ThemeContext.js        # Dynamic theme (colors, images)
│   │   ├── NotificationContext.js # FCM notifications
│   │   ├── LeadContext.js         # Lead management state
│   │   └── AuthContext.js         # Admin auth (future)
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx         # Customer website layout
│   │   ├── AdminLayout.jsx        # Admin panel layout
│   │   └── AuthLayout.jsx         # Login layout
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx          # Main navigation
│   │   │   ├── Footer.jsx          # Footer with contact
│   │   │   ├── HeroSlider.jsx      # Auto-playing slider
│   │   │   ├── ServiceCard.jsx     # Service card with icon
│   │   │   ├── CTASection.jsx      # Call to action
│   │   │   ├── LanguageSelector.jsx # Multi-language support
│   │   │   ├── WhatsAppButton.jsx  # Floating WhatsApp
│   │   │   ├── CallButton.jsx      # Floating call button
│   │   │   ├── LoadingSpinner.jsx  # Lottie animation
│   │   │   └── SuccessModal.jsx    # Form submission success
│   │   │
│   │   ├── forms/
│   │   │   ├── FormWrapper.jsx     # Reusable form wrapper
│   │   │   ├── TwoWheelerForm.jsx  # Bike/scooter form
│   │   │   ├── FourWheelerForm.jsx # Car/SUV form
│   │   │   ├── CommercialForm.jsx  # Truck/transport form
│   │   │   ├── SchoolBusForm.jsx   # School bus form
│   │   │   ├── NewPolicyForm.jsx   # New policy form
│   │   │   ├── RenewalForm.jsx     # Renewal form
│   │   │   └── ThirdPartyForm.jsx  # Third-party form
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminSidebar.jsx     # Admin navigation
│   │   │   ├── DashboardStats.jsx   # Lead statistics
│   │   │   ├── LeadsTable.jsx       # All leads with export
│   │   │   ├── ThemeManager.jsx     # Colors, slider images
│   │   │   ├── ServiceManager.jsx   # Services CRUD
│   │   │   ├── IconManager.jsx      # Service icons
│   │   │   └── ContentManager.jsx   # Text content
│   │   │
│   │   └── modals/
│   │       ├── LeadDetailModal.jsx  # View lead details
│   │       ├── ImageCropper.jsx     # Image crop for admin
│   │       └── ConfirmationModal.jsx
│   │
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── HomePage.jsx         # Main landing page
│   │   │   ├── ServicesPage.jsx     # All services
│   │   │   ├── ContactPage.jsx      # Contact info
│   │   │   ├── AboutPage.jsx        # About us
│   │   │   ├── TermsPage.jsx        # Terms
│   │   │   ├── PrivacyPage.jsx      # Privacy policy
│   │   │   └── RefundPage.jsx       # Refund policy
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx   # Admin home
│   │   │   ├── LeadsManagement.jsx  # All leads CRUD
│   │   │   ├── ThemeSettings.jsx    # Theme customization
│   │   │   ├── SliderManager.jsx    # Slider images
│   │   │   ├── ServicesManager.jsx  # Services with icons
│   │   │   ├── ContentEditor.jsx    # Text content editor
│   │   │   └── NotificationLog.jsx  # FCM logs
│   │   │
│   │   └── auth/
│   │       ├── AdminLogin.jsx       # Admin login
│   │       └── ForgotPassword.jsx
│   │
│   ├── routes/
│   │   ├── CustomerRoutes.js
│   │   ├── AdminRoutes.js
│   │   └── AuthRoutes.js
│   │
│   ├── utils/
│   │   ├── constants.js             # App constants
│   │   ├── validation.js            # Form validation schemas
│   │   ├── formHelpers.js           # Form utilities
│   │   ├── dateHelpers.js           # Date formatting
│   │   ├── exportHelpers.js         # Excel/CSV export
│   │   └── dummyData.js             # JSON data for testing
│   │
│   ├── styles/
│   │   ├── theme.css                # CSS variables
│   │   ├── animations.css
│   │   └── responsive.css
│   │
│   └── data/
│       ├── services.json            # Services with icons
│       ├── sliderImages.json        # Slider data
│       ├── languages.json           # Multi-language content
│       └── dummyLeads.json          # Sample leads
│
├── package.json
└── README.md
```

---

## 🎨 UI/UX Design Requirements

### 1. Color Scheme (Admin manageable)
```javascript
// Default Theme (JSON structure)
{
  "primary": "#2563eb",      // Blue - Trust
  "secondary": "#10b981",     // Green - Safety
  "tertiary": "#f59e0b",      // Orange - Call to action
  "background": "#ffffff",
  "textPrimary": "#1f2937",
  "textSecondary": "#6b7280",
  "headerBg": "#ffffff",
  "footerBg": "#1f2937",
  "buttonGradient": "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
  "buttonHover": "#1e40af",
  "fontFamily": "'Inter', sans-serif"
}
```

### 2. Hero Slider Component
```javascript
// Slider images managed via admin
const sliderImages = [
  {
    id: 1,
    imageUrl: "/sliders/slide1.jpg",
    title: "Make Your Journey Safe",
    subtitle: "बनाए अपना सफर सुरक्षित",
    buttonText: "Get Insurance",
    buttonLink: "#services"
  },
  {
    id: 2,
    imageUrl: "/sliders/slide2.jpg",
    title: "Trust & Protection",
    subtitle: "भरोसा और सुरक्षा",
    buttonText: "Contact Us",
    buttonLink: "#contact"
  }
]
```

### 3. Service Cards Design
Each service card should have:
- **Icon** (Font Awesome/React Icons) - Admin manageable
- **Title** - Two-Wheeler Insurance
- **Description** - Bikes, scooters & mopeds
- **Form Trigger Button** - "Get Quote"
- **Hover Effects** - Scale and shadow

### 4. Language Support Component
Multi-language toggle displaying:
- English (Default)
- मराठी (Marathi)
- हिन्दी (Hindi)
- اردو (Urdu)

---

## 📝 Service Forms Detailed Structure

### 1. Two-Wheeler Insurance Form
```javascript
{
  formId: "twoWheeler",
  fields: [
    // Personal Info Section
    { type: "text", name: "fullName", label: "Full Name *", required: true },
    { type: "tel", name: "mobile", label: "Mobile Number *", required: true, pattern: "[0-9]{10}" },
    { type: "email", name: "email", label: "Email *", required: true },
    { type: "text", name: "address", label: "Address", required: false },
    
    // Vehicle Details Section
    { type: "text", name: "registrationNumber", label: "Registration Number *", required: true },
    { type: "text", name: "vehicleModel", label: "Vehicle Model *", required: true },
    { type: "select", name: "manufacturingYear", label: "Manufacturing Year *", 
      options: generateYearOptions(2000, 2026) },
    { type: "select", name: "engineCC", label: "Engine CC", 
      options: ["Below 100CC", "100-150CC", "150-200CC", "Above 200CC"] },
    
    // Insurance Details
    { type: "date", name: "policyExpiry", label: "Current Policy Expiry (if any)" },
    { type: "select", name: "ncbYears", label: "No Claim Bonus Years",
      options: ["0 Years", "1 Year", "2 Years", "3+ Years"] },
    { type: "radio", name: "insuranceType", label: "Insurance Type",
      options: ["Comprehensive", "Third-party only"] },
    
    // Additional Info
    { type: "textarea", name: "previousClaims", label: "Previous Claim History" },
    { type: "select", name: "preferredTime", label: "Preferred Contact Time",
      options: ["Morning (10AM-12PM)", "Afternoon (12PM-4PM)", "Evening (4PM-7PM)"] }
  ]
}
```

### 2. Four-Wheeler Insurance Form
```javascript
{
  formId: "fourWheeler",
  fields: [
    // Personal Info
    { type: "text", name: "fullName", label: "Full Name *", required: true },
    { type: "tel", name: "mobile", label: "Mobile Number *", required: true },
    { type: "email", name: "email", label: "Email *", required: true },
    { type: "text", name: "panNumber", label: "PAN Number", required: false },
    { type: "text", name: "address", label: "Address", required: true },
    
    // Vehicle Details
    { type: "text", name: "registrationNumber", label: "Registration Number *", required: true },
    { type: "text", name: "carModel", label: "Car Model *", required: true },
    { type: "text", name: "variant", label: "Variant", required: false },
    { type: "select", name: "manufacturingYear", label: "Manufacturing Year *", required: true,
      options: generateYearOptions(2000, 2026) },
    { type: "select", name: "fuelType", label: "Fuel Type",
      options: ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"] },
    { type: "number", name: "idvValue", label: "IDV Value (₹)", required: false },
    
    // Insurance Details
    { type: "text", name: "currentInsurer", label: "Current Insurer (if any)" },
    { type: "date", name: "policyExpiry", label: "Policy Expiry Date" },
    { type: "multiselect", name: "addons", label: "Add-ons Required",
      options: ["Zero Depreciation", "Engine Protect", "Roadside Assistance", 
                "Consumables Cover", "NCB Protection"] },
    { type: "radio", name: "previousClaims", label: "Any Claims in Last Year?",
      options: ["Yes", "No"] }
  ]
}
```

### 3. Commercial Goods Vehicle Form
```javascript
{
  formId: "commercialVehicle",
  fields: [
    // Business Details
    { type: "text", name: "ownerName", label: "Owner Name *", required: true },
    { type: "text", name: "companyName", label: "Company/Firm Name", required: false },
    { type: "text", name: "gstNumber", label: "GST Number", required: false },
    { type: "tel", name: "mobile", label: "Mobile Number *", required: true },
    { type: "text", name: "businessAddress", label: "Business Address *", required: true },
    
    // Vehicle Details
    { type: "text", name: "vehicleNumber", label: "Vehicle Number *", required: true },
    { type: "select", name: "vehicleType", label: "Vehicle Type *",
      options: ["Truck", "Container", "Trailer", "Tanker", "Other"] },
    { type: "select", name: "gvw", label: "Gross Vehicle Weight *",
      options: ["Below 7.5 Ton", "7.5-12 Ton", "12-16 Ton", "16-25 Ton", "Above 25 Ton"] },
    { type: "select", name: "bodyType", label: "Body Type",
      options: ["Open Body", "Closed Body", "Container", "Refrigerated"] },
    { type: "select", name: "permitType", label: "Permit Type",
      options: ["National Permit", "State Permit", "Local Permit"] },
    
    // Fleet Details
    { type: "number", name: "fleetSize", label: "Total Fleet Size" },
    { type: "text", name: "existingInsurer", label: "Existing Insurer" },
    { type: "date", name: "fleetPolicyExpiry", label: "Fleet Policy Expiry" }
  ]
}
```

### 4. School Bus Insurance Form
```javascript
{
  formId: "schoolBus",
  fields: [
    // School Details
    { type: "text", name: "schoolName", label: "School Name *", required: true },
    { type: "text", name: "contactPerson", label: "Contact Person Name *", required: true },
    { type: "text", name: "designation", label: "Designation", required: false },
    { type: "tel", name: "mobile", label: "Mobile Number *", required: true },
    { type: "email", name: "email", label: "Email *", required: true },
    { type: "text", name: "schoolAddress", label: "School Address *", required: true },
    
    // Bus Details
    { type: "text", name: "busNumber", label: "Bus Registration Number *", required: true },
    { type: "text", name: "busModel", label: "Bus Model", required: false },
    { type: "number", name: "seatingCapacity", label: "Seating Capacity *", required: true },
    { type: "select", name: "manufacturingYear", label: "Manufacturing Year *",
      options: generateYearOptions(2000, 2026) },
    { type: "text", name: "routeDetails", label: "Route Details", required: false },
    
    // Insurance Requirements
    { type: "radio", name: "studentCover", label: "Student Accident Cover Required? *",
      options: ["Yes", "No"] },
    { type: "number", name: "studentCount", label: "Number of Students (if cover needed)" },
    { type: "checkbox", name: "paCover", label: "PA Cover for Driver/Conductor" },
    { type: "checkbox", name: "breakdownAssistance", label: "Breakdown Assistance Required" }
  ]
}
```

### 5. New Insurance Policy Form
```javascript
{
  formId: "newPolicy",
  fields: [
    // Customer Info
    { type: "text", name: "fullName", label: "Full Name *", required: true },
    { type: "date", name: "dob", label: "Date of Birth *", required: true },
    { type: "tel", name: "mobile", label: "Mobile Number *", required: true },
    { type: "email", name: "email", label: "Email *", required: true },
    { type: "text", name: "panCard", label: "PAN Card *", required: true },
    { type: "text", name: "aadharNumber", label: "Aadhar Number", required: false },
    
    // Vehicle Info
    { type: "select", name: "vehicleCondition", label: "Vehicle Condition *",
      options: ["New Vehicle", "Used Vehicle"] },
    { type: "text", name: "makeModel", label: "Make & Model *", required: true },
    { type: "date", name: "purchaseDate", label: "Purchase Date *", required: true },
    { type: "number", name: "invoiceValue", label: "Invoice Value (₹) *", required: true },
    { type: "text", name: "dealerName", label: "Dealer Name", required: false },
    
    // Policy Requirements
    { type: "select", name: "policyType", label: "Policy Type *",
      options: ["Comprehensive", "Third-party only", "Standalone Own Damage"] },
    { type: "date", name: "coverageStart", label: "Coverage Start Date *", required: true },
    { type: "select", name: "preferredInsurer", label: "Preferred Insurer",
      options: ["Any", "New India", "Oriental", "National", "ICICI Lombard", "Bajaj Allianz", "Other"] },
    { type: "radio", name: "loanRequired", label: "Loan Required?",
      options: ["Yes", "No"] }
  ]
}
```

### 6. Renewal Service Form
```javascript
{
  formId: "renewal",
  fields: [
    // Policy Holder
    { type: "text", name: "fullName", label: "Full Name *", required: true },
    { type: "tel", name: "mobile", label: "Mobile Number *", required: true },
    { type: "email", name: "email", label: "Email *", required: true },
    
    // Current Policy
    { type: "text", name: "policyNumber", label: "Policy Number *", required: true },
    { type: "text", name: "insuranceCompany", label: "Insurance Company *", required: true },
    { type: "text", name: "vehicleNumber", label: "Vehicle Number *", required: true },
    { type: "date", name: "expiryDate", label: "Expiry Date *", required: true },
    { type: "number", name: "previousPremium", label: "Previous Premium Amount (₹)", required: false },
    
    // Renewal Info
    { type: "radio", name: "claimLastYear", label: "Any Claim in Last Year? *",
      options: ["Yes", "No"] },
    { type: "textarea", name: "claimDetails", label: "Claim Details (if yes)" },
    { type: "select", name: "ncbDeclaration", label: "NCB Declaration",
      options: ["0%", "20%", "25%", "35%", "45%", "50%"] },
    { type: "checkbox", name: "coverageUpgrade", label: "Upgrade Coverage?" }
  ]
}
```

### 7. Third-Party Insurance Form
```javascript
{
  formId: "thirdParty",
  fields: [
    // Basic Info
    { type: "text", name: "fullName", label: "Full Name *", required: true },
    { type: "tel", name: "mobile", label: "Mobile Number *", required: true },
    { type: "email", name: "email", label: "Email *", required: true },
    { type: "tel", name: "emergencyContact", label: "Emergency Contact Number", required: false },
    
    // Vehicle Details
    { type: "text", name: "registrationNumber", label: "Registration Number *", required: true },
    { type: "select", name: "vehicleType", label: "Vehicle Type *",
      options: ["Two-Wheeler", "Car/SUV", "Commercial Vehicle"] },
    { type: "select", name: "vehicleUsage", label: "Vehicle Usage",
      options: ["Personal", "Commercial"] },
    
    // Insurance Details
    { type: "select", name: "duration", label: "Policy Duration *",
      options: ["1 Year", "3 Years", "5 Years"] },
    { type: "radio", name: "immediateCoverage", label: "Immediate Coverage Required? *",
      options: ["Yes, Today", "Within 3 Days", "Within a Week"] },
    { type: "select", name: "location", label: "Vehicle Location *",
      options: ["Mumbai", "Delhi", "Bangalore", "Pune", "Other"] }
  ]
}
```

---

## 🔥 Firebase Integration (Structure Ready)

### 1. Firebase Configuration
```javascript
// src/services/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
```

### 2. Firestore Collections Structure
```javascript
// Collection: leads
{
  leadId: "auto-generated",
  formType: "twoWheeler/fourWheeler/etc",
  customerData: { ...form fields },
  status: "new/contacted/converted/closed",
  createdAt: timestamp,
  updatedAt: timestamp,
  notified: boolean,
  notes: string,
  assignedTo: "admin"
}

// Collection: services
{
  serviceId: "twoWheeler",
  title: "Two-Wheeler Insurance",
  description: "Bikes, scooters & mopeds",
  icon: "FaMotorcycle",
  iconLibrary: "react-icons/fa",
  formFields: [...],
  active: true,
  order: 1
}

// Collection: theme
{
  primaryColor: "#2563eb",
  secondaryColor: "#10b981",
  tertiaryColor: "#f59e0b",
  logo: "url",
  favicon: "url",
  sliderImages: [...],
  fonts: {...},
  socialLinks: {...},
  contactInfo: {...}
}

// Collection: notifications
{
  notificationId: "auto",
  type: "newLead/leadUpdate",
  leadId: "ref",
  message: "New lead received",
  read: false,
  createdAt: timestamp
}
```

### 3. FCM Notification Setup
```javascript
// Request permission and get token
export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      return token;
    }
  } catch (error) {
    console.error('FCM Error:', error);
  }
};

// Listen for foreground messages
export const onMessageListener = () => 
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
```

---

## 📱 Key Features to Implement

### 1. Customer Website Features
- [ ] **Responsive Design** - Mobile-first approach
- [ ] **Hero Slider** - Auto-playing with manual controls
- [ ] **Service Grid** - 7 service cards with icons
- [ ] **Multi-language Support** - 4 languages toggle
- [ ] **Floating Action Buttons** - WhatsApp & Call
- [ ] **Form Modal System** - Click service → open form
- [ ] **Form Validation** - Real-time validation
- [ ] **Success Animation** - Lottie on submission
- [ ] **Contact Section** - Hours, phone, map
- [ ] **Footer** - All links, copyright

### 2. Admin Panel Features
- [ ] **Login Security** - Firebase Auth
- [ ] **Dashboard** - Lead statistics, charts
- [ ] **Leads Management** - View, filter, export
- [ ] **Theme Manager** - Colors, fonts, logos
- [ ] **Slider Manager** - Upload, crop, order
- [ ] **Services Manager** - CRUD with icons
- [ ] **Content Editor** - All text content
- [ ] **Notification Center** - FCM logs
- [ ] **Excel Export** - Download leads

### 3. Notification System
- [ ] **FCM Push** - New lead notification
- [ ] **Browser Notification** - When admin online
- [ ] **Email Alert** - Using EmailJS
- [ ] **Sound Alert** - Optional for new leads

---

## 🎯 Dummy Data Structure

```javascript
// src/data/dummyLeads.json
{
  "leads": [
    {
      "id": "LD001",
      "formType": "twoWheeler",
      "customerData": {
        "fullName": "Rajesh Kumar",
        "mobile": "9876543210",
        "email": "rajesh@email.com",
        "vehicleModel": "Honda Activa",
        "registrationNumber": "MH12AB1234"
      },
      "status": "new",
      "createdAt": "2026-02-18T10:30:00Z"
    }
  ]
}

// src/data/services.json
{
  "services": [
    {
      "id": "twoWheeler",
      "title": "Two-Wheeler Insurance",
      "description": "Bikes, scooters & mopeds",
      "icon": "FaMotorcycle",
      "iconLibrary": "react-icons/fa",
      "color": "#3b82f6",
      "formFields": [...]
    }
  ]
}

// src/data/theme.json
{
  "colors": {
    "primary": "#2563eb",
    "secondary": "#10b981",
    "tertiary": "#f59e0b"
  },
  "sliders": [
    {
      "id": 1,
      "image": "/sliders/safety-first.jpg",
      "title": "Make Your Journey Safe",
      "subtitle": "बनाए अपना सफर सुरक्षित"
    }
  ]
}
```

---

## 📦 Component Implementation Details

### 1. HeroSlider Component
```jsx
// Auto-playing, touch-enabled slider
// Admin can manage images via ThemeManager
// Support for title/subtitle overlay
// Call-to-action buttons
```

### 2. ServiceCard Component
```jsx
// Accepts service object with icon
// On click opens respective form modal
// Hover animations
// Responsive grid (4 on desktop, 2 on mobile)
```

### 3. FormModal Component
```jsx
// Reusable modal wrapper
// Dynamic form based on service type
// React Hook Form + Yup validation
// Success animation on submit
// Stores in localStorage + Firebase ready
```

### 4. Admin Theme Manager
```jsx
// Color picker for primary/secondary/tertiary
// Logo upload with cropper
// Slider image manager (upload, crop, order)
// Font selector (Google Fonts)
// Live preview
```

---

## 🚀 Implementation Phases

### Phase 1: Core Structure (Week 1)
- [ ] Setup React project with structure
- [ ] Implement routing
- [ ] Create layouts
- [ ] Setup ThemeContext
- [ ] Create dummy data files

### Phase 2: Customer UI (Week 2)
- [ ] Header with navigation
- [ ] Hero Slider with dummy images
- [ ] Services grid with icons
- [ ] Multi-language component
- [ ] Contact section
- [ ] Footer
- [ ] Floating action buttons

### Phase 3: Forms (Week 3)
- [ ] Create FormWrapper component
- [ ] Implement all 7 forms with validation
- [ ] Form modal system
- [ ] Success animations
- [ ] LocalStorage storage

### Phase 4: Admin Panel (Week 4)
- [ ] Admin login
- [ ] Dashboard with stats
- [ ] Leads management table
- [ ] Theme manager
- [ ] Services manager
- [ ] Slider manager

### Phase 5: Firebase Ready (Week 5)
- [ ] Firebase project setup
- [ ] Firestore collections structure
- [ ] FCM configuration
- [ ] Notification system
- [ ] Export functionality

---

## ✅ Success Criteria
- [ ] All 7 forms working with validation
- [ ] Responsive on all devices
- [ ] Theme colors change dynamically
- [ ] Slider images manageable via admin
- [ ] Service icons manageable
- [ ] Multi-language working
- [ ] Forms save to localStorage
- [ ] Admin can view all leads
- [ ] Firebase structure ready for future
- [ ] Export to Excel working

---

## 🎨 UI Improvements (Better than Sample)
1. **Modern gradient design** instead of flat colors
2. **Smooth animations** on scroll and hover
3. **Glassmorphism effects** on cards
4. **3D transforms** on service cards
5. **Micro-interactions** on buttons
6. **Loading skeletons** for better UX
7. **Toast notifications** for form submission
8. **Progress indicator** on multi-step forms
9. **Dark mode support** (optional)
10. **PWA capabilities** (manifest already setup)

---

## 📋 Final Notes
- **All data operations** should work with JSON dummy data first
- **Firebase structure** should be ready - just need to uncomment when backend ready
- **Admin panel** should be fully functional with localStorage
- **Forms** should store data in both localStorage and prepare for Firestore
- **Notifications** should show toast first, FCM structure ready

---

**Please generate the complete code following this structure. Use dummy JSON data for all operations. Make the UI modern, responsive, and better than the sample images. Ensure all 7 forms are fully functional with validation.** 🚀