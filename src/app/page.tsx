'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StarField from '@/components/StarField';
import { getHappinessesByDate } from '@/lib/storage';
import { getTodayString } from '@/lib/utils';

import { FACTORS } from '@/lib/factors';

export default function WelcomePage() {
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const today = getTodayString();
    const entries = getHappinessesByDate(today);
    setTodayCount(entries.length);
  }, []);

  const isComplete = todayCount >= 3;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <StarField count={80} />

      {/* Nebula glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${FACTORS[3].color}, transparent 70%)` }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${FACTORS[2].color}, transparent 70%)` }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-8 pb-24">
        <motion.div
          className="relative w-24 h-24 mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-4xl shadow-lg shadow-purple-500/40">
            🪐
          </div>
          <motion.div
            className="absolute top-0 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full bg-yellow-300 shadow-[0_0_8px_#fde68a]"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '0 48px' }}
          />
        </motion.div>

        <motion.h1
          className="text-5xl font-bold text-white mb-3 glow-text"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
        >
          おかえり。
        </motion.h1>

        <motion.p
          className="text-lg text-white/60 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          今日もお疲れ様。
        </motion.p>

        <motion.p
          className="text-sm text-white/40 max-w-xs leading-relaxed mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          まずは、心の中の重い荷物をここに置いていかない？
        </motion.p>

        {isComplete && (
          <motion.div
            className="mb-6 px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: '#4DDD9F22', color: '#4DDD9F', border: '1px solid #4DDD9F44' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
          >
            ✨ 今日の3つの光はもう宇宙へ送りました！
          </motion.div>
        )}

        <motion.a
          href="/detox"
          className="relative px-12 py-4 rounded-full text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/40 hover:shadow-purple-400/60 transition-shadow"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.85 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          START →
        </motion.a>

        {todayCount > 0 && !isComplete && (
          <motion.p
            className="mt-4 text-xs text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            今日は {todayCount}/3 つ記録済み
          </motion.p>
        )}
      </div>
    </div>
  );
}
