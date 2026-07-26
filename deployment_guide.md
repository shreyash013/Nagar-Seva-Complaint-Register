# Netlify Deployment Guide: Dual Web Applications

This guide provides step-by-step instructions for deploying two separate web applications to **Netlify** from this single GitHub repository:

1. **Citizen Portal Web App** (`citizen.shirolnagar.gov.in` or `shirol-citizen.netlify.app`)
2. **Municipal Corporation Staff Web App** (`admin.shirolnagar.gov.in` or `shirol-admin.netlify.app`)

---

## Step 1: Push Code to GitHub / GitLab / Bitbucket

Ensure your repository is pushed to GitHub:
```bash
git add .
git commit -m "Configure dual Netlify deployments for Citizen & Municipal apps"
git push origin main
```

---

## Step 2: Deploy Site 1 — Citizen Web Application on Netlify

1. Log into your [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** → **Import an existing project**.
3. Select **GitHub** and choose your `Shirol-Nagar-Seva` repository.
4. Set site configuration:
   - **Site name**: `shirol-nagar-citizen` (or your preferred name)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Click **Environment variables** → **Add a variable**:
   - `DATABASE_URL`: Your PostgreSQL database connection string.
   - `NEXT_PUBLIC_APP_MODE`: `citizen`
6. Click **Deploy shirol-nagar-citizen**.
7. *(Optional)* Under **Site settings** → **Domain management**, add your custom domain (e.g. `citizen.shirolnagar.gov.in`).

---

## Step 3: Deploy Site 2 — Municipal Corporation Web Application on Netlify

1. In Netlify Dashboard, click **Add new site** → **Import an existing project**.
2. Select **GitHub** again and pick the **same** `Shirol-Nagar-Seva` repository.
3. Set site configuration:
   - **Site name**: `shirol-nagar-admin` (or your preferred name)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. Click **Environment variables** → **Add a variable**:
   - `DATABASE_URL`: Same `DATABASE_URL` as Site 1 (so complaints sync instantly!).
   - `NEXT_PUBLIC_APP_MODE`: `admin`
5. Click **Deploy shirol-nagar-admin**.
6. *(Optional)* Under **Site settings** → **Domain management**, add your staff domain (e.g. `admin.shirolnagar.gov.in`).

---

## Step 4: Verification

- Open your **Citizen App URL** (`shirol-citizen.netlify.app`):
  - Loads Citizen Dashboard, services, complaint submission, and complaint tracking.
- Open your **Municipal Corp App URL** (`shirol-admin.netlify.app`):
  - Automatically loads Executive Command Center, Master Admin Department & Staff Management, Officer Tasks, and All Complaints Console.

---

## Technical Summary

| Property | Site 1: Citizen Web App | Site 2: Municipal Corp Web App |
| :--- | :--- | :--- |
| **Netlify App Mode** | `NEXT_PUBLIC_APP_MODE=citizen` | `NEXT_PUBLIC_APP_MODE=admin` |
| **Primary Audience** | Citizens of Shirol | Mayor, Master Admin & Officers |
| **Database Sync** | Shared `DATABASE_URL` | Shared `DATABASE_URL` |
