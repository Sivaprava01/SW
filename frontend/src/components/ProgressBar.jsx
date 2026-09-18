import React from 'react';

export default function ProgressBar({ value = 0, max = 100, color = 'bg-emerald-600', height = 'h-3' }) {
  const safeMax = Number(max) || 0;
  const safeVal = Number(value) || 0;
  const percent = safeMax <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((safeVal / safeMax) * 100)));

  return (
    <div className={`w-full bg-stone-100 dark:bg-[#28211C] rounded-full overflow-hidden ${height}`}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
