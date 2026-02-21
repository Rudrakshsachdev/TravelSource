# TRAVEL PROFESSOR — Project Report

**Project Name:** Travel Professor  
**Client Deliverable Report**  
**Date:** February 20, 2026  
**Prepared By:** Development Team

---

## 1. EXECUTIVE SUMMARY

Travel Professor is a full-stack travel agency web application built with a **React 19** frontend and a **Django 6 / Django REST Framework** backend. The platform allows users to browse curated travel packages, submit enquiries, book trips, read/write reviews, and contact the company. A fully functional **Admin Panel** enables staff to manage trips, bookings, enquiries, users, contact messages, and site-wide statistics — all from the browser without touching code.

**Key Numbers:**

- **63 frontend source files** across components, pages, admin views, services, hooks, and utilities
- **24 backend source files** (models, views, serializers, admin, signals, utils, templates)
- **14 database migrations** applied
- **28 API endpoints** connecting frontend to backend
- **8 database models** powering all functionality
- **12 serializers** handling data validation and transformation

---

## 2. TECHNOLOGY STACK

| Layer                    | Technology                         | Version |
| ------------------------ | ---------------------------------- | ------- |
| **Frontend Framework**   | React                              | 19.2.0  |
| **Routing**              | React Router DOM                   | 7.13.0  |
| **Build Tool**           | Vite (Rolldown)                    | 7.2.5   |
| **Styling**              | CSS Modules (scoped per component) | —       |
| **Backend Framework**    | Django                             | 6.0.1   |
| **REST API**             | Django REST Framework              | 3.16.1  |
| **Authentication**       | JWT (SimpleJWT)                    | 5.5.1   |
| **Database**             | SQLite3 (development)              | —       |
| **Image Hosting**        | Cloudinary                         | —       |
| **CORS**                 | django-cors-headers                | 4.9.0   |
| **Email**                | SMTP (Gmail)                       | —       |
| **Payment (scaffolded)** | Razorpay                           | —       |

---

## 3. DESIGN SYSTEM & BRANDING

The entire website follows a cohesive **luxury teal/aqua** visual identity:

| Token        | Value                 | Usage                                   |
| ------------ | --------------------- | --------------------------------------- |
| Primary Dark | `#1a3a35`             | Footer background, CTAs, headings       |
| Primary Teal | `#3f9e8f`             | Accent color, buttons, links, gradients |
| Light Teal   | `#7ecfc0`             | Highlights, social hover, counter emoji |
| Soft Aqua    | `#5fb8a8`             | Gradient endpoints, secondary accents   |
| Background   | `#f2faf8` / `#e8f6f3` | Section backgrounds                     |
| White        | `#ffffff`             | Cards, surfaces                         |

**Typography:**

- **Playfair Display** — Display headings (serif, elegant)
- **Inter** — Body text (sans-serif, highly readable)
- **Montserrat** — Labels, buttons, navigation (sans-serif, strong)

**Design Principles Applied:**

- Glassmorphic card surfaces with `backdrop-filter: blur`
- GPU-composited animations (`transform`, `opacity` only — no layout thrashing)
- `requestAnimationFrame`-throttled scroll handlers
- Responsive breakpoints at 1280px / 1024px / 768px / 480px / 360px
- Touch-device optimizations via `@media (hover: none)`
- `IntersectionObserver` for scroll-triggered animations

---

## 4. DATABASE SCHEMA (8 Models)

### 4.1 Trip

| Field         | Type           | Description                  |
| ------------- | -------------- | ---------------------------- |
| title         | CharField(200) | Trip name                    |
| location      | CharField(200) | Destination                  |
| price         | IntegerField   | Price in INR                 |
| duration_days | IntegerField   | Number of days               |
| description   | TextField      | Detailed description         |
| itinerary     | JSONField      | Day-by-day itinerary objects |
| highlights    | JSONField      | Trip highlight list          |
| inclusions    | JSONField      | What's included              |
| exclusions    | JSONField      | What's excluded              |
| image         | URLField       | Cloudinary image URL         |
| is_active     | BooleanField   | Toggle visibility            |

