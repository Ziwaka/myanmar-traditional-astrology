import React, { useRef, useState } from 'react';
import { 
  X, 
  Printer, 
  Sparkles, 
  Download, 
  Check, 
  Loader2,
  Calendar,
  User,
  Flame,
  CreditCard,
  Crown
} from 'lucide-react';
import { toJpeg } from 'html-to-image';
import html2canvas from 'html2canvas';
import { ConsultationRecord } from '../types';
import { formatMMK, NAWAWIN_OPTIONS, BURMESE_DAYS, MAHABOTE_HOUSES, formatDateDDMMYYYY } from '../utils/astrology';
import { AstrologyLogo } from './AstrologyLogo';

interface PrintReceiptModalProps {
  record: ConsultationRecord | null;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string>('');

  const serviceName = record.serviceCategory || 'ဗေဒင်ဟောကြားခြင်း';
  const dayInfo = BURMESE_DAYS.find(d => d.key === record.birthDayOfWeek);
  const mahaboteInfo = MAHABOTE_HOUSES.find(m => m.key === record.mahabote);
  const hasYatra = Boolean((record.yatraFee && record.yatraFee > 0) || (record.navawinFee && record.navawinFee > 0));

  const showNotification = (msg: string) => {
    setExportSuccessMsg(msg);
    setTimeout(() => setExportSuccessMsg(''), 3000);
  };

