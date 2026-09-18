import React from 'react';

export default function MoneyCard({ title, amount, subtitle, icon: Icon, variant = 'neutral', onClick }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'income':
        return 'bg-emerald-50/70 border-emerald-200 text-emerald-950';
      case 'expense':
        return 'bg-amber-50/70 border-amber-200 text-amber-950';
      case 'surplus':
        return 'bg-teal-50 border-teal-300 text-teal-950';
      case 'debt':
        return 'bg-rose-50/70 border-rose-200 text-rose-950';
      case 'savings':
        return 'bg-blue-50/70 border-blue-200 text-blue-950';
      default:
        return 'bg-white border-slate-200 text-slate-900';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'income':
        return 'text-emerald-600 bg-emerald-100';
      case 'expense':
        return 'text-amber-600 bg-amber-100';
      case 'surplus':
        return 'text-teal-600 bg-teal-100';
      case 'debt':
        return 'text-rose-600 bg-rose-100';
      case 'savings':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-2xl p-4 transition-all shadow-xs ${getVariantStyles()} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl ${getIconColor()}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="text-2xl font-black tracking-tight">
        ₹{Number(amount || 0).toLocaleString('en-IN')}
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-slate-500 font-medium">
          {subtitle}
        </div>
      )}
    </div>
  );
}
