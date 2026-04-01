'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import Navigation from '@/components/Navigation';
import { incrementDetoxCount } from '@/lib/storage';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number; // final x velocity target (px)
  vy: number; // intermediate y (px)
}

const PARTICLE_COLORS = ['#FF6B35', '#FF6B8A', '#4DA6FF', '#4DDD9F', '#a78bfa', '#fbbf24'];

export default function DetoxPage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'input' | 'exploding' | 'done'>('input');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [flash, setFlash] = useState(false);

  const darknessFactor = Math.min(text.length / 200, 1);

  const handleDestroy = useCallback(() => {
    if (!text.trim()) return;

    const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      size: Math.random() * 8 + 3,
      vx: 300 + Math.random() * 200, // pixels toward black hole on right
      vy: (Math.random() - 0.5) * 100,
    }));

    setParticles(newParticles);
    setPhase('exploding');
    incrementDetoxCount();

    setTimeout(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
    }, 800);

    setTimeout(() => {
      setPhase('done');
    }, 1600);
  }, [text]);

  const handleContinue = () => {
    router.push('/charge');
  };

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden transition-colors duration-700"
      style={{
        background: `radial-gradient(ellipse at 30% 20%, 
          rgba(13, 21, ${48 - Math.round(darknessFactor * 35)}, 1) 0%, 
          rgba(${Math.round(10 - darknessFactor * 5)}, ${Math.round(14 - darknessFactor * 8)}, ${Math.round(26 - darknessFactor * 18)}, 1) 60%, 
          #040608 100%)`,
      }}
    >
      <StarField count={50} />

      {/* Flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="absolute inset-0 z-50 bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Black hole vortex (visible during explosion) */}
      <AnimatePresence>
        {phase === 'exploding' && (
          <motion.div
            className="absolute right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full"
              style={{
                background: 'radial-gradient(circle, #000 30%, #1a0a2e 60%, transparent 100%)',
                boxShadow: '0 0 40px 20px rgba(100, 0, 200, 0.4), inset 0 0 20px rgba(0,0,0,0.9)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particles */}
      <AnimatePresence>
        {phase === 'exploding' && particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-sm z-30 pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 4px ${p.color}`,
            }}
            initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            animate={{
              x: [0, (Math.random() - 0.5) * 200, p.vx],
              y: [0, p.vy, 0],
              scale: [1, 1.5, 0.1],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.4, 1],
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex flex-col flex-1 px-6 pt-16 pb-28 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {phase === 'input' && (
            <motion.div
              key="input"
              className="flex flex-col flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h1
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                🗑️ デトックス
              </motion.h1>
              <motion.p
                className="text-sm text-white/50 mb-6 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                今日の重い荷物を、ここに置いていって。
              </motion.p>

              <textarea
                className="flex-1 w-full rounded-2xl p-4 text-white/90 placeholder-white/20 resize-none outline-none text-base leading-relaxed min-h-48"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                }}
                placeholder="嫌だったこと、モヤモヤしていること、怒り、悲しみ…なんでもここに書いて。"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <div className="mt-4 flex flex-col gap-3">
                <motion.button
                  onClick={handleDestroy}
                  disabled={!text.trim()}
                  className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all disabled:opacity-30"
                  style={{
                    background: text.trim()
                      ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                      : 'rgba(124, 58, 237, 0.3)',
                    boxShadow: text.trim() ? '0 4px 24px rgba(124, 58, 237, 0.4)' : 'none',
                  }}
                  whileHover={text.trim() ? { scale: 1.02 } : {}}
                  whileTap={text.trim() ? { scale: 0.98 } : {}}
                >
                  💥 DESTROY
                </motion.button>

                <button
                  onClick={() => router.push('/charge')}
                  className="text-sm text-white/30 hover:text-white/50 transition-colors py-2"
                >
                  デトックスをスキップ →
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'exploding' && (
            <motion.div
              key="exploding"
              className="flex flex-col flex-1 items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.p
                className="text-3xl font-bold text-white text-center"
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                💥 消えていく...
              </motion.p>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div
              key="done"
              className="flex flex-col flex-1 items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                ✨
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-4">スッキリ！</h2>
              <p className="text-white/50 mb-10 max-w-xs leading-relaxed">
                重い荷物は宇宙の彼方に消えました。<br />
                軽くなった心で、今日の良いことを探しに行こう。
              </p>
              <motion.button
                onClick={handleContinue}
                className="px-10 py-4 rounded-full font-bold text-white text-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                チャージへ →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Navigation />
    </div>
  );
}
