'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import FactorBadge from '@/components/FactorBadge';
import { getHappinessesByDate, getHappinessesByMonth } from '@/lib/storage';
import { getDaysInMonth, getFirstDayOfMonth, getTodayString } from '@/lib/utils';
import { FACTORS } from '@/lib/factors';
import type { Happiness, FactorId } from '@/lib/types';

export default function CalendarPage() {
  const today = getTodayString();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [monthData, setMonthData] = useState<Record<string, Happiness[]>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const yearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;

  useEffect(() => {
    const entries = getHappinessesByMonth(yearMonth);
    const grouped: Record<string, Happiness[]> = {};
    for (const entry of entries) {
      if (!grouped[entry.date]) grouped[entry.date] = [];
      grouped[entry.date].push(entry);
    }
    setMonthData(grouped);
  }, [yearMonth]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const monthName = currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
  const selectedEntries = selectedDay ? (monthData[selectedDay] ?? []) : [];

  return (
    <div className="relative flex flex-col min-h-screen bg-space-900 overflow-hidden">
      {/* Subtle bg gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #162040 0%, #0a0e1a 60%)' }} />

      <div className="relative z-10 flex flex-col flex-1 px-4 pt-10 pb-28 max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            📅 カレンダー
          </motion.h1>
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="text-white/50 hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              ‹
            </button>
            <span className="text-sm text-white/70 font-medium">{monthName}</span>
            <button
              onClick={nextMonth}
              className="text-white/50 hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              ›
            </button>
          </div>
        </div>

        {/* Day-of-week labels */}
        <div className="grid grid-cols-7 mb-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
            <div
              key={d}
              className={`text-center text-xs font-medium py-1 ${
                i === 0 ? 'text-red-400/60' : i === 6 ? 'text-blue-400/60' : 'text-white/30'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((i) => (
            <div key={`blank-${i}`} />
          ))}

          {days.map((day) => {
            const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
            const entries = monthData[dateStr] ?? [];
            const isToday = dateStr === today;
            const isSelected = selectedDay === dateStr;
            const isComplete = entries.length >= 3;
            const factorIds = [...new Set(entries.map((e) => e.factorId))] as FactorId[];

            return (
              <motion.button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                className={`
                  relative flex flex-col items-center rounded-xl py-2 transition-all duration-200 min-h-14
                  ${isToday ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-space-900' : ''}
                  ${isSelected ? 'bg-white/15' : isComplete ? 'bg-white/8' : 'bg-white/4'}
                  ${isComplete ? 'hover:bg-white/12' : 'hover:bg-white/8'}
                `}
                whileTap={{ scale: 0.92 }}
                style={isComplete ? { boxShadow: '0 0 12px 2px rgba(255,255,255,0.08)' } : {}}
              >
                <span className={`text-xs font-medium ${isToday ? 'text-indigo-300' : 'text-white/70'}`}>
                  {day}
                </span>

                {/* Factor dots */}
                {factorIds.length > 0 && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                    {factorIds.slice(0, 3).map((fid) => (
                      <div
                        key={fid}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: FACTORS[fid].color,
                          boxShadow: isComplete ? `0 0 4px ${FACTORS[fid].color}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                )}

                {isComplete && (
                  <span className="text-[8px] mt-0.5" style={{ color: '#fde68a', textShadow: '0 0 6px #fde68a' }}>
                    ✦
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {Object.values(FACTORS).map((f) => (
            <div key={f.id} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
              <span className="text-xs text-white/30">{f.name}</span>
            </div>
          ))}
        </div>

        {/* Selected day entries */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              key={selectedDay}
              className="mt-6 glass rounded-2xl p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-white/40 mb-3 font-medium">{selectedDay}</p>

              {selectedEntries.length === 0 ? (
                <p className="text-sm text-white/30 text-center py-2">
                  この日の記録はありません
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <FactorBadge factorId={entry.factorId} size="sm" />
                      <p className="text-sm text-white/70 leading-relaxed">{entry.text}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Navigation />
    </div>
  );
}