  // Helper to format currency numbers without repeated 'ကျပ်'
  const formatKyatsOnly = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null) return '၀';
    return new Intl.NumberFormat('my-MM').format(amount);
  };

  // 1. Direct Browser Print
  const handlePrint = () => {
    window.print();
  };

  // 2. High-Compatibility JPEG Image Export using Browser Native SVG Render + html2canvas Fallback
  const handleExportJPEG = async () => {
    if (!printAreaRef.current) return;
    setIsExporting(true);

    const fileName = `Horoscope_Receipt_${record.id}_${record.customerName || 'Receipt'}.jpg`;

    try {
      // Primary Engine: html-to-image (Uses browser native SVG renderer, 100% supports Tailwind v4 oklch())
      const dataUrl = await toJpeg(printAreaRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      showNotification('JPEG ပုံရိပ် အောင်မြင်စွာ ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!');
    } catch (primaryErr) {
      console.warn('html-to-image export failed, attempting html2canvas with oklch sanitizer fallback...', primaryErr);

      try {
        // Fallback Engine: html2canvas with onclone CSS rule sanitization (removes oklch rules to prevent parser crash)
        const canvas = await html2canvas(printAreaRef.current, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          onclone: (clonedDoc) => {
            try {
              const sheets = Array.from(clonedDoc.styleSheets);
              for (const sheet of sheets) {
                try {
                  const rules = sheet.cssRules || sheet.rules;
                  if (rules) {
                    for (let i = rules.length - 1; i >= 0; i--) {
                      if (rules[i].cssText && rules[i].cssText.includes('oklch')) {
                        sheet.deleteRule(i);
                      }
                    }
                  }
                } catch (e) {
                  // ignore cross-origin stylesheets
                }
              }
            } catch (e) {
              // ignore
            }
          },
        });

        const fallbackDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = fallbackDataUrl;
        link.click();

        showNotification('JPEG ပုံရိပ် အောင်မြင်စွာ ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!');
      } catch (fallbackErr) {
        console.error('All image export methods failed:', fallbackErr);
        alert('ပုံရိပ်သိမ်းဆည်းရာတွင် အမှားဖြစ်ပေါ်နေပါသည်။ Browser ရွှေ့သုံးပေးပါ သို့မဟုတ် Screenshot ရိုက်၍ အလွယ်တကူ သိမ်းဆည်းနိုင်ပါသည် ခင်ဗျာ။');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[96vh]">
        
        {/* Modal Top Control Bar (Hidden during window.print()) */}
        <div className="no-print p-4 sm:p-5 bg-stone-950 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm sm:text-base font-bold text-amber-200">
                ဗေဒင်ဟောစာတမ်း၊ ဇာတာ၊ ယတြာနှင့် ပြေစာ ထုတ်ယူရန်
              </h2>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              JPEG ပုံစံဖြင့် သိမ်းဆည်းခြင်း သို့မဟုတ် ပရင်တာဖြင့် တိုက်ရိုက်ထုတ်ခြင်း
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. JPEG Image */}
            <button
              onClick={handleExportJPEG}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-500/40 text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
              title="JPEG ပုံရိပ်အဖြစ် ထုတ်ယူမည်"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>JPEG သိမ်းဆည်းရန်</span>
            </button>

            {/* 2. Browser Direct Print */}
            <button
              onClick={handlePrint}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print (ပရင့်)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {exportSuccessMsg && (
          <div className="no-print bg-emerald-500/20 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportSuccessMsg}</span>
          </div>
        )}

        {/* Loading Spinner during capture */}
        {isExporting && (
          <div className="no-print bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-xs text-amber-300 flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
            <span>ဖိုင် ပြင်ဆင်နေပါသည်... ကျေးဇူးပြု၍ ခေတ္တစောင့်ဆိုင်းပေးပါ။</span>
          </div>
        )}

        {/* Printable & Exportable Canvas Container */}
        <div className="p-4 sm:p-8 bg-stone-950/40 overflow-y-auto max-h-[85vh] flex justify-center">
          
          <div 
            ref={printAreaRef}
            className="w-full max-w-[680px] bg-white text-stone-900 font-sans p-6 sm:p-8 rounded-2xl shadow-xl border border-stone-200 space-y-5 print:shadow-none print:border-none print:p-0"
            style={{ minHeight: '840px', boxSizing: 'border-box' }}
          >
            
            {/* Header: Traditional Buddhist Invocation & Royal Emblem */}
            <div className="text-center border-b-2 border-amber-600/60 pb-4">
              <p className="text-[11px] font-semibold text-amber-900 tracking-widest mb-1.5 font-serif">
                နမော တဿ ဘဂဝတော အရဟတော သမ္မာသမ္ဗုဒ္ဓဿ
              </p>
              
              <div className="flex items-center justify-center gap-2.5">
                <AstrologyLogo className="w-8 h-8 shrink-0" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  မြန်မာ့ရိုးရာဗေဒင်ပညာ ဟောစာတမ်းနှင့် ဝန်ဆောင်မှုပြေစာ
                </h1>
              </div>
            </div>

            {/* Section 1: မေးသူ အချက်အလက်များ */}
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-300/80 space-y-2.5">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-1.5">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  <span>၁။ မေးသူနှင့် ရက်ချိန်း အချက်အလက်</span>
                </span>
              </div>

              <div className="flex flex-col gap-y-2 text-xs text-stone-800">
                <div className="flex items-center justify-between gap-2 border-b border-amber-200/40 pb-1.5">
                  <span className="text-stone-500 text-[11px] font-medium whitespace-nowrap">ဗေဒင်မေးသူ ID:</span>
                  <strong className="font-mono text-amber-950 font-bold bg-amber-200/60 px-2 py-0.5 rounded border border-amber-300 inline-block text-xs">
                    {record.id}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-2 border-b border-amber-200/40 pb-1.5">
                  <span className="text-stone-500 text-[11px] font-medium whitespace-nowrap">ဗေဒင်မေးသူ အမည်:</span>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <strong className="text-stone-950 text-sm">{record.customerName || 'မမေးသူ'}</strong>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900">
                      {record.consultationMode === 'remote' ? '🌐 Remote (အွန်လိုင်း)' : '🏢 In Person (လူကိုယ်တိုင်)'}
                    </span>
                  </div>
                </div>

                {record.phone && record.phone.trim() !== '' && record.phone.trim() !== '-' && record.phone.trim() !== '0' && record.phone.trim() !== '09-' ? (
                  <div className="flex items-center justify-between gap-2 border-b border-amber-200/40 pb-1.5">
                    <span className="text-stone-500 text-[11px] font-medium whitespace-nowrap">ဖုန်းနံပါတ် / Social:</span>
                    <strong className="font-mono text-stone-900">
                      {record.phone}
                      {record.socialAccountName ? ` (${record.socialPlatform || 'Social'}: ${record.socialAccountName})` : ''}
                    </strong>
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-2 border-b border-amber-200/40 pb-1.5">
                  <span className="text-stone-500 text-[11px] font-medium whitespace-nowrap">ဘိုကင်ရက်စွဲ:</span>
                  <span className="font-mono text-stone-900">{formatDateDDMMYYYY(record.bookingDate)}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pb-0.5">
                  <span className="text-stone-500 text-[11px] font-medium whitespace-nowrap">ဟောကြားသည့် ရက်စွဲနှင့် အချိန်:</span>
                  <strong className="font-mono text-amber-950">{formatDateDDMMYYYY(record.readingDateTime)}</strong>
                </div>
              </div>
            </div>

            {/* Section 2: ကျသင့်ငွေစာရင်း */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-stone-600" />
                <span>၂။ ဝန်ဆောင်ခနှင့် အဆောင်ပစ္စည်း ကျသင့်ငွေများ</span>
              </span>

              <table className="w-full text-xs border-collapse border border-stone-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 border-b border-stone-300">
                    <th className="py-2 px-3 text-left font-bold w-10">စဉ်</th>
                    <th className="py-2 px-3 text-left font-bold">အမျိုးအမည် / ဝန်ဆောင်မှု</th>
                    <th className="py-2 px-3 text-center font-bold w-20">အရေအတွက်</th>
                    <th className="py-2 px-3 text-right font-bold w-28">ကျသင့်ငွေ (ကျပ်)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {/* Service Fee */}
                  <tr>
                    <td className="py-2 px-3 text-stone-500">၁</td>
                    <td className="py-2 px-3 font-semibold text-stone-900">{serviceName}</td>
                    <td className="py-2 px-3 text-center">၁ ကြိမ်</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">{formatKyatsOnly(record.serviceFee)}</td>
                  </tr>

                  {/* Yatra Fee */}
                  {hasYatra ? (
                    <tr className="bg-amber-50/40">
                      <td className="py-2 px-3 text-stone-500">၂</td>
                      <td className="py-2 px-3 font-semibold text-amber-950">
                        {record.yatraName || 'ယတြာ အစီအရင်'}
                      </td>
                      <td className="py-2 px-3 text-center">၁ မှု</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-amber-900">
                        {formatKyatsOnly(record.yatraFee || record.navawinFee)}
                      </td>
                    </tr>
                  ) : null}

                  {/* Purchased Amulets */}
                  {record.amulets && record.amulets.length > 0 ? record.amulets.map((item, idx) => {
                    const rowNumber = (hasYatra ? 2 : 1) + idx + 1;
                    const rowNumberMy = new Intl.NumberFormat('my-MM').format(rowNumber);
                    return (
                      <tr key={idx}>
                        <td className="py-2 px-3 text-stone-500">{rowNumberMy}</td>
                        <td className="py-2 px-3 text-stone-900">
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-[10px] text-stone-500 ml-1.5">({item.category})</span>
                        </td>
                        <td className="py-2 px-3 text-center font-mono">{item.quantity} ခု</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">{formatKyatsOnly(item.price * item.quantity)}</td>
                      </tr>
                    );
                  }) : null}
                </tbody>
                <tfoot>
                  <tr className="bg-stone-100 font-bold border-t-2 border-stone-300">
                    <td colSpan={3} className="py-2 px-3 text-right text-stone-900">စုစုပေါင်း ကျသင့်ငွေ:</td>
                    <td className="py-2 px-3 text-right font-mono text-amber-900 text-sm">{formatKyatsOnly(record.totalAmount)}</td>
                  </tr>
                  {record.paidAmount && record.paidAmount > 0 ? (
                    <tr className="text-xs font-semibold text-emerald-800 bg-emerald-50/40">
                      <td colSpan={3} className="py-1.5 px-3 text-right">
                        ပေးချေပြီးငွေ ({record.paymentMethod ? record.paymentMethod.toUpperCase() : 'CASH'}):
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono">{formatKyatsOnly(record.paidAmount)}</td>
                    </tr>
                  ) : null}
                  {record.totalAmount > (record.paidAmount || 0) && (record.paidAmount || 0) > 0 ? (
                    <tr className="text-xs font-semibold text-rose-800 bg-rose-50/40">
                      <td colSpan={3} className="py-1.5 px-3 text-right">ကျန်ငွေ:</td>
                      <td className="py-1.5 px-3 text-right font-mono">{formatKyatsOnly(record.totalAmount - (record.paidAmount || 0))}</td>
                    </tr>
                  ) : null}
                </tfoot>
              </table>
            </div>

            {/* Section 3: ယတြာနှင့် အစီအရင် ညွှန်ကြားချက်များ */}
            {(record.yatraInstructions || record.yatraName) ? (
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-300/80 space-y-1.5">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>၃။ ဆောင်ရွက်ရမည့် ယတြာနှင့် အစီအရင် ညွှန်ကြားချက်များ</span>
                </span>
                {record.yatraName ? (
                  <p className="text-xs font-bold text-amber-900">
                    ယတြာအမည်: {record.yatraName}
                  </p>
                ) : null}
                {record.yatraInstructions ? (
                  <p className="text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                    {record.yatraInstructions}
                  </p>
                ) : (
                  <p className="text-xs text-stone-500 italic">
                    (ဆရာ့ထံမှ ညွှန်ကြားချက်အတိုင်း စိတ်သဒ္ဓါကြည်လင်စွာ ဆောင်ရွက်ပါရန်)
                  </p>
                )}
              </div>
            ) : null}

            {/* Section 4: ဆရာ့ဟောကိန်း အပြည့်အစုံ */}
            {record.predictions ? (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>၄။ ဆရာ့ဟောကိန်းနှင့် အကြံပြုချက်များ</span>
                </span>
                <p className="text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {record.predictions}
                </p>
              </div>
            ) : null}

            {/* Section 5: Traditional Blessing Footer */}
            <div className="pt-4 border-t-2 border-stone-200 text-xs text-stone-600 space-y-1">
              <p className="font-bold text-amber-900 text-xs">
                “ကံပွင့် လာဘ်ရွှင် စီးပွားတိုးတက် ဘေးရန်ကင်းရှင်းပြီး လိုရာဆန္ဒ ပြည့်ဝပါစေ”
              </p>
              <p className="text-[10px] text-stone-500">
                မှတ်ချက်: ယတြာပြုလုပ်ရာတွင် အချိန်အခါနှင့် စိတ်သဒ္ဓါ အဓိကဖြစ်ပါသည်။
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
