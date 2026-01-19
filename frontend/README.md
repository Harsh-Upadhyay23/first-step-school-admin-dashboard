# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# FirstStep Admin Panel – Backend

## 🚀 Demo Screenshots

Below are some demo screenshots of the application:

### 📸 Screen 1
![Demo Screen 1](./public/image1.jpg)

### 📸 Screen 2
![Demo Screen 2](./public/image2.jpg)

### 📸 Screen 3
![Demo Screen 3](./public/image3.jpg)

Backend for **FirstStep Pre-School Admin Panel**, built using **Node.js, Express, MongoDB**.

---

## 🚀 Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- REST APIs

---

## 📁 Folder Structure
# FirstStep Admin Panel – Backend

Backend for **FirstStep Pre-School Admin Panel**, built using **Node.js, Express, MongoDB**.

---

## 🚀 Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- REST APIs

---

## 📁 Folder Structure
backend/
│── controllers/
│ ├── authController.js
│ ├── studentController.js
│ ├── feeController.js
│
│── models/
│ ├── Student.js
│ ├── Fee.js
│ ├── Payment.js
│ ├── Counter.js
│
│── routes/
│ ├── authRoutes.js
│ ├── studentRoutes.js
│ ├── feeRoutes.js
│
│── middleware/
│ ├── authMiddleware.js
│
│── config/
│ ├── db.js
│
│── server.js
│── .env
│── package.json

## 🔐 Authentication
- JWT based authentication
- Token stored on frontend (localStorage)
- All student & fees routes are **protected**

---

## ▶️ Run Backend
```bash
npm install
npm run dev
http://localhost:5000

📌 Major Features

Student Admission (with auto Student ID & Roll No)

Fee Management (Total, Paid, Pending)

Payment History

Class-wise Pending Fees

Cascade Delete (Student → Fees → Payments)

Admission Date auto saved
Auth

POST /api/auth/login

Students

POST /api/students

GET /api/students

GET /api/students/:id

PUT /api/students/:id

DELETE /api/students/:id

Fees

GET /api/fees/:studentId

POST /api/fees/pay/:studentId

GET /api/fees/history/:studentId

GET /api/fees/pending/:className


---

# 📘 Frontend – `README.md`

```md
# FirstStep Admin Panel – Frontend

Frontend for **FirstStep Pre-School Admin Panel**, built with **React + Vite + Tailwind CSS**.

---

## 🚀 Tech Stack
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS

---

## 📁 Folder Structure
src/
│── api/
│ ├── axios.js
│ ├── studentApi.js
│ ├── feeApi.js
│
│── components/
│ ├── common/
│ ├── fees/
│ │ ├── FeeSummary.jsx
│ │ ├── PaymentForm.jsx
│ │ ├── PaymentHistory.jsx
│ │
│ ├── students/
│ │ ├── StudentForm.jsx
│ │ ├── StudentList.jsx
│ │ ├── StudentRow.jsx
│ │
│ ├── layout/
│ ├── Header.jsx
│ ├── Sidebar.jsx
│
│── pages/
│ ├── Dashboard.jsx
│ ├── Students.jsx
│ ├── AddStudent.jsx
│ ├── EditStudent.jsx
│ ├── Fees.jsx
│ ├── PendingFees.jsx
│ ├── Login.jsx
│
│── App.jsx
│── main.jsx

---

## 🔐 Authentication Flow
1. Login page
2. JWT token saved in `localStorage`
3. Axios interceptor attaches token
4. Protected routes accessible

---

## ▶️ Run Frontend
```bash
npm install
npm run dev

