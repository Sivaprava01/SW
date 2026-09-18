import React from 'react';

export default function ProgressBar({ value = 0, max = 100, color = 'bg-emerald-600', height = 'h-3' }) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
