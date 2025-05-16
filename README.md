# Vehiman Web Application

Vehiman is a vehicle management web application that allows guest users to view vehicle information, monitor expiry statuses (e.g., insurance and pollution), and manage user sessions with automated guest cleanup.

## 🌐 Live Site

Hosted on **Vercel**: [View Live →](https://vehiman.vercel.app)

---

## 🚀 Features

- 🔐 **Guest Login System**
  - Temporary guest access with expiry cleanup
- 🚘 **Vehicle Management**
  - Grid view of vehicles with status
  - Expiry warnings for insurance and pollution
- 👤 **Profile View**
  - Display guest name and phone number
- 📅 **Automated Cleanup**
  - Edge Function deletes expired guest entries daily
- ☁️ **Firestore Integration**
  - Realtime data from Firebase Firestore

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router, React Icons
- **Backend**: Firebase Firestore, Firebase Admin SDK
- **Deployment**: Vercel
- **Scheduled Jobs**: Vercel Cron + Edge Function
