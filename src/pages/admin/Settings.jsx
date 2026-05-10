import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSave, FiPhone, FiMail, FiMapPin, FiGlobe, FiDroplet, FiRefreshCw, FiImage, FiLoader, FiUpload, FiTrash2, FiCloud, FiCheck, FiArrowRight } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube, FaGoogleDrive } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSettings } from '../../contexts/SettingsContext';
import { uploadImage, getImageUrl } from '../../services/googleDrive';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../services/firebase/firebase';

const DRIVE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const DEFAULT_COLORS = {
  primary: '#047857',
  secondary: '#F59E0B',
  accent: '#10B981',
};

const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook', icon: FaFacebookF, color: '#1877F2' },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram, color: '#E4405F' },
  { key: 'twitter', label: 'Twitter / X', icon: FaTwitter, color: '#1DA1F2' },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn, color: '#0A66C2' },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube, color: '#FF0000' },
];

const SectionCard = ({ title, icon: Icon, delay = 0, headerRight, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl shadow-sm p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      {headerRight}
    </div>
    {children}
  </motion.div>
);

const InputField = ({ label, hint, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
      {...props}
    />
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

// ── Phone input helpers ──
// Format raw digits → "XXXXX XXXXX" with auto-space
const formatPhoneDisplay = (raw) => {
  const d = (raw || '').replace(/\D/g, '').slice(0, 10);
  if (d.length <= 5) return d;
  return d.slice(0, 5) + ' ' + d.slice(5);
};

// Strip to max 10 digits
const cleanDigits = (val) => val.replace(/\D/g, '').slice(0, 10);

// Phone input with prefix label, 10-digit limit, auto-space after 5 digits
const PhoneInput = ({ label, hint, prefix, value, onChange }) => {
  const displayVal = formatPhoneDisplay(value);

  const handleChange = (e) => {
    const digits = cleanDigits(e.target.value);
    onChange(digits);
  };

  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, arrows, home, end
    const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;
    // Block non-digit keys
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    // Block if already 10 digits
    const current = (value || '').replace(/\D/g, '');
    if (current.length >= 10) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex">
        <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm font-medium text-gray-600">
          {prefix}
        </span>
        <input
          type="tel"
          value={displayVal}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          placeholder="98765 43210"
          maxLength={11} /* 10 digits + 1 space */
        />
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
};

const AdminSettings = () => {
  const { rawSettings, updateSettings, saveSettings, brandColors, setBrandColors } = useSettings();

  const [form, setForm] = useState({ ...rawSettings });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [driveConnecting, setDriveConnecting] = useState(false);
  const [colors, setColors] = useState({ ...brandColors });

  useEffect(() => {
    setForm({ ...rawSettings });
  }, [rawSettings]);

  useEffect(() => {
    setColors({ ...brandColors });
  }, [brandColors]);

  // Google Drive one-time setup via popup
  const handleConnectDrive = () => {
    if (!window.google?.accounts?.oauth2) {
      toast.error('Google Identity Services not loaded. Please refresh the page.');
      return;
    }

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: DRIVE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.file',
      ux_mode: 'popup',
      callback: async (response) => {
        if (response.error) {
          toast.error('Google authorization failed: ' + response.error);
          setDriveConnecting(false);
          return;
        }

        try {
          setDriveConnecting(true);
          const exchangeFn = httpsCallable(functions, 'exchangeDriveAuthCode');
          await exchangeFn({ authCode: response.code });
          toast.success('Google Drive connected successfully! Image uploads will now work.');
        } catch (err) {
          console.error('Drive connect error:', err);
          const code = err.code || '';
          const detail = err.details?.message || err.details || '';
          const msg = err.message && err.message !== code ? err.message : '';
          const surfaced = [code, msg, typeof detail === 'string' ? detail : ''].filter(Boolean).join(' · ');
          toast.error('Drive connect failed: ' + (surfaced || 'Unknown error — check browser console'));
        } finally {
          setDriveConnecting(false);
        }
      },
    });

    client.requestCode();
  };

  const handleImageUpload = async (file, field) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const setUploading = field === 'brandLogo' ? setUploadingLogo : setUploadingFavicon;
    setUploading(true);
    try {
      const fileName = `${field}_${Date.now()}.${file.name.split('.').pop()}`;
      const fileId = await uploadImage(file, fileName);
      const imageUrl = getImageUrl(fileId);
      update(field, imageUrl);
      // Auto-save to Firebase immediately (like slider does)
      const updatedForm = { ...form, [field]: imageUrl, colors };
      updateSettings({ [field]: imageUrl });
      await saveSettings(updatedForm);
      toast.success(`${field === 'brandLogo' ? 'Logo' : 'Favicon'} uploaded & saved!`);
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocial = (platform, field, value) => {
    setForm((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: {
          ...prev.socialMedia[platform],
          [field]: value,
        },
      },
    }));
  };

  const handleColorChange = (key, value) => {
    setColors((prev) => {
      const next = { ...prev, [key]: value };
      setBrandColors(next);
      return next;
    });
  };

  const handleResetTheme = () => {
    setColors(DEFAULT_COLORS);
    setBrandColors(DEFAULT_COLORS);
    toast.success('Theme reset to default!');
  };

  const isCustomized = Object.keys(DEFAULT_COLORS).some((key) => colors[key] !== DEFAULT_COLORS[key]);

  const handleSave = async () => {
    if (!form.phone10 || form.phone10.length !== 10) {
      toast.error('Support phone number must be 10 digits');
      return;
    }
    if (!form.email.trim()) {
      toast.error('Email is required');
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = { ...form, colors };
      await saveSettings(dataToSave);
      updateSettings(form);
      setBrandColors(colors);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings to server');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500">Manage your website settings & contact information</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <FiSave className="w-4 h-4" />
          Save All Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ── Brand Assets + Footer Description (merged) ── */}
        <SectionCard title="Brand Assets & Footer" icon={FiImage} delay={0}>
          <div className="space-y-4">
            {/* Brand Name & Site Title */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Brand Name"
                hint="Company name shown across the website."
                type="text"
                value={form.brandName || ''}
                onChange={(e) => update('brandName', e.target.value)}
                placeholder="XYZ Insurance"
              />
              <InputField
                label="Site Title"
                hint="Browser tab title (SEO)."
                type="text"
                value={form.siteTitle || ''}
                onChange={(e) => update('siteTitle', e.target.value)}
                placeholder="XYZ Insurance - Trusted Vehicle Insurance Partner"
              />
            </div>

            {/* Logo & Favicon side by side */}
            <div className="grid grid-cols-2 gap-5">
              {/* Logo */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">Brand Logo</label>
                <div className="w-full h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden mb-3">
                  {form.brandLogo ? (
                    <img src={form.brandLogo} alt="Logo" className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-sm text-gray-400">No logo uploaded</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                    uploadingLogo ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    {uploadingLogo ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiUpload className="w-4 h-4" />}
                    {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    <input type="file" accept="image/*" className="hidden" disabled={uploadingLogo}
                      onChange={(e) => handleImageUpload(e.target.files?.[0], 'brandLogo')} />
                  </label>
                  {form.brandLogo && (
                    <button onClick={() => { update('brandLogo', ''); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-200" title="Remove">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">Header, footer & sidebar. PNG recommended.</p>
              </div>

              {/* Favicon */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">Favicon</label>
                <div className="w-full h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden mb-3">
                  {form.brandFavicon ? (
                    <img src={form.brandFavicon} alt="Favicon" className="h-10 w-10 object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-sm text-gray-400">No favicon uploaded</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                    uploadingFavicon ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    {uploadingFavicon ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiUpload className="w-4 h-4" />}
                    {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                    <input type="file" accept="image/*" className="hidden" disabled={uploadingFavicon}
                      onChange={(e) => handleImageUpload(e.target.files?.[0], 'brandFavicon')} />
                  </label>
                  {form.brandFavicon && (
                    <button onClick={() => { update('brandFavicon', ''); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-200" title="Remove">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">Browser tab icon. 32x32 or 64x64.</p>
              </div>
            </div>

            {/* Footer Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Description</label>
              <textarea
                value={form.footerDescription}
                onChange={(e) => update('footerDescription', e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                placeholder="Your trusted insurance partner in India..."
              />
              <p className="text-xs text-gray-400 mt-1">This text appears in the website footer below the logo.</p>
            </div>
          </div>
        </SectionCard>

        {/* ── Phone Numbers ── */}
        <SectionCard title="Phone Numbers" icon={FiPhone} delay={0}>
          <div className="space-y-4">
            <PhoneInput
              label="Support Phone Number"
              hint="Displayed in top bar & footer as main contact number."
              prefix="+91"
              value={form.phone10}
              onChange={(v) => update('phone10', v)}
            />
            <PhoneInput
              label="Alternate Phone Number"
              hint="Secondary number shown in footer."
              prefix="+91"
              value={form.altPhone10}
              onChange={(v) => update('altPhone10', v)}
            />
            <div className="pt-2 border-t border-gray-100">
              <PhoneInput
                label="WhatsApp Number"
                hint="For WhatsApp chat button & links."
                prefix="91"
                value={form.whatsapp10}
                onChange={(v) => update('whatsapp10', v)}
              />
            </div>
            <div className="pt-2 border-t border-gray-100">
              <PhoneInput
                label="Call Button Number"
                hint="For the floating call icon (bottom-left)."
                prefix="91"
                value={form.call10}
                onChange={(v) => update('call10', v)}
              />
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>Note:</strong> Support phone, WhatsApp, and Call button numbers can all be different. Enter 10 digits only.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ── Email & Hours ── */}
        <SectionCard title="Email & Business Hours" icon={FiMail} delay={0.05}>
          <div className="space-y-4">
            <InputField
              label="Primary Email"
              hint="Displayed in top bar & footer."
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="info@bharatinsurance.in"
            />
            <InputField
              label="Support Email"
              hint="Secondary email shown in footer."
              type="email"
              value={form.supportEmail}
              onChange={(e) => update('supportEmail', e.target.value)}
              placeholder="support@bharatinsurance.in"
            />
            <div className="pt-2 border-t border-gray-100">
              <InputField
                label="Business Hours"
                hint="Displayed in top bar of website."
                type="text"
                value={form.businessHours}
                onChange={(e) => update('businessHours', e.target.value)}
                placeholder="9:00 AM - 7:00 PM"
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Address ── */}
        <SectionCard title="Address" icon={FiMapPin} delay={0.1}>
          <div className="space-y-4">
            <InputField
              label="Address Line 1"
              type="text"
              value={form.addressLine1}
              onChange={(e) => update('addressLine1', e.target.value)}
              placeholder="Office No. 302, 3rd Floor"
            />
            <InputField
              label="Address Line 2"
              type="text"
              value={form.addressLine2}
              onChange={(e) => update('addressLine2', e.target.value)}
              placeholder="Trade Centre, Bandra Kurla Complex"
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="City"
                type="text"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Mumbai"
              />
              <InputField
                label="State"
                type="text"
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                placeholder="Maharashtra"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Pincode"
                type="text"
                value={form.pincode}
                onChange={(e) => update('pincode', e.target.value)}
                placeholder="400051"
              />
              <InputField
                label="Google Maps URL"
                type="url"
                value={form.mapUrl}
                onChange={(e) => update('mapUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Social Media ── */}
        <SectionCard title="Social Media Links" icon={FiGlobe} delay={0.2}>
          <div className="space-y-4">
            <p className="text-xs text-gray-500 -mt-2 mb-2">Toggle which social media icons appear on the website and set their URLs.</p>
            {SOCIAL_PLATFORMS.map((platform) => {
              const data = form.socialMedia[platform.key] || { url: '', enabled: false };
              const Icon = platform.icon;
              return (
                <div key={platform.key} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: data.enabled ? platform.color : '#9ca3af', opacity: data.enabled ? 1 : 0.5 }}
                  >
                    <Icon className="text-white text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{platform.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.enabled}
                          onChange={(e) => updateSocial(platform.key, 'enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                      </label>
                    </div>
                    <input
                      type="url"
                      value={data.url}
                      onChange={(e) => updateSocial(platform.key, 'url', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder={`https://${platform.key}.com/yourpage`}
                      disabled={!data.enabled}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* ── Site Theme summary (edit on Theme page) ── */}
        <SectionCard title="Site Theme" icon={FiDroplet} delay={0.25}>
          <p className="text-sm text-gray-500 mb-5">
            The customer-site mode, accent color, and optional bg / text overrides are managed on the dedicated Theme page.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Mode</span>
              <span className="text-sm font-semibold text-gray-900 capitalize">
                {form.themeMode || 'dark'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Accent</span>
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: colors.primary || '#C9A961' }} />
                <span className="text-sm font-mono text-gray-900">{colors.primary || '#C9A961'}</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Background override</span>
              <span className="text-sm font-mono text-gray-700">
                {form.customBg || <span className="italic text-gray-400">— preset —</span>}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Text override</span>
              <span className="text-sm font-mono text-gray-700">
                {form.customText || <span className="italic text-gray-400">— preset —</span>}
              </span>
            </div>
          </div>

          <Link
            to="/admin/theme"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-noir-950 bg-gradient-to-r from-[#C9A961] to-[#8B6F2C] hover:from-[#D4AF37] hover:to-[#C9A961] border border-[#E5C770] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)] hover:shadow-[0_16px_32px_-12px_rgba(201,169,97,0.65)] transition-all"
          >
            Edit on Theme page <FiArrowRight className="w-4 h-4" />
          </Link>
        </SectionCard>

        {/* Hero Slider settings — hidden for now, uncomment when needed */}
        {false && <SectionCard title="Hero Slider" icon={FiImage} delay={0.28}>
          <div className="space-y-4">
            <InputField
              label="Badge Text"
              hint="Top eyebrow line shown above the hero heading."
              type="text"
              value={form.hero?.badgeText || ''}
              onChange={(e) => update('hero', { ...form.hero, badgeText: e.target.value })}
              placeholder="Trusted by 50,000+ customers"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Title Start"
                type="text"
                value={form.hero?.titlePrefix || ''}
                onChange={(e) => update('hero', { ...form.hero, titlePrefix: e.target.value })}
                placeholder="Insurance that"
              />
              <InputField
                label="Title Highlight"
                type="text"
                value={form.hero?.titleHighlight || ''}
                onChange={(e) => update('hero', { ...form.hero, titleHighlight: e.target.value })}
                placeholder="actually shows up"
              />
              <InputField
                label="Title End"
                type="text"
                value={form.hero?.titleSuffix || ''}
                onChange={(e) => update('hero', { ...form.hero, titleSuffix: e.target.value })}
                placeholder="when you need it."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Description</label>
              <textarea
                value={form.hero?.description || ''}
                onChange={(e) => update('hero', { ...form.hero, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                placeholder="Short hero copy for the homepage."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Slider Speed (ms)"
                hint="Higher value means slower slide change."
                type="number"
                min="3000"
                step="500"
                value={form.hero?.autoplayMs ?? 6500}
                onChange={(e) => update('hero', { ...form.hero, autoplayMs: Number(e.target.value) })}
              />
              <InputField
                label="Icon Shower Speed"
                hint="Use smaller values like 0.6 for slower falling icons."
                type="number"
                min="0.2"
                max="2"
                step="0.1"
                value={form.hero?.iconShowerSpeed ?? 0.7}
                onChange={(e) => update('hero', { ...form.hero, iconShowerSpeed: Number(e.target.value) })}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.hero?.showIconShower ?? true}
                onChange={(e) => update('hero', { ...form.hero, showIconShower: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show falling insurance icons in hero</span>
            </label>
          </div>
        </SectionCard>}
      </div>

      {/* Google Drive Setup — full width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FaGoogleDrive className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Google Drive Connection</h2>
              <p className="text-xs text-gray-500">One-time setup — connect your Google Drive for image uploads (slider, logo, favicon)</p>
            </div>
          </div>
          <button
            onClick={handleConnectDrive}
            disabled={driveConnecting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              driveConnecting
                ? 'bg-gray-100 text-gray-400'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {driveConnecting ? (
              <><FiLoader className="w-4 h-4 animate-spin" /> Connecting...</>
            ) : (
              <><FiCloud className="w-4 h-4" /> Connect Google Drive</>
            )}
          </button>
        </div>
      </motion.div>

      {/* Bottom Save */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/30"
        >
          <FiSave className="w-4 h-4" />
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
