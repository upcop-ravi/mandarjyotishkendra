import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function MetricWidget({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-2"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 8px 32px rgba(45,106,79,0.10)',
      }}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Value */}
      <div>
        <p className="font-heading font-black text-3xl text-charcoal-800">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </p>
        <p className="text-sm font-medium text-charcoal-600 mt-0.5">{label}</p>
      </div>

      {/* Sub & trend */}
      {(sub || trend) && (
        <div className="flex items-center justify-between mt-1">
          {sub && <span className="text-xs text-charcoal-400">{sub}</span>}
          {trend && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <ArrowUp className="w-3 h-3" />
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
