# 🚀 Bookifyr - Event Booking Platform

Bookifyr is a full-stack MERN event booking system that allows users to browse events, book tickets with OTP verification, and manage bookings through a secure role-based system. Admins can create and manage events, as well as approve or reject bookings with full control over payments and seat availability.

---

## ✨ Features

### 👤 User Features
- Secure Authentication (JWT + bcrypt)
- Email OTP verification for account activation & booking
- Browse and book events
- View personal bookings dashboard
- Cancel bookings anytime

### 🛠️ Admin Features
- Create, update, and delete events
- Manage all booking requests
- Approve / reject bookings
- Mark bookings as Paid / Non-Paid
- View event analytics (pending, confirmed, revenue)

### 🎟️ Event System
- Free & Paid events support
- Real-time seat availability tracking
- Prevents overbooking with safe seat handling

### 📧 Notifications
- Email notifications using Nodemailer for booking confirmation

---

## ⚙️ Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js
- JWT Authentication
- Nodemailer

---

## 🚀 Setup Instructions

- Install Dependencies

- npm run install:all

## ▶️ Run Backend
- cd server
- npm run dev

## ▶️ Run Frontend
- cd client
- npm run dev