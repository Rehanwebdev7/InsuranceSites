import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin, FiArrowUpRight, FiShield, FiLock, FiAward, FiHeart } from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';
import { useSettings } from '../../contexts/SettingsContext';

const serviceLinks = [
  { name: 'Two-Wheeler', path: '/services' },
  { name: 'Four-Wheeler', path: '/services' },
  { name: 'Commercial Vehicle', path: '/services' },
  { name: 'School Bus', path: '/services' },
  { name: 'Policy Renewal', path: '/services' },
  { name: 'Third-Party', path: '/services' },
];

const companyLinks = [
  { name: 'About us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms & Conditions', path: '/terms' },
];

const SOCIAL_ICON_MAP = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

const trustSeals = [
  { icon: FiShield, label: 'IRDAI-licensed partners' },
  { icon: FiLock, label: 'Bank-grade encryption' },
  { icon: FiAward, label: '15+ years of claims' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings, fullAddress, whatsappLink } = useSettings();

  const socialIcons = Object.entries(settings.socialMedia || {})
    .filter(([, data]) => data?.enabled && data?.url)
    .map(([key, data]) => ({
      key,
      icon: SOCIAL_ICON_MAP[key],
      url: data.url,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }))
    .filter((s) => s.icon);

  return (
    <footer
      className="relative overflow-hidden text-ink-300"
      style={{ backgroundColor: 'color-mix(in srgb, var(--site-accent, #C9A961) 18%, #000000)', color: '#B0A99E' }}
    >
      {/* Background accents — warm gold whisper */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="aurora-blob w-[520px] h-[520px] -top-40 -left-40"
          style={{ backgroundColor: 'rgba(201, 169, 97, 0.18)' }}
        />
        <div
          className="aurora-blob w-[420px] h-[420px] -bottom-32 -right-20"
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.10)', animationDelay: '4s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(229,199,112,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(229,199,112,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Trust strip */}
      <div className="relative border-b border-[rgba(201,169,97,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-5 gap-x-8">
            {trustSeals.map((seal) => (
              <div key={seal.label} className="flex items-center gap-2.5 text-ink-300/85 text-sm">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[rgba(201,169,97,0.08)] text-[#E5C770] border border-[rgba(201,169,97,0.25)]">
                  <seal.icon className="text-base" />
                </span>
                <span className="font-medium">{seal.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-14 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-8 sm:gap-x-8 lg:gap-12">
          {/* Brand column — full row on mobile/tablet */}
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              {settings?.brandLogo ? (
                <img
                  src={settings.brandLogo}
                  alt={settings?.brandName || APP_NAME}
                  className="h-10 w-auto brightness-0 invert"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] flex items-center justify-center shadow-[0_8px_16px_-8px_rgba(201,169,97,0.5)] border border-[rgba(229,199,112,0.4)]">
                    <span className="text-noir-950 text-lg font-bold font-display italic">
                      {(settings?.brandName || 'B').charAt(0)}
                    </span>
                  </div>
                  <span className="font-display text-xl font-semibold text-white tracking-tight">
                    {settings?.brandName || 'Bharat Insurance'}
                  </span>
                </>
              )}
            </Link>
            <p className="text-sm text-ink-400 leading-relaxed mb-6 max-w-sm">
              {settings?.footerDescription ||
                'Insurance made effortless. Honest quotes from 20+ IRDAI-licensed insurers in under 60 seconds, then we get out of your way.'}
            </p>

            {socialIcons.length > 0 && (
              <div className="flex items-center gap-2">
                {socialIcons.map((social) => (
                  <a
                    key={social.key}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,97,0.20)] flex items-center justify-center text-ink-300 hover:bg-[#C9A961] hover:text-noir-950 hover:border-[#C9A961] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <social.icon className="text-sm" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services — 1/2 on mobile */}
          <div className="col-span-1 lg:col-span-3">
            <h3 className="font-display text-white font-semibold text-sm mb-5 tracking-[0.14em] uppercase">
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#C9A961]" />
                What we cover
              </span>
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-ink-400 hover:text-[#E5C770] transition-colors inline-flex items-center gap-1.5 group"
                  >
                    {link.name}
                    <FiArrowUpRight className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company — 1/2 on mobile (next to Services) */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="font-display text-white font-semibold text-sm mb-5 tracking-[0.14em] uppercase">
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#C9A961]" />
                Company
              </span>
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-ink-400 hover:text-[#E5C770] transition-colors inline-flex items-center gap-1.5 group"
                  >
                    {link.name}
                    <FiArrowUpRight className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — full row on mobile (it has wider items) */}
          <div className="col-span-2 lg:col-span-3">
            <h3 className="font-display text-white font-semibold text-sm mb-5 tracking-[0.14em] uppercase">
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#C9A961]" />
                Get in touch
              </span>
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={`tel:${settings.phoneRaw}`}
                  className="group flex items-start gap-3 text-sm text-ink-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,97,0.22)] text-[#E5C770] group-hover:bg-[#C9A961] group-hover:text-noir-950 group-hover:border-[#C9A961] transition-all shrink-0">
                    <FiPhone className="text-sm" />
                  </span>
                  <span className="pt-1.5">{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="group flex items-start gap-3 text-sm text-ink-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,97,0.22)] text-[#E5C770] group-hover:bg-[#C9A961] group-hover:text-noir-950 group-hover:border-[#C9A961] transition-all shrink-0">
                    <FiMail className="text-sm" />
                  </span>
                  <span className="pt-1.5 break-all">{settings.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm text-ink-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,97,0.22)] text-[#E5C770] group-hover:bg-[#C9A961] group-hover:text-noir-950 group-hover:border-[#C9A961] transition-all shrink-0">
                    <FaWhatsapp className="text-sm" />
                  </span>
                  <span className="pt-1.5">WhatsApp chat</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm text-ink-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,97,0.22)] text-[#E5C770] group-hover:bg-[#C9A961] group-hover:text-noir-950 group-hover:border-[#C9A961] transition-all shrink-0 mt-0.5">
                    <FiMapPin className="text-sm" />
                  </span>
                  <span className="pt-1.5 leading-relaxed">{fullAddress}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Centered gold monogram divider */}
        <div className="mt-12 flex items-center justify-center" aria-hidden>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(201,169,97,0.35)]" />
          <div className="px-4 flex items-center gap-2 text-[#C9A961]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961]" />
            <span className="font-display italic text-sm">{settings?.brandName?.charAt(0) || 'B'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961]" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(201,169,97,0.35)]" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-[rgba(201,169,97,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-400 text-center md:text-left">
            &copy; {currentYear} {settings?.brandName || APP_NAME}. All rights reserved. &nbsp;·&nbsp; Insurance is
            the subject matter of solicitation. Visit official IRDAI site for details.
          </p>
          <p className="text-xs text-ink-400 flex items-center gap-1.5 flex-wrap justify-center md:justify-end">
            <span>We</span>
            <FiHeart className="text-[#D4AF37] fill-current" />
            <span>Digital India</span>
            <span className="text-ink-500">·</span>
            <span>Developed by</span>
            <span className="text-white font-semibold">Rehan</span>
            <span>and</span>
            <span className="text-white font-semibold">Parvez</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