### 4.2 Profile (extends Django User)

| Field | Type                     | Description         |
| ----- | ------------------------ | ------------------- |
| user  | OneToOneField(User)      | Linked Django user  |
| role  | CharField (USER / ADMIN) | Access control role |

_Auto-created via Django signal on user registration._

### 4.3 Enquiry

| Field              | Type                       | Description               |
| ------------------ | -------------------------- | ------------------------- |
| trip               | ForeignKey(Trip)           | Related trip              |
| user               | ForeignKey(User), nullable | Logged-in user (optional) |
| name, email, phone | Char/Email fields          | Contact details           |
| message            | TextField                  | User message              |
| created_at         | DateTimeField (auto)       | Timestamp                 |

### 4.4 Booking

| Field                   | Type                                      | Description           |
| ----------------------- | ----------------------------------------- | --------------------- |
| user                    | ForeignKey(User)                          | Booking owner         |
| trip                    | ForeignKey(Trip)                          | Booked trip           |
| full_name, email, phone | Contact fields                            | Traveler details      |
| persons                 | PositiveIntegerField                      | Number of travelers   |
| total_amount            | DecimalField(10,2)                        | Computed total in INR |
| status                  | CharField (PENDING / APPROVED / DECLINED) | Booking state         |
| admin_note              | TextField (optional)                      | Internal admin notes  |
| created_at              | DateTimeField (auto)                      | Timestamp             |

### 4.5 ContactMessage

| Field              | Type                 | Description  |
| ------------------ | -------------------- | ------------ |
| name, email, phone | Contact fields       | Sender info  |
| message            | TextField            | Message body |
| created_at         | DateTimeField (auto) | Timestamp    |

### 4.6 Review

| Field      | Type                      | Description      |
| ---------- | ------------------------- | ---------------- |
| name       | CharField(100)            | Reviewer name    |
| country    | CharField(100)            | Reviewer country |
| trip       | CharField(200)            | Trip reviewed    |
| rating     | PositiveSmallIntegerField | 1–5 star rating  |
| review     | TextField                 | Review body      |
| created_at | DateTimeField (auto)      | Timestamp        |

### 4.7 TripView (Personalization Engine)

| Field     | Type                 | Description     |
| --------- | -------------------- | --------------- |
| user      | ForeignKey(User)     | Who viewed      |
| trip      | ForeignKey(Trip)     | What was viewed |
| viewed_at | DateTimeField (auto) | When viewed     |

_Unique constraint on (user, trip). Powers the recommendation engine._

### 4.8 SiteStat (Dynamic Counters)

| Field | Type                  | Description                         |
| ----- | --------------------- | ----------------------------------- |
| key   | CharField(80), unique | Identifier (e.g. `trips_completed`) |
| label | CharField(120)        | Display label                       |
| value | PositiveIntegerField  | Current stat value                  |
| icon  | CharField(10)         | Emoji icon                          |

_Editable inline from Django admin. Currently seeded with: Trips Completed (1200), Happy Travelers (500), Destinations (50), Satisfaction Rate (98%)._

---

## 5. API ENDPOINTS (28 Total)

