import React from 'react';

export default function MoneyCard({ title, amount, subtitle, icon: Icon, variant = 'neutral', onClick }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'income':
        return 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200';
      case 'expense':
        return 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200';
      case 'surplus':
        return 'bg-orange-50/90 dark:bg-orange-950/50 border-orange-300 dark:border-orange-800/70 text-orange-950 dark:text-orange-200';
      case 'debt':
        return 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-200';
      case 'savings':
        return 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/60 text-teal-950 dark:text-teal-200';
      default:
        return 'bg-white dark:bg-slate-900 border-amber-100 dark:border-slate-800 text-stone-900 dark:text-stone-100';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'income':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60';
      case 'expense':
        return 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60';
      case 'surplus':
        return 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/60';
      case 'debt':
        return 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60';
      case 'savings':
        return 'text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60';
      default:
        return 'text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-slate-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-2xl p-3.5 sm:p-4 transition-all shadow-xs ${getVariantStyles()} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl ${getIconColor()}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="text-xl sm:text-2xl font-black tracking-tight">
        ₹{Number(amount || 0).toLocaleString('en-IN')}
      </div>
      {subtitle && (
        <div className="mt-1 text-[11px] opacity-75 font-semibold line-clamp-1">
          {subtitle}
        </div>
      )}
    </div>
  );
}
