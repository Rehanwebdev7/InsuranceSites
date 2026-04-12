# Bharat Insurance - Project Progress

## Project Overview
**Project Name:** Bharat Insurance
**Type:** React SPA (Vite)
**Purpose:** Lead generation website for an insurance agent with unified quote form, Firebase-ready admin panel, slider management, and responsive design
**Admin Credentials:** (stored securely — contact project admin)

---

## Tech Stack
- React 19.2.0 + Vite 7.3.1
- Tailwind CSS v4.2.0
- React Router DOM v7.13.0
- React Hook Form + Yup (form validation)
- Framer Motion (animations)
- Firebase v12.9.0 (Firestore, Auth, Storage) - with localStorage fallback
- React Icons, React Select, React DatePicker
- React Toastify (notifications)
- XLSX (Excel export)

---

## Feature Status

### Customer Website
| Feature | Status |
|---------|--------|
| Responsive Header with Navigation | Done |
| Hero Slider (responsive, admin-manageable, Firebase-powered) | Done |
| All 8 Service Cards on Home Page (redesigned) | Done |
| Unified Quote Form (all services use same form) | Done |
| Card click + "Get Quote" button both open form | Done |
| Services Page with modal forms | Done |
| Service Detail Page (all 8 types) | Done |
| About Page | Done |
| Contact Page with form | Done |
| Multi-language Selector (EN/HI/MR/UR) | Done |
| Floating WhatsApp Button (dynamic number from Settings) | Done |
| Floating Call Button (dynamic number from Settings) | Done |
| CTA Section with stats | Done |
| Footer with dynamic contact info & social media | Done |
| Top bar with dynamic phone, email, hours | Done |
| Header spacing for fixed navigation | Done |
| Toast notifications on form submit | Done |
| Flat lead data storage for admin compatibility | Done |
| "How It Works" section on Home | Done |
| "Why Choose Us" section on Home | Done |
| Statistics counter section | Done |
| Mobile-responsive slider with floating icons | Done |

### Admin Panel
| Feature | Status |
|---------|--------|
| Admin Login (fixed - was broken) | Done |
| Protected Routes (fixed - role check) | Done |
| Dashboard with lead statistics | Done |
| Leads Management (search/filter/status update) | Done |
| Lead Detail View | Done |
| Service Management (simplified: title, desc, icon, color, active) | Done |
| Slider Management (Google Drive upload + Firebase sync) | Done |
| Settings - Phone Numbers (support, alt, WhatsApp, call - all separate) | Done |
| Settings - Email & Business Hours | Done |
| Settings - Address | Done |
| Settings - Footer Description | Done |
| Settings - Social Media Links (with enable/disable toggle per platform) | Done |
| Settings - Brand Colors (primary, secondary, accent with live preview) | Done |
| All settings reflected live on customer website | Done |

### Unified Quote Form
All 8 services share ONE form with these fields:
- **Personal Info:** Full Name (required), Mobile (required, 10-digit), Email (optional)
- **Vehicle Details:** Vehicle Number (required), Model with Company Name (required)
- **Policy Detail:** Toggle "Is Active Policy?" → if Yes: Current Insurer + Policy Expiry Date

### Lead Statuses
| Status | Color | Description |
|--------|-------|-------------|
| new | Blue | Freshly submitted lead |
| contacted | Yellow | Agent has contacted the customer |
| converted | Green | Lead converted to policy sale |
| closed | Red | Lead closed/rejected |

---

## Project Structure

