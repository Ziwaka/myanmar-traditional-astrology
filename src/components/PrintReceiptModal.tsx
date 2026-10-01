import React, { useRef, useState } from 'react';
import { 
  X, 
  Printer, 
  Sparkles, 
  Download, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  Loader2,
  Share2,
  Calendar,
  User,
  Flame,
  CreditCard,
  Crown
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ConsultationRecord } from '../types';
import { formatMMK, NAWAWIN_OPTIONS, BURMESE_DAYS, MAHABOTE_HOUSES, formatDateDDMMYYYY } from '../utils/astrology';

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

  const showNotification = (msg: string) => {
    setExportSuccessMsg(msg);
    setTimeout(() => setExportSuccessMsg(''), 3000);
  };

  // 1. Direct Browser Print
  const handlePrint = () => {
    window.print();
  };

  // 2. Export High-Resolution PDF
  const handleExportPDF = async () => {
    if (!printAreaRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(printAreaRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 mm
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`Horoscope_Receipt_${record.id}_${record.customerName}.pdf`);
      showNotification('PDF ဖိုင် အောင်မြင်စွာ ဒေါင်းလုဒ်ဆွဲပြီးပါပြီ!');
    } catch (err) {
      console.error('Error exporting PDF', err);
      alert('PDF ထုတ်ယူရာတွင် အမှားဖြစ်ပေါ်ပါသည်');
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Export PNG Image (Ideal for Viber / Messenger)
  const handleExportPNG = async () => {
    if (!printAreaRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(printAreaRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `Horoscope_Card_${record.id}_${record.customerName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showNotification('PNG ပုံရိပ် အောင်မြင်စွာ ထုတ်ယူပြီးပါပြီ (Viber/Messenger တွင် ပို့နိုင်ပါသည်)!');
    } catch (err) {
      console.error('Error exporting PNG', err);
      alert('PNG ထုတ်ယူရာတွင် အမှားဖြစ်ပေါ်ပါသည်');
    } finally {
      setIsExporting(false);
    }
  };

  // 4. Export JPEG Image
  const handleExportJPEG = async () => {
    if (!printAreaRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(printAreaRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `Horoscope_Card_${record.id}_${record.customerName}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
      showNotification('JPEG ပုံရိပ် အောင်မြင်စွာ ထုတ်ယူပြီးပါပြီ!');
    } catch (err) {
      console.error('Error exporting JPEG', err);
      alert('JPEG ထုတ်ယူရာတွင် အမှားဖြစ်ပေါ်ပါသည်');
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
              PDF, PNG, JPEG ပုံစံများဖြင့် သိမ်းဆည်းခြင်း သို့မဟုတ် ပရင်တာဖြင့် တိုက်ရိုက်ထုတ်ခြင်း
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. PDF Download */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40 text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
              title="PDF ဖိုင် ဒေါင်းလုဒ်ဆွဲမည်"
            >
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span>PDF</span>
            </button>

            {/* 2. PNG Image (for Viber/Telegram/Messenger) */}
            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/40 text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
              title="PNG ပုံရိပ်အဖြစ် ထုတ်ယူမည် (Viber တွင် ပို့ရန် အထူးသင့်လျော်ပါသည်)"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>PNG ပုံရိပ်</span>
            </button>

            {/* 3. JPEG Image */}
            <button
              onClick={handleExportJPEG}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-500/40 text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
              title="JPEG ပုံရိပ်အဖြစ် ထုတ်ယူမည်"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>JPEG</span>
            </button>

            {/* 4. Browser Direct Print */}
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
              
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-5 h-5 text-amber-600" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  မြန်မာ့ရိုးရာဗေဒင်ပညာ ဟောစာတမ်းနှင့် ဝန်ဆောင်မှုပြေစာ
                </h1>
              </div>

              <p className="text-xs text-stone-600 mt-1 font-medium">
                မွေးဇာတာစစ်ဆေးချက် • နဝင်းယတြာ အစီအရင် • မင်္ဂလာအဆောင်ပစ္စည်း POS
              </p>
            </div>

            {/* Section 1: မေးသူဇာတာ အချက်အလက်များ (Client Horoscope Dossier) */}
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-300/80 space-y-2.5">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-1.5">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  <span>၁။ မေးသူဇာတာနှင့် အချက်အလက် (Client Horoscope Profile)</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded border border-amber-300">
                  ID: {record.id}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs text-stone-800">
                <div>
                  <span className="text-stone-500 block text-[11px]">ဗေဒင်မေးသူ အမည်:</span>
                  <strong className="text-stone-950 text-sm">{record.customerName || 'မမေးသူ'}</strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">ဖုန်းနံပါတ် / Social:</span>
                  <strong className="font-mono text-stone-900">
                    {record.phone || '-'}
                    {record.socialAccountName ? ` (${record.socialPlatform || 'Social'}: ${record.socialAccountName})` : ''}
                  </strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">ကျား/မ:</span>
                  <span>{record.gender === 'male' ? 'အမျိုးသား' : record.gender === 'female' ? 'အမျိုးသမီး' : 'အခြား'}</span>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">မွေးနံ:</span>
                  <strong className="text-amber-900">{record.birthDayOfWeek} ဖွား {dayInfo ? `(${dayInfo.shorthand})` : ''}</strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">မွေးသက္ကရာဇ် & အသက်:</span>
                  <span>{formatDateDDMMYYYY(record.birthDate) || '-'} {record.age ? `(အသက် ${record.age} နှစ်)` : ''}</span>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">မဟာဘုတ်ခွင်:</span>
                  <strong className="text-amber-900">{record.mahabote ? `${record.mahabote} ဖွား` : '-'}</strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">မွေးဖွားချိန်:</span>
                  <span>{record.birthTime || '-'}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-stone-500 block text-[11px]">ဟောကြားသည့် ရက်စွဲနှင့် အချိန်:</span>
                  <strong className="font-mono">{formatDateDDMMYYYY(record.readingDateTime)}</strong>
                </div>
              </div>
            </div>

            {/* Section 2: ကျသင့်ငွေစာရင်း (Itemized Financial Statement) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-stone-600" />
                <span>၂။ ဝန်ဆောင်ခနှင့် အဆောင်ပစ္စည်း ကျသင့်ငွေများ (Financial Breakdown)</span>
              </span>

              <table className="w-full text-xs border-collapse border border-stone-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 border-b border-stone-300">
                    <th className="py-2 px-3 text-left font-bold w-10">စဉ်</th>
                    <th className="py-2 px-3 text-left font-bold">အမျိုးအမည် / ဝန်ဆောင်မှု</th>
                    <th className="py-2 px-3 text-center font-bold w-20">အရေအတွက်</th>
                    <th className="py-2 px-3 text-right font-bold w-28">ကျသင့်ငွေ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {/* Service Fee */}
                  <tr>
                    <td className="py-2 px-3 text-stone-500">၁</td>
                    <td className="py-2 px-3 font-semibold text-stone-900">{serviceName}</td>
                    <td className="py-2 px-3 text-center">၁ ကြိမ်</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">{formatMMK(record.serviceFee)}</td>
                  </tr>

                  {/* Yatra Fee */}
                  {((record.yatraFee && record.yatraFee > 0) || (record.navawinFee && record.navawinFee > 0)) && (
                    <tr className="bg-amber-50/40">
                      <td className="py-2 px-3 text-stone-500">၂</td>
                      <td className="py-2 px-3 font-semibold text-amber-950">
                        {record.yatraName || 'ယတြာ အစီအရင်'}
                      </td>
                      <td className="py-2 px-3 text-center">၁ မှု</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-amber-900">
                        {formatMMK(record.yatraFee || record.navawinFee)}
                      </td>
                    </tr>
                  )}

                  {/* Purchased Amulets */}
                  {record.amulets && record.amulets.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 text-stone-500">{3 + idx}</td>
                      <td className="py-2 px-3 text-stone-900">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-[10px] text-stone-500 ml-1.5">({item.category})</span>
                      </td>
                      <td className="py-2 px-3 text-center font-mono">{item.quantity} ခု</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">{formatMMK(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-stone-100 font-bold border-t-2 border-stone-300">
                    <td colSpan={3} className="py-2 px-3 text-right text-stone-900">စုစုပေါင်း ကျသင့်ငွေ (Total):</td>
                    <td className="py-2 px-3 text-right font-mono text-amber-900 text-sm">{formatMMK(record.totalAmount)}</td>
                  </tr>
                  <tr className="text-xs font-semibold text-emerald-800 bg-emerald-50/40">
                    <td colSpan={3} className="py-1.5 px-3 text-right">
                      ပေးချေပြီးငွေ ({record.paymentMethod.toUpperCase()}):
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono">{formatMMK(record.paidAmount)}</td>
                  </tr>
                  {record.totalAmount > record.paidAmount && (
                    <tr className="text-xs font-semibold text-rose-800 bg-rose-50/40">
                      <td colSpan={3} className="py-1.5 px-3 text-right">ကျန်ငွေ (Remaining):</td>
                      <td className="py-1.5 px-3 text-right font-mono">{formatMMK(record.totalAmount - record.paidAmount)}</td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>

            {/* Section 3: ယတြာနှင့် အစီအရင် ညွှန်ကြားချက်များ (Yatra Ritual Instructions) */}
            {(record.yatraInstructions || record.yatraName) && (
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-300/80 space-y-1.5">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>၃။ ဆောင်ရွက်ရမည့် ယတြာနှင့် အစီအရင် ညွှန်ကြားချက်များ (Yatra Instructions)</span>
                </span>
                {record.yatraName && (
                  <p className="text-xs font-bold text-amber-900">
                    ယတြာအမည်: {record.yatraName}
                  </p>
                )}
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
            )}

            {/* Section 4: ဆရာ့ဟောကိန်း အပြည့်အစုံ (Astrological Predictions) */}
            {record.predictions && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>၄။ ဆရာ့ဟောကိန်းနှင့် အကြံပြုချက်များ (Astrological Predictions)</span>
                </span>
                <p className="text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {record.predictions}
                </p>
              </div>
            )}

            {/* Section 5: Traditional Blessing & Signature Footer */}
            <div className="pt-4 border-t-2 border-stone-200 flex items-end justify-between text-xs text-stone-600">
              <div className="space-y-1">
                <p className="font-bold text-amber-900 text-xs">
                  “ကံပွင့် လာဘ်ရွှင် စီးပွားတိုးတက် ဘေးရန်ကင်းရှင်းပြီး လိုရာဆန္ဒ ပြည့်ဝပါစေ”
                </p>
                <p className="text-[10px] text-stone-500">
                  မှတ်ချက်: ယတြာပြုလုပ်ရာတွင် အချိန်အခါနှင့် စိတ်သဒ္ဓါ အဓိကဖြစ်ပါသည်။
                </p>
              </div>

              <div className="text-center shrink-0">
                <div className="h-10 border-b border-stone-400 w-36 mx-auto mb-1"></div>
                <p className="font-semibold text-stone-800 text-xs">ဗေဒင်ပညာရှင် လက်မှတ်</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
