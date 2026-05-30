import { useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens — matches the dark-navy UI from the design reference
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bgPage:       '#0B0F1C',
  bgNav:        '#0F1423',
  bgCard:       '#141929',
  bgInput:      '#1A2035',
  bgInputHover: '#1E253D',
  bgSelected:   '#162045',
  bgSuccess:    '#FFFFFF',
  border:       '#232C47',
  borderFocus:  '#4169E1',
  borderActive: '#3B5BDB',
  text:         '#FFFFFF',
  textSec:      '#7B8BB2',
  textMuted:    '#4D5A7A',
  blue:         '#4169E1',
  blueDim:      '#1E2C58',
  blueBadge:    '#EEF3FF',
  blueBadgeText:'#3451C7',
  green:        '#22C55E',
  greenBg:      '#DCFCE7',
  greenDark:    '#16A34A',
  orange:       '#F59E0B',
  red:          '#EF4444',
  btnBg:        '#111E3C',
  btnHover:     '#172444',
  sectionLine:  '#3B5BDB',
};

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────────────────────────────────────
const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);

const IconHelp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconMotor = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="2.5"/>
    <circle cx="18.5" cy="17.5" r="2.5"/>
    <path d="M8 17h7"/>
    <path d="M6 17l1.5-5H14l2 3.5"/>
    <path d="M11 12l-1-5H8.5"/>
    <path d="M15.5 12H18l1 3"/>
    <path d="M10 7h3"/>
  </svg>
);

const IconCar = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3v-5l2-5h14l2 5v5h-2"/>
    <circle cx="7.5" cy="17.5" r="1.5"/>
    <circle cx="16.5" cy="17.5" r="1.5"/>
    <path d="M5 12h14"/>
  </svg>
);

const IconTruck = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="13" height="13" rx="1"/>
    <path d="M14 8h4l3 4.5V19h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2"/>
    <circle cx="18.5" cy="18.5" r="2"/>
  </svg>
);

const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const IconList = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2"/>
    <line x1="7" y1="9" x2="17" y2="9"/>
    <line x1="7" y1="13" x2="17" y2="13"/>
    <line x1="7" y1="17" x2="12" y2="17"/>
  </svg>
);

const IconSupport = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="4"/>
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/>
    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/>
    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
  </svg>
);

const IconProfile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconCheck = ({ size = 14, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const IconDoc = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1,4 1,10 7,10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.56"/>
  </svg>
);

const IconSpark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L9 9H2l6 4.5L5.5 22 12 17l6.5 5L16 13.5 22 9h-7z"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Shared Components
// ─────────────────────────────────────────────────────────────────────────────

const NavBar = ({ title, onBack, showHelp = true }) => (
  <div style={{
    display: 'flex', alignItems: 'center',
    padding: '14px 16px 14px',
    background: C.bgNav,
    borderBottom: `1px solid ${C.border}`,
    gap: 10,
  }}>
    {onBack ? (
      <button onClick={onBack} aria-label="Kembali" style={navBtnStyle}>
        <IconBack />
      </button>
    ) : (
      <div style={{ width: 36 }} />
    )}
    <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600, color: C.text }}>
      {title}
    </span>
    {showHelp ? (
      <button aria-label="Bantuan" style={navBtnStyle}>
        <IconHelp />
      </button>
    ) : (
      <div style={{ width: 36 }} />
    )}
  </div>
);

const navBtnStyle = {
  width: 36, height: 36,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'none', border: 'none',
  color: C.textSec, cursor: 'pointer',
  borderRadius: 8, flexShrink: 0,
};