```
bharat-insurance/
├── public/
│   ├── vite.svg
│   └── slider/               (default slider images)
│       ├── slider1.png
│       ├── slider2.jpeg
│       ├── slider3.png
│       └── slider4.jpeg
├── src/
│   ├── api/
│   │   └── apiClient.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── CallButton.jsx       (uses SettingsContext for call number)
│   │   │   ├── CTASection.jsx       (uses SettingsContext for phone)
│   │   │   ├── Footer.jsx           (uses SettingsContext for all contact/social)
│   │   │   ├── Header.jsx           (uses SettingsContext for top bar info)
│   │   │   ├── HeroSlider.jsx       (reads from Firebase, loading skeleton, DefaultHero fallback)
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── ServiceCard.jsx      (redesigned with large icon area)
│   │   │   └── WhatsAppButton.jsx   (uses SettingsContext for WhatsApp number)
│   │   └── forms/
│   │       ├── FormWrapper.jsx
│   │       ├── QuoteForm.jsx        (unified form for ALL services)
│   │       ├── TwoWheelerForm.jsx   (legacy)
│   │       ├── FourWheelerForm.jsx  (legacy)
│   │       ├── CommercialForm.jsx   (legacy)
│   │       ├── SchoolBusForm.jsx    (legacy)
│   │       ├── NewPolicyForm.jsx    (legacy)
│   │       ├── RenewalForm.jsx      (legacy)
│   │       ├── ThirdPartyForm.jsx   (legacy)
│   │       └── MiscellaneousVehicleForm.jsx (legacy)
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── LeadContext.jsx
│   │   ├── SettingsContext.jsx      (NEW - centralized settings state)
│   │   └── ThemeContext.jsx
│   ├── data/
│   │   ├── dummyLeads.json
│   │   ├── languages.json
│   │   ├── services.json            (8 services with slug, order)
│   │   └── sliderImages.json        (default slider data)
│   ├── layouts/
│   │   ├── AdminLayout.jsx          (sidebar: Dashboard, Leads, Services, Slider, Settings)
│   │   ├── AuthLayout.jsx
│   │   └── CustomerLayout.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LeadDetail.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── Services.jsx         (simplified form - no featured/features fields)
│   │   │   ├── Settings.jsx         (REWRITTEN - full settings + brand colors)
│   │   │   ├── Slider.jsx
│   │   │   └── Theme.jsx            (DEPRECATED - merged into Settings)
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   └── customer/
│   │       ├── About.jsx
│   │       ├── Contact.jsx          (uses SettingsContext for contact info)
│   │       ├── Home.jsx
│   │       ├── ServiceDetail.jsx
│   │       └── Services.jsx
│   ├── routes/
│   │   └── AppRouter.jsx            (SettingsProvider wraps entire app)
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── firebase.js
│   │   │   ├── firestore.js          (leads, services, settings, sliderImages CRUD + Drive token storage)
│   │   │   └── fcm.js
│   │   ├── googleDrive.js             (NEW - Google Drive API: upload, delete, OAuth with refresh token)
│   │   ├── leadService.js
│   │   └── themeService.js
│   ├── utils/
│   │   ├── constants.js             (default values, used as fallback)
│   │   ├── dateHelpers.js
│   │   ├── exportHelpers.js
│   │   ├── formHelpers.js
│   │   └── validation.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## Services (8 Total)

| # | Service | ID | Icon | Color |
|---|---------|-----|------|-------|
| 1 | Two-Wheeler Insurance | twoWheeler | FaMotorcycle | #2563eb |
| 2 | Four-Wheeler Insurance | fourWheeler | FaCar | #16a34a |
| 3 | Commercial Vehicle Insurance | commercial | FaTruck | #ea580c |
| 4 | School Bus Insurance | schoolBus | FaBus | #ca8a04 |
| 5 | New Policy | newPolicy | FaFileAlt | #7c3aed |
| 6 | Policy Renewal | renewal | FaSyncAlt | #0891b2 |
| 7 | Third-Party Insurance | thirdParty | FaShieldAlt | #dc2626 |
| 8 | Miscellaneous Vehicle | miscellaneous | FaTractor | #b45309 |

---

## Routing

### Customer Routes
| Path | Page |
|------|------|
| `/` | Home (slider + 8 services + how it works + why us + CTA + stats) |
| `/services` | All services grid with unified quote form modal |
| `/services/:serviceType` | Service detail with quote form |
| `/about` | About page |
| `/contact` | Contact page (dynamic contact info from Settings) |

### Admin Routes (Protected - requires admin role)
| Path | Page |
|------|------|
| `/admin` | Dashboard |
| `/admin/leads` | Leads management |
| `/admin/leads/:id` | Lead detail |
| `/admin/services` | Service management |
| `/admin/slider` | Slider management (add/edit/delete) |
| `/admin/settings` | Settings (contact info, social media, brand colors) |

### Auth
| Path | Page |
|------|------|
| `/login` | Admin login |

---

## Admin Settings Page (Session 3 - NEW)

The Settings page (`/admin/settings`) is the centralized control panel for the website owner. All changes are saved to `localStorage` (key: `bharat_insurance_settings`) and reflect instantly across the entire customer website.

### Settings Sections

| Section | Fields | Where It Appears |
|---------|--------|------------------|
| **Phone Numbers** | Support phone (+91 prefix, 10-digit), Alternate phone (+91 prefix, 10-digit), WhatsApp number (91 prefix, 10-digit), Call button number (91 prefix, 10-digit) | Top bar, Footer, WhatsApp button, Call button, Contact page |
| **Email & Business Hours** | Primary email, Support email, Business hours text | Top bar, Footer, Contact page |
| **Address** | Line 1, Line 2, City, State, Pincode, Google Maps URL | Footer, Contact page |
| **Footer Description** | Company description text | Footer (below logo) |
| **Social Media Links** | Facebook, Instagram, Twitter/X, LinkedIn, YouTube — each with URL + enable/disable toggle | Footer (only enabled ones shown) |
| **Brand Colors** | Primary, Secondary, Accent — color pickers with hex input + live preview + reset to default | Entire website via CSS variables |

### Phone Number Handling
- **Support & Alt phone:** Stored as raw 10 digits. Prefix "+91" shown in input label. Auto-space after 5 digits. Displayed as `+91 XXXXX XXXXX` on website. Saved as `91XXXXXXXXXX` for `tel:` links.
- **WhatsApp number:** Stored as raw 10 digits. Prefix "91" shown in input label. Saved as `91XXXXXXXXXX` (no spaces) for `wa.me/` redirect links.
- **Call button number:** Same as WhatsApp format. Used for the floating call icon `tel:` link.
- **All three numbers (support, WhatsApp, call) can be different.**
- **10-digit limit enforced** — typing is blocked beyond 10 digits.

---

## Bugs Fixed (Session 2)
1. **Admin Login broken** - `Login.jsx` checked `result.success` but `login()` returns userData directly. Fixed to `await login()` then navigate.
2. **ProtectedRoute broken** - Checked `user.isAdmin` (undefined) instead of `user.role === 'admin'`. Fixed in both ProtectedRoute and PublicRoute.
3. **Admin Leads used `updateLeadStatus`** - Function didn't exist in LeadContext. Changed to `updateLead(id, { status })`.
4. **Admin LeadDetail same bug** - Fixed same `updateLeadStatus` → `updateLead` issue.
5. **Status mismatch** - Leads created with status `'new'` but admin dropdowns only had `'pending'`. Aligned to: new, contacted, converted, closed.
6. **Dashboard counted wrong status** - Was counting `'pending'` which no leads have. Fixed to count `'new'` + `'contacted'`.
7. **Lead data nested in `customerData`** - Admin expected flat fields. Flattened: fullName, mobile, email, vehicleNumber, vehicleModel at top level.

## Improvements (Session 2)
1. **ServiceCard redesigned** - Large icon illustration area at top, feature tags, hover effects, entire card clickable
2. **Unified QuoteForm** - Single form replaces 8 individual forms. Simpler fields with policy toggle.
3. **HeroSlider mobile-responsive** - Responsive heights, font sizes, button layout (stacked on mobile), floating vehicle icons hidden on small screens
4. **Slider reads from localStorage** - Admin-managed slider content reflected on customer site
5. **Admin Slider page** - Full CRUD for slider content (add/edit/delete slides)
6. **Admin nav updated** - Added Slider link in sidebar

## Improvements (Session 3)
1. **SettingsContext created** - Centralized settings state (`src/contexts/SettingsContext.jsx`) wrapping the entire app via `SettingsProvider` in `AppRouter.jsx`. Stores all configurable data in `localStorage` with computed formatted values.
2. **Admin Settings page rewritten** - Full settings page with 6 sections: Phone Numbers, Email & Business Hours, Address, Footer Description, Social Media Links, Brand Colors.
3. **Phone number smart inputs** - 10-digit limit, auto-space after every 5 digits, fixed "+91" / "91" prefix labels, numbers saved without spaces for redirect links.
4. **All customer components now dynamic** - Header top bar, Footer, WhatsApp button, Call button, CTA section, Contact page — all read from SettingsContext instead of hardcoded constants.
5. **Social media toggle** - Each platform (Facebook, Instagram, Twitter/X, LinkedIn, YouTube) can be enabled/disabled from Settings. Only enabled platforms show in the footer.
6. **Service form simplified** - Removed "Featured" toggle and "Features (up to 4)" input fields from admin Service add/edit form. Now only: Title, Description, Icon, Color, Active toggle.
7. **Theme merged into Settings** - Brand Colors section (Primary, Secondary, Accent) moved from separate Theme page into Settings. Includes color picker, hex input, live preview, and "Reset to Default" button. Separate Theme page removed from sidebar and router.
8. **Dashboard quick actions updated** - Replaced Theme link with Slider link since Theme was merged into Settings.
9. **Migration support** - SettingsContext auto-migrates old format settings (phone strings with +91) to new format (raw 10 digits) seamlessly.

---

## Data Storage

| Data | localStorage Key | Firebase Collection | Notes |
|------|-----------------|---------------------|-------|
| Leads | `bharat_insurance_leads` | `leads` | Dual storage with fallback |
| Services | `bharat_insurance_services` | `services` | Dual storage with fallback |
| Theme | `bharat_insurance_theme` | `theme` | CSS variables applied via `themeService.js` |
| Slider | — | `sliderImages` | Google Drive (image hosting) + Firebase (metadata). No more localStorage/base64 |
| Drive Auth | — | `settings/googleDriveAuth` | Stores Google OAuth refresh token for silent auth |
| Settings | `bharat_insurance_settings` | — | localStorage only. All contact info, social media, footer description |
| Auth | `bharat_insurance_auth_token` / `_user_data` | Firebase Auth | localStorage fallback for demo |

---

## Firebase Integration
- Firebase config via environment variables (`VITE_FIREBASE_*` in `.env`)
- `firestore.js` has full CRUD for leads, services, theme with dual Firebase/localStorage support
- `leadService.js` saves to localStorage first, syncs to Firestore in background
- Falls back gracefully to localStorage when Firebase is not configured
- **Slider now uses Google Drive + Firebase** (no more localStorage/base64) — see Session 4 details below
- Settings currently localStorage-only (for production, add Firestore persistence)

---

## Notes
- Admin credentials: stored securely — do not commit to repo
- Theme customization uses CSS variables (`--color-primary`, `--secondary`, etc.) applied via `themeService.js` `applyThemeToDOM()`
- All customer forms use the unified QuoteForm with React Hook Form + Yup validation
- Form submissions save flat lead data to localStorage and show toast notification
- Legacy individual form files removed — all services use unified QuoteForm
- Slider images now hosted on Google Drive, metadata in Firebase — persists across all browsers/devices.
- Settings stored in localStorage — admin changes reflect instantly on same browser. For multi-device sync, add Firestore persistence.

---

## Session 4 — Google Drive + Firebase Slider Integration (2026-02-22)

### What Changed
Slider images moved from **localStorage (base64)** to **Google Drive (image hosting) + Firebase (metadata)**. Admin can now upload/delete slider images that persist across all devices.

### Files Created
| File | Purpose |
|------|---------|
| `src/services/googleDrive.js` | Google Drive API service — OAuth (with refresh token), upload, delete, public URL |

### Files Modified
| File | Changes |
|------|---------|
| `index.html` | Added Google API (`apis.google.com/js/api.js`) and GIS (`accounts.google.com/gsi/client`) scripts |
| `src/services/firebase/firestore.js` | Added `sliderImages` CRUD (`addSliderImage`, `getSliderImages`, `updateSliderImage`, `deleteSliderImage`) + Drive token storage (`getDriveToken`, `saveDriveToken`) |
| `src/pages/admin/Slider.jsx` | Full rewrite — removed localStorage, uses Google Drive upload + Firebase storage, one-time Drive setup with refresh token |
| `src/components/common/HeroSlider.jsx` | Removed localStorage/JSON dependency, reads from Firebase `getSliderImages()`, loading skeleton, DefaultHero fallback |

### Google Drive Setup
- **OAuth Client ID:** `(see .env / functions/.env)`
- **Drive Folder ID:** `(see functions/.env)`
- **Image URL pattern:** `https://lh3.googleusercontent.com/d/{fileId}`