### 5.1 Public Endpoints (No Authentication Required)

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/api/v1/trips/`             | List all active trips            |
| GET    | `/api/v1/trips/<id>/`        | Get single trip details          |
| GET    | `/api/v1/trips/recommended/` | Get personalized recommendations |
| POST   | `/api/v1/auth/login/`        | Login, returns JWT tokens + role |
| POST   | `/api/v1/auth/signup/`       | Register new user                |
| POST   | `/api/v1/enquiries/`         | Submit a trip enquiry            |
| POST   | `/api/v1/contact/`           | Submit a contact form message    |
| GET    | `/api/v1/reviews/`           | List all reviews                 |
| POST   | `/api/v1/reviews/create/`    | Submit a new review              |
| GET    | `/api/v1/site-stats/`        | Get animated counter stats       |

### 5.2 Authenticated User Endpoints

| Method | Endpoint                   | Description                          |
| ------ | -------------------------- | ------------------------------------ |
| GET    | `/api/v1/my-enquiries/`    | User's own enquiries                 |
| POST   | `/api/v1/bookings/create/` | Create a new booking                 |
| GET    | `/api/v1/bookings/my/`     | User's own bookings                  |
| POST   | `/api/v1/trips/<id>/view/` | Record a trip view (personalization) |
| GET    | `/api/v1/auth/protected/`  | Auth verification test               |

### 5.3 Admin-Only Endpoints

| Method     | Endpoint                               | Description               |
| ---------- | -------------------------------------- | ------------------------- |
| GET        | `/api/v1/admin/enquiries/`             | All enquiries             |
| GET/POST   | `/api/v1/admin/trips/`                 | List / Create trips       |
| PUT/DELETE | `/api/v1/admin/trips/<id>/`            | Update / Delete trip      |
| PATCH      | `/api/v1/admin/trips/<id>/toggle/`     | Toggle trip active status |
| GET        | `/api/v1/admin/users/`                 | List all users            |
| PATCH      | `/api/v1/admin/users/<id>/role/`       | Change user role          |
| DELETE     | `/api/v1/admin/users/<id>/`            | Delete user               |
| GET        | `/api/v1/admin/contact-messages/`      | List contact messages     |
| DELETE     | `/api/v1/admin/contact-messages/<id>/` | Delete contact message    |
| GET        | `/api/v1/admin/bookings/`              | List all bookings         |
| PATCH      | `/api/v1/admin/bookings/<id>/status/`  | Approve/Decline booking   |
| GET/PATCH  | `/api/v1/admin/site-stats/`            | View/Update site stats    |

---

## 6. FRONTEND ARCHITECTURE

### 6.1 Page Structure & Routing

| Route                     | Component           | Auth Required | Description                                                     |
| ------------------------- | ------------------- | ------------- | --------------------------------------------------------------- |
| `/`                       | Home                | No            | Landing page (Hero → Trips → Reviews → WhyChooseUs → ContactUs) |
| `/login`                  | Login               | No            | User login page                                                 |
| `/signup`                 | Signup              | No            | User registration page                                          |
| `/trips/:id`              | TripDetail          | No            | Individual trip page with booking                               |
| `/contact`                | ContactUs           | No            | Contact form page                                               |
| `/my-enquiries`           | Profile             | USER          | User's enquiry history                                          |
| `/my-bookings`            | MyBookings          | USER          | User's booking history                                          |
| `/admin`                  | AdminDashboard      | ADMIN         | Admin overview                                                  |
| `/admin/enquiries`        | AdminEnquiries      | ADMIN         | Manage enquiries                                                |
| `/admin/trips`            | AdminTrips          | ADMIN         | Full CRUD for trips                                             |
| `/admin/users`            | AdminUsers          | ADMIN         | User management                                                 |
| `/admin/contact-messages` | AdminContactMessage | ADMIN         | Contact message management                                      |
| `/admin/bookings`         | AdminBookings       | ADMIN         | Booking management                                              |

### 6.2 User-Facing Components

| Component          | Lines  | Key Features                                                                                                                         |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Navbar**         | ~500   | Scroll-aware sticky nav, mobile hamburger drawer, luxury dropdown, rAF-throttled scroll, body scroll lock, GPU-composited transforms |
| **HeroSection**    | ~350   | Animated travel photo grid, destination pins, SVG map overlay, parallax-style motion                                                 |
| **TripsList**      | ~1,566 | Search + filter + sort + pagination (6/page), orbit loading animation, personalization integration                                   |
| **TripCard**       | ~426   | Hover effects, lazy images, category gradient themes, INR price format, difficulty badges                                            |
| **TripDetail**     | ~810   | Full trip info with tabs, date selection, inline booking form, enquiry submission                                                    |
| **BookingForm**    | ~80    | Controlled form, dynamic price calculation (price × persons)                                                                         |
| **Reviews**        | ~749   | Review carousel/grid, "Write a Review" modal with star-rating picker, API submission                                                 |
| **WhyChooseUs**    | ~426   | 5 feature cards with highlights, image gallery, animated counters (IntersectionObserver + easeOutQuart), backend-driven stats        |
| **ContactUs**      | ~563   | Validated contact form, auto-resize textarea, floating labels, info cards                                                            |
| **Footer**         | ~248   | 4-column layout (brand, links, services, contact), social icons, newsletter form, responsive grid                                    |
| **ProtectedRoute** | ~26    | Role-based route guard (USER / ADMIN)                                                                                                |

### 6.3 Admin Panel Components

| Component               | Lines | Key Features                                                                                                           |
| ----------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------- |
| **AdminLayout**         | ~283  | Sidebar navigation with badges, active state, page title, logout                                                       |
| **AdminDashboard**      | ~484  | Enquiry count + recent enquiries, search, time/status filters                                                          |
| **AdminTrips**          | ~868  | Full CRUD, Cloudinary image upload, itinerary/highlights/inclusions/exclusions editors, search, toggle active/inactive |
| **AdminBookings**       | ~110  | List all bookings, approve/decline with optimistic UI updates                                                          |
| **AdminEnquiries**      | ~474  | Search, status filter, sort, batch selection                                                                           |
| **AdminUsers**          | ~508  | List users, change roles (USER↔ADMIN), delete users, session expiry handling                                           |
| **AdminContactMessage** | ~589  | Filter (all/unread/today/week), search, sort, message detail view, delete                                              |

### 6.4 Services & Utilities

| File                                      | Description                                                                             |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| `services/api.js` (522 lines)             | 28 API functions using native `fetch`, JWT auth via `localStorage`, Cloudinary upload   |
| `utils/auth.js`                           | `getAuthData()` and `logout()` — localStorage-based auth state                          |
| `hooks/usePersonalization.js` (233 lines) | Interest-based trip recommendations, recently-viewed tracking, localStorage persistence |

---

## 7. KEY FEATURES SUMMARY

### 7.1 User Features

- ✅ **Browse Trips** — Search, filter by category, sort by price/duration, paginated listing
- ✅ **Trip Details** — Full itinerary, highlights, inclusions/exclusions, image gallery
- ✅ **Trip Booking** — Select persons, auto-computed total, status tracking
- ✅ **Trip Enquiry** — Submit questions about specific trips
- ✅ **User Registration & Login** — JWT-based authentication with role assignment
- ✅ **My Bookings** — View booking history with status (Pending/Approved/Declined)
- ✅ **My Enquiries** — View enquiry history
- ✅ **Reviews** — Read reviews + submit new reviews with 1-5 star rating
- ✅ **Contact Us** — Validated contact form with success feedback
- ✅ **Personalized Recommendations** — Interest-based + recently-viewed trip suggestions
- ✅ **Animated Stats Counter** — Backend-driven, scroll-triggered counters (Trips Completed, Happy Travelers, etc.)

### 7.2 Admin Features

- ✅ **Dashboard** — Overview with enquiry stats and recent activity
- ✅ **Trip Management** — Create, edit, delete trips with Cloudinary image upload + JSON field editors for itinerary/highlights/inclusions/exclusions
- ✅ **Booking Management** — View all bookings, approve or decline with email notifications
- ✅ **Enquiry Management** — View, search, filter, sort all enquiries
- ✅ **User Management** — View all users, promote/demote roles, delete accounts
- ✅ **Contact Messages** — View, filter, search, delete incoming messages
- ✅ **Site Stats** — Edit animated counter values from Django admin (no code changes needed)
- ✅ **Email Notifications** — HTML email templates sent on booking approval/decline

### 7.3 Technical Features

- ✅ **JWT Authentication** — Access tokens (30 min) + refresh tokens (1 day)
- ✅ **Role-Based Access Control** — USER and ADMIN roles with route guards
- ✅ **Auto Profile Creation** — Django signal creates Profile on user registration
- ✅ **Cloudinary Integration** — Image uploads for trip management
- ✅ **Responsive Design** — 5 breakpoints (1280/1024/768/480/360px)
- ✅ **Performance Optimized** — GPU-composited animations, rAF throttling, lazy loading, passive event listeners
- ✅ **CSS Modules** — Scoped styles per component, zero class name conflicts
- ✅ **Payment Gateway Ready** — Razorpay integration scaffolded

---

## 8. EMAIL SYSTEM

The application sends **HTML email notifications** for booking status changes:

- **Booking Approved** — `booking_approved.html` template
- **Booking Declined** — `booking_declined.html` template

Configured via Gmail SMTP with TLS encryption.

---

## 9. FILE STRUCTURE

```
TravelSource/
├── backend/
│   ├── backend/
│   │   ├── manage.py
│   │   ├── db.sqlite3
│   │   ├── backend/                # Django project settings
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   ├── wsgi.py
│   │   │   └── asgi.py
│   │   └── core/                   # Main Django app
│   │       ├── models.py           (8 models)
│   │       ├── views.py            (28 view functions)
│   │       ├── urls.py             (28 URL patterns)
│   │       ├── admin.py            (4 admin registrations)
│   │       ├── signals.py          (auto profile creation)
│   │       ├── utils.py            (payment hash generation)
│   │       ├── serializers/        (12 serializer files)
│   │       ├── templates/          (2 email templates)
│   │       └── migrations/         (14 migrations)
│   └── myenv/                      # Python virtual environment
│
└── frontend/
    └── travel-source/
        ├── package.json
        ├── vite.config.js
        ├── index.html
        └── src/
            ├── App.jsx                 (Route definitions)
            ├── main.jsx                (Entry point)
            ├── components/
            │   ├── Navbar/             (Navbar.jsx + CSS)
            │   ├── HeroSection/        (HeroSection.jsx + CSS)
            │   ├── Trips/              (TripsList, TripCard, TripDetail, Personalization)
            │   ├── BookingForm/        (BookingForm.jsx + CSS)
            │   ├── Reviews/            (Reviews.jsx + CSS)
            │   ├── WhyChooseUs/        (WhyChooseUs.jsx + CSS)
            │   ├── ContactUs/          (ContactUs.jsx + CSS)
            │   ├── Footer/             (Footer.jsx + CSS)
            │   ├── Layout.jsx
            │   └── ProtectedRoute.jsx
            ├── pages/
            │   ├── Home.jsx
            │   ├── Login/
            │   ├── Signup/
            │   ├── Profile/
            │   └── MyBookings/
            ├── admin/
            │   ├── AdminLayout.jsx
            │   ├── AdminDashboard.jsx
            │   ├── AdminTrips.jsx
            │   ├── AdminBookings.jsx
            │   ├── AdminEnquiries.jsx
            │   ├── AdminUsers.jsx
            │   └── AdminContactMessage.jsx
            ├── services/
            │   └── api.js              (28 API functions)
            ├── hooks/
            │   └── usePersonalization.js
            └── utils/
                └── auth.js
```

---

## 10. CURRENT STATUS

| Area           | Status                                                                  |
| -------------- | ----------------------------------------------------------------------- |
| Backend API    | ✅ Fully functional, 28 endpoints                                       |
| Database       | ✅ 8 models, 14 migrations applied                                      |
| Authentication | ✅ JWT login/signup with role-based access                              |
| User Pages     | ✅ Home, Login, Signup, Trip Detail, My Bookings, My Enquiries, Contact |
| Admin Panel    | ✅ Dashboard, Trips CRUD, Bookings, Enquiries, Users, Contact Messages  |
| UI/UX          | ✅ Consistent teal/aqua theme, responsive, performance-optimized        |
| Email          | ✅ Booking approval/decline notifications                               |
| Image Hosting  | ✅ Cloudinary integration                                               |
| Payment        | 🔶 Razorpay scaffolded (not fully wired)                                |
| Deployment     | 🔶 Development configuration (SQLite, DEBUG=True)                       |

---

_End of Report_
