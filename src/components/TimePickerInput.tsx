import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerInputProps {
  label?: string;
  value: string; // e.g. "10:30 AM" or "မနက် 10:30 AM" or "14:30"
  onChange: (newValue: string) => void;
  required?: boolean;
  className?: string;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  className = '',
}) => {
  // Parse initial value if present
  const parseValue = (val: string) => {
    let hour = '09';
    let minute = '00';
    let period = 'AM';

    if (val) {
      if (val.includes('PM') || val.includes('ညနေ') || val.includes('ည')) {
        period = 'PM';
      } else if (val.includes('AM') || val.includes('မနက်')) {
        period = 'AM';
      }

      const match = val.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        let h = parseInt(match[1], 10);
        if (h > 12) {
          h = h - 12;
          period = 'PM';
        } else if (h === 0) {
          h = 12;
        }
        hour = h < 10 ? `0${h}` : `${h}`;
        minute = match[2];
      }
    }

    return { hour, minute, period };
  };

  const initial = parseValue(value);
  const [selectedHour, setSelectedHour] = useState(initial.hour);
  const [selectedMinute, setSelectedMinute] = useState(initial.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(initial.period);

  useEffect(() => {
    const formatted = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    if (formatted !== value) {
      onChange(formatted);
    }
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const hours = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    return num < 10 ? `0${num}` : `${num}`;
  });

  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  return (
    <div className={`space-y-1 w-full ${className}`}>
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-stone-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div className="flex items-center gap-2 bg-stone-900 p-2 rounded-xl border border-stone-700 hover:border-amber-500 transition shadow-inner">
        <Clock className="w-5 h-5 text-amber-400 shrink-0 ml-1" />

        {/* Hour Dropdown */}
        <div className="flex-1">
          <select
            value={selectedHour}
            onChange={(e) => setSelectedHour(e.target.value)}
            className="w-full bg-stone-850 text-amber-300 font-mono font-bold text-base py-1.5 px-2 rounded-lg border border-stone-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            style={{ fontSize: '16px' }}
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h} နာရီ
              </option>
            ))}
          </select>
        </div>

        <span className="text-amber-400 font-bold text-base">:</span>

        {/* Minute Dropdown */}
        <div className="flex-1">
          <select
            value={selectedMinute}
            onChange={(e) => setSelectedMinute(e.target.value)}
            className="w-full bg-stone-850 text-amber-300 font-mono font-bold text-base py-1.5 px-2 rounded-lg border border-stone-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            style={{ fontSize: '16px' }}
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m} မိနစ်
              </option>
            ))}
          </select>
        </div>

        {/* AM / PM Dropdown Selector */}
        <div className="flex-1">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`w-full font-bold text-base py-1.5 px-2 rounded-lg border border-stone-700 focus:outline-none cursor-pointer ${
              selectedPeriod === 'AM' 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                : 'bg-purple-500/20 text-purple-300 border-purple-500/50'
            }`}
            style={{ fontSize: '16px' }}
          >
            <option value="AM">AM (မနက်)</option>
            <option value="PM">PM (ညနေ/ည)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
