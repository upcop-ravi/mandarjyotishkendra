import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Our Mission', href: '#mission' },
    { label: 'Stories',     href: '#stories' },
    { label: 'Impact',      href: '#impact' },
    { label: 'Get Involved',href: '#involved' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'bg-transparent py-5'}`}
      style={scrolled ? {
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.4)',
        boxShadow: '0 8px 32px rgba(45,106,79,0.12)',
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" id="header-logo">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-glass
                          group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-heading font-bold text-lg leading-none text-primary-800">
              NourishHope
            </p>
            <p className="text-xs text-primary-600 font-medium leading-none mt-0.5">
              Foundation
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link text-sm font-medium pb-1 ${
                scrolled ? 'text-charcoal-700' : 'text-white/90'
              } hover:text-amber-500`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#donate"
            id="header-donate-btn"
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Heart className="w-4 h-4" />
            Donate Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-btn"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(o => !o)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled ? 'text-charcoal-800' : 'text-white'
          }`}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden mt-2 mx-4 rounded-2xl p-6 flex flex-col gap-4 animate-slide-up"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 32px rgba(45,106,79,0.12)',
          }}
        >
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-charcoal-700 font-medium py-2 border-b border-primary-100 last:border-0"
            >
              {link.label}
            </a>
          ))}
          <a href="#donate" className="btn-primary text-center mt-2">
            <Heart className="w-4 h-4 inline mr-2" />
            Donate Now
          </a>
        </div>
      )}
    </header>
  );
}
