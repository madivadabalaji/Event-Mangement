# EventHub - Centralized Event Management Portal

A full-stack, enterprise-grade Event Management Platform featuring dedicated **Student** and **Organizer** portals, real-time QR attendance verification, and live analytics.

---

## 🚀 Quick Start (1-Click Run)

1. **Option A (Instant Start via Batch Script):**
   - Double-click `start.bat`
   - It will start the server and open `http://localhost:3000` automatically.

2. **Option B (Command Line):**
   ```bash
   npm install
   node server.js
   ```
   Open your browser to: **`http://localhost:3000`**

---

## 🔐 Login Credentials & Portals

The application features **separate login portals** for Students and Event Organizers with **1-click quick demo buttons**:

### 🎓 1. Student Portal
- **Demo Credentials:**
  - **Email:** `student@campus.edu` | **Password:** `student123` (Aarav Sharma)
  - **Email:** `sneha@campus.edu` | **Password:** `student123` (Sneha Patel)
  - **Email:** `vikram@campus.edu` | **Password:** `student123` (Vikram Rao)
- **Student Capabilities:**
  - Browse active events and seat availability.
  - **1-Click Event Registration** (automatically uses student profile).
  - **My Registered Tickets & Passes** view with printable/downloadable digital QR passes.
  - Real-time attendance check-in status (`Confirmed` vs `Attended`).
  - View event announcements and notifications.

### 💼 2. Event Organizer Portal
- **Demo Credentials:**
  - **Email:** `organizer@campus.edu` | **Password:** `admin123`
- **Organizer Capabilities:**
  - **Event Management**: Create new events, edit details, delete events, set seat capacity quotas.
  - **QR Attendance Verification Terminal**: Live camera QR scanner (`html5-qrcode`), manual ticket input, 1-click test simulation chips, duplicate scan alerts, and live audit feed.
  - **Live Analytics & Turnout Reporting**: Attendance vs. Registrations comparison charts, Category doughnut charts, Hourly velocity line charts, and **1-Click CSV Report Download**.
  - **Attendees Directory**: Search and filter all registered participants across events.
  - **Announcements & Broadcasts**: Publish campus-wide or event-specific notifications.
