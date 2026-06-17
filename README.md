# Sabun Krim Ekonomi — Gebyar Berkah Umroh, Pesta Emas (Landing Page)

[![Deploy to ECS](https://github.com/Wings-Corporation/smu-lunar-sabunkrimekonomi-web/actions/workflows/ci.yml/badge.svg)](https://github.com/Wings-Corporation/smu-lunar-sabunkrimekonomi-web/actions/workflows/ci.yml)

A Next.js 15 landing page application for the **Sabun Krim Ekonomi - Gebyar Berkah Umroh, Pesta Emas** promotional program. The application is designed to be highly responsive, optimized for static export, and served via a lightweight Nginx container.

---

## 📌 Project Overview

- **Core Framework:** Next.js 15 (React 19)
- **Deployment Mode:** Static Export (`output: 'export'`)
- **Web Server:** Nginx (Alpine) running inside Docker
- **Styling:** CSS Modules & inline styling for custom canvas layouts
- **Deployment Target:** AWS ECS (Fargate) via GitHub Actions CI/CD

---

## 🏷️ Version & Changelog

### **Current Version:** `1.0.1`

#### **Release v1.0.1 — June 17, 2026**
- **chore:** Set version to `1.0.1` in `package.json` for UAT alignment.
- **fix:** Removed the local `api` folder and successfully migrated all endpoints to external APIs (e.g., Google Apps Script) to enable a **pure static export**.
- **docker:** Reverted standalone Next.js server configuration in the `Dockerfile` to use a minimal Nginx multi-stage build, serving the statically exported files under `/app/out` directly.
- **update:** Performed configuration and layout adjustments (responsive updates for mobile and custom banner links).
- **content:** Updated winner testimony subtitles to reflect the **April – Mei 2026** period, and refreshed the list of winners with real testimony cards and avatar indicators.
- **feat:** Added a custom notification system and integration with consent cookies.
- **ci:** Added automatic `.env` file generation inside GitHub Actions directly from AWS Secrets Manager for `dev`, `uat`, and `prod` targets.
- **SEO/Metadata:** Added and updated the `sitemap.xml` structure for SEO compliance.

---

## 🛠️ Development & Local Setup

### 1. Prerequisites
- **Node.js:** version 20.x or higher
- **npm:** version 10.x or higher

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycby4bCXLpHJ4YnwJ4V1dVSSGRxT-E2pQT1fTmNISL_wEa6Zek_OcDFXNgjWFqTP7aMazTw/exec"
SITE_DOMAIN="http://localhost:3000"
```

### 3. Setup Commands
```bash
# Install dependencies
npm install

# Start the local development server (with HMR)
npm run dev

# Run ESLint check
npm run lint

# Build the project (generates static files inside /out directory)
npm run build
```

---

## 🐳 Docker Deployment

The application is containerized using a multi-stage Docker build to keep the production image size minimal and highly secure.

### Multi-Stage Architecture:
1. **Deps Stage:** Installs production dependencies (`npm install --omit=dev`).
2. **Builder Stage:** Copies full source code, installs dev dependencies, and runs `npm run build` to generate static files in `/app/out`.
3. **Runner Stage:** Leverages a lightweight `nginx:1.27-alpine` base image, clears default Nginx HTML files, copies build output `/app/out` into the webroot `/usr/share/nginx/html`, and applies custom configuration from `.github/workflows/nginx.conf`.

### Run Docker Locally:
```bash
# Build the Docker image
docker build -t smu-berkahekonomi-fe:latest .

# Run the container (maps port 80 to 8080 locally)
docker run -p 8080:80 smu-berkahekonomi-fe:latest
```

---

## 🚀 CI/CD Pipeline & Environments

Deployments are automated using GitHub Actions defined in [.github/workflows/ci.yml](file:///.github/workflows/ci.yml). 

### Branch Routing:
- **`dev` branch** -> Deploys automatically to `dev` ECS cluster environment.
- **`uat` branch** -> Deploys automatically to `uat` ECS cluster environment.
- **`main` branch** (or manual `workflow_dispatch`) -> Deploys to `prod` (production) environment.

During the pipeline, environment variables are securely retrieved from AWS Secrets Manager corresponding to the targeted environment (`/ecs/smu-berkahekonomi-fe/dev`, `/ecs/smu-berkahekonomi-fe/uat`, or `/ecs/smu-berkahekonomi-fe/prod`).
