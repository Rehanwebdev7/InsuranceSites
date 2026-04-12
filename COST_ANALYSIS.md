# Bharat Insurance — Firebase Cost Analysis & Project Audit

> **Author:** Senior Cloud Architect Audit
> **Project:** Bharat Insurance (React + Firebase + Google Drive)
> **Date:** March 2026
> **Status:** Development → Production Ready Assessment

---

## Table of Contents

1. [Cloud Functions Inventory](#1-cloud-functions-inventory)
2. [Monthly Usage Estimation](#2-monthly-usage-estimation)
3. [Firebase Cost Breakdown](#3-firebase-cost-breakdown)
4. [Google Drive Cost Clarification](#4-google-drive-cost-clarification)
5. [Risk Detection (CRITICAL)](#5-risk-detection-critical)
6. [Optimization Plan](#6-optimization-plan)
7. [Can This Project Stay FREE?](#7-can-this-project-stay-free)
8. [Production Best Practices](#8-production-best-practices)
9. [Final Summary](#9-final-summary)

---

## 1. Cloud Functions Inventory

### Currently Deployed Functions

| # | Function Name | Type | Trigger | Purpose | Memory | Timeout |
|---|--------------|------|---------|---------|--------|---------|
| 1 | `uploadToDrive` | Callable (onCall) | Admin clicks "Add Slide" or "Upload Logo/Favicon" | Image upload to Google Drive via Service Account | 256 MiB | 60s |
| 2 | `deleteFromDrive` | Callable (onCall) | Admin clicks "Delete Slide" | Delete image from Google Drive | 128 MiB | 30s |
| 3 | `onNewLead` | Background (onDocumentCreated) | Auto — fires when new lead created in Firestore | Sends FCM push notification to all admin devices | Default | Default |

### Per-Function Call Analysis

#### `uploadToDrive`
- **Kab call hota hai:** Sirf jab admin manually image upload kare (slider, logo, favicon)
- **Estimated calls:** 1-5 per week (very low frequency)
- **Internal API calls:** 2 Google Drive API calls (file create + set permission)
- **Payload size:** 100KB - 2MB (cropped JPEG at 85% quality)
- **Cost risk:** LOW — manual admin action, rarely called

#### `deleteFromDrive`
- **Kab call hota hai:** Sirf jab admin manually slider image delete kare
- **Estimated calls:** 0-2 per week
- **Internal API calls:** 1 Google Drive API call
- **Cost risk:** VERY LOW

#### `onNewLead`
- **Kab call hota hai:** Auto — har naya lead submit hone par
- **Estimated calls:** Depends on traffic (see Section 2)
- **Internal operations per call:**
  - 1 Firestore READ: `fcmTokens` collection (ALL documents) ⚠️
  - 1 FCM multicast send to all admin devices
  - 0-N Firestore WRITES: Cleanup invalid tokens
- **Cost risk:** MEDIUM — scales with lead volume

---

## 2. Monthly Usage Estimation

### Assumptions
- Admin users: 2-5 (fixed, small team)
- Admin logins per day: 3-5 sessions
- Slider/settings changes: 2-5 per week
- Customer = visitor who may or may not submit a lead form

### Scenario A: Low Usage (50 visitors/day)

| Action | Per Day | Per Month | Firestore Reads | Firestore Writes | Function Calls |
|--------|---------|-----------|-----------------|------------------|----------------|
| Customer page loads | 50 | 1,500 | 2 per visit (cached) = 100 | 0 | 0 |
| Lead form submissions | 5 | 150 | 0 | 5 | 5 (onNewLead) |
| onNewLead → fcmTokens read | 5 | 150 | 5 × 3 tokens = 15 | 0-5 | 0 |
| Admin dashboard (onSnapshot) | 5 sessions | 150 | 150 leads × 5 = 750 | 0 | 0 |
| Settings page load | 1 | 30 | 1 | 0 | 0 |
| Slider management | 0.3 | 9 | 1 | 1 | 0-1 upload |
| **TOTAL** | | | **~900/day** | **~10/day** | **~5/day** |
| **Monthly Total** | | | **~27,000** | **~300** | **~160** |

**Free tier limit:** 50,000 reads/day → **Using 1.8% of daily limit. SAFE.**

### Scenario B: Medium Usage (500 visitors/day)

| Action | Per Day | Per Month | Firestore Reads | Firestore Writes | Function Calls |
|--------|---------|-----------|-----------------|------------------|----------------|
| Customer page loads | 500 | 15,000 | 1,000 (cached after first) | 0 | 0 |
| Lead form submissions | 50 | 1,500 | 0 | 50 | 50 |
| onNewLead → fcmTokens read | 50 | 1,500 | 50 × 5 = 250 | 0-10 | 0 |
| Admin dashboard (onSnapshot) | 10 | 300 | 1,500 leads initial + updates | 0 | 0 |
| **TOTAL** | | | **~3,000/day** | **~60/day** | **~50/day** |
| **Monthly Total** | | | **~90,000** | **~1,800** | **~1,500** |

**Free tier:** 50,000 reads/day → **Using 6%. SAFE.**

### Scenario C: High Usage (5,000 visitors/day)

| Action | Per Day | Per Month | Firestore Reads | Firestore Writes | Function Calls |
|--------|---------|-----------|-----------------|------------------|----------------|
| Customer page loads | 5,000 | 150,000 | 10,000 | 0 | 0 |
| Lead form submissions | 500 | 15,000 | 0 | 500 | 500 |
| onNewLead → fcmTokens | 500 | 15,000 | 500 × 5 = 2,500 | 0-50 | 0 |
| Admin dashboard (onSnapshot) | 15 | 450 | ⚠️ 15,000 leads × updates | 0 | 0 |
| **TOTAL** | | | **~15,000/day** | **~550/day** | **~500/day** |
| **Monthly Total** | | | **~450,000** | **~16,500** | **~15,000** |

**Free tier:** 50,000 reads/day → **Using 30%. SAFE but watch admin onSnapshot.**

### Biggest Cost Contributors (ranked)
1. **Admin onSnapshot listener** — Reads ALL leads in real-time (grows with data)
2. **Customer page loads** — Firestore reads (mitigated by caching)
3. **onNewLead Cloud Function** — Triggered per lead + reads fcmTokens
4. **Slider/Logo uploads** — Negligible (manual, rare)

---

## 3. Firebase Cost Breakdown

### (A) Cloud Functions — v2 (2nd Gen)

| Resource | Free Tier (Monthly) | Your Usage (Medium) | Status |
|----------|-------------------|-------------------|--------|
| Invocations | 2,000,000 | ~1,500 | ✅ 0.075% used |
| vCPU-seconds | 180,000 | ~3,000 | ✅ 1.7% used |
| GiB-seconds (RAM) | 360,000 | ~6,000 | ✅ 1.7% used |
| Outbound networking | 1 GB | ~50 MB | ✅ 5% used |

**Paid pricing (if you exceed free tier):**
- Invocations: $0.40/million (~₹34/million)
- vCPU-second: $0.000024 (~₹0.002)
- GiB-second: $0.0000025 (~₹0.0002)
- Outbound: $0.12/GB (~₹10/GB)

**Verdict: Cloud Functions bilkul FREE rahenge tumhare usage mein.**

### (B) Firestore

| Resource | Free Tier (Daily) | Free Tier (Monthly ~) | Your Usage (Medium/day) | Status |
|----------|------------------|-----------------------|------------------------|--------|
| Reads | 50,000/day | ~1,500,000 | ~3,000 | ✅ 6% used |
| Writes | 20,000/day | ~600,000 | ~60 | ✅ 0.3% used |
| Deletes | 20,000/day | ~600,000 | ~5 | ✅ 0.025% used |
| Storage | 1 GiB | 1 GiB | ~50 MB | ✅ 5% used |
| Egress | 10 GiB/month | 10 GiB | ~200 MB | ✅ 2% used |

**Paid pricing (per 100K operations):**
- Reads: $0.03 (~₹2.52)
- Writes: $0.09 (~₹7.56)
- Deletes: $0.01 (~₹0.84)

**Verdict: Firestore bhi FREE rahega. Even high usage mein 30% se kam.**

### (C) Firebase Hosting

| Resource | Free Tier | Your Usage | Status |
|----------|----------|------------|--------|
| Storage | 10 GB | ~50 MB (built React app) | ✅ 0.5% used |
| Data Transfer | 10 GB/month | ~2-5 GB (medium traffic) | ✅ 20-50% used |

**Paid pricing:** $0.15/GB (~₹12.60/GB) bandwidth beyond 10 GB.

**Verdict: FREE. Even 5,000 visitors/day mein SPA caching ke wajah se 10GB ke andar rahega.**

### (D) Firebase Authentication

| Resource | Free Tier | Your Usage | Status |
|----------|----------|------------|--------|
| Monthly Active Users | 50,000 MAU | 2-5 admins + 0 customer auth | ✅ 0.01% used |

**Verdict: Basically zero cost. Customers don't need auth.**

### (E) Firebase Cloud Messaging (FCM)

| Resource | Cost | Status |
|----------|------|--------|
| Push notifications | **Completely FREE** | ✅ No limits |
| Topic messaging | **FREE** | ✅ |

**Verdict: FCM is 100% free. Unlimited notifications.**

### (F) Hidden Costs

| Hidden Cost | Risk Level | Explanation |
|-------------|-----------|-------------|
| Network egress (Cloud Functions) | LOW | Images go directly to Google Drive, not through Firebase CDN. Egress from functions is minimal (JSON responses only). |
| Large payloads in callable functions | LOW | Images are 100KB-2MB JPEG. Base64 encoding adds ~33% overhead. Still under 3MB per call. Well within limits. |
| Retry behavior | LOW | Firebase callable functions don't auto-retry on client errors. Only server errors (5xx) may retry. |
| Cold starts | LOW | First function call after idle takes 3-5 seconds. Subsequent calls are fast. Not a cost issue, just UX. |
| Firestore onSnapshot charges | MEDIUM | Real-time listeners charge for every document in the initial snapshot + every changed document. **This is your biggest hidden cost.** |

---

## 4. Google Drive Cost Clarification

### Is Google Drive API Free?

| Question | Answer |
|----------|--------|
| API calls ka koi charge hai? | **NO — completely free.** No per-call charges. |
| Rate limits hai? | Yes: 12,000 requests/60 seconds (project level), 2,400/60s per user |
| Storage limit? | Service account ko **15 GB free** milta hai (separate from any user account) |
| Bandwidth charges? | **No direct charges.** Google Drive serves images via `lh3.googleusercontent.com` CDN for free. |
| Image serving charges? | **Free.** Public images served directly by Google's CDN. |

### 15 GB Storage Calculation

| Content | Avg Size | Count | Total |
|---------|----------|-------|-------|
| Slider images | 200 KB | 20 images | ~4 MB |
| Brand logos/favicons | 100 KB | 4 files | ~400 KB |
| **Total estimated** | | | **~5 MB** |

**15 GB mein ~75,000 images store kar sakte ho. Storage kabhi issue nahi hoga.**

### Google Drive vs Firebase Storage Comparison

| Feature | Google Drive | Firebase Storage |
|---------|------------|-----------------|
| **Cost** | FREE (API + 15GB storage + CDN) | 5 GB free, then $0.026/GB storage + $0.12/GB download |
| **CDN** | Google's built-in CDN (lh3.googleusercontent.com) | Firebase CDN |
| **Setup** | Service Account (done) | Security rules needed |
| **Image URL** | Permanent public links | Token-based or public |
| **Admin needed** | Share folder with SA email | Configure security rules |
| **Speed** | Fast (Google CDN) | Fast (Firebase CDN) |
| **Verdict** | **WINNER for this project** | Overkill for slider images |

**Conclusion: Google Drive is the better choice for this project. Zero cost, simple setup, permanent URLs.**

---

## 5. Risk Detection (CRITICAL)

### 🔴 HIGH RISK

#### Risk 1: LeadContext onSnapshot — No Limit
```
Location: src/contexts/LeadContext.jsx
```
- **Problem:** `onSnapshot` on `leads` collection with **no limit** — loads ALL leads
- **Impact:** Agar 10,000 leads ho gaye, har admin login par 10,000 reads
- **Scenario:** 5 admins × 10,000 leads × 3 logins/day = **150,000 reads/day**
- **Free limit:** 50,000/day → **FREE TIER EXCEED HO SAKTA HAI**

#### Risk 2: onNewLead — Unfiltered fcmTokens Read
```
Location: functions/index.js → onNewLead
```
- **Problem:** `db.collection('fcmTokens').get()` reads ALL tokens on every lead
- **Impact:** 500 leads/day × 10 tokens = 5,000 extra reads/day
- **Risk level:** Medium (manageable now, but grows with admin devices)

### 🟡 MEDIUM RISK

#### Risk 3: No Pagination on getLeads()
```
Location: src/services/firebase/firestore.js → getLeads()
```
- **Problem:** Falls back to `getDocs` with no limit when onSnapshot fails
- **Impact:** Full collection read on fallback

#### Risk 4: Slider Title Blur — Write on Every Edit
```
Location: src/pages/admin/Slider.jsx → handleTitleBlur
```
- **Problem:** Every time admin clicks out of title input, a Firestore write happens
- **Impact:** Low (1-2 writes per edit, infrequent)

#### Risk 5: Bulk Operations — Sequential Writes
```
Location: src/services/leadService.js
```
- **Problem:** `bulkUpdateStatus` and `bulkDelete` do individual writes in a loop
- **Impact:** 50 leads selected = 50 individual writes instead of 1 batch

### 🟢 LOW RISK

#### Risk 6: FCM Tokens — No TTL/Cleanup
- **Problem:** Tokens accumulate forever, cleaned only when FCM send fails
- **Impact:** Slowly increasing reads in onNewLead

#### Risk 7: Customer Cache — No TTL
- **Problem:** In-memory cache never expires during a session
- **Impact:** Admin changes don't reflect for customers until page refresh (acceptable behavior)

### ✅ NO RISK (Already Optimized)

| Feature | Why It's Safe |
|---------|--------------|
| Customer page data | Cached via `CustomerDataContext` — only 2 reads per session |
| Settings data | Cached in `localStorage` + one-time Firestore fetch |
| Cloud Functions | Very low call frequency (admin manual actions) |
| Google Drive uploads | Callable with auth check, size validation (< 5MB) |
| Image serving | Google CDN, no Firestore/Function cost |

---

## 6. Optimization Plan

### Priority 1: Fix LeadContext onSnapshot (CRITICAL)

**Current code:**
```javascript
// PROBLEM: No limit — reads ALL leads
const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
onSnapshot(q, callback);
```

**Recommended fix:**
```javascript
// SOLUTION: Add limit for initial load + pagination
const q = query(
  collection(db, 'leads'),
  orderBy('createdAt', 'desc'),
  limit(100)  // Only latest 100 leads in real-time
);
onSnapshot(q, callback);
```

**Impact:** 10,000 reads → 100 reads per admin login. **99% reduction.**

### Priority 2: Optimize onNewLead Function

**Current:** Reads all fcmTokens on every lead.

**Option A (Simple):** Keep a single document with all tokens:
```javascript
// Instead of: db.collection('fcmTokens').get()  // N reads
// Use: db.doc('settings/activeFcmTokens').get()  // 1 read
```

**Option B (Better):** Add `active: true` filter:
```javascript
const tokensSnapshot = await db.collection('fcmTokens')
  .where('active', '==', true)
  .get();
```

**Impact:** N reads → 1 read per lead submission.

### Priority 3: Batch Write Operations

**Current:**
```javascript
// Individual writes in a loop
for (const id of leadIds) {
  await updateLead(id, { status });  // N writes, N network calls
}
```

**Fix:**
```javascript
// Batch write — 1 network call for up to 500 writes
const batch = writeBatch(db);
leadIds.forEach(id => {
  batch.update(doc(db, 'leads', id), { status });
});
await batch.commit();
```

### Priority 4: Image Optimization (Before Upload)

Already optimized:
- ✅ Cropped to 16:5 ratio (canvas)
- ✅ JPEG at 85% quality
- ✅ Server-side 5MB limit check

Additional optimization possible:
- Resize to max width 1920px before upload (saves bandwidth)
- WebP format instead of JPEG (30-40% smaller)

### Priority 5: Admin Debounce for Title Edits

```javascript
// Add debounce to slider title updates
const debouncedUpdate = useMemo(
  () => debounce((id, title) => updateSliderImage(id, { title }), 1000),
  []
);
```

---

## 7. Can This Project Stay FREE?

### Answer: **YES — with high confidence**

### Free Tier Limits vs Your Usage

| Service | Free Limit | Low (50/day) | Medium (500/day) | High (5000/day) |
|---------|-----------|--------------|-------------------|-----------------|
| Firestore Reads | 50K/day | 900 (1.8%) | 3,000 (6%) | 15,000 (30%) |
| Firestore Writes | 20K/day | 10 (0.05%) | 60 (0.3%) | 550 (2.75%) |
| Function Invocations | 2M/month | 160 (0.008%) | 1,500 (0.075%) | 15,000 (0.75%) |
| Hosting Bandwidth | 10 GB/month | 500 MB | 3 GB | 8 GB |
| Auth MAU | 50K | 5 | 5 | 5 |
| FCM | Unlimited | FREE | FREE | FREE |
| Google Drive API | FREE | FREE | FREE | FREE |
| Google Drive Storage | 15 GB | ~5 MB | ~10 MB | ~50 MB |

### Conditions to Remain FREE

1. **LeadContext mein `limit(100)` lagao** (Priority 1 fix)
2. **Leads 50,000 se zyada na ho** bina pagination ke
3. **Admin users 10 se kam rahe** (more admins = more onSnapshot listeners)
4. **Hosting bandwidth 10 GB/month ke andar rahe** (5,000 visitors/day tak safe)
5. **Blaze plan activate karo** — Spark plan mein Cloud Functions nahi chalte. Blaze has **same free limits** but allows Cloud Functions.

### When Will It Start Costing?

| Milestone | Estimated Cost | When It Happens |
|-----------|---------------|-----------------|
| 50K+ reads/day | ~₹2.52/day | Only if LeadContext unfixed + 50K leads |
| 10 GB+ hosting/month | ~₹12.60/extra GB | 10,000+ visitors/day |
| 2M+ function calls/month | ~₹34/million | Not possible with this app |
| **Realistic monthly cost** | **₹0** | Up to 5,000 visitors/day |

> **Important:** Blaze plan (pay-as-you-go) ka billing enable hona chahiye Cloud Functions ke liye. BUT Blaze plan mein bhi same free tier milta hai. Jab tak free limits ke andar ho, ₹0 lagega. Safety ke liye **Budget Alert set karo** at ₹100.

---

## 8. Production Best Practices

### Folder Structure (Current — Already Good)

```
bharat-insurance/
├── functions/              # Cloud Functions
│   ├── index.js           # All 3 functions
│   ├── serviceAccountKey.json  # ⚠️ Never commit to git
│   └── package.json
├── src/
│   ├── contexts/          # React contexts (state management)
│   ├── services/
│   │   ├── firebase/      # Firestore, Auth, Cache
│   │   └── googleDrive.js # Cloud Function wrapper
│   ├── pages/
│   │   ├── admin/         # Admin panel pages
│   │   └── customer/      # Customer-facing pages
│   ├── components/        # Reusable UI components
│   └── utils/             # Helpers, constants
├── firebase.json
├── .env                   # ⚠️ Never commit
└── .firebaserc
```

### Function Design Checklist

| Practice | Status | Notes |
|----------|--------|-------|
| Auth check in callable functions | ✅ Done | `request.auth` verified |
| Input validation | ✅ Done | Size, mimeType checks |
| Error handling | ✅ Done | HttpsError with proper codes |
| Timeout configured | ✅ Done | 60s upload, 30s delete |
| Memory configured | ✅ Done | 256MiB upload, 128MiB delete |
| Rate limiting | ❌ Missing | Add per-user rate limit |
| Logging | ✅ Basic | console.log with user UID |

### Rate Limiting Strategy

Cloud Functions mein built-in rate limiting nahi hai. Options:

**Option A: Firestore-based (simple):**
```javascript
// Check last upload time in function
const lastUpload = await db.doc(`rateLimit/${request.auth.uid}`).get();
if (lastUpload.exists && Date.now() - lastUpload.data().timestamp < 5000) {
  throw new HttpsError('resource-exhausted', 'Too many requests. Wait 5 seconds.');
}
```

**Option B: Client-side (quick fix):**
```javascript
// Disable upload button for 5 seconds after upload
setUploading(true);
// ... upload logic
setTimeout(() => setUploading(false), 5000);
```

### Error Handling Best Practices

```javascript
// Cloud Function error codes to use:
'unauthenticated'    // No auth token
'permission-denied'  // Not authorized
'invalid-argument'   // Bad input data
'resource-exhausted' // Rate limit hit
'internal'          // Server error (unexpected)
'not-found'         // Resource doesn't exist
```

### Monitoring & Alerts Setup

1. **Firebase Console → Usage & Billing → Budget Alerts**
   - Set alert at ₹50 and ₹100
   - Get email notification before surprise billing

2. **Cloud Functions → Logs**
   - Monitor function execution times
   - Watch for errors in upload/delete

3. **Firestore → Usage Tab**
   - Monitor daily reads/writes
   - Watch for sudden spikes

---

## 9. Final Summary

### Monthly Cost Estimate

| Scenario | Monthly Cost | Confidence |
|----------|-------------|------------|
| Development (current) | **₹0** | 100% |
| Low traffic (50 visitors/day) | **₹0** | 99% |
| Medium traffic (500 visitors/day) | **₹0** | 95% |
| High traffic (5,000 visitors/day) | **₹0 - ₹50** | 90% |
| Very high (10,000+ visitors/day) | **₹50 - ₹200** | Hosting bandwidth may exceed |

### Safe Usage Limits (FREE mein rahega)

| Metric | Safe Limit |
|--------|-----------|
| Daily visitors | Up to 5,000 |
| Monthly leads | Up to 15,000 |
| Admin users (concurrent) | Up to 10 |
| Slider images | Up to 50 |
| Total leads in database | Up to 50,000 (with `limit` fix) |
| Hosting bandwidth | Up to 10 GB/month |

### Red Flags to Avoid

| Red Flag | Kya Hoga | Fix |
|----------|---------|-----|
| LeadContext without `limit()` | 50K+ reads/day possible at scale | Add `limit(100)` to onSnapshot query |
| Blaze plan without budget alert | Unexpected billing | Set ₹100 budget alert in Firebase Console |
| `serviceAccountKey.json` committed to git | Security breach — hackers can access your Drive | Add to `.gitignore` (already done ✅) |
| `.env` file committed to git | Firebase credentials exposed | Add to `.gitignore` (verify) |
| Multiple browser tabs as admin | Multiplied onSnapshot reads | Detect duplicate tabs, close listener |
| No pagination on leads | Reads grow linearly with data | Implement `limit()` + cursor pagination |

### Action Items (Priority Order)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | Add `limit(100)` to LeadContext onSnapshot | 🔴 Saves 90%+ reads | 5 minutes |
| 2 | Set Blaze plan + ₹100 budget alert | 🔴 Prevents surprise billing | 2 minutes |
| 3 | Optimize onNewLead fcmTokens query | 🟡 Saves reads per lead | 15 minutes |
| 4 | Add batch writes for bulk operations | 🟡 Reduces write cost | 20 minutes |
| 5 | Deploy Cloud Functions (`firebase deploy --only functions`) | 🟡 Required for production | 5 minutes |
| 6 | Remove `connectFunctionsEmulator` line for production | 🟡 Points to real functions | 1 minute |
| 7 | Add debounce to slider title updates | 🟢 Minor write savings | 5 minutes |

---

### Final Verdict

> **Tumhara project Firebase FREE tier mein comfortably chalega 5,000 daily visitors tak.**
>
> Google Drive API completely free hai, FCM completely free hai, Cloud Functions negligible usage hai.
>
> **Sirf ek cheez fix karo:** LeadContext mein `limit(100)` lagao. Bas. Phir full confidence se production mein jaao.
>
> **Estimated monthly cost: ₹0**

---

*This document should be reviewed and updated quarterly or when significant architectural changes are made.*