const BottomNav = ({ active, onNavigate }) => {
  const items = [
    { id: 'beranda',  label: 'Beranda',  Icon: IconHome },
    { id: 'status',   label: 'Status',   Icon: IconList },
    { id: 'bantuan',  label: 'Bantuan',  Icon: IconSupport },
    { id: 'profil',   label: 'Profil',   Icon: IconProfile },
  ];
  return (
    <div style={{
      display: 'flex',
      background: C.bgNav,
      borderTop: `1px solid ${C.border}`,
      paddingBottom: 8,
    }}>
      {items.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onNavigate(id)} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 4, padding: '10px 4px 4px',
            color: isActive ? C.blue : C.textMuted,
          }}>
            <Icon />
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, fontFamily: 'inherit' }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const SectionHeader = ({ children }) => (
  <div style={{
    borderLeft: `3px solid ${C.sectionLine}`,
    paddingLeft: 12,
    marginBottom: 16,
    marginTop: 8,
  }}>
    <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0 }}>{children}</h3>
  </div>
);

const FieldLabel = ({ children, required }) => (
  <label style={{ display: 'block', fontSize: 13, color: C.textSec, marginBottom: 6, fontWeight: 500 }}>
    {children}{required && <span style={{ color: C.red, marginLeft: 3 }}>*</span>}
  </label>
);

const inputStyle = (hasError) => ({
  width: '100%',
  background: C.bgInput,
  border: `1px solid ${hasError ? C.red : C.border}`,
  borderRadius: 10,
  padding: '12px 14px',
  color: C.text,
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
});

const FieldError = ({ msg }) =>
  msg ? <p style={{ fontSize: 11, color: C.red, marginTop: 5, fontWeight: 500 }}>{msg}</p> : null;

const FormInput = ({ label, required, placeholder, type = 'text', value, onChange, error, maxLength }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle(error),
          borderColor: error ? C.red : focused ? C.borderFocus : C.border,
        }}
      />
      <FieldError msg={error} />
    </div>
  );
};

