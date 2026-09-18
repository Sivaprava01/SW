import React, { useState } from 'react';
import {
  IconSparkles,
  IconArrowRight,
  IconArrowLeft,
  IconCircleCheck,
  IconX,
  IconAlertTriangle,
  IconExternalLink,
  IconRefresh,
  IconChevronRight,
  IconAward,
  IconFileText,
} from '@tabler/icons-react';
import { api } from '../services/api';
import SchemeDetailsModal from './SchemeDetailsModal';

const TOTAL_QUESTIONS = 5;

export default function FullWindowSchemeMatcher({ isOpen, onClose, initialCriteria, userId }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const [answers, setAnswers] = useState({
    is_woman: initialCriteria?.is_woman ?? true,
    age: initialCriteria?.age ?? 28,
    state: initialCriteria?.state ?? 'Telangana',
    is_shg_member: initialCriteria?.is_shg_member ?? true,
    has_business_interest: initialCriteria?.has_business_interest ?? true,
    income_level: 'low',
    is_rural: true,
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < TOTAL_QUESTIONS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleMatch();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMatch = async () => {
    setLoading(true);
    try {
      const matchPayload = {
        is_woman: answers.is_woman,
        age: parseInt(answers.age, 10) || 28,
        state: answers.state,
        income_level: answers.income_level,
        has_business_interest: answers.has_business_interest,
        is_shg_member: answers.is_shg_member,
        is_rural: answers.is_rural,
      };

      const res = await api.matchSchemes(matchPayload);
      setResults(res);
    } catch (err) {
      alert(err.message || 'Error calculating scheme eligibility');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setCurrentStep(1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="matcher-title"
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex flex-col justify-between overflow-y-auto animate-in fade-in"
    >
      <div className="w-full max-w-lg mx-auto min-h-screen bg-[#fffaf5] dark:bg-slate-950 flex flex-col shadow-2xl relative">
        
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-amber-100 dark:border-slate-800 px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-slate-800 text-orange-700 dark:text-orange-400">
              <IconSparkles size={18} />
            </div>
            <div>
              <h2 id="matcher-title" className="text-sm font-black text-stone-900 dark:text-stone-100 tracking-tight">
                Government Scheme Matcher
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Step-by-step preliminary eligibility check
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close matcher"
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <IconX size={20} />
          </button>
        </header>

        {/* Progress Bar (Only during question steps) */}
        {!results && !loading && (
          <div className="bg-white dark:bg-slate-900 px-4 py-2 border-b border-amber-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 mb-1.5">
              <span>Question {currentStep} of {TOTAL_QUESTIONS}</span>
              <span className="text-orange-600 dark:text-orange-400 font-black">{Math.round((currentStep / TOTAL_QUESTIONS) * 100)}%</span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-orange-600 dark:bg-orange-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 p-5 flex flex-col justify-center">
          
          {/* Loading Animation State */}
          {loading && (
            <div className="text-center py-12 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-orange-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto animate-pulse">
                <IconSparkles size={32} />
              </div>
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                Analyzing your answers...
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
                Comparing your profile against 15 verified central and state schemes for maximum financial support.
              </p>
            </div>
          )}

          {/* Question Flow: 1 Question at a time */}
          {!results && !loading && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Question 1: Gender */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-orange-800 dark:text-orange-300 bg-[#fff1e3] dark:bg-orange-950/80 px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-200/60 dark:border-orange-800/40">
                    Step 1 • Target Profile
                  </span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 leading-tight">
                    Are you a woman?
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Many specialized government schemes (like Lakhpati Didi, Stree Nidhi, Mahila Samman) offer exclusive grants and lower loan interest rates specifically for women.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setAnswers({ ...answers, is_woman: true })}
                      className={`p-4 rounded-2xl border text-sm font-black transition text-left cursor-pointer min-h-[56px] flex items-center justify-between ${
                        answers.is_woman
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 border-amber-100 dark:border-slate-800 hover:bg-stone-50'
                      }`}
                    >
                      <span>Yes</span>
                      {answers.is_woman && <IconCircleCheck size={18} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnswers({ ...answers, is_woman: false })}
                      className={`p-4 rounded-2xl border text-sm font-black transition text-left cursor-pointer min-h-[56px] flex items-center justify-between ${
                        !answers.is_woman
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 border-amber-100 dark:border-slate-800 hover:bg-stone-50'
                      }`}
                    >
                      <span>No</span>
                      {!answers.is_woman && <IconCircleCheck size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Question 2: Age */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-orange-800 dark:text-orange-300 bg-[#fff1e3] dark:bg-orange-950/80 px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-200/60 dark:border-orange-800/40">
                    Step 2 • Eligibility
                  </span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 leading-tight">
                    What is your age?
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Schemes like Atal Pension Yojana, Sukanya Samriddhi, and PMSBY have specific age brackets.
                  </p>

                  <div className="space-y-3 pt-2">
                    <input
                      type="number"
                      min="18"
                      max="90"
                      value={answers.age}
                      onChange={(e) => setAnswers({ ...answers, age: e.target.value })}
                      className="w-full text-2xl font-black px-4 py-3 border border-amber-200 dark:border-slate-700 rounded-2xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-900"
                      placeholder="e.g. 28"
                    />
                    <div className="flex gap-2">
                      {[25, 28, 35, 45, 55].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAnswers({ ...answers, age: preset })}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            parseInt(answers.age, 10) === preset
                              ? 'bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-300 border-orange-300'
                              : 'bg-white dark:bg-slate-900 text-stone-600 dark:text-stone-400 border-amber-100 dark:border-slate-800 hover:bg-stone-50'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Question 3: State */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-orange-800 dark:text-orange-300 bg-[#fff1e3] dark:bg-orange-950/80 px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-200/60 dark:border-orange-800/40">
                    Step 3 • Location
                  </span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 leading-tight">
                    Which state do you live in?
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    This unlocks state-specific welfare benefits (such as Stree Nidhi or Kalyana Lakshmi in Telangana) alongside Central schemes.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {['Telangana', 'Andhra Pradesh', 'Maharashtra', 'Other / All India'].map((st) => {
                      const isSelected = (answers.state === st) || (st === 'Other / All India' && answers.state === 'Central');
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setAnswers({ ...answers, state: st === 'Other / All India' ? 'Central' : st })}
                          className={`p-3.5 rounded-2xl border text-sm font-bold transition text-left cursor-pointer min-h-[50px] flex items-center justify-between ${
                            isSelected
                              ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                              : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 border-amber-100 dark:border-slate-800 hover:bg-stone-50'
                          }`}
                        >
                          <span>{st}</span>
                          {isSelected && <IconCircleCheck size={16} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question 4: SHG Member */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-orange-800 dark:text-orange-300 bg-[#fff1e3] dark:bg-orange-950/80 px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-200/60 dark:border-orange-800/40">
                    Step 4 • Community Livelihood
                  </span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 leading-tight">
                    Are you a member of a Self-Help Group (SHG / Bachat Gat)?
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    SHG members qualify for Lakhpati Didi grants, Stree Nidhi fast loans, and NABARD group credit linkages.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setAnswers({ ...answers, is_shg_member: true })}
                      className={`w-full p-4 rounded-2xl border text-sm font-bold transition text-left cursor-pointer min-h-[56px] flex items-center justify-between ${
                        answers.is_shg_member
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                          : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 border-amber-100 dark:border-slate-800 hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <div>Yes, active in an SHG / Bachat Gat</div>
                        <div className={`text-xs mt-0.5 ${answers.is_shg_member ? 'text-orange-100' : 'text-stone-400'}`}>
                          Unlocks micro-credit and group grants
                        </div>
                      </div>
                      {answers.is_shg_member && <IconCircleCheck size={20} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnswers({ ...answers, is_shg_member: false })}
                      className={`w-full p-4 rounded-2xl border text-sm font-bold transition text-left cursor-pointer min-h-[56px] flex items-center justify-between ${
                        !answers.is_shg_member
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                          : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 border-amber-100 dark:border-slate-800 hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <div>No, not a member</div>
                        <div className={`text-xs mt-0.5 ${!answers.is_shg_member ? 'text-orange-100' : 'text-stone-400'}`}>
                          Still eligible for direct individual schemes
                        </div>
                      </div>
                      {!answers.is_shg_member && <IconCircleCheck size={20} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Question 5: Business Interest */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-orange-800 dark:text-orange-300 bg-[#fff1e3] dark:bg-orange-950/80 px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-200/60 dark:border-orange-800/40">
                    Step 5 • Business & Livelihood
                  </span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 leading-tight">
                    Do you want to start or expand a small business, tailoring, or shop?
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Unlocks collateral-free loans like MUDRA Shishu (up to ₹50k), PM Vishwakarma toolkits, and Stand-Up India.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setAnswers({ ...answers, has_business_interest: true })}
                      className={`p-4 rounded-2xl border text-sm font-black transition text-left cursor-pointer min-h-[56px] flex items-center justify-between ${
                        answers.has_business_interest
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 border-amber-100 dark:border-slate-800 hover:bg-stone-50'
                      }`}
                    >
                      <span>Yes</span>
                      {answers.has_business_interest && <IconCircleCheck size={18} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnswers({ ...answers, has_business_interest: false })}
                      className={`p-4 rounded-2xl border text-sm font-black transition text-left cursor-pointer min-h-[56px] flex items-center justify-between ${
                        !answers.has_business_interest
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 border-amber-100 dark:border-slate-800 hover:bg-stone-50'
                      }`}
                    >
                      <span>No</span>
                      {!answers.has_business_interest && <IconCircleCheck size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results Screen */}
          {results && !loading && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-black text-base flex items-center gap-2">
                    <IconCircleCheck size={20} className="text-emerald-700 dark:text-emerald-400" />
                    You may want to explore {results.total_matched} Schemes
                  </h3>
                </div>
                <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
                  Based on your age ({answers.age}), location ({answers.state}), and profile.
                </p>
              </div>

              {/* Disclaimer Notice */}
              <div className="bg-[#fff1e3] dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 rounded-2xl p-3.5 flex gap-2.5 text-orange-950 dark:text-orange-200">
                <IconAlertTriangle size={18} className="shrink-0 text-orange-600 dark:text-orange-400 mt-0.5" />
                <p className="text-xs leading-relaxed font-medium">
                  {results.disclaimer}
                </p>
              </div>

              {/* Matched Schemes List */}
              <div className="space-y-3 pt-1">
                {results.matches.map((m) => (
                  <div
                    key={m.scheme.id}
                    className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-orange-300 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff1e3] dark:bg-slate-800 text-orange-900 dark:text-orange-300 border border-orange-200/50 dark:border-slate-700">
                        {m.scheme.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                        {m.match_score}% Match
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                      {m.scheme.name}
                    </h4>

                    <p className="text-xs text-stone-600 dark:text-stone-400 mb-3 leading-relaxed">
                      {m.scheme.what_it_provides}
                    </p>

                    {/* Why you match */}
                    {m.reasons && m.reasons.length > 0 && (
                      <div className="bg-stone-50 dark:bg-slate-800/80 p-2.5 rounded-xl mb-3 border border-amber-50 dark:border-slate-700/60">
                        <span className="text-[11px] font-bold text-orange-700 dark:text-orange-400 block mb-1">
                          Why it may be relevant:
                        </span>
                        <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5 pl-3 list-disc">
                          {m.reasons.slice(0, 2).map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 border-t border-amber-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedScheme(m.scheme)}
                        className="px-3 py-1.5 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs transition cursor-pointer min-h-[38px]"
                      >
                        View Full Summary
                      </button>

                      <a
                        href={m.scheme.official_source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer min-h-[38px]"
                      >
                        <span>View official source →</span>
                        <IconExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <footer className="sticky bottom-0 z-10 bg-white dark:bg-slate-900 border-t border-amber-100 dark:border-slate-800 p-4 flex gap-2">
          {!results && !loading && (
            <>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-3 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs transition cursor-pointer min-h-[44px] flex items-center gap-1.5"
                >
                  <IconArrowLeft size={16} />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl text-xs transition shadow-sm cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>{currentStep === TOTAL_QUESTIONS ? 'Calculate My Matches' : 'Next Question'}</span>
                <IconArrowRight size={16} />
              </button>
            </>
          )}

          {results && !loading && (
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <IconRefresh size={14} />
                <span>Retake Matcher</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl text-xs transition shadow-sm cursor-pointer min-h-[44px] active:scale-95"
              >
                Done
              </button>
            </div>
          )}
        </footer>

        {/* Scheme Details Modal */}
        <SchemeDetailsModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
        />
      </div>
    </div>
  );
}
