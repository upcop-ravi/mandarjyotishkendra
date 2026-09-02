import React from 'react';
import { Heart, Mail, Phone, MapPin, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

// Inline brand SVG icons (lucide-react removed brand icons)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-800 text-white" id="involved">
      {/* Donate Banner */}
      <div id="donate"
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #FDF8F0 0%, #FEE9C7 100%)' }}
      >
        <h2 className="font-heading font-black text-3xl sm:text-4xl text-primary-800 mb-3">
          Help Us Feed More Families
        </h2>
        <p className="text-charcoal-600 max-w-lg mx-auto mb-8 text-lg">
          Every ₹50 you donate feeds one person for a day. Together we can end hunger in our community.
        </p>
        <a
          href="mailto:donate@nourishhope.org"
          id="footer-donate-btn"
          className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2"
        >
          <Heart className="w-5 h-5" />
          Donate Today
        </a>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-heading font-bold text-lg leading-none">NourishHope</p>
              <p className="text-white/50 text-xs mt-0.5">Foundation</p>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
            Serving nutritious meals to underprivileged communities across our region since 2019.
            Every meal is a step toward a hunger-free future.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {[
              { icon: FacebookIcon,  label: 'Facebook',  href: '#' },
              { icon: InstagramIcon, label: 'Instagram', href: '#' },
              { icon: TwitterIcon,   label: 'Twitter',   href: '#' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 bg-white/10 hover:bg-primary-500 rounded-lg flex items-center
                           justify-center transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            {[
              { label: 'Our Mission', href: '#mission' },
              { label: 'Impact Stories', href: '#stories' },
              { label: 'Volunteer', href: '#involved' },
              { label: 'Donate', href: '#donate' },
            ].map(link => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-amber-400 transition-colors">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
            Contact Us
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
              hello@nourishhope.org
            </li>
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
              +91 98765 43210
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
              Near Ram Vatika, Sachin Tendulkar Road, Kailash Nagar, Govindpuri, Gwalior, Madhya Pradesh 474011
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 px-4 flex flex-col sm:flex-row items-center
                      justify-between gap-2 text-xs text-white/30 max-w-7xl mx-auto w-full">
        <p>© {year} NourishHope Foundation. All rights reserved. Built with ❤️ for humanity.</p>
        <Link
          to="/admin/login"
          id="footer-admin-login-link"
          className="hover:text-white/60 transition-colors"
        >
          Staff Login
        </Link>
      </div>
    </footer>
  );
}
