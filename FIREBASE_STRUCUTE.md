*** SLIDERS ***

createdAt 
3 February 2026 at 00:00:00 UTC+5:30
(timestamp)


imageUrl
"https://drive.google.com/uc?id=abc123xyz789"
(string)


isActive
true
(boolean)


updatedAt 
3 February 2026 at 00:00:00 UTC+5:30



*** LEADS ***


createdAt
2 February 2026 at 00:00:00 UTC+5:30
(timestamp)


formType
""
(string)



personalInfo
(map)


email
"test@example.com"
(string)


fullName
"Test User"
(string)


mobile
"9876543210"
(string)



policyDetails
(map)


isActivePolicy
"Test Policy"
(string)


policyExpiryDate
""
(string)


source
"website"
(string)


status
"new"
(string)


updatedAt
2 February 2026 at 00:00:00 UTC+5:30
(timestamp)



vehicleDetails
(map)


model
"Test Vehicle"
(string)


vehicleNumber
"MH01AB1234"


*** SERVICE ***
active
true
(boolean)


color
"#3b82f6"
(string)


description
""
(string)


icon
"FaMotorcycle"
(string)


iconLibrary
"fa"
(string)


order
1
(number)


serviceName
""

*** SETTINGS ***

address
(map)


city
"Mumbai"
(string)


googleMapsUrl
"https://maps.google.com/?q=Bandra+Kurla+Complex"
(string)


line1
"Office No. 302, 3rd Floor"
(string)


line2
"Trade Centre, Bandra Kurla Complex"
(string)


pincode
"400051"
(string)


state
"Maharashtra"
(string)



colors
(map)


accent
"#059669"
(string)


primary
"#2563eb"
(string)


secondary
"#f97316"
(string)



contact
(map)


businessHours
"9:00 AM – 7:00 PM"
(string)


primaryEmail
"info@bharatinsurance.in"
(string)


sundayHours
"Special: Third-party only"
(string)


supportEmail
"support@bharatinsurance.in"
(string)


footerDescription 
"Your trusted insurance partner in India. We provide comprehensive vehicle insurance solutions with the best rates from 20+ top insurance companies. Fast, reliable, and hassle-free."
(string)



phoneNumbers
(map)


alternate
"+91 9876543211"
(string)


call
"919876543210"
(string)


support
"+91 9876543210"
(string)


whatsapp
"919876543210"
(string)



seo
(map)


description
"Get the best vehicle insurance quotes for two-wheelers, four-wheelers, commercial vehicles and more."
(string)


keywords
"insurance, vehicle insurance, car insurance, bike insurance"
(string)


title
"Bharat Insurance - Trusted Vehicle Insurance Partner"
(string)


settingType
"website"
(string)



socialMedia
(map)



facebook
(map)


active
true
(boolean)


url
"https://facebook.com/bharatinsurance"
(string)



instagram
(map)


active
true
(boolean)


url
"https://instagram.com/bharatinsurance"
(string)



twitter
(map)


active
true
(boolean)


url
"https://twitter.com/bharatinsurance"
(string)



youtube
(map)


active
true
(boolean)


url
"https://youtube.com/@bharatinsurance"
(string)


updatedAt
4 February 2026 at 00:00:00 UTC+5:30
(timestamp)


updatedBy
"admin"




