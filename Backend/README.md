# Portfolio Backend API (MongoDB & Notification Engine)

Backend service for Anurag Giri's portfolio website. Connects to MongoDB, persists contact inquiries and newsletter subscribers, and sends real-time email notifications.

---

## 🗄️ Database Connection
- **MongoDB URI:** `mongodb://127.0.0.1:27017/Portfolio` (configured in `.env`)
- **Collections:**
  - `messages`: Stores inquiries submitted from the Contact form.
  - `subscribers`: Stores emails from the "Join the Circle" modal.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
A ready-to-use `.env` file is generated. To activate direct email forwarding to `sankhaanurag2005@gmail.com`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/Portfolio
ADMIN_EMAIL=sankhaanurag2005@gmail.com

# SMTP Settings (e.g. Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=sankhaanurag2005@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM="Anurag Giri Portfolio" <sankhaanurag2005@gmail.com>
```

> **Note on SMTP:** If `SMTP_USER` and `SMTP_PASS` are left empty, all incoming inquiries and subscriptions are still **100% safely stored in MongoDB**, and a notification alert is printed to your server console. Once you enter your Gmail App Password, real emails will be dispatched automatically!

### 3. Run Backend Server
```bash
# Production mode
npm start

# Development watch mode
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check backend server and MongoDB status |
| `POST` | `/api/contact` | Submit contact form (`name`, `email`, `message`, `role`) |
| `POST` | `/api/subscribe` | Subscribe to circle/newsletter (`email`, `source`) |
| `GET` | `/api/messages` | View all submitted inquiries stored in MongoDB |
| `GET` | `/api/subscribers` | View all circle subscribers |
| `GET` | `/api/stats` | Inquiries & subscriber count overview |

---

## 🔍 Viewing Messages from Portfolio UI
Press **`⌘K`** (or **`Ctrl+K`**) anywhere on the portfolio to open the Command Palette, then select:
**"View Inquiries & Messages (MongoDB Database)"**
to view all submissions in real-time directly inside the web interface.
