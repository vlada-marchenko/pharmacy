# Pharmacy Manager 💊

A full-stack pharmacy management system with shop-specific routing, secure authentication, and real-time inventory tracking.

---

## About the Project

**Pharmacy Manager** is a web application designed for managing pharmacy operations.

A user can:

- Register/Login with secure JWT authentication
- Manage inventory – add, edit, and delete medicines
- Track stock levels – real-time updates and low-stock alerts
- View shop dashboard – shop-specific data and analytics
- Browse medicine catalog – search and filter by category, name, or supplier
- Process sales – record transactions and update inventory automatically

---

## Main Features

### 🔐 Authentication & Authorization

- Secure **JWT-based authentication** with token refresh mechanism
- Session persistence using both **cookies and localStorage** for resilience
- **Shop-owner relationship linking** – each user is associated with their shop in the database
- **Protected routes** – unauthorized access redirects to login
- **Auto-logout** on token expiration with session cleanup

---

### 📊 Dashboard

- **Shop-specific routing** – dynamic URL structure based on shop ID  
  `/shop/:shopId/...`
- **Real-time analytics** – total medicines, low stock alerts, recent sales
- **Quick access panels** – navigate to inventory, sales, or add new medicine
- **Responsive layout** – optimized for mobile, tablet, and desktop

---

### 💊 Inventory Management

- **Add/Edit/Delete medicines** with form validation
- **Stock tracking** – current quantity, reorder level, supplier info
- **Category filtering** – organize by medicine type (e.g., antibiotics, painkillers)
- **Search functionality** – find medicines by name or active ingredient
- **Low-stock notifications** – visual indicators and alerts

---

### 💰 Sales & Transactions

- **Record sales** – decrease inventory automatically on sale
- **Transaction history** – view past sales with timestamps
- **Sales analytics** – daily / weekly / monthly revenue charts

---

### 📦 Medicine Details

- **Comprehensive information** – dosage, manufacturer, expiry date, price
- **Modal view** – detailed medicine card with edit/delete actions
- **Image upload** – optional product images for medicines

---

## Tech Stack

### Frontend

- **React** – component-based UI
- **TypeScript** – type-safe development
- **Vite** – fast build tool and dev server
- **React Router** – dynamic shop-specific routing
- **Axios** – HTTP client with interceptors for auth tokens
- **CSS Modules** – scoped styling
- **react-toastify** – user notifications
- **yup** – form validation
- **react-spinners** – loading states

---

## Design

The UI follows a **clean, professional design**:

- **Responsive layout** – mobile-first approach (Mobile / Tablet / Desktop)
- **Modals** for medicine details, add/edit forms, and confirmations
- **Dashboard cards** – quick stats and navigation
- **Data tables** – sortable and filterable inventory/sales lists
- **Toast notifications** – success/error feedback
- **Loading states** – spinners during async operations
