import React from 'react';
import { X, ExternalLink, FileText, CheckCircle, ShieldAlert, Building2, MapPin, Users, Award } from 'lucide-react';

export default function SchemeDetailsModal({ scheme, onClose }) {
  if (!scheme) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                {scheme.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 flex items-center gap-1">
                <MapPin size={12} /> {scheme.state}
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">
              {scheme.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          
          {/* Disclaimer Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex gap-2.5 text-amber-950">
            <ShieldAlert size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              <strong>Important Notice:</strong> Sakhi provides a preliminary eligibility match and does not provide official eligibility confirmation. Always verify rules and submit applications through official government channels.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Award size={15} className="text-emerald-600" /> What this program provides
            </h4>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed font-medium">
              {scheme.what_it_provides}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Users size={15} className="text-emerald-600" /> Target beneficiaries
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {scheme.target_users}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle size={15} className="text-emerald-600" /> Basic Eligibility
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {scheme.basic_eligibility}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <FileText size={15} className="text-emerald-600" /> Documents Needed
            </h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {scheme.required_documents}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Building2 size={15} className="text-emerald-600" /> How to Apply
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {scheme.application_process}
            </p>
          </div>
        </div>

        {/* Footer with Official Link */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition"
          >
            Close
          </button>

          <a
            href={scheme.official_source}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Official Government Portal</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
