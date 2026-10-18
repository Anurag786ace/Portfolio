# Anurag Giri — Personal Portfolio

A cinematic, interactive full-stack portfolio constructed with React 19, Three.js WebGL shaders, Node.js, Express, and MongoDB.

---

## 🛠️ Tech Architecture

- **Frontend (`/Frontend`):** React 19, Vite, Three.js (interactive 3D sculpture & particle contours), Vanilla CSS design system, Procedural Web Audio engine, Command Palette (`⌘K`).
- **Backend (`/Backend`):** Node.js, Express, Mongoose, Nodemailer, Dotenv, CORS.
- **Database:** MongoDB (`mongodb://localhost:27017/Portfolio`).
- **Collections:**
  - `messages`: Visitor inquiries from the Contact section.
  - `subscribers`: Circle & newsletter emails.

---

## 🚀 Running the Project

### 1. Start MongoDB
Ensure MongoDB is running locally on port 27017:
```bash
# Verify connection
mongodb://localhost:27017/Portfolio
```

### 2. Start the Backend API
```bash
cd Backend
npm install
npm run dev
# Running on http://localhost:5000
```

### 3. Start the Frontend
```bash
cd Frontend
npm install
npm run dev
# Running on http://localhost:5173
```

*(Or from root workspace: `npm run dev:backend` and `npm run dev:frontend`)*

---

## 📬 Contact Inquiries & Email Notifications
- Contact form submissions and circle subscriptions are stored directly in MongoDB.
- To receive instant email notifications at `sankhaanurag2005@gmail.com` and send courtesy receipts to users, configure your `SMTP_USER` and `SMTP_PASS` (Gmail App Password) in `Backend/.env`.
- You can inspect all submitted inquiries directly inside the portfolio by pressing **`⌘K` / `Ctrl+K`** and choosing **"View Inquiries & Messages (MongoDB Database)"**.