const FormTextarea = ({ label, required, placeholder, value, onChange, error, helper }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle(error),
          borderColor: error ? C.red : focused ? C.borderFocus : C.border,
          resize: 'vertical',
          lineHeight: 1.6,
          minHeight: 96,
        }}
      />
      <FieldError msg={error} />
      {helper && !error && (
        <p style={{ fontSize: 12, color: C.textMuted, marginTop: 5, fontStyle: 'italic', lineHeight: 1.5 }}>
          {helper}
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 1 — Form
// ─────────────────────────────────────────────────────────────────────────────
const VEHICLE_TYPES = [
  { id: 'Motor', label: 'Motor', Icon: IconMotor },
  { id: 'Mobil', label: 'Mobil', Icon: IconCar },
  { id: 'Truk',  label: 'Truk',  Icon: IconTruck },
];

const VEHICLE_BRANDS = [
  'Toyota','Honda','Yamaha','Suzuki','Mitsubishi','Daihatsu',
  'Nissan','Mazda','Isuzu','Kawasaki','Vespa','Bajaj','Wuling','DFSK','Lainnya',
];

const FormScreen = ({ onSubmit, isSubmitting }) => {
  const [vehicleType, setVehicleType] = useState('Motor');
  const [merkKendaraan, setMerkKendaraan] = useState('');
  const [showMerkDropdown, setShowMerkDropdown] = useState(false);
  const [nama, setNama] = useState('');
  const [noHP, setNoHP] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [alamat, setAlamat] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('status');

  const validate = () => {
    const e = {};
    if (!merkKendaraan.trim()) e.merkKendaraan = 'Merk kendaraan wajib diisi.';
    if (!nama.trim() || nama.trim().length < 3) e.nama = 'Nama minimal 3 karakter.';
    const hp = noHP.replace(/[-\s]/g, '');
    if (!hp || !/^08\d{8,11}$/.test(hp)) e.noHP = 'Format: 08xx-xxxx-xxxx (10–13 digit).';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Format email tidak valid.';
    if (!nik || !/^\d{16}$/.test(nik)) e.nik = 'NIK KTP harus tepat 16 digit angka.';
    if (!alamat.trim() || alamat.trim().length < 20) e.alamat = 'Alamat minimal 20 karakter.';
    if (!consent) e.consent = 'Persetujuan wajib dicentang sebelum mengirim.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      // Scroll to first error
      setTimeout(() => {
        const el = document.querySelector('[data-error="true"]');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    onSubmit({ tipeKendaraan: vehicleType, merkKendaraan, nama, noHP, email, nik, alamat });
  };

  const clearError = useCallback((field) => {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const canSubmit = !isSubmitting;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <NavBar title="Daftar Program Karyawan" onBack={() => {}} />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', background: C.bgPage }}>
        {/* Hero Banner */}
        <div style={{ margin: '14px 16px', borderRadius: 14, overflow: 'hidden', position: 'relative', height: 130 }}>
          {/* Dark gradient hero with illustration */}
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #0F1C3D 0%, #1A3060 40%, #162550 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
          }}>
            {/* Decorative grid pattern */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  left: `${i * 14}%`, top: 0, bottom: 0,
                  width: 1, background: '#fff',
                }} />
              ))}
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: `${i * 20}%`, left: 0, right: 0,
                  height: 1, background: '#fff',
                }} />
              ))}
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500, marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Program Karyawan
              </p>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.3, maxWidth: 190 }}>
                Wujudkan Kendaraan Impian Anda
              </p>
            </div>

            {/* Decorative car silhouette */}
            <div style={{ position: 'relative', zIndex: 1, opacity: 0.25 }}>
              <IconCar size={56} />
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px 24px' }}>
          {/* ── Informasi Kendaraan ── */}
          <SectionHeader>Informasi Kendaraan</SectionHeader>

          {/* Vehicle Type Toggle */}
          <div style={{ marginBottom: 16 }}>
            <FieldLabel required>Tipe Kendaraan</FieldLabel>
            <div style={{ display: 'flex', gap: 10 }}>
              {VEHICLE_TYPES.map(({ id, label, Icon }) => {
                const selected = vehicleType === id;
                return (
                  <button key={id} onClick={() => setVehicleType(id)} style={{
                    flex: 1,
                    background: selected ? C.bgSelected : C.bgInput,
                    border: `1.5px solid ${selected ? C.blue : C.border}`,
                    borderRadius: 10,
                    padding: '12px 8px',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    color: selected ? '#fff' : C.textSec,
                    transition: 'all 0.15s',
                  }}>
                    <Icon size={24} />
                    <span style={{ fontSize: 12, fontWeight: selected ? 600 : 500, fontFamily: 'inherit' }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Merk Kendaraan — autocomplete-style */}
          <div style={{ marginBottom: 16, position: 'relative' }} data-error={!!errors.merkKendaraan}>
            <FieldLabel required>Merk Kendaraan</FieldLabel>
            <input
              type="text"
              placeholder="Contoh: Toyota, Honda, Yamaha"
              value={merkKendaraan}
              onChange={e => { setMerkKendaraan(e.target.value); clearError('merkKendaraan'); setShowMerkDropdown(true); }}
              onFocus={() => setShowMerkDropdown(true)}
              onBlur={() => setTimeout(() => setShowMerkDropdown(false), 150)}
              style={inputStyle(errors.merkKendaraan)}
            />
            <FieldError msg={errors.merkKendaraan} />
            {showMerkDropdown && merkKendaraan && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#1E2540', border: `1px solid ${C.border}`,
                borderRadius: 10, zIndex: 100, maxHeight: 180, overflowY: 'auto',
                marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}>
                {VEHICLE_BRANDS
                  .filter(b => b.toLowerCase().includes(merkKendaraan.toLowerCase()))
                  .map(brand => (
                    <div key={brand}
                      onMouseDown={() => { setMerkKendaraan(brand); setShowMerkDropdown(false); clearError('merkKendaraan'); }}
                      style={{
                        padding: '11px 14px', cursor: 'pointer', fontSize: 14,
                        color: C.text, borderBottom: `1px solid ${C.border}`,
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#252D4A'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {brand}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* ── Informasi Karyawan ── */}
          <SectionHeader>Informasi Karyawan</SectionHeader>

          <div data-error={!!errors.nama}>
            <FormInput
              label="Nama Lengkap" required
              placeholder="Masukkan nama sesuai KTP"
              value={nama}
              onChange={v => { setNama(v); clearError('nama'); }}
              error={errors.nama}
            />
          </div>

          <div data-error={!!errors.noHP}>
            <FormInput
              label="No. HP" required type="tel"
              placeholder="08xx-xxxx-xxxx"
              value={noHP}
              onChange={v => { setNoHP(v); clearError('noHP'); }}
              error={errors.noHP}
              maxLength={15}
            />
          </div>

          <div data-error={!!errors.email}>
            <FormInput
              label="Email Karyawan" required type="email"
              placeholder="nama@perusahaan.com"
              value={email}
              onChange={v => { setEmail(v); clearError('email'); }}
              error={errors.email}
            />
          </div>

          <div data-error={!!errors.nik}>
            <FormInput
              label="NIK (Sesuai KTP)" required type="text"
              placeholder="16 digit nomor induk kependudukan"
              value={nik}
              onChange={v => { const d = v.replace(/\D/g, '').slice(0, 16); setNik(d); clearError('nik'); }}
              error={errors.nik}
              maxLength={16}
            />
          </div>

          <div data-error={!!errors.alamat}>
            <FormTextarea
              label="Alamat Tempat Tinggal" required
              placeholder="Jl. Nama Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan"
              value={alamat}
              onChange={v => { setAlamat(v); clearError('alamat'); }}
              error={errors.alamat}
              helper="Alamat lengkap diperlukan untuk keperluan survei."
            />
          </div>

          {/* Consent */}
          <div style={{ marginBottom: 20 }} data-error={!!errors.consent}>
            <label style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={e => { setConsent(e.target.checked); clearError('consent'); }}
                style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0, accentColor: C.blue }}
              />
              <span style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>
                Saya menyetujui pengumpulan data ini untuk keperluan Program Karyawan.
              </span>
            </label>
            <FieldError msg={errors.consent} />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: '100%',
              background: canSubmit ? C.btnBg : '#1A2035',
              color: canSubmit ? '#fff' : C.textMuted,
              border: 'none',
              borderRadius: 12,
              padding: '15px',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.15s',
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Mengirim...
              </>
            ) : (
              'Kirim Pendaftaran'
            )}
          </button>
        </div>
      </div>

      <BottomNav active={activeTab} onNavigate={setActiveTab} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 2 — Success
// ─────────────────────────────────────────────────────────────────────────────
const SuccessScreen = ({ refId, name, email, onViewStatus, onHome }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minHeight: '100%', background: C.bgPage,
    padding: '32px 24px',
  }}>
    {/* Floating card */}
    <div style={{
      background: '#fff',
      borderRadius: 20,
      padding: '36px 28px',
      width: '100%',
      maxWidth: 360,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 12,
      textAlign: 'center',
      boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
    }}>
      {/* Sparkle + check icon */}
      <div style={{ position: 'relative', marginBottom: 4 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: C.greenBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        </div>
        <div style={{ position: 'absolute', top: -4, right: -8 }}>
          <IconSpark />
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
        Pendaftaran Berhasil!
      </h2>
      <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, maxWidth: 260 }}>
        Terima kasih, <strong style={{ color: '#111827' }}>{name || 'Kamu'}</strong>. Tim HR kami akan menghubungi kamu dalam 2–3 hari kerja.
      </p>

      {/* Ref number box */}
      <div style={{
        background: '#F8FAFF',
        border: '1px solid #D1D9F0',
        borderRadius: 12,
        padding: '14px 20px',
        width: '100%',
        margin: '4px 0',
      }}>
        <p style={{ fontSize: 11, color: '#8895B3', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          Nomor Referensi
        </p>
        <p style={{ fontSize: 22, fontWeight: 700, color: '#1B2E5C', letterSpacing: '0.04em' }}>
          {refId}
        </p>
      </div>

      {/* CTAs */}
      <button onClick={onViewStatus} style={{
        width: '100%', padding: '13px',
        background: '#111E3C', color: '#fff',
        border: 'none', borderRadius: 10,
        fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginTop: 4,
      }}>
        Lihat Status Pendaftaran
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      <button onClick={onHome} style={{
        width: '100%', padding: '13px',
        background: 'transparent', color: '#111E3C',
        border: '1.5px solid #D1D9F0', borderRadius: 10,
        fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
        cursor: 'pointer',
      }}>
        Kembali ke Beranda
      </button>

      <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
        Butuh bantuan?{' '}
        <a href="#" style={{ color: '#4169E1', textDecoration: 'none', fontWeight: 600 }}>
          Hubungi Support
        </a>
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Screen 3 — Status Tracker
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_STEPS = [
  { id: 'diterima',           label: 'Diterima',           desc: 'Formulir telah diterima oleh sistem.' },
  { id: 'dalam-peninjauan',   label: 'Dalam Peninjauan',   desc: 'Tim HR sedang meninjau pendaftaran kamu.' },
  { id: 'survei-dijadwalkan', label: 'Survei Dijadwalkan', desc: 'Jadwal kunjungan/survei akan segera dikonfirmasi.' },
  { id: 'selesai',            label: 'Selesai',             desc: 'Proses selesai dan kamu terdaftar dalam program.' },
];

const STATUS_ORDER = STATUS_STEPS.map(s => s.id);

const formatDateShort = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const TrackerScreen = ({ lead, onBack, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('status');

  const currentIdx = STATUS_ORDER.indexOf(lead?.status);

  const getStepState = (stepId) => {
    const stepIdx = STATUS_ORDER.indexOf(stepId);
    if (stepIdx < currentIdx) return 'done';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  const historyMap = {};
  (lead?.statusHistory || []).forEach(h => { historyMap[h.status] = h; });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <NavBar title="Status Pendaftaran" onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', background: C.bgPage, padding: '14px 16px 24px' }}>

        {/* Ref card */}
        <div style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: '16px',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            Nomor Referensi
          </p>
          <p style={{ fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: '0.04em', marginBottom: 10 }}>
            {lead?.id}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: C.blueDim, color: '#7B9EF5',
              borderRadius: 20, padding: '4px 10px',
              fontSize: 11, fontWeight: 600,
            }}>
              <IconRefresh /> PENINJAUAN HR
            </span>
            <button onClick={onRefresh} style={{
              background: 'none', border: 'none', color: C.textMuted,
              fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <IconRefresh /> Refresh
            </button>
          </div>
        </div>

        {/* Progress stepper */}
        <div style={{
          background: C.bgCard, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: '16px 16px 8px', marginBottom: 16,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>Lacak Progress</p>

          {STATUS_STEPS.map((step, idx) => {
            const state = getStepState(step.id);
            const isLast = idx === STATUS_STEPS.length - 1;
            const histEntry = historyMap[step.id];

            return (
              <div key={step.id} style={{ display: 'flex', gap: 12 }}>
                {/* Left: dot + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 28 }}>
                  {/* Dot */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: state === 'done' ? C.green : state === 'active' ? '#1E2540' : C.bgInput,
                    border: state === 'active' ? `2px solid ${C.blue}` : state === 'done' ? 'none' : `1.5px solid ${C.border}`,
                  }}>
                    {state === 'done' ? (
                      <IconCheck size={13} color="#fff" />
                    ) : state === 'active' ? (
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.blue }} />
                    ) : (
                      <IconCheck size={13} color={C.textMuted} />
                    )}
                  </div>
                  {/* Connector line */}
                  {!isLast && (
                    <div style={{
                      width: 2, flex: 1, minHeight: 24, marginTop: 3,
                      background: state === 'done' ? C.green : C.border,
                      borderRadius: 2,
                    }} />
                  )}
                </div>

                {/* Right: text */}
                <div style={{ paddingBottom: isLast ? 0 : 20, paddingTop: 2, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 14, fontWeight: state !== 'pending' ? 700 : 500,
                      color: state === 'pending' ? C.textMuted : C.text,
                    }}>
                      {step.label}
                    </span>
                    {state === 'active' && (
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        background: '#1E3A58', color: '#60A5FA',
                        borderRadius: 20, padding: '2px 8px',
                        letterSpacing: '0.04em',
                      }}>
                        SEDANG BERJALAN
                      </span>
                    )}
                    {histEntry && state === 'done' && (
                      <span style={{ fontSize: 11, color: C.textMuted }}>
                        {formatDateShort(histEntry.timestamp)}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5, marginTop: 3 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vehicle Detail Card */}
        {lead?.vehicle && (
          <div style={{
            background: '#111E3C',
            borderRadius: 14, padding: '16px',
            marginBottom: 16,
            border: `1px solid #1E2D55`,
          }}>
            <p style={{ fontSize: 10, color: '#4D6699', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              Detail Kendaraan
            </p>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 14 }}>
              {lead.vehicle.brand} ({lead.vehicle.type})
            </p>

            {[
              { label: 'Tenure', value: lead.programDetails?.tenure || '60 Bulan', color: C.text },
              { label: 'Skema Pembayaran', value: lead.programDetails?.skemaPembayaran || 'Potong Gaji', color: C.text },
              { label: 'Estimasi Penyerahan', value: lead.programDetails?.estimasiPenyerahan || 'TBD', color: C.orange },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0',
                borderTop: `1px solid #1E2D55`,
              }}>
                <span style={{ fontSize: 13, color: '#7B8BB2' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* View Summary Button */}
        <button style={{
          width: '100%', padding: '14px',
          background: C.btnBg, color: '#fff',
          border: 'none', borderRadius: 12,
          fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
          cursor: 'pointer', letterSpacing: '0.04em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 14,
        }}>
          <IconDoc /> LIHAT RINGKASAN FORMULIR
        </button>

        <p style={{ fontSize: 12, color: C.textMuted, textAlign: 'center', lineHeight: 1.6 }}>
          Butuh bantuan? Hubungi tim support kami melalui menu Bantuan di bawah.
        </p>
      </div>

      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('form'); // 'form' | 'success' | 'tracker'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionRef, setSubmissionRef] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [lead, setLead] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || Object.values(data.errors || {}).join('\n') || 'Gagal mengirim pendaftaran.';
        alert(msg);
        return;
      }

      setSubmissionRef(data.data.id);
      setSubmittedName(formData.nama);
      setSubmittedEmail(formData.email);

      // Also store lead shape locally so tracker works immediately
      setLead({
        id: data.data.id,
        status: data.data.status,
        submittedAt: data.data.submittedAt,
        vehicle: { type: formData.tipeKendaraan, brand: formData.merkKendaraan },
        statusHistory: [
          { status: 'diterima', timestamp: data.data.submittedAt },
          { status: 'dalam-peninjauan', timestamp: data.data.submittedAt },
        ],
        programDetails: { tenure: '60 Bulan', skemaPembayaran: 'Potong Gaji', estimasiPenyerahan: 'TBD' },
      });

      setScreen('success');
    } catch {
      alert('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    if (!submissionRef) return;
    try {
      const res = await fetch(`${API_BASE}/leads/${submissionRef}`);
      const data = await res.json();
      if (data.success) setLead(data.data);
    } catch {
      /* silent */
    }
  };

  return (
    <div style={{
      background: C.bgPage,
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: C.bgPage,
      }}>
        {screen === 'form' && (
          <FormScreen
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        {screen === 'success' && (
          <SuccessScreen
            refId={submissionRef}
            name={submittedName}
            email={submittedEmail}
            onViewStatus={() => setScreen('tracker')}
            onHome={() => setScreen('form')}
          />
        )}
        {screen === 'tracker' && (
          <TrackerScreen
            lead={lead}
            onBack={() => setScreen('success')}
            onRefresh={handleRefresh}
          />
        )}
      </div>
    </div>
  );
}
