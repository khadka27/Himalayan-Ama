# 🧘‍♀️ Himalayan Yogini

Himalayan Yogini is a modern web application for booking yoga classes online, based in **Pokhara, Nepal**. The platform allows users to explore yoga offerings, manage bookings, and connect with the Himalayan Yogini yoga studio through a clean and responsive interface.

The frontend is built with **Next.js**, focusing on performance, scalability, and a smooth user experience.

---

## ✨ Features

* Online yoga class booking
* Clean and responsive UI
* Fast performance with Next.js
* Environment-based backend configuration
* Production-ready frontend architecture

---

## 🛠 Tech Stack

### Frontend

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript 5.x
* **Styling:** Tailwind CSS 3.x
* **UI Components:** Radix UI / Shadcn UI
* **State Management:** React Context / Zustand
* **Forms:** React Hook Form with Zod validation
* **Charts:** Recharts / Chart.js
* **Icons:** Lucide React

### Backend Integration

* **API Client:** Axios with interceptors
* **Authentication:** JWT tokens with refresh logic
* **File Handling:** Upload and preview for profile/images
* **Real-time:** WebSocket / Socket.io for live updates

### Development & Deployment

* **Package Manager:** npm / yarn / pnpm
* **Linting:** ESLint with Next.js config
* **Formatting:** Prettier
* **Version Control:** Git
* **Hosting:** Vercel (recommended)
* **CI/CD:** GitHub Actions

---

## ✅ Prerequisites

Make sure the following tools are installed before running the project:

* **Node.js:** v18 or later (LTS recommended)
* **npm / yarn / pnpm:** Any one package manager
* **Git:** For version control
* **Code Editor:** VS Code (recommended)
* **Backend API:** Himalayan Yogini backend running locally or accessible via hosted URL

Optional but helpful:

* **ESLint & Prettier extensions** (VS Code)
* **Postman / Insomnia** for API testing

---

## 📁 Project Structure

```bash
himalayan-yogii/
├── app/            # Next.js app router
├── components/     # Reusable UI components
├── services/       # API & axios configuration
├── public/         # Static assets
├── .env.local      # Environment variables
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of the project and follow this structure:

```env
NEXT_PUBLIC_NODE_ENV=
NEXT_PUBLIC_BACKEND_HOSTED=
NEXT_PUBLIC_BACKEND_LOCAL=
```

> ⚠️ Note: Since these variables are prefixed with `NEXT_PUBLIC_`, they are exposed to the browser. Do not store secrets here.

---

## 🚀 Getting Started

Follow these steps to run the project locally:

```bash
cd ./himalayan-yogii
npm install
npm run dev
```

The application will start in development mode.

---

## 🌐 Backend Configuration

The frontend dynamically connects to the backend using environment variables. You can switch between hosted or local backends by adjusting the values in `.env.local`.

---

## 📍 Location

This project is built specifically for **Himalayan Yogini**, a yoga studio based in **Pokhara, Nepal**.

---
