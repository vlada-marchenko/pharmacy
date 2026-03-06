# 💊 E-Pharmacy Management System

A professional, full-stack pharmacy management platform designed for shop owners to digitize their inventory, manage drug stores, and oversee medication logistics. This application handles the entire lifecycle from shop registration to individual product management.

## 🚀 Live Links
* **Frontend:** [https://pharmacy-ten-woad.vercel.app](https://pharmacy-ten-woad.vercel.app)
* **Backend API:** [https://pharmacy-backend-app.onrender.com/api](https://pharmacy-backend-app.onrender.com/api)

---

## 🛠 Tech Stack

### Frontend
* **Core:** Next.js 14+ (App Router)
* **State & Forms:** React Hook Form with Yup schema validation
* **Auth:** JWT-based authentication with `js-cookie` and LocalStorage persistence
* **Styling:** CSS Modules for component-scoped styling
* **Notifications:** React-Toastify for real-time user feedback

### Backend
* **Runtime:** Node.js & Express
* **Database:** MongoDB with Mongoose ODM
* **API Client:** Axios with interceptors for automatic header injection

---

## ⚙️ Key Features

* **User Authentication:** Secure login and registration with automatic redirection based on shop ownership status.
* **Shop Lifecycle Management:** Users can create a shop profile, which is then permanently linked to their user account in the database.
* **Dynamic Inventory:** CRUD operations for medication, including price management, category assignment, and photo uploads.
* **Dashboard Statistics:** View analytics and inventory data specific to the authenticated shop.
* **Responsive Design:** Fully optimized for desktop and mobile pharmacy management.

