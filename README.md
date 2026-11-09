# 📅 BookEase - Modern Appointment & Service Booking System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel_Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A fullstack service & appointment booking web application built with Next.js (App Router), Prisma ORM, and Serverless PostgreSQL — engineered for zero-downtime deployment on Vercel.**

[Features](#-key-features) • [Database Architecture](#-database-schema-erd) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start-local-development) • [Deploy to Vercel](#-deploying-to-vercel)

</div>

---

## 🌟 Key Features

### 👤 Customer Experience
* **Service Catalog**: Interactive service listings with descriptions, duration, and transparent pricing in IDR format.
* **Dynamic Slot Booking**: Time slots are generated dynamically based on business operating hours and auto-disable already booked slots.
* **Double-Booking Prevention**: Atomic database validation prevents race conditions and schedule conflicts.
* **Unique Booking Tracking**: Generates unique receipt codes (e.g., `BK-2611-8941`) so customers can check their appointment status anytime without having to create an account.

### 🛡️ Admin Management Dashboard
* **Real-time KPI Metrics**: High-level overview of Today's Bookings, Pending Approvals, Confirmed Appointments, and Estimated Revenue.
* **Booking Pipeline**: Filter appointments by `ALL`, `PENDING`, `CONFIRMED`, `COMPLETED`, and `CANCELLED`.
* **Instant Status Mutations**: Powered by Next.js Server Actions with instant cache revalidation (`revalidatePath`).
* **Service Overview**: Displays available studio services and pricing.

---

## 🗄️ Database Schema (ERD)

The application uses **PostgreSQL** modeled via **Prisma ORM**. Below is the entity relationship:

```mermaid
erDiagram
    SERVICE ||--o{ BOOKING : "booked for"
    
    SERVICE {
        string id PK "cuid()"
        string name "e.g. Haircut & Styling Deluxe"
        string slug UK "Unique URL identifier"
        string description
        float price
        int durationMinutes "e.g. 60"
        string icon
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    BOOKING {
        string id PK "cuid()"
        string bookingCode UK "Unique code e.g. BK-2611-102"
        string customerName
        string customerEmail
        string customerPhone
        datetime date "Booking date (YYYY-MM-DD)"
        string startTime "e.g. 10:00"
        string endTime "e.g. 11:00"
        float totalPrice
        enum status "PENDING, CONFIRMED, COMPLETED, CANCELLED"
        string notes "Optional customer requests"
        string serviceId FK
        datetime createdAt
        datetime updatedAt
    }

    BUSINESS_SETTING {
        string id PK "default"
        string businessName
        string contactEmail
        string contactPhone
        string address
        string openTime "09:00"
        string closeTime "18:00"
        int slotDurationMin "60"
        datetime updatedAt
    }
```

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| **Next.js 16 (App Router)** | Fullstack React framework with Server Actions & Turbopack |
| **React 19** | Modern UI components with hooks (`useTransition`, `Suspense`) |
| **TypeScript** | Type-safety across client, actions, and database entities |
| **Prisma ORM 6** | Clean data modeling, migrations, and type-safe database queries |
| **PostgreSQL** | Serverless relational database (compatible with Neon.tech & Supabase) |
| **Tailwind CSS 4** | Modern utility-first responsive styling |
| **Lucide React** | Clean, lightweight icon suite |

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/bookease.git
cd bookease
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Cloud PostgreSQL Database (Free)
1. Go to **[Neon.tech](https://neon.tech)** (or **[Supabase.com](https://supabase.com)**) and sign up for a free account.
2. Create a new project (takes ~30 seconds, no credit card required).
3. Copy your PostgreSQL connection string (looks like: `postgresql://user:password@ep-xyz.aws.neon.tech/neondb?sslmode=require`).

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Paste your Neon / Supabase URL into `.env`:
```env
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 5. Push Schema and Seed Database
Run Prisma migrations to create the tables and populate dummy data:
```bash
npx prisma db push
npm run prisma:seed
```

### 6. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

* **Public Booking**: `http://localhost:3000/book`
* **Check Status**: `http://localhost:3000/check-status` (Try testing code: `BK-202611-101`)
* **Admin Dashboard**: `http://localhost:3000/admin`

---

## ☁️ Deploying to Vercel

This project is tailored specifically for 1-click deployment on Vercel:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of BookEase booking system"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/bookease.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your GitHub repository `bookease`.

3. **Set Environment Variable in Vercel**:
   - In the **Environment Variables** section, add:
     - **Name**: `DATABASE_URL`
     - **Value**: *(Your Neon.tech or Supabase PostgreSQL connection string)*

4. **Click Deploy**:
   - Vercel automatically runs `npm install`, triggers `prisma generate` via `postinstall`, and creates the production build.
   - Your site is live on `https://your-project.vercel.app`! 🎉

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
