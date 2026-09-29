import React from 'react';
import { X, Printer, Sparkles } from 'lucide-react';
import { ConsultationRecord } from '../types';
import { formatMMK, NAWAWIN_OPTIONS, SERVICE_CATEGORIES, BURMESE_DAYS } from '../utils/astrology';

interface PrintReceiptModalProps {
  record: ConsultationRecord | null;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  const serviceName = SERVICE_CATEGORIES.find(s => s.key === record.serviceCategory)?.label || record.serviceCategory;
  const navawinInfo = NAWAWIN_OPTIONS.find(n => n.key === record.navawinType);
  const dayInfo = BURMESE_DAYS.find(d => d.key === record.birthDayOfWeek);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
        
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>ဗေဒင်ပြေစာနှင့် ဟောစာတမ်း ပရင့်ထုတ်ရန်</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print (ပရင့်ထုတ်ရန်)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 bg-white text-stone-900 font-sans leading-normal overflow-y-auto max-h-[85vh]">
          
          {/* Traditional Buddhist Invocation */}
          <div className="text-center border-b-2 border-amber-600/40 pb-4 mb-5">
            <p className="text-xs font-semibold text-amber-800 tracking-widest mb-1">
              နမော တဿ ဘဂဝတော အရဟတော သမ္မာသမ္ဗုဒ္ဓဿ
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              မြန်မာ့ရိုးရာဗေဒင်ပညာ မှတ်တမ်းနှင့် ဝန်ဆောင်မှုပြေစာ
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              ဗေဒင်ဟောစာတမ်း • နဝင်းယတြာ • မင်္ဂလာအဆောင်ပစ္စည်း POS
            </p>
          </div>

          {/* Voucher Info & Client Dossier */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-5 bg-amber-50/60 p-3 rounded-lg border border-amber-200">
            <div>
              <p><strong>ပြေစာအမှတ် (Voucher ID):</strong> <span className="font-mono text-amber-900 font-bold">{record.id}</span></p>
              <p className="mt-1"><strong>ဗေဒင်မေးသူအမည်:</strong> <span className="text-stone-950 font-bold text-sm">{record.customerName}</span></p>
              <p className="mt-1"><strong>ဖုန်းနံပါတ်:</strong> {record.phone}</p>
            </div>
            <div className="text-right">
              <p><strong>ရက်စွဲနှင့် အချိန်:</strong> {record.readingDateTime.replace('T', ' ')}</p>
              <p className="mt-1"><strong>မွေးဖွားသည့် နေ့နံ:</strong> {record.birthDayOfWeek} ဖွား {dayInfo ? `(${dayInfo.animal})` : ''}</p>
              {record.mahabote && <p className="mt-1"><strong>မဟာဘုတ်:</strong> {record.mahabote} ဖွား {record.age ? `(အသက် ${record.age} နှစ်)` : ''}</p>}
            </div>
          </div>

          {/* Itemized Table of Services & Amulets */}
          <table className="w-full text-xs mb-5 border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-800 text-stone-700">
                <th className="py-2 text-left font-bold">စဉ်</th>
                <th className="py-2 text-left font-bold">အမျိုးအမည် / ဝန်ဆောင်မှု</th>
                <th className="py-2 text-center font-bold">အရေအတွက်</th>
                <th className="py-2 text-right font-bold">ကျသင့်ငွေ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {/* Service Fee */}
              <tr>
                <td className="py-2 text-stone-500">၁</td>
                <td className="py-2 font-medium text-stone-900">{serviceName}</td>
                <td className="py-2 text-center">၁ ကြိမ်</td>
                <td className="py-2 text-right font-mono font-medium">{formatMMK(record.serviceFee)}</td>
              </tr>

              {/* Navawin Ritual Fee */}
              {record.navawinFee > 0 && (
                <tr>
                  <td className="py-2 text-stone-500">၂</td>
                  <td className="py-2 font-medium text-stone-900">{navawinInfo?.label || 'နဝင်းယတြာ အစီအရင်'}</td>
                  <td className="py-2 text-center">၁ မှု</td>
                  <td className="py-2 text-right font-mono font-medium">{formatMMK(record.navawinFee)}</td>
                </tr>
              )}

              {/* Amulets */}
              {record.amulets && record.amulets.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 text-stone-500">{3 + idx}</td>
                  <td className="py-2 text-stone-900">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-[11px] text-stone-500 ml-1">({item.category})</span>
                  </td>
                  <td className="py-2 text-center font-mono">{item.quantity} ခု</td>
                  <td className="py-2 text-right font-mono font-medium">{formatMMK(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-stone-800 font-bold text-sm">
                <td colSpan={3} className="py-2 text-right text-stone-900">စုစုပေါင်း ကျသင့်ငွေ (Total):</td>
                <td className="py-2 text-right font-mono text-amber-900">{formatMMK(record.totalAmount)}</td>
              </tr>
              <tr className="text-xs font-semibold text-emerald-800">
                <td colSpan={3} className="py-1 text-right">ပေးချေပြီးငွေ ({record.paymentMethod.toUpperCase()}):</td>
                <td className="py-1 text-right font-mono">{formatMMK(record.paidAmount)}</td>
              </tr>
              {record.totalAmount > record.paidAmount && (
                <tr className="text-xs font-semibold text-rose-800">
                  <td colSpan={3} className="py-1 text-right">ကျန်ငွေ (Remaining):</td>
                  <td className="py-1 text-right font-mono">{formatMMK(record.totalAmount - record.paidAmount)}</td>
                </tr>
              )}
            </tfoot>
          </table>

          {/* Predictions & Yatra Instructions Section */}
          {(record.predictions || record.yatraInstructions) && (
            <div className="space-y-3 pt-2 mb-6 border-t border-dashed border-stone-300 text-xs">
              {record.predictions && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <strong className="text-amber-900 block mb-1">ဗေဒင်ဟောကိန်း အကျဉ်း:</strong>
                  <p className="text-stone-800 whitespace-pre-wrap leading-relaxed">{record.predictions}</p>
                </div>
              )}

              {record.yatraInstructions && (
                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                  <strong className="text-amber-900 block mb-1">နဝင်းစီးနည်းနှင့် ညွှန်ကြားလိုက်သော ယတြာ:</strong>
                  <p className="text-stone-800 whitespace-pre-wrap leading-relaxed">{record.yatraInstructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Signature and Traditional Blessing Footer */}
          <div className="pt-6 border-t border-stone-300 flex items-end justify-between text-xs text-stone-600">
            <div>
              <p className="font-semibold text-amber-900">“ကံပွင့် လာဘ်ရွှင် စီးပွားတိုးတက် ဘေးရန်ကင်းရှင်းပါစေ”</p>
              <p className="text-[11px] text-stone-500 mt-1">မှတ်ချက်: ယတြာနှင့် နဝင်းစီးရာတွင် စိတ်သဒ္ဓါကြည်လင်စွာ ဆောင်ရွက်ပါရန်။</p>
            </div>

            <div className="text-center">
              <div className="h-10 border-b border-stone-400 w-36 mx-auto mb-1"></div>
              <p className="font-medium text-stone-800">ဗေဒင်ပညာရှင် လက်မှတ်</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
