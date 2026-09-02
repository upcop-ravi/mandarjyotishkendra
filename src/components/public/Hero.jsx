import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Users, MapPin, Utensils, Calendar } from 'lucide-react';

// ── Animated Counter ─────────────────────────────────────
function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref               = useRef(null);
  const started           = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const step     = target / (duration / 16);
          let current    = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            setCount(Math.floor(current));
            if (current >= target) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

// ── Metric Card ──────────────────────────────────────────
function MetricCard({ icon: Icon, value, suffix, label, color }) {
  return (
    <div
      className="rounded-2xl px-6 py-5 flex items-center gap-4 hover:scale-105 transition-transform duration-300"
      style={{
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="font-heading font-bold text-2xl text-white leading-none">
          <Counter target={value} suffix={suffix} />
        </p>
        <p className="text-white/70 text-sm mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function Hero() {
  const metrics = [
    { icon: Utensils, value: 250000, suffix: '+', label: 'Meals Served',      color: 'bg-amber-500' },
    { icon: MapPin,   value: 48,     suffix: '+', label: 'Locations Reached', color: 'bg-primary-500' },
    { icon: Users,    value: 15000,  suffix: '+', label: 'Lives Touched',     color: 'bg-teal-600' },
    { icon: Calendar, value: 5,      suffix: ' yrs', label: 'of Service',    color: 'bg-rose-500' },
  ];

  return (
    <section
      id="mission"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B3D2A 0%, #1a5c3f 30%, #2D6A4F 60%, #1e4532 100%)' }}
      aria-label="Hero — NGO mission statement"
    >
      {/* Background decorative circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />

      {/* Floating food emoji decorations */}
      <span className="absolute top-1/4 left-8 text-4xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>🌾</span>
      <span className="absolute top-1/3 right-10 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🥗</span>
      <span className="absolute bottom-1/3 left-12 text-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>🍱</span>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-amber-300 text-sm font-medium
                        px-4 py-2 rounded-full mb-8 animate-fade-in border border-white/20"
             style={{ background: 'rgba(45,106,79,0.82)', backdropFilter: 'blur(16px)' }}>
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          Serving communities since 2019
        </div>

        {/* Headline */}
        <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-6 animate-slide-up"
            style={{ animationDelay: '0.1s' }}>
          Nourishing{' '}
          <span className="text-amber-400">Hope</span>
          <br />
          <span className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white/90">
            One Meal at a Time
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
           style={{ animationDelay: '0.2s' }}>
          We believe no one should go to sleep hungry. Every week, our volunteers
          drive across neighborhoods to distribute fresh, nutritious meals to
          underprivileged communities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-slide-up"
             style={{ animationDelay: '0.3s' }}>
          <a href="#donate" id="hero-donate-btn" className="btn-primary text-base px-8 py-4">
            ❤️ Make a Donation
          </a>
          <a href="#stories" className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-full
                                        hover:bg-white/10 transition-all duration-200">
            Read Our Stories
          </a>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {metrics.map(m => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#stories"
        aria-label="Scroll to blog stories"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white
                   transition-colors flex flex-col items-center gap-2 animate-bounce"
      >
        <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
}
