import React, { useState, useMemo } from 'react';
import { 
  Crown, 
  User, 
  Phone, 
  Calendar, 
  Sparkles, 
  Clock, 
  ShoppingBag, 
  FileText, 
  Plus, 
  Search, 
  ChevronRight, 
  X, 
  History, 
  CheckCircle2, 
  Award,
  CreditCard
} from 'lucide-react';
import { ConsultationRecord, CustomerSummary } from '../types';
import { formatMMK, formatDateDDMMYYYY } from '../utils/astrology';

interface LoyalCustomersViewProps {
  consultations: ConsultationRecord[];
  onBookForCustomer: (customerName: string, phone: string) => void;
  onSelectRecord: (record: ConsultationRecord) => void;
}

export const LoyalCustomersView: React.FC<LoyalCustomersViewProps> = ({
  consultations,
  onBookForCustomer,
  onSelectRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  // Group consultations by Customer Phone (or Normalized Name)
  const customerSummaries = useMemo<CustomerSummary[]>(() => {
    const map = new Map<string, ConsultationRecord[]>();

    consultations.forEach((rec) => {
      // Key by phone if available, else clean name
      const key = rec.phone && rec.phone.replace(/[^0-9]/g, '').length > 5
        ? rec.phone.trim()
        : rec.customerName.trim().toLowerCase();

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(rec);
    });

    const summaries: CustomerSummary[] = [];

    map.forEach((records) => {
      // Sort chronologically by reading date desc
      records.sort((a, b) => new Date(b.readingDateTime || b.bookingDate).getTime() - new Date(a.readingDateTime || a.bookingDate).getTime());

      const latest = records[0];
      const visitCount = records.length;
      const totalSpent = records.reduce((s, r) => s + (r.totalAmount || 0), 0);
      const navawinTotalCount = records.filter(r => r.navawinType !== 'none').length;

      let loyaltyTier: CustomerSummary['loyaltyTier'] = 'ဧည့်သည်သစ် (Standard)';
      const isRoyal = visitCount >= 3;

      if (visitCount >= 3) {
        loyaltyTier = 'ရွှေတံဆိပ် (Royal VIP)';
      } else if (visitCount >= 2) {
        loyaltyTier = 'ငွေတံဆိပ် (Regular VIP)';
      }

      summaries.push({
        name: latest.customerName,
        phone: latest.phone,
        visitCount,
        totalSpent,
        navawinTotalCount,
        lastVisitDate: latest.readingDateTime ? latest.readingDateTime.slice(0, 10) : latest.bookingDate,
        isRoyal,
        loyaltyTier,
        records,
      });
    });

    // Sort by visit count desc, then total spent desc
    summaries.sort((a, b) => {
      if (b.visitCount !== a.visitCount) return b.visitCount - a.visitCount;
      return b.totalSpent - a.totalSpent;
    });

    return summaries;
  }, [consultations]);

  // Filtered summaries by search (Name, Phone, Customer ID, Consultation ID)
  const filteredCustomers = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return customerSummaries;
    return customerSummaries.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.records.some(r => r.id.toLowerCase().includes(q) || (r.customerId && r.customerId.toLowerCase().includes(q)))
    );
  }, [customerSummaries, searchTerm]);

  // Overall Royal VIP stats
  const royalStats = useMemo(() => {
    const royalCount = customerSummaries.filter(c => c.isRoyal).length;
    const repeatCount = customerSummaries.filter(c => c.visitCount >= 2).length;
    const totalCustomers = customerSummaries.length;
    const royalRevenue = customerSummaries
      .filter(c => c.isRoyal)
      .reduce((s, c) => s + c.totalSpent, 0);

    return { royalCount, repeatCount, totalCustomers, royalRevenue };
  }, [customerSummaries]);

  return (
    <div className="space-y-6">
      {/* Top Banner & VIP Overview */}
      <div className="bg-stone-850 p-6 rounded-2xl border border-amber-500/30 shadow-xl bg-gradient-to-br from-stone-850 via-stone-900 to-amber-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-amber-200">
                  ဖောက်သည်ကြီးများ (Royal & Repeat Customers)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
                  VIP စာရင်း
                </span>
              </div>
              <p className="text-xs text-stone-400">
                အကြိမ်ရေ အများဆုံး မေးမြန်းသူများ၊ သမိုင်းကြောင်း ဟောချက်များနှင့် တစ်သက်တာ ကံကြမ္မာမှတ်တမ်းများ
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-stone-900/80 px-3.5 py-2 rounded-xl border border-stone-800 text-xs">
              <span className="text-stone-400">Royal VIP (၃ ကြိမ်+): </span>
              <strong className="text-amber-400 font-bold text-sm ml-1">{royalStats.royalCount} ဦး</strong>
            </div>
            <div className="bg-stone-900/80 px-3.5 py-2 rounded-xl border border-stone-800 text-xs">
              <span className="text-stone-400">ဖောက်သည်ဟောင်း (၂ ကြိမ်+): </span>
              <strong className="text-blue-400 font-bold text-sm ml-1">{royalStats.repeatCount} ဦး</strong>
            </div>
            <div className="bg-stone-900/80 px-3.5 py-2 rounded-xl border border-stone-800 text-xs">
              <span className="text-stone-400">VIP ဖောက်သည်များ ဝင်ငွေ: </span>
              <strong className="text-emerald-400 font-bold text-sm ml-1">{formatMMK(royalStats.royalRevenue)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 flex items-center justify-between gap-3 shadow">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="အမည်၊ ဖုန်းနံပါတ်၊ Customer ID ဖြင့် ရှာရန်..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <span className="text-xs text-stone-400">
          ဖောက်သည်ဦးရေ: <strong className="text-stone-200">{filteredCustomers.length} ဦး</strong>
        </span>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => {
          const latest = c.records[0];
          return (
            <div
              key={c.phone || c.name}
              className={`bg-stone-850 rounded-2xl border p-5 shadow-lg transition hover:border-amber-500/50 space-y-4 ${
                c.isRoyal
                  ? 'border-amber-500/40 bg-gradient-to-b from-stone-850 to-amber-950/10'
                  : c.visitCount >= 2
                  ? 'border-blue-500/30'
                  : 'border-stone-800'
              }`}
            >
              {/* Header: Customer Name & Loyalty Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-stone-100">{c.name}</h3>
                    {c.isRoyal && (
                      <span className="p-1 rounded-full bg-amber-500/20 text-amber-400" title="ရွှေတံဆိပ် Royal VIP">
                        <Crown className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
                    <Phone className="w-3 h-3 text-stone-500" />
                    <span>{c.phone}</span>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                    c.isRoyal
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : c.visitCount >= 2
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}
                >
                  {c.loyaltyTier}
                </span>
              </div>

              {/* Stats: Visits, Navawin, Lifetime Value */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs py-1 border-y border-stone-800">
                <div>
                  <span className="text-stone-400 block text-[11px]">မေးမြန်းကြိမ်ရေ</span>
                  <strong className="text-sm font-bold text-amber-300">{c.visitCount} ကြိမ်</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">နဝင်းယတြာ</span>
                  <strong className="text-sm font-bold text-purple-300">{c.navawinTotalCount} ကြိမ်</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">စုစုပေါင်းကျသင့်ငွေ</span>
                  <strong className="text-xs font-mono font-bold text-emerald-400">{formatMMK(c.totalSpent)}</strong>
                </div>
              </div>

              {/* Latest Reading Preview */}
              {latest.predictions && (
                <div className="text-xs text-stone-400 bg-stone-900/40 p-2 rounded-lg border border-stone-800/60 line-clamp-2">
                  <span className="text-amber-400/90 font-medium">နောက်ဆုံးဟောချက်: </span>
                  {latest.predictions}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(c)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>ဟောကိန်းရာဇဝင် အပြည့်အစုံ</span>
                </button>

                <button
                  type="button"
                  onClick={() => onBookForCustomer(c.name, c.phone)}
                  title="ရက်ချိန်းအသစ် ဘိုကင်တင်ရန်"
                  className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Customer Dossier & Historical Readings Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-amber-200">{selectedCustomer.name}</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {selectedCustomer.loyaltyTier}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 flex items-center gap-3 mt-0.5">
                    <span>ဖုန်း: {selectedCustomer.phone}</span>
                    <span>•</span>
                    <span>မေးမြန်းမှု စုစုပေါင်း: {selectedCustomer.visitCount} ကြိမ်</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Historical Timeline of Readings */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              
              {/* Dossier Summary Banner */}
              <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-stone-400 block text-xs">စုစုပေါင်း မေးမြန်းမှု</span>
                  <span className="text-lg font-bold text-amber-300">{selectedCustomer.visitCount} ကြိမ်</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-xs">ယတြာ စုစုပေါင်း</span>
                  <span className="text-lg font-bold text-purple-300">{selectedCustomer.navawinTotalCount} ကြိမ်</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-xs">စုစုပေါင်း ပေးချေငွေ</span>
                  <span className="text-base font-bold font-mono text-emerald-400">{formatMMK(selectedCustomer.totalSpent)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-xs">နောက်ဆုံးလာသည့်ရက်</span>
                  <span className="text-xs font-medium text-stone-300 mt-1 block">{formatDateDDMMYYYY(selectedCustomer.lastVisitDate)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-stone-200 flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-400" />
                  <span>ပေးခဲ့သော ဟောကိန်းများနှင့် ယတြာမှတ်တမ်းများ (Reading History)</span>
                </h4>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomer(null);
                    onBookForCustomer(
                      selectedCustomer.name,
                      selectedCustomer.phone
                    );
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ရက်ချိန်းအသစ်သွင်းမည်</span>
                </button>
              </div>

              {/* Chronological Reading List */}
              <div className="space-y-4">
                {selectedCustomer.records.map((rec) => {
                  const serviceName = rec.serviceCategory || 'ဗေဒင်ဝန်ဆောင်မှု';
                  const yatraTitle = rec.yatraName || (rec.yatraEnabled ? 'ယတြာ အစီအရင်' : '');

                  return (
                    <div
                      key={rec.id}
                      className="bg-stone-850 rounded-xl border border-stone-800 p-4 space-y-3 hover:border-amber-500/30 transition"
                    >
                      {/* Top Row: Date, Service, ID */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-400 text-xs font-semibold">{rec.id}</span>
                          <span className="font-bold text-stone-100">{serviceName}</span>
                          {yatraTitle && (
                            <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              {yatraTitle}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-500" />
                            <span>{formatDateDDMMYYYY(rec.readingDateTime || rec.bookingDate)}</span>
                          </span>
                          <span className="font-mono font-bold text-emerald-400">
                            {formatMMK(rec.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Predictions Given */}
                      {rec.predictions && (
                        <div className="bg-stone-900/80 p-3 rounded-lg border border-stone-800 text-xs space-y-1">
                          <span className="text-amber-400 font-semibold block flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> ပေးလိုက်သော ဟောချက် / ဟောကိန်း:
                          </span>
                          <p className="text-stone-200 leading-relaxed whitespace-pre-wrap">{rec.predictions}</p>
                        </div>
                      )}

                      {/* Yatra Instructions */}
                      {rec.yatraInstructions && (
                        <div className="bg-stone-900/80 p-3 rounded-lg border border-stone-800 text-xs space-y-1">
                          <span className="text-purple-300 font-semibold block flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> ညွှန်ကြားခဲ့သော ယတြာနှင့် နဝင်းစီးနည်း:
                          </span>
                          <p className="text-stone-300 leading-relaxed whitespace-pre-wrap">{rec.yatraInstructions}</p>
                        </div>
                      )}

                      {/* Amulets Purchased in this session */}
                      {rec.amulets && rec.amulets.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap text-xs text-stone-300">
                          <span className="text-stone-400 flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3 text-purple-400" /> ဝယ်ယူခဲ့သော အဆောင်ပစ္စည်းများ:
                          </span>
                          {rec.amulets.map((a, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-purple-300">
                              {a.name} ({a.quantity} ခု)
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes & Actions */}
                      <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                        {rec.notes ? <span>မှတ်ချက်: {rec.notes}</span> : <span />}
                        <button
                          onClick={() => {
                            setSelectedCustomer(null);
                            onSelectRecord(rec);
                          }}
                          className="text-amber-400 hover:text-amber-300 font-medium underline cursor-pointer"
                        >
                          အသေးစိတ်ကြည့်ရန် &gt;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
