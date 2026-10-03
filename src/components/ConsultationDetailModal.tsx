import React, { useMemo } from 'react';
import { 
  X, 
  Printer, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  User, 
  Phone, 
  FileText, 
  Calendar,
  CreditCard,
  History,
  ExternalLink
} from 'lucide-react';
import { ConsultationRecord } from '../types';
import { formatMMK, BURMESE_DAYS, formatDateDDMMYYYY } from '../utils/astrology';

interface ConsultationDetailModalProps {
  record: ConsultationRecord | null;
  allRecords?: ConsultationRecord[];
  onClose: () => void;
  onEdit: (record: ConsultationRecord) => void;
  onPrint: (record: ConsultationRecord) => void;
  onToggleTaskDone: (id: string) => void;
  onSelectRecord?: (record: ConsultationRecord) => void;
}

export const ConsultationDetailModal: React.FC<ConsultationDetailModalProps> = ({
  record,
  allRecords = [],
  onClose,
  onEdit,
  onPrint,
  onToggleTaskDone,
  onSelectRecord,
}) => {
  if (!record) return null;

  const serviceName = record.serviceCategory || 'ဗေဒင်ဝန်ဆောင်မှု';
  const dayInfo = BURMESE_DAYS.find(d => d.key === record.birthDayOfWeek);

  // Look up previous appointments by phone number AND/OR customer ID
  const previousAppointments = useMemo(() => {
    if (!allRecords || allRecords.length === 0 || !record) return [];
    const cleanPhone = (record.phone || '').replace(/[^0-9]/g, '');
    const cleanCustomerId = (record.customerId || '').trim().toLowerCase();
    const cleanRecordId = (record.id || '').trim().toLowerCase();

    return allRecords
      .filter((r) => {
        if (r.id === record.id) return false;

        // 1. Match by Phone Number (if at least 5 digits)
        const rCleanPhone = (r.phone || '').replace(/[^0-9]/g, '');
        if (cleanPhone && cleanPhone.length >= 5 && rCleanPhone === cleanPhone) {
          return true;
        }

        // 2. Match by Customer ID
        const rCleanCustId = (r.customerId || '').trim().toLowerCase();
        if (cleanCustomerId && rCleanCustId && cleanCustomerId === rCleanCustId) {
          return true;
        }

        // 3. Match Customer ID with Consultation ID
        if (cleanCustomerId && r.id.toLowerCase() === cleanCustomerId) {
          return true;
        }
        if (cleanRecordId && rCleanCustId === cleanRecordId) {
          return true;
        }

        // 4. Fallback: Match by exact Customer Name + BirthDay (when phone & customerId are absent)
        if (!cleanPhone && !cleanCustomerId && record.customerName && r.customerName) {
          if (record.customerName.trim().toLowerCase() === r.customerName.trim().toLowerCase()) {
            if (record.birthDayOfWeek === r.birthDayOfWeek) {
              return true;
            }
          }
        }

        return false;
      })
      .sort((a, b) => new Date(b.readingDateTime || b.bookingDate).getTime() - new Date(a.readingDateTime || a.bookingDate).getTime());
  }, [allRecords, record]);

  const totalPreviousSpent = useMemo(() => {
    return previousAppointments.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  }, [previousAppointments]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 2.75rem), 2.75rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 1.25rem), 1.25rem)',
      }}
    >
      <div className="bg-stone-900 border border-amber-500/30 rounded-3xl w-full max-w-3xl max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {record.id}
                </span>
                <h2 className="text-lg font-bold text-stone-100">{record.customerName || 'မမေးသူ (အမည်မသိ)'}</h2>
                {record.taskDone && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ပြီးစီး
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                ဗေဒင်ဟောစာတမ်းနှင့် နဝင်းယတြာ အသေးစိတ်မှတ်တမ်း
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(record)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-600/30 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>ပြေစာ/ဟောစာတမ်း ပရင့်</span>
            </button>
            <button
              onClick={() => onEdit(record)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* Customer & Horoscope Dossier Card */}
          <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="font-semibold text-amber-400 flex items-center gap-2">
                <User className="w-4 h-4" /> မေးသူ ကိုယ်ရေးနှင့် မွေးဇာတာ အချက်အလက်
              </span>
              <span className="text-stone-400 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>{record.phone || 'ဖုန်းမပါ'}</span>
                {record.socialAccountName && (
                  <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 text-xs">
                    {record.socialPlatform || 'Social'}: {record.socialAccountName}
                  </span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-300">
              <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-500 text-[11px] block">မွေးနံ:</span>
                <span className="font-semibold text-amber-300">{record.birthDayOfWeek} ဖွား</span>
                {dayInfo && <span className="text-xs text-stone-400 block">({dayInfo.shorthand})</span>}
              </div>

              <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-500 text-[11px] block">မဟာဘုတ်:</span>
                <span className="font-semibold text-stone-200">{record.mahabote || '-'} ဖွား</span>
              </div>

              <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-500 text-[11px] block">မွေးသက္ကရာဇ် & အသက်:</span>
                <span className="font-medium text-stone-200 block">
                  {formatDateDDMMYYYY(record.birthDate) || '-'} {record.age ? `(${record.age} နှစ်)` : ''}
                </span>
                {record.myanmarBirthDate && (
                  <span className="text-xs text-amber-300 font-semibold block mt-1">
                    {record.myanmarBirthDate}
                  </span>
                )}
              </div>

              <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-500 text-[11px] block">မွေးဖွားချိန်:</span>
                <span className="font-medium text-stone-200">{record.birthTime || '-'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2 text-stone-400 text-xs">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>ဘိုကင်တင်သည့်နေ့: <strong className="text-stone-200">{formatDateDDMMYYYY(record.bookingDate)}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-stone-400 text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>ဗေဒင်ဟောမည့်နေ့နှင့် အချိန်: <strong className="text-amber-300">{formatDateDDMMYYYY(record.readingDateTime)}</strong></span>
              </div>
            </div>
          </div>

          {/* Predictions Given Card */}
          <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-2">
            <span className="font-semibold text-amber-400 flex items-center gap-2">
              <FileText className="w-4 h-4" /> ပေးလိုက်သော ဟောချက်များ / ဟောကိန်း (Predictions)
            </span>
            <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 leading-relaxed text-stone-200 whitespace-pre-wrap">
              {record.predictions || 'ဟောချက် မှတ်တမ်း မထည့်သွင်းရသေးပါ။'}
            </div>
          </div>

          {/* Yatra Instructions */}
          {(record.yatraEnabled || record.navawinType !== 'none' || record.yatraInstructions || record.yatraName) && (
            <div className="bg-stone-850 p-4 rounded-xl border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> ညွှန်ကြားခဲ့သော ယတြာနှင့် အစီအရင်
                </span>
                {(record.yatraName || record.yatraEnabled || record.navawinType !== 'none') && (
                  <span className="px-2.5 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                    {record.yatraName || 'ယတြာ အစီအရင်'}
                  </span>
                )}
              </div>
              <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 leading-relaxed text-stone-200 whitespace-pre-wrap">
                {record.yatraInstructions || 'ယတြာ ညွှန်ကြားချက် မထည့်သွင်းရသေးပါ။'}
              </div>
            </div>
          )}

          {/* Amulets Purchased POS Items */}
          {record.amulets && record.amulets.length > 0 && (
            <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-semibold text-purple-400 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> ဝယ်ယူခဲ့သော အဆောင်ပစ္စည်းများ (POS Items)
                </span>
                <span className="text-xs text-stone-400">
                  စုစုပေါင်း: <strong className="text-purple-300">{formatMMK(record.amuletsTotal)}</strong>
                </span>
              </div>

              <div className="divide-y divide-stone-800">
                {record.amulets.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 text-stone-300">
                    <div>
                      <span className="font-medium text-stone-100">{item.name}</span>
                      <span className="text-xs text-stone-500 ml-2">({item.category})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-stone-400">{item.quantity} ခု</span>
                      <span className="font-mono font-bold text-purple-300">{formatMMK(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing & Payment Breakdown */}
          <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="font-semibold text-emerald-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> ငွေပေးချေမှုနှင့် ကျသင့်ငွေ ရှင်းတမ်း
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-stone-800 text-stone-300 border border-stone-700">
                {record.paymentMethod.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1.5 text-stone-300 text-xs">
              <div className="flex justify-between">
                <span>{serviceName}:</span>
                <span className="font-mono text-stone-200">{formatMMK(record.serviceFee)}</span>
              </div>
              {((record.yatraFee && record.yatraFee > 0) || (record.navawinFee && record.navawinFee > 0)) && (
                <div className="flex justify-between">
                  <span>{record.yatraName || 'ယတြာ အစီအရင်'}:</span>
                  <span className="font-mono text-amber-300">{formatMMK(record.yatraFee || record.navawinFee)}</span>
                </div>
              )}
              {record.amuletsTotal > 0 && (
                <div className="flex justify-between">
                  <span>အဆောင်ပစ္စည်းများ:</span>
                  <span className="font-mono text-purple-300">{formatMMK(record.amuletsTotal)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-stone-800 text-sm font-bold">
                <span className="text-amber-200">စုစုပေါင်း ကျသင့်ငွေ:</span>
                <span className="font-mono text-amber-300">{formatMMK(record.totalAmount)}</span>
              </div>

              <div className="flex justify-between text-xs text-emerald-400 font-semibold pt-1">
                <span>ပေးချေပြီးငွေ (Paid):</span>
                <span className="font-mono">{formatMMK(record.paidAmount)}</span>
              </div>

              {record.totalAmount > record.paidAmount && (
                <div className="flex justify-between text-xs text-rose-400 font-semibold">
                  <span>ကျန်ငွေ (Remaining):</span>
                  <span className="font-mono">{formatMMK(record.totalAmount - record.paidAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Previous Appointments History (Based on Phone / Customer ID) */}
          <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-800 pb-2">
              <span className="font-semibold text-amber-400 flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <span>ဖုန်းနံပါတ် / Customer ID အလိုက် ယခင် မေးမြန်းမှုရာဇဝင် (Previous Consultations)</span>
              </span>
              {previousAppointments.length > 0 && (
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span>ယခင်လာရောက်မှု: <strong className="text-amber-300">{previousAppointments.length} ကြိမ်</strong></span>
                  <span>•</span>
                  <span>စုစုပေါင်း ပေးချေငွေ: <strong className="text-emerald-400 font-mono">{formatMMK(totalPreviousSpent)}</strong></span>
                </div>
              )}
            </div>

            {previousAppointments.length === 0 ? (
              <div className="p-3 rounded-lg bg-stone-900/60 border border-stone-800 text-stone-400 text-xs flex items-center gap-2">
                <User className="w-4 h-4 text-stone-500 shrink-0" />
                <span>
                  {record.phone ? `ဖုန်းနံပါတ် (${record.phone})` : (record.customerId ? `Customer ID (${record.customerId})` : `မေးသူအမည်`)} ဖြင့် ယခင် လာရောက်မေးမြန်းထားသော မှတ်တမ်း မရှိသေးပါ (ပထမဆုံးအကြိမ် ဧည့်သည်)။
                </span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {previousAppointments.map((prev) => {
                  const prevService = prev.serviceCategory || 'ဗေဒင်ဝန်ဆောင်မှု';
                  const prevYatra = prev.yatraName || (prev.yatraEnabled ? 'ယတြာ အစီအရင်' : '');

                  return (
                    <div
                      key={prev.id}
                      className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 hover:border-amber-500/40 transition flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {prev.id}
                          </span>
                          <span className="font-semibold text-stone-200 text-xs">{prevService}</span>
                          {prevYatra && (
                            <span className="px-1.5 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {prevYatra}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-500" />
                            {formatDateDDMMYYYY(prev.readingDateTime || prev.bookingDate)}
                          </span>
                          {onSelectRecord && (
                            <button
                              type="button"
                              onClick={() => onSelectRecord(prev)}
                              className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1 transition cursor-pointer"
                              title="ဤမှတ်တမ်းအား အသေးစိတ်ကြည့်ရန်"
                            >
                              <span>ကြည့်မည်</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Brief info: predictions or yatra notes */}
                      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-800/60">
                        <div className="truncate max-w-[280px] sm:max-w-md text-stone-400">
                          {prev.predictions ? `ဟောချက်: ${prev.predictions}` : (prev.notes ? `မှတ်ချက်: ${prev.notes}` : 'အသေးစိတ်မှတ်တမ်း ရှိသည်')}
                        </div>
                        <div className="font-mono font-bold text-emerald-400 shrink-0">
                          {formatMMK(prev.totalAmount)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          {record.notes && (
            <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800 text-xs text-stone-400">
              <strong className="text-stone-300">မှတ်ချက်: </strong> {record.notes}
            </div>
          )}

          {/* Multi-Device Audit Trail */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 bg-stone-900/40 px-3 py-2 rounded-xl border border-stone-800/60">
            <span>
              သွင်းသည့် စက်/တာဝန်ခံ: <strong className="text-stone-300">{record.recordedBy || 'စက် (၁)'}</strong>
            </span>
            {record.updatedBy && (
              <span>
                နောက်ဆုံးပြင်သူ: <strong className="text-emerald-400">{record.updatedBy}</strong>{' '}
                <span className="text-stone-600 font-mono">({new Date(record.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
              </span>
            )}
          </div>

          {/* Footer Status Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={() => onToggleTaskDone(record.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                record.taskDone
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-stone-800 text-stone-400 border-stone-700 hover:border-amber-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{record.taskDone ? 'ပြီးစီးပြီး (Done)' : 'ပြီးစီးကြောင်း အမှတ်အသားပြုရန်'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
            >
              ပိတ်မည်
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