Firestore Database
│
├── 📁 leads (collection)
│   ├── 📄 FbOfR37Y0QmKOyodua2D (document)
│   │   ├── createdAt: timestamp
│   │   ├── formType: ""
│   │   ├── personalInfo (map)
│   │   │   ├── email: "test@example.com"
│   │   │   ├── fullName: "Test User"
│   │   │   └── mobile: "9876543210"
│   │   ├── policyDetails (map)
│   │   │   ├── isActivePolicy: "Test Policy"
│   │   │   └── policyExpiryDate: ""
│   │   ├── source: "website"
│   │   ├── status: "new"
│   │   ├── updatedAt: timestamp
│   │   └── vehicleDetails (map)
│   │       ├── model: "Test Vehicle"
│   │       └── vehicleNumber: "MH01AB1234"
│   │
│   └── 📄 [auto-id-2] (document)  // More leads
│
├── 📁 services (collection)
│   ├── 📄 [auto-id-1] (document)
│   │   ├── serviceName: "Two-Wheeler Insurance"
│   │   ├── description: "Bikes, scooters & mopeds"
│   │   ├── icon: "FaMotorcycle"
│   │   ├── iconLibrary: "fa"
│   │   ├── color: "#3b82f6"
│   │   ├── active: true
│   │   ├── order: 1
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   ├── 📄 [auto-id-2] (document)
│   │   ├── serviceName: "Four-Wheeler Insurance"
│   │   ├── description: "Cars, SUVs & personal vehicles"
│   │   ├── icon: "FaCar"
│   │   ├── iconLibrary: "fa"
│   │   ├── color: "#10b981"
│   │   ├── active: true
│   │   ├── order: 2
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   ├── 📄 [auto-id-3] (document)
│   │   ├── serviceName: "Commercial Goods Vehicle"
│   │   ├── description: "Trucks & transport vehicles"
│   │   ├── icon: "FaTruck"
│   │   ├── iconLibrary: "fa"
│   │   ├── color: "#f59e0b"
│   │   ├── active: true
│   │   ├── order: 3
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   ├── 📄 [auto-id-4] (document)
│   │   ├── serviceName: "School Bus Insurance"
│   │   ├── description: "School & passenger buses"
│   │   ├── icon: "FaBus"
│   │   ├── iconLibrary: "fa"
│   │   ├── color: "#ef4444"
│   │   ├── active: true
│   │   ├── order: 4
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   ├── 📄 [auto-id-5] (document)
│   │   ├── serviceName: "New Insurance Policies"
│   │   ├── description: "Fresh policies for all vehicles"
│   │   ├── icon: "FaFileAlt"
│   │   ├── iconLibrary: "fa"
│   │   ├── color: "#8b5cf6"
│   │   ├── active: true
│   │   ├── order: 5
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   ├── 📄 [auto-id-6] (document)
│   │   ├── serviceName: "Renewal Services"
│   │   ├── description: "Quick & hassle-free renewals"
│   │   ├── icon: "FaSyncAlt"
│   │   ├── iconLibrary: "fa"
│   │   ├── color: "#ec4899"
│   │   ├── active: true
│   │   ├── order: 6
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   └── 📄 [auto-id-7] (document)
│       ├── serviceName: "Third-Party Insurance"
│       ├── description: "Sunday special service available"
│       ├── icon: "FaShieldAlt"
│       ├── iconLibrary: "fa"
│       ├── color: "#14b8a6"
│       ├── active: true
│       ├── order: 7
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── 📁 settings (collection)
│   └── 📄 [auto-id] (document)
│       ├── settingType: "website"
│       ├── phoneNumbers (map)
│       │   ├── support: "+91 9876543210"
│       │   ├── alternate: "+91 9876543211"
│       │   ├── whatsapp: "919876543210"
│       │   └── callButton: "919876543210"
│       │
│       ├── contact (map)
│       │   ├── primaryEmail: "info@bharatinsurance.in"
│       │   ├── supportEmail: "support@bharatinsurance.in"
│       │   ├── businessHours: "9:00 AM – 7:00 PM"
│       │   └── sundayHours: "Special: Third-party only"
│       │
│       ├── address (map)
│       │   ├── line1: "Office No. 302, 3rd Floor"
│       │   ├── line2: "Trade Centre, Bandra Kurla Complex"
│       │   ├── city: "Mumbai"
│       │   ├── state: "Maharashtra"
│       │   ├── pincode: "400051"
│       │   └── googleMapsUrl: "https://maps.google.com/?q=Bandra+Kurla+Complex"
│       │
│       ├── footerDescription: "Your trusted insurance partner in India..."
│       │
│       ├── socialMedia (map)
│       │   ├── facebook (map)
│       │   │   ├── url: "https://facebook.com/bharatinsurance"
│       │   │   └── active: true
│       │   ├── instagram (map)
│       │   │   ├── url: "https://instagram.com/bharatinsurance"
│       │   │   └── active: true
│       │   ├── twitter (map)
│       │   │   ├── url: "https://twitter.com/bharatinsurance"
│       │   │   └── active: true
│       │   ├── linkedin (map)
│       │   │   ├── url: "https://linkedin.com/company/bharatinsurance"
│       │   │   └── active: true
│       │   └── youtube (map)
│       │       ├── url: "https://youtube.com/@bharatinsurance"
│       │       └── active: false
│       │
│       ├── colors (map)
│       │   ├── primary: "#2563eb"
│       │   ├── secondary: "#f97316"
│       │   └── accent: "#059669"
│       │
│       ├── seo (map) - optional
│       │   ├── title: "Bharat Insurance - Trusted Vehicle Insurance Partner"
│       │   ├── description: "Get the best vehicle insurance quotes..."
│       │   └── keywords: "insurance, vehicle insurance, car insurance, bike insurance"
│       │
│       ├── updatedBy: "admin"
│       └── updatedAt: timestamp
│
└── 📁 sliderImages (collection)  ← ✅ NAYA COLLECTION
    ├── 📄 [auto-id-1] (document)
    │   ├── imageUrl: "https://drive.google.com/uc?id=abc123..."
    │   ├── isActive: true
    │   ├── createdAt: timestamp
    │   └── updatedAt: timestamp
    │
    ├── 📄 [auto-id-2] (document)
    │   ├── imageUrl: "https://drive.google.com/uc?id=abc123..."
    │   ├── isActive: true
    │   ├── createdAt: timestamp
    │   └── updatedAt: timestamp
    │
    ├── 📄 [auto-id-3] (document)
    │   ├── imageUrl: "https://drive.google.com/uc?id=abc123..."
    │   ├── isActive: true
    │   ├── createdAt: timestamp
    │   └── updatedAt: timestamp
    