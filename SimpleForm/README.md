# Employee Program — Lead Form
> Full-stack app: React/Vite frontend + Express.js backend

---

## Project Structure

```
employee-program/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── App.jsx         # All 3 screens (Form → Success → Tracker)
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/                # Express.js API
    ├── server.js           # All routes + email notification
    ├── .env.example
    └── package.json
```

---

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # Edit with your SMTP credentials
node server.js
# → API running at http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# → App running at http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/leads` | Submit lead form |
| `GET` | `/api/leads/:id` | Get full lead data (for tracker) |
| `GET` | `/api/leads/:id/status` | Get status only |
| `PATCH` | `/api/leads/:id/status` | Update status (HR use) |
| `GET` | `/api/leads` | List all leads |
| `GET` | `/api/vehicle-brands` | Get vehicle brand list |
| `GET` | `/api/vehicle-types` | Get vehicle types |
| `GET` | `/health` | Health check |

### POST /api/leads — Request Body

```json
{
  "tipeKendaraan": "Motor",
  "merkKendaraan": "Honda",
  "nama": "Budi Santoso",
  "noHP": "081234567890",
  "email": "budi@perusahaan.com",
  "nik": "3201234567890001",
  "alamat": "Jl. Merdeka No. 10, RT 02/RW 05, Kel. Sukajadi, Kec. Bandung Barat"
}
```

### PATCH /api/leads/:id/status — Update Status

```json
{
  "status": "survei-dijadwalkan",
  "description": "Survei dijadwalkan pada 5 Juni 2026"
}
```

Valid status values:
- `diterima`
- `dalam-peninjauan`
- `survei-dijadwalkan`
- `selesai`
- `tidak-memenuhi-syarat`

---

## Email Setup (Nodemailer)

In `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourcompany.com
SMTP_PASS=your_app_password
HR_EMAIL=hr-team@yourcompany.com
HR_EMAIL_CC=hr-manager@yourcompany.com   # optional
```

**Gmail note**: Use [App Passwords](https://support.google.com/accounts/answer/185833) — not your regular password.

If `SMTP_USER` or `HR_EMAIL` are not set, the server will skip email sending and log a warning (no crash).

---

## Production Checklist

- [ ] Replace in-memory `leads` Map with a real database (PostgreSQL / MySQL / MongoDB)
- [ ] Add authentication middleware to `GET /api/leads` and `PATCH /api/leads/:id/status`
- [ ] Configure `CORS_ORIGIN` to your production domain
- [ ] Set `VITE_API_URL` to your deployed backend URL
- [ ] Add rate limiting (`express-rate-limit`) to `POST /api/leads`
- [ ] Encrypt PII fields (NIK, HP, email) at rest
- [ ] Add push notification service for status change alerts
- [ ] Review consent copy with Legal team (UU PDP compliance)

---

## Screens

| Screen | Trigger |
|--------|---------|
| **Formulir Pendaftaran** | App loads |
| **Pendaftaran Berhasil** | After successful form submit |
| **Lacak Status Pendaftaran** | After clicking "Lihat Status Pendaftaran" |
