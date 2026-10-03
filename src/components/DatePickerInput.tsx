import React, { useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { formatDateDDMMYYYY } from '../utils/astrology';

interface DatePickerInputProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (newValue: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder = 'ရက် / လ / ခုနှစ် (ပြက္ခဒိန် ရွေးရန်)',
  className = '',
}) => {
  const nativeInputRef = useRef<HTMLInputElement>(null);

  const formattedDisplay = value ? formatDateDDMMYYYY(value) : '';

  const handleOpenPicker = () => {
    if (nativeInputRef.current) {
      if (nativeInputRef.current.showPicker) {
        try {
          nativeInputRef.current.showPicker();
        } catch {
          nativeInputRef.current.focus();
        }
      } else {
        nativeInputRef.current.focus();
      }
    }
  };

  return (
    <div className={`space-y-1 w-full ${className}`}>
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-stone-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div className="relative w-full">
        {/* Visible Display Box showing DD / MM / YYYY */}
        <div
          onClick={handleOpenPicker}
          className="w-full px-3.5 py-3 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-500 text-stone-100 flex items-center justify-between cursor-pointer transition shadow-inner"
        >
          <span className={`text-base font-mono ${formattedDisplay ? 'text-amber-300 font-bold' : 'text-stone-500 text-sm'}`}>
            {formattedDisplay || placeholder}
          </span>
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 shrink-0">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-xs font-semibold">ပြက္ခဒိန်</span>
          </div>
        </div>

        {/* Hidden Native Date Input (triggers native calendar GUI) */}
        <input
          ref={nativeInputRef}
          type="date"
          required={required}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 text-base"
          style={{ fontSize: '16px' }}
        />
      </div>
    </div>
  );
};