### How Slider Works Now
1. **First time only:** Admin clicks "Setup Google Drive (one-time)" → Google consent popup → refresh token saved to Firebase (`settings/googleDriveAuth`)
2. **Every time after:** Page loads → silently gets access token using stored refresh token → "Add Slide" button is immediately active
3. **Upload flow:** Select image → Crop (16:5) → Blob → Upload to Google Drive folder → Set public permission → Save `{title, imageUrl, driveFileId, order}` to Firebase `sliderImages` collection
4. **Delete flow:** Delete from Google Drive → Delete from Firebase
5. **Frontend (HeroSlider):** Reads from Firebase `getSliderImages()` → shows loading skeleton → displays slides or DefaultHero fallback

### Firebase `sliderImages` Document Structure
```json
{
  "title": "Slide Title",
  "imageUrl": "https://lh3.googleusercontent.com/d/FILE_ID",
  "driveFileId": "FILE_ID",
  "order": 1,
  "createdAt": "serverTimestamp"
}
```

### Testing Checklist (TODO — Not Yet Tested)
- [ ] Admin: Open `/admin/slider` → "Setup Google Drive (one-time)" button appears
- [ ] Admin: Click setup → Google consent popup → success toast → button disappears
- [ ] Admin: Reload page → no setup button (refresh token stored) → "Add Slide" is active
- [ ] Admin: Upload image → appears in Google Drive folder + Firebase `sliderImages` collection
- [ ] Homepage: Slider shows Firebase images (not localStorage)
- [ ] Admin: Delete slide → removed from Google Drive + Firebase
- [ ] Homepage reload: Images persist (from Firebase)
- [ ] New browser/device: Same images load (no localStorage dependency)

---

*Last Updated: 2026-02-22*
