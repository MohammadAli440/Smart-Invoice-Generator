# 🧾 Smart Invoice Generator Web App

The **Smart Invoice Generator Web App** is a full-stack application designed to help users create, manage, and share professional invoices with ease.

This workspace includes both the **frontend** and **backend** boilerplates, built using modern web technologies for scalability and performance.

---

## 📁 Project Structure

Smart-Invoice-Generator/
│
├── frontend/ # Next.js frontend application
├── backend/ # NestJS-styled backend API
└── README.md

yaml
Copy code

---

## 🚀 Tech Stack

### Frontend
- Next.js
- React.js
- Tailwind CSS
- TypeScript

### Backend
- Node.js
- NestJS-style architecture
- REST APIs
- Environment-based configuration

---

## ✨ Features (Planned & In Progress)

- User authentication
- Create and customise invoices
- Auto-calculate totals & taxes
- Download invoices as PDF
- Send invoices via email
- Business & client management
- Secure backend APIs

---

## 🔐 Environment Variables

Each application uses environment variables for configuration.

### Backend `.env`
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

yaml
Copy code

> ⚠️ Do not commit `.env` files to GitHub.

---

## ▶️ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/USERNAME/REPO_NAME.git
cd Smart-Invoice-Generator
2️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
3️⃣ Backend Setup
bash
Copy code
cd backend
npm install
npm run start:dev
🌐 Running the App
Frontend: http://localhost:3000

Backend API: http://localhost:5000
