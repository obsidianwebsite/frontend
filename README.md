# Obsidian Trust Bancorp Core Banking Web Application

Enterprise client-facing and administrative web portal for the **Obsidian Trust Bancorp** core banking platform. Built with **Angular 18** (Standalone Components, Signals) and styled with **Tailwind CSS**.

---

## 🏛️ Platform Highlights

- **Institutional Design**: Ultra-sleek, responsive UI crafted for high-net-worth clients and corporate institutions across mobile, tablet, and desktop viewports.
- **Client Banking Experience**:
  - **Account & Ledger**: Real-time balance updates, recent transactions, PDF bank statement exports.
  - **Global Wire Transfers**: Multi-currency wire initiation (Domestic ACH, Fedwire, SWIFT) with live validation.
  - **Card Management**: Physical and virtual debit card controls, freeze/unfreeze toggles, spending limit settings.
  - **Lending & Credit**: Automated loan requests and amortization calculations.
  - **Fixed-Yield Portfolios**: Investment packages with tier yields and maturity terms.
  - **Tax & Grants**: Regulatory compliance documents, certificate clearance, and grant applications.
- **Admin Command Center**:
  - Live bank configuration (Platform name, contact info, branding assets, logos, clearance fees).
  - KYC document verification and manual account status approval.
  - Transaction review, clearance flags, and ledger audit.
- **AI Chatbot & Assistant**: Interactive banking assistant answering client questions and guiding through financial workflows.

---

## 🛠️ Tech Stack

- **Framework**: Angular 18 (Standalone Components, Reactive Architecture)
- **Styling**: Tailwind CSS + Custom Institutional Design System
- **State & Data Handling**: RxJS & Angular Signals
- **Routing**: Angular Router with RBAC route guards (`CUSTOMER` vs `ADMIN`)
- **HTTP & Proxying**: Angular `HttpClient` routed through `proxy.conf.json` to the backend REST API

---

## 📁 Repository Structure

```text
frontend/
├── public/                 # Static brand assets, logos, and illustration images
├── src/
│   ├── app/
│   │   ├── core/           # Auth guards, HTTP interceptors, session models
│   │   ├── features/       # Feature modules:
│   │   │   ├── admin/      # Admin Command Center & settings
│   │   │   ├── auth/       # Login, Register, 2-Stage Security PIN entry
│   │   │   ├── dashboard/  # Client banking hub
│   │   │   ├── transfer/   # Wire transfer workflows
│   │   │   ├── cards/      # Card management
│   │   │   ├── loans/      # Credit & lending applications
│   │   │   ├── support/    # Support ticketing & live AI chatbot
│   │   │   └── public/     # Homepage, about, services, privacy, terms
│   │   ├── shared/         # Reusable UI widgets (navbars, footers, modals)
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/             # Vector icons and stylesheets
│   ├── styles.css          # Tailwind CSS layer definitions & custom themes
│   └── main.ts             # Application bootstrapper
├── angular.json            # Angular CLI build workspace configuration
├── package.json
├── proxy.conf.json         # Reverse proxy mapping /api to backend
├── serve.js                # Persistent dev runner
├── tailwind.config.js      # Design tokens and color palette
└── tsconfig.json           # TypeScript configuration
```

---

## ⚙️ Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Obsidian Trust Bancorp Core Backend**: Running on port `5000` ([Backend Repo](https://github.com/vaultatlantic1/backend))

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/vaultatlantic1/frontend.git
cd obsidiantrustbancorp-frontend
npm install
```

### 2. Configure Backend Proxy

The frontend uses `proxy.conf.json` to automatically proxy all `/api` calls to the backend:

```json
{
  "/api": {
    "target": "http://127.0.0.1:5000",
    "secure": false,
    "changeOrigin": true
  }
}
```

If your backend is running on a different port or host, adjust the `"target"` in `proxy.conf.json`.

### 3. Start the Development Server

```bash
npm start
# or: node serve.js
```

Navigate to `http://localhost:4200` in your web browser. The app will automatically reload when source files change.

---

## 🏗️ Production Build

To build the static distribution artifacts for production deployment:

```bash
npm run build
```

The compiled output will be generated in `dist/obsidian-trust-bank-frontend/browser` and is ready to be served via Nginx, AWS S3 / CloudFront, Vercel, or Netlify.

---

## 🛡️ Authentication Architecture

The application enforces a **two-tier security gate**:
1. **Primary Credentials**: Email and password authenticated against `/api/v1/auth/login`. Returns a temporary pre-auth session token.
2. **Security PIN**: User enters their 4-digit security PIN on `/pin`. On verification, the server issues the final bearer JWT token.
3. **Route Guards**: Evaluates JWT claims (`role: 'ADMIN'` or `role: 'CUSTOMER'`) and routes users to either `/admin` or `/dashboard`.
