import React from 'react';

export default function MoneyCard({ title, amount, subtitle, icon: Icon, variant = 'neutral', onClick }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'income':
        return 'bg-emerald-50/80 dark:bg-[#1e1b19] border-emerald-200 dark:border-[#3D332B] text-emerald-950 dark:text-emerald-300';
      case 'expense':
        return 'bg-amber-50/80 dark:bg-[#1e1b19] border-amber-200 dark:border-[#3D332B] text-amber-950 dark:text-[#ffb599]';
      case 'surplus':
        return 'bg-orange-50/90 dark:bg-[#28211C] border-orange-300 dark:border-[#3D332B] text-orange-950 dark:text-[#ffb690]';
      case 'debt':
        return 'bg-rose-50/80 dark:bg-[#1e1b19] border-rose-200 dark:border-[#3D332B] text-rose-950 dark:text-rose-300';
      case 'savings':
        return 'bg-teal-50/80 dark:bg-[#1e1b19] border-teal-200 dark:border-[#3D332B] text-teal-950 dark:text-teal-300';
      default:
        return 'bg-white dark:bg-[#1e1b19] border-amber-100 dark:border-[#3D332B] text-[#221a0e] dark:text-[#FFF5EB]';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'income':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-[#28211C]';
      case 'expense':
        return 'text-amber-700 dark:text-[#ffb599] bg-amber-100 dark:bg-[#28211C]';
      case 'surplus':
        return 'text-orange-700 dark:text-[#ffb690] bg-orange-100 dark:bg-[#14110F]';
      case 'debt':
        return 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-[#28211C]';
      case 'savings':
        return 'text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-[#28211C]';
      default:
        return 'text-stone-600 dark:text-[#A8988A] bg-stone-100 dark:bg-[#28211C]';
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
      <div className="font-headline text-xl sm:text-2xl font-black tracking-tight">
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
