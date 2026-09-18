import React, { useState, useEffect } from 'react';
import {
  IconShieldCheck,
  IconSparkles,
  IconSearch,
  IconCheck,
} from '@tabler/icons-react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import SchemeCard from '../components/SchemeCard';
import SchemeDetailsModal from '../components/SchemeDetailsModal';
import FullWindowSchemeMatcher from '../components/FullWindowSchemeMatcher';

const CATEGORIES = [
  'All',
  'Women entrepreneurship',
  'SHG / livelihood',
  'Insurance',
  'Pension',
  'Education',
  'Housing',
  'State-specific benefits'
];

export default function Benefits() {
  const { user, t } = useUser();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const data = await api.getSchemes({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
      });
      setSchemes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory]);

  const filteredSchemes = schemes.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-3.5 pb-6">
      {/* Title & Header */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[11px] font-bold text-orange-800 dark:text-orange-300 bg-[#fff1e3] dark:bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-800/40">
            Verified Government Programs
          </span>
        </div>
        <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          {t('nav_benefits') || 'Government Benefits'} & Schemes
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Official central and state initiatives for women, SHGs, and micro businesses
        </p>
      </div>

      {/* Hero Scheme Matcher Banner (Stitch Gradient Card) */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-stone-950 rounded-2xl p-4 sm:p-5 shadow-sm border border-orange-400/40">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-stone-950/80 mb-1">
              <IconSparkles size={16} />
              <span>Smart Preliminary Eligibility Match</span>
            </div>
            <h3 className="text-base sm:text-lg font-black leading-tight text-stone-950 mb-1">
              Find Schemes You May Be Eligible For
            </h3>
            <p className="text-xs text-stone-900/80 max-w-xs leading-relaxed font-medium">
              Answer 5 quick questions. Sakhi evaluates your age, state, and work to find the best programs.
            </p>
          </div>
          <button
            onClick={() => setIsMatcherOpen(true)}
            className="px-4 py-2.5 bg-stone-950 text-amber-300 hover:bg-stone-900 text-xs font-black rounded-xl transition shadow-xs cursor-pointer shrink-0 min-h-[44px] flex items-center justify-center gap-1.5 active:scale-95"
          >
            <IconSparkles size={14} />
            <span>Start Matching</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <IconSearch size={16} className="absolute left-3.5 top-3 text-stone-400" />
        <input
          type="text"
          placeholder="Search scheme name, e.g. Mudra, Stree Nidhi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-2xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 focus:outline-hidden shadow-2xs"
        />
      </div>

      {/* Category Chips */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition cursor-pointer min-h-[36px] ${
              selectedCategory === cat
                ? 'bg-orange-600 dark:bg-orange-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-stone-600 dark:text-stone-300 border border-amber-100 dark:border-slate-800 hover:bg-stone-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scheme Cards Feed */}
      {loading ? (
        <div className="p-8 text-center text-stone-500 dark:text-stone-400 text-xs font-medium">
          Loading authentic schemes...
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-amber-200 dark:border-slate-800 rounded-2xl p-6 text-center text-stone-500 dark:text-stone-400 text-xs">
          No schemes found matching this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSchemes.map((s) => (
            <SchemeCard
              key={s.id}
              scheme={s}
              onViewDetails={(scheme) => setSelectedScheme(scheme)}
            />
          ))}
        </div>
      )}

      {/* Full Window Guided Matcher */}
      <FullWindowSchemeMatcher
        isOpen={isMatcherOpen}
        onClose={() => setIsMatcherOpen(false)}
        initialCriteria={user}
        userId={user?.id}
      />

      {/* Details Modal */}
      <SchemeDetailsModal
        scheme={selectedScheme}
        onClose={() => setSelectedScheme(null)}
      />
    </div>
  );
}
