# 🚀 SAPAT

Welcome to **SAPAT**, a full-stack web application developed for optimizing feed formulations. SAPAT is deployed at [https://sapat.netlify.app](https://sapat.netlify.app) and utilizes a Node.js backend along with a React/Vite frontend, offering a robust platform for feed formulation management.

## 🎉 Overview

SAPAT is designed to streamline feed formulation optimization by integrating secure, Google-based user authentication with a comprehensive dashboard. The system facilitates the effective management of ingredients, nutrients, and formulations within a collaborative environment. Its responsive design ensures consistent performance across a wide range of devices.

## ✨ Key Features

### 🔒 Authentication & User Management
- Login/Signup through Google account

### 📊 Dashboard
- Total active formulations overview
- Total ingredients counter
- Feed classifications summary
- Logs of recent formulations

### 🌾 Ingredients Management
- Add new ingredients
- Edit existing ingredients
- Delete ingredients
- Search ingredients
- Import ingredient data with nutrients from Excel Sheet
- Export ingredient data with nutrients to Excel Sheet
- Pagination for easy navigation

### 🧪 Nutrients Management
- Add new nutrients
- Edit existing nutrients
- Delete nutrients
- Search nutrients
- Pagination for easy navigation

### 📋 Formulations Management
- Add new formulations
- Edit existing formulations
- Delete formulations
- Search formulations
- Pagination for easy navigation
- Detailed formulation view

### 🔬 View Formulation Tools
- Edit basic formulation information
- Add/delete ingredients and nutrients
- Set and adjust constraints
- Save formulations to database
- Share formulations with other users
- Adjust user permissions (owner, can edit, can view)
- Formulation optimization using:
  * Simplex algorithm
  * Particle Swarm Optimization
- Generate formulation reports to PDF
- Real-time sharing and collaborative editing

## 🛠️ Running Locally

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (Node Package Manager)

### Backend Setup

Install dependencies:

```bash
cd backend
npm install
```

Run:
```bash
npm run dev
```

### Frontend Setup

Install dependencies:

```bash
cd frontend/SAPAT
npm install
```

Run:
```bash
npm run dev
```

## 📚 API Documentation

SAPAT provides a comprehensive RESTful API for integrating with the platform or building custom applications. The full API documentation is available here:

[SAPAT API Documentation](https://documenter.getpostman.com/view/36732971/2sB2ca5KNV)

