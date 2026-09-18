import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Filter, CheckCircle2, AlertCircle, Search, HelpCircle, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import SchemeCard from '../components/SchemeCard';
import SchemeDetailsModal from '../components/SchemeDetailsModal';

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

  // Matcher state
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);
  const [matcherLoading, setMatcherLoading] = useState(false);
  const [matchResults, setMatchResults] = useState(null);

  const [matcherCriteria, setMatcherCriteria] = useState({
    is_woman: true,
    age: user?.age || 28,
    state: user?.state || 'Telangana',
    income_level: 'low',
    has_business_interest: true,
    is_shg_member: true,
    is_rural: true,
  });

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

  const handleRunMatcher = async (e) => {
    e.preventDefault();
    setMatcherLoading(true);
    try {
      const res = await api.matchSchemes({
        ...matcherCriteria,
        age: parseInt(matcherCriteria.age, 10),
      });
      setMatchResults(res);
    } catch (err) {
      alert(err.message || 'Error running scheme matcher');
    } finally {
      setMatcherLoading(false);
    }
  };

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
          Official central and state initiatives for women, SHGs, and small businesses
        </p>
      </div>

      {/* Hero Scheme Matcher Banner */}
      <div className="bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900/80 mb-1">
              <Sparkles size={16} />
              <span>Smart Preliminary Eligibility Match</span>
            </div>
            <h3 className="text-lg font-black leading-tight text-slate-950 mb-1">
              Find Schemes You May Be Eligible For
            </h3>
            <p className="text-xs text-slate-900/80 max-w-xs leading-relaxed">
              Answer 4 simple questions about age, state, and work. Sakhi will highlight matching opportunities.
            </p>
          </div>
          <button
            onClick={() => setIsMatcherOpen(!isMatcherOpen)}
            className="px-3.5 py-2 bg-slate-950 text-amber-300 hover:bg-slate-900 text-xs font-black rounded-xl transition shadow-xs shrink-0"
          >
            {isMatcherOpen ? 'Close Wizard' : 'Run Matcher'}
          </button>
        </div>

        {/* Scheme Matcher Form Drawer */}
        {isMatcherOpen && (
          <form onSubmit={handleRunMatcher} className="mt-4 pt-4 border-t border-slate-950/10 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div>
                <label className="block mb-1 text-slate-900">Are you a woman?</label>
                <select
                  value={matcherCriteria.is_woman ? 'yes' : 'no'}
                  onChange={(e) => setMatcherCriteria({ ...matcherCriteria, is_woman: e.target.value === 'yes' })}
                  className="w-full bg-white px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-900">Your Age</label>
                <input
                  type="number"
                  min="18"
                  max="80"
                  value={matcherCriteria.age}
                  onChange={(e) => setMatcherCriteria({ ...matcherCriteria, age: e.target.value })}
                  className="w-full bg-white px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-900">State</label>
                <select
                  value={matcherCriteria.state}
                  onChange={(e) => setMatcherCriteria({ ...matcherCriteria, state: e.target.value })}
                  className="w-full bg-white px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Central">Other / All India</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-900">SHG Member?</label>
                <select
                  value={matcherCriteria.is_shg_member ? 'yes' : 'no'}
                  onChange={(e) => setMatcherCriteria({ ...matcherCriteria, is_shg_member: e.target.value === 'yes' })}
                  className="w-full bg-white px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="yes">Yes, active in SHG</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                <input
                  type="checkbox"
                  checked={matcherCriteria.has_business_interest}
                  onChange={(e) => setMatcherCriteria({ ...matcherCriteria, has_business_interest: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <span>Interested in starting / expanding business or tailoring</span>
              </label>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                type="submit"
                disabled={matcherLoading}
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} />
                <span>{matcherLoading ? 'Matching Schemes...' : 'Find My Matching Schemes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Match Results Display if available */}
      {matchResults && (
        <div className="space-y-3 bg-emerald-50/70 border border-emerald-300 rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-700" />
              <h3 className="font-bold text-sm text-emerald-950">
                Found {matchResults.total_matched} Potential Schemes
              </h3>
            </div>
            <button
              onClick={() => setMatchResults(null)}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              Clear Filter
            </button>
          </div>

          <p className="text-[11px] text-emerald-900/80 bg-emerald-100/60 p-2.5 rounded-xl">
            <strong>Disclaimer:</strong> {matchResults.disclaimer}
          </p>

          <div className="space-y-3 pt-1">
            {matchResults.matches.map((m) => (
              <SchemeCard
                key={m.scheme.id}
                scheme={m.scheme}
                matchScore={m.match_score}
                matchReasons={m.reasons}
                onViewDetails={(s) => setSelectedScheme(s)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Tabs */}
      {!matchResults && (
        <>
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
                className={`px-3 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition ${
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
        </>
      )}

      {/* Details Modal */}
      <SchemeDetailsModal
        scheme={selectedScheme}
        onClose={() => setSelectedScheme(null)}
      />
    </div>
  );
}
