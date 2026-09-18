import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Search, CheckCircle2 } from 'lucide-react';
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
  const { user } = useUser();
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
    <div className="space-y-4">
      {/* Title & Header */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Verified Government Programs
          </span>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Government Benefits & Schemes
        </h2>
        <p className="text-xs text-slate-500">
          Official central and state initiatives for women, SHGs, and micro businesses
        </p>
      </div>

      {/* Hero Scheme Matcher Banner */}
      <div className="bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900/80 mb-1">
              <Sparkles size={16} />
              <span>Smart Preliminary Eligibility Match</span>
            </div>
            <h3 className="text-lg font-black leading-tight text-slate-950 mb-1">
              Find Schemes You May Be Eligible For
            </h3>
            <p className="text-xs text-slate-900/80 max-w-xs leading-relaxed">
              Answer 5 quick questions. Sakhi evaluates your age, state, and work to find the best programs.
            </p>
          </div>
          <button
            onClick={() => setIsMatcherOpen(true)}
            className="px-4 py-2.5 bg-slate-950 text-amber-300 hover:bg-slate-900 text-xs font-black rounded-xl transition shadow-xs cursor-pointer shrink-0 min-h-[44px] flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Start Matching</span>
          </button>
        </div>
      </div>

      {/* Search & Category Tabs */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search scheme name, e.g. Mudra, Stree Nidhi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
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
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scheme Cards Feed */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs font-medium">
          Loading authentic schemes...
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs">
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
