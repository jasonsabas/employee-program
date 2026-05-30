/**
 * Employee Program Lead Form — Backend API
 * Stack: Express.js + Nodemailer
 * Run: npm install && node server.js
 */

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// ─── In-Memory Store (replace with DB in production) ──────────────────────────
// Structure: Map<refId, LeadObject>
const leads = new Map();

// ─── Static Data ──────────────────────────────────────────────────────────────
const VEHICLE_BRANDS = [
  'Toyota', 'Honda', 'Yamaha', 'Suzuki', 'Mitsubishi',
  'Daihatsu', 'Nissan', 'Mazda', 'Isuzu', 'Kawasaki',
  'Vespa', 'Bajaj', 'TVS', 'Wuling', 'DFSK', 'Lainnya',
];

const VEHICLE_TYPES = ['Motor', 'Mobil', 'Truk'];

const STATUS_LABELS = {
  'diterima':              { label: 'Diterima',            description: 'Formulir telah diterima oleh sistem.' },
  'dalam-peninjauan':      { label: 'Dalam Peninjauan',    description: 'Tim HR sedang meninjau data pendaftaranmu.' },
  'survei-dijadwalkan':    { label: 'Survei Dijadwalkan',  description: 'Jadwal kunjungan/survei akan segera dikonfirmasi.' },
  'selesai':               { label: 'Selesai',              description: 'Proses selesai dan kamu terdaftar dalam program.' },
  'tidak-memenuhi-syarat': { label: 'Tidak Memenuhi Syarat', description: 'Pendaftaran tidak memenuhi kriteria. HR akan menghubungimu.' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateRefId = () => {
  const year = new Date().getFullYear();
  const seq  = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `EMP-${year}-${seq}`;
};

const formatDateId = (iso) =>
  new Date(iso).toLocaleString('id-ID', {
    timeZone:  'Asia/Jakarta',
    day:       '2-digit',
    month:     'long',
    year:      'numeric',
    hour:      '2-digit',
    minute:    '2-digit',
    hour12:    false,
  }) + ' WIB';

// ─── Validation ───────────────────────────────────────────────────────────────
const validateLead = (body) => {
  const errors = {};

  if (!body.tipeKendaraan || !VEHICLE_TYPES.includes(body.tipeKendaraan))
    errors.tipeKendaraan = 'Tipe kendaraan tidak valid.';

  if (!body.merkKendaraan || body.merkKendaraan.trim().length < 2)
    errors.merkKendaraan = 'Merk kendaraan wajib diisi.';

  if (!body.nama || body.nama.trim().length < 3)
    errors.nama = 'Nama minimal 3 karakter.';

  const hp = (body.noHP || '').replace(/[-\s]/g, '');
  if (!hp || !/^08\d{8,11}$/.test(hp))
    errors.noHP = 'Format nomor HP tidak valid. Gunakan format 08xx-xxxx-xxxx.';

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.email = 'Format email tidak valid.';

  if (!body.nik || !/^\d{16}$/.test(body.nik))
    errors.nik = 'NIK harus tepat 16 digit angka.';

  if (!body.alamat || body.alamat.trim().length < 20)
    errors.alamat = 'Alamat minimal 20 karakter (sertakan RT/RW, Kelurahan, Kecamatan).';

  return errors;
};

// ─── Email Transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const buildHREmailHTML = (lead) => `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #F4F6FB; padding: 32px 16px; color: #1A2038; }
  .wrapper { max-width: 600px; margin: 0 auto; }
  .header  { background: linear-gradient(135deg, #0F1422 0%, #1B2E5C 100%); border-radius: 12px 12px 0 0; padding: 28px 32px; }
  .header h1 { color: #fff; font-size: 20px; font-weight: 600; }
  .header p  { color: rgba(255,255,255,0.65); font-size: 13px; margin-top: 4px; }
  .body   { background: #fff; padding: 28px 32px; border: 1px solid #E2E8F0; border-top: none; }
  .ref-box { background: #F0F5FF; border: 1px solid #C7D7F5; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; }
  .ref-box .label { font-size: 11px; color: #6B7FA8; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 600; }
  .ref-box .value { font-size: 22px; font-weight: 700; color: #1B2E5C; margin-top: 2px; letter-spacing: 0.04em; }
  .section-title { font-size: 11px; color: #6B7FA8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin: 22px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #E8EEF8; }
  table { width: 100%; border-collapse: collapse; }
  tr td { padding: 9px 0; font-size: 14px; border-bottom: 1px solid #F1F5FB; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  td.key { color: #6B7FA8; width: 42%; font-weight: 500; }
  td.val { color: #1A2038; font-weight: 500; }
  .footer { background: #F8FAFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px; padding: 16px 32px; font-size: 12px; color: #8895B3; text-align: center; line-height: 1.6; }
  .badge  { display: inline-block; background: #DCFCE7; color: #15803D; font-size: 11px; font-weight: 600; border-radius: 20px; padding: 3px 10px; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>📋 Lead Baru — Program Karyawan</h1>
    <p>Ada pendaftaran baru yang masuk melalui aplikasi</p>
  </div>
  <div class="body">
    <div class="ref-box">
      <div class="label">Nomor Referensi</div>
      <div class="value">${lead.id}</div>
    </div>

    <div class="section-title">Informasi Karyawan</div>
    <table>
      <tr><td class="key">Nama Lengkap</td><td class="val">${lead.employee.name}</td></tr>
      <tr><td class="key">NIK (KTP)</td><td class="val">${lead.employee.nik}</td></tr>
      <tr><td class="key">No. HP</td><td class="val">${lead.employee.phone}</td></tr>
      <tr><td class="key">Email Karyawan</td><td class="val">${lead.employee.email}</td></tr>
      <tr><td class="key">Alamat Tinggal</td><td class="val">${lead.employee.address}</td></tr>
    </table>

    <div class="section-title">Informasi Kendaraan</div>
    <table>
      <tr><td class="key">Tipe Kendaraan</td><td class="val">${lead.vehicle.type}</td></tr>
      <tr><td class="key">Merk Kendaraan</td><td class="val">${lead.vehicle.brand}</td></tr>
    </table>

    <div class="section-title">Metadata Pengiriman</div>
    <table>
      <tr><td class="key">Tanggal &amp; Waktu</td><td class="val">${formatDateId(lead.submittedAt)}</td></tr>
      <tr><td class="key">Status</td><td class="val"><span class="badge">Diterima</span></td></tr>
    </table>
  </div>
  <div class="footer">
    Silakan tindak lanjuti dalam <strong>2–3 hari kerja</strong>.<br>
    Email ini dikirim otomatis dari sistem Program Karyawan. Jangan balas email ini.
  </div>
</div>
</body>
</html>`;

const sendHREmail = async (lead) => {
  if (!process.env.SMTP_USER || !process.env.HR_EMAIL) {
    console.warn('[Email] SMTP_USER or HR_EMAIL not configured — skipping email.');
    return;
  }
  await transporter.sendMail({
    from:    `"Program Karyawan" <${process.env.SMTP_USER}>`,
    to:      process.env.HR_EMAIL,
    cc:      process.env.HR_EMAIL_CC || undefined,
    subject: `[Program Karyawan] Lead Baru: ${lead.employee.name} – ${lead.employee.nik}`,
    html:    buildHREmailHTML(lead),
  });
  console.log(`[Email] Sent to ${process.env.HR_EMAIL} for ref ${lead.id}`);
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/vehicle-brands
app.get('/api/vehicle-brands', (_req, res) => {
  res.json({ success: true, data: VEHICLE_BRANDS });
});

// GET /api/vehicle-types
app.get('/api/vehicle-types', (_req, res) => {
  res.json({ success: true, data: VEHICLE_TYPES });
});

// POST /api/leads  — create a new lead
app.post('/api/leads', async (req, res) => {
  const errors = validateLead(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Duplicate NIK check
  for (const [, existing] of leads) {
    if (existing.employee.nik === req.body.nik) {
      return res.status(409).json({
        success: false,
        error: 'NIK ini sudah terdaftar. Hubungi HR untuk informasi lebih lanjut.',
      });
    }
  }

  const now   = new Date();
  const refId = generateRefId();

  const lead = {
    id:          refId,
    submittedAt: now.toISOString(),
    status:      'dalam-peninjauan',
    statusHistory: [
      {
        status:      'diterima',
        timestamp:   now.toISOString(),
        label:       STATUS_LABELS['diterima'].label,
        description: STATUS_LABELS['diterima'].description,
      },
      {
        status:      'dalam-peninjauan',
        timestamp:   new Date(now.getTime() + 60000).toISOString(), // +1 min
        label:       STATUS_LABELS['dalam-peninjauan'].label,
        description: STATUS_LABELS['dalam-peninjauan'].description,
      },
    ],
    employee: {
      name:    req.body.nama.trim(),
      nik:     req.body.nik.trim(),
      phone:   req.body.noHP.trim(),
      email:   req.body.email.trim().toLowerCase(),
      address: req.body.alamat.trim(),
    },
    vehicle: {
      type:  req.body.tipeKendaraan,
      brand: req.body.merkKendaraan.trim(),
    },
    programDetails: {
      tenure:          '60 Bulan',
      skemaPembayaran: 'Potong Gaji',
      estimasiPenyerahan: 'TBD',
    },
  };

  leads.set(refId, lead);

  // Fire email — don't await so response is fast
  sendHREmail(lead).catch(err => console.error('[Email] Delivery failed:', err.message));

  return res.status(201).json({
    success: true,
    data: {
      id:          lead.id,
      status:      lead.status,
      submittedAt: lead.submittedAt,
    },
  });
});

// GET /api/leads/:id  — get full lead (for tracker)
app.get('/api/leads/:id', (req, res) => {
  const lead = leads.get(req.params.id.toUpperCase());
  if (!lead) return res.status(404).json({ success: false, error: 'Lead tidak ditemukan.' });
  res.json({ success: true, data: lead });
});

// GET /api/leads/:id/status  — lightweight status check
app.get('/api/leads/:id/status', (req, res) => {
  const lead = leads.get(req.params.id.toUpperCase());
  if (!lead) return res.status(404).json({ success: false, error: 'Lead tidak ditemukan.' });
  res.json({
    success: true,
    data: { id: lead.id, status: lead.status, statusHistory: lead.statusHistory },
  });
});

// PATCH /api/leads/:id/status  — HR updates the status
app.patch('/api/leads/:id/status', (req, res) => {
  const lead = leads.get(req.params.id.toUpperCase());
  if (!lead) return res.status(404).json({ success: false, error: 'Lead tidak ditemukan.' });

  const { status } = req.body;
  if (!STATUS_LABELS[status]) {
    return res.status(400).json({
      success: false,
      error: `Status tidak valid. Pilihan: ${Object.keys(STATUS_LABELS).join(', ')}`,
    });
  }

  lead.status = status;
  lead.statusHistory.push({
    status,
    timestamp:   new Date().toISOString(),
    label:       STATUS_LABELS[status].label,
    description: req.body.description || STATUS_LABELS[status].description,
  });

  leads.set(lead.id, lead);
  res.json({ success: true, data: lead });
});

// GET /api/leads  — list all leads (HR admin use, protect with auth in prod)
app.get('/api/leads', (_req, res) => {
  const all = Array.from(leads.values()).map(l => ({
    id:          l.id,
    status:      l.status,
    submittedAt: l.submittedAt,
    name:        l.employee.name,
    nik:         l.employee.nik,
    vehicle:     `${l.vehicle.brand} (${l.vehicle.type})`,
  }));
  res.json({ success: true, total: all.length, data: all });
});

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404 catch-all
app.use((_req, res) => res.status(404).json({ success: false, error: 'Route not found.' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[Error]', err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅  API server running → http://localhost:${PORT}`);
  console.log(`   POST   /api/leads`);
  console.log(`   GET    /api/leads/:id`);
  console.log(`   GET    /api/leads/:id/status`);
  console.log(`   PATCH  /api/leads/:id/status`);
  console.log(`   GET    /api/vehicle-brands`);
  console.log(`   GET    /api/vehicle-types`);
});
