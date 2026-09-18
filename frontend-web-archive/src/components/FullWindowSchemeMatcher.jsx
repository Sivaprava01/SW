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
      <div className="w-full max-w-lg mx-auto min-h-screen bg-[#fff8f3] dark:bg-[#14110F] text-[#221a0e] dark:text-[#FFF5EB] flex flex-col shadow-2xl relative">
        
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-[#fff8f3]/95 dark:bg-[#14110F]/95 backdrop-blur-md border-b border-amber-100 dark:border-[#3D332B] px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-[#28211C] text-orange-700 dark:text-[#ffb690]">
              <IconSparkles size={18} />
            </div>
            <div>
              <h2 id="matcher-title" className="font-headline text-sm font-black text-[#221a0e] dark:text-[#FFF5EB] tracking-tight">
                Government Scheme Matcher
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-[#A8988A]">
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
          <div className="bg-[#fff1e3] dark:bg-[#1e1b19] px-4 py-2 border-b border-amber-100 dark:border-[#3D332B]">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-[#A8988A] mb-1.5 font-mono">
              <span>Question {currentStep} of {TOTAL_QUESTIONS}</span>
              <span className="text-orange-600 dark:text-[#ffb690] font-black">{Math.round((currentStep / TOTAL_QUESTIONS) * 100)}%</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-[#28211C] h-2 rounded-full overflow-hidden">
              <div
                className="bg-orange-600 dark:bg-[#ffb690] h-full transition-all duration-300 rounded-full"
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
              <div className="w-16 h-16 rounded-3xl bg-orange-100 dark:bg-[#28211C] text-orange-600 dark:text-[#ffb690] flex items-center justify-center mx-auto animate-pulse">
                <IconSparkles size={32} />
              </div>
              <h3 className="font-headline text-lg font-black text-[#221a0e] dark:text-[#FFF5EB]">
                Analyzing your answers...
              </h3>
              <p className="text-xs text-stone-500 dark:text-[#A8988A] max-w-xs mx-auto leading-relaxed">
                Checking age, SHG rules, and region criteria against 15 authentic welfare schemes.
              </p>
            </div>
          )}

          {/* Results View */}
          {results && !loading && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-emerald-50 dark:bg-[#1e1b19] border border-emerald-200 dark:border-[#3D332B] rounded-2xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                  <IconCircleCheck size={20} />
                </div>
                <h3 className="font-headline text-lg font-black text-emerald-950 dark:text-emerald-300">
                  {results.matched_schemes?.length || 0} Matches Found
                </h3>
                <p className="text-xs text-stone-600 dark:text-[#D4C4B5] mt-1">
                  Based on your responses, you show strong potential eligibility for the following programs:
                </p>
              </div>

              <div className="space-y-3">
                {results.matched_schemes?.map((m) => (
                  <div
                    key={m.scheme.id}
                    className="bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] rounded-2xl p-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fff1e3] dark:bg-[#28211C] text-orange-900 dark:text-[#ffb690]">
                        {m.scheme.category}
                      </span>
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-[#28211C] px-2.5 py-0.5 rounded-full border border-emerald-300/40 font-mono">
                        {m.match_score}% Match
                      </span>
                    </div>

                    <h4 className="font-headline text-base font-bold text-[#221a0e] dark:text-[#FFF5EB] mb-1">
                      {m.scheme.name}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-[#D4C4B5] mb-3">
                      {m.scheme.description}
                    </p>

                    <div className="bg-[#fffaf5] dark:bg-[#14110F] p-2.5 rounded-xl border border-stone-100 dark:border-[#3D332B] mb-3">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                        Matching Criteria:
                      </span>
                      <ul className="text-xs text-stone-700 dark:text-[#D4C4B5] space-y-0.5 pl-3 list-disc">
                        {m.match_reasons.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setSelectedScheme(m.scheme)}
                      className="w-full py-2 bg-orange-50 dark:bg-[#28211C] hover:bg-orange-100 dark:hover:bg-stone-800 text-orange-800 dark:text-[#ffb690] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 border border-orange-200/60 dark:border-[#3D332B] cursor-pointer"
                    >
                      <span>View Full Scheme Details</span>
                      <IconChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-[#fff1e3] dark:bg-[#28211C] hover:bg-amber-100 dark:hover:bg-stone-800 text-stone-700 dark:text-[#D4C4B5] font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <IconRefresh size={15} />
                  <span>Start Over</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}

          {/* QUESTION 1 */}
          {!results && !loading && currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-bold text-orange-600 dark:text-[#ffb690] uppercase tracking-wider">
                Question 1 of 5
              </span>
              <h3 className="font-headline text-lg font-black text-[#221a0e] dark:text-[#FFF5EB]">
                What is your age in completed years?
              </h3>
              <p className="text-xs text-stone-500 dark:text-[#A8988A]">
                Many state schemes have specific minimum age guidelines (e.g. 18+ for livelihood loans, 60+ for pensions).
              </p>
              <div>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={answers.age}
                  onChange={(e) => setAnswers({ ...answers, age: e.target.value })}
                  className="w-full text-2xl font-headline font-black px-4 py-3 bg-[#fffaf5] dark:bg-[#100e0c] border border-amber-200 dark:border-[#3D332B] rounded-2xl text-[#221a0e] dark:text-[#FFF5EB] focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* QUESTION 2 */}
          {!results && !loading && currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-bold text-orange-600 dark:text-[#ffb690] uppercase tracking-wider">
                Question 2 of 5
              </span>
              <h3 className="font-headline text-lg font-black text-[#221a0e] dark:text-[#FFF5EB]">
                Are you a member of a Self-Help Group (SHG)?
              </h3>
              <p className="text-xs text-stone-500 dark:text-[#A8988A]">
                SHG members qualify for special community loans, revolving funds, and government interest subventions.
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, is_shg_member: true })}
                  className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${
                    answers.is_shg_member
                      ? 'bg-[#fff1e3] dark:bg-[#28211C] border-orange-500 text-orange-950 dark:text-[#FFF5EB] shadow-xs'
                      : 'bg-white dark:bg-[#1e1b19] border-stone-200 dark:border-[#3D332B] text-stone-700 dark:text-[#D4C4B5]'
                  }`}
                >
                  <span>Yes, active SHG member</span>
                  {answers.is_shg_member && <IconCircleCheck size={18} className="text-orange-600 dark:text-[#ffb690]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, is_shg_member: false })}
                  className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${
                    !answers.is_shg_member
                      ? 'bg-[#fff1e3] dark:bg-[#28211C] border-orange-500 text-orange-950 dark:text-[#FFF5EB] shadow-xs'
                      : 'bg-white dark:bg-[#1e1b19] border-stone-200 dark:border-[#3D332B] text-stone-700 dark:text-[#D4C4B5]'
                  }`}
                >
                  <span>No, independent saver</span>
                  {!answers.is_shg_member && <IconCircleCheck size={18} className="text-orange-600 dark:text-[#ffb690]" />}
                </button>
              </div>
            </div>
          )}

          {/* QUESTION 3 */}
          {!results && !loading && currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-bold text-orange-600 dark:text-[#ffb690] uppercase tracking-wider">
                Question 3 of 5
              </span>
              <h3 className="font-headline text-lg font-black text-[#221a0e] dark:text-[#FFF5EB]">
                Which state is your primary residence?
              </h3>
              <p className="text-xs text-stone-500 dark:text-[#A8988A]">
                State-specific welfare schemes vary between Telangana, Andhra Pradesh, and Central programs.
              </p>
              <select
                value={answers.state}
                onChange={(e) => setAnswers({ ...answers, state: e.target.value })}
                className="w-full text-sm font-bold px-4 py-3 bg-[#fffaf5] dark:bg-[#100e0c] border border-amber-200 dark:border-[#3D332B] rounded-2xl text-[#221a0e] dark:text-[#FFF5EB] focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              >
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Odisha">Odisha</option>
                <option value="Other">Other State</option>
              </select>
            </div>
          )}

          {/* QUESTION 4 */}
          {!results && !loading && currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-bold text-orange-600 dark:text-[#ffb690] uppercase tracking-wider">
                Question 4 of 5
              </span>
              <h3 className="font-headline text-lg font-black text-[#221a0e] dark:text-[#FFF5EB]">
                Do you plan to run or grow a small enterprise?
              </h3>
              <p className="text-xs text-stone-500 dark:text-[#A8988A]">
                E.g. Tailoring, dairy farming, vegetable vending, flour mill, or home handicraft.
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, has_business_interest: true })}
                  className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${
                    answers.has_business_interest
                      ? 'bg-[#fff1e3] dark:bg-[#28211C] border-orange-500 text-orange-950 dark:text-[#FFF5EB] shadow-xs'
                      : 'bg-white dark:bg-[#1e1b19] border-stone-200 dark:border-[#3D332B] text-stone-700 dark:text-[#D4C4B5]'
                  }`}
                >
                  <span>Yes, I want to start or expand a micro-business</span>
                  {answers.has_business_interest && <IconCircleCheck size={18} className="text-orange-600 dark:text-[#ffb690]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, has_business_interest: false })}
                  className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${
                    !answers.has_business_interest
                      ? 'bg-[#fff1e3] dark:bg-[#28211C] border-orange-500 text-orange-950 dark:text-[#FFF5EB] shadow-xs'
                      : 'bg-white dark:bg-[#1e1b19] border-stone-200 dark:border-[#3D332B] text-stone-700 dark:text-[#D4C4B5]'
                  }`}
                >
                  <span>No, primary focus is safety and insurance</span>
                  {!answers.has_business_interest && <IconCircleCheck size={18} className="text-orange-600 dark:text-[#ffb690]" />}
                </button>
              </div>
            </div>
          )}

          {/* QUESTION 5 */}
          {!results && !loading && currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-bold text-orange-600 dark:text-[#ffb690] uppercase tracking-wider">
                Question 5 of 5
              </span>
              <h3 className="font-headline text-lg font-black text-[#221a0e] dark:text-[#FFF5EB]">
                Where is your family home located?
              </h3>
              <p className="text-xs text-stone-500 dark:text-[#A8988A]">
                Rural and urban welfare divisions operate through different panchayat and municipal bodies.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, is_rural: true })}
                  className={`p-4 rounded-2xl border text-center font-bold text-xs sm:text-sm transition cursor-pointer ${
                    answers.is_rural
                      ? 'bg-[#fff1e3] dark:bg-[#28211C] border-orange-500 text-orange-950 dark:text-[#FFF5EB] shadow-xs'
                      : 'bg-white dark:bg-[#1e1b19] border-stone-200 dark:border-[#3D332B] text-stone-700 dark:text-[#D4C4B5]'
                  }`}
                >
                  Rural village
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, is_rural: false })}
                  className={`p-4 rounded-2xl border text-center font-bold text-xs sm:text-sm transition cursor-pointer ${
                    !answers.is_rural
                      ? 'bg-[#fff1e3] dark:bg-[#28211C] border-orange-500 text-orange-950 dark:text-[#FFF5EB] shadow-xs'
                      : 'bg-white dark:bg-[#1e1b19] border-stone-200 dark:border-[#3D332B] text-stone-700 dark:text-[#D4C4B5]'
                  }`}
                >
                  Urban town
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav Actions (during questions) */}
        {!results && !loading && (
          <footer className="sticky bottom-0 bg-[#fff8f3]/95 dark:bg-[#14110F]/95 backdrop-blur-md border-t border-amber-100 dark:border-[#3D332B] p-4 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-3 bg-stone-200 dark:bg-[#28211C] hover:bg-stone-300 text-stone-800 dark:text-[#D4C4B5] font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 min-h-[44px]"
              >
                <IconArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] active:scale-95"
            >
              <span>{currentStep === TOTAL_QUESTIONS ? 'Calculate My Matches' : 'Next Question'}</span>
              <IconArrowRight size={16} />
            </button>
          </footer>
        )}

        {/* Scheme Details Sub-modal inside Matcher */}
        <SchemeDetailsModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
        />
      </div>
    </div>
  );
}
