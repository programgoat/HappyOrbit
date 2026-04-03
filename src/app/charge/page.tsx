'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import Navigation from '@/components/Navigation';
import FactorBadge from '@/components/FactorBadge';
import { classifyText } from '@/lib/classify';
import { addHappiness } from '@/lib/storage';
import { getTodayString, generateId } from '@/lib/utils';
import { FACTORS } from '@/lib/factors';
import type { FactorId, Happiness } from '@/lib/types';

const STEP_PROMPTS = [
  {
    label: 'ステップ 1',
    question: '今日、あなたを喜ばせてくれたことは？',
    placeholders: ['今日、褒められたことは？', '新しく試したことは？', '達成感を感じた瞬間は？'],
  },
  {
    label: 'ステップ 2',
    question: '今日、誰かへの感謝を感じた瞬間は？',
    placeholders: ['誰かに感謝したことは？', '誰かと笑った瞬間は？', '助けてもらったことは？'],
  },
  {
    label: 'ステップ 3',
    question: "今日、あなたが'自分らしかった'瞬間は？",
    placeholders: ['自分らしく過ごせた時間は？', '美味しいと感じたものは？', '心が落ち着いた瞬間は？'],
  },
];

export default function ChargePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<Array<{ text: string; factorId: FactorId }>>([]);
  const [isSparkle, setIsSparkle] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Pre-generate sparkle particle positions (stable, avoids impure Math.random in render)
  const sparkleParticles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: 20 + ((i * 37 + 13) % 60),
        top: 20 + ((i * 53 + 7) % 60),
        width: 4 + (i % 5) + 1,
        height: 4 + (i % 4) + 1,
        dy: -(30 + (i * 17) % 50),
        dx: ((i % 2 === 0 ? 1 : -1) * ((i * 13) % 40)),
      })),
    []
  );

  const currentPrompt = STEP_PROMPTS[step];
  const placeholder = currentPrompt.placeholders[step % currentPrompt.placeholders.length];

  // Derive classification from text (no side effects needed)
  const classificationResult = useMemo(() => {
    if (text.trim().length > 3) {
      return classifyText(text);
    }
    return null;
  }, [text]);

  const suggestedFactor = classificationResult?.factorId ?? null;
  const confidence = classificationResult?.confidence ?? 0;

  const bgColor = suggestedFactor ? FACTORS[suggestedFactor].color : '#4DA6FF';

  const handleConfirm = useCallback(() => {
    if (!text.trim()) return;

    const factorId = suggestedFactor ?? (((step + 1) % 4) + 1) as FactorId;
    const newEntry = { text: text.trim(), factorId };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);

    setIsSparkle(true);
    setTimeout(() => setIsSparkle(false), 600);

    const today = getTodayString();
    const happiness: Happiness = {
      id: generateId(),
      userId: 'local',
      date: today,
      text: text.trim(),
      factorId,
      order: (step + 1) as 1 | 2 | 3,
      createdAt: new Date().toISOString(),
    };
    addHappiness(happiness);

    if (step < 2) {
      setTimeout(() => {
        setText('');
        setStep(step + 1);
      }, 400);
    } else {
      setTimeout(() => setIsDone(true), 400);
    }
  }, [text, suggestedFactor, entries, step]);

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden transition-all duration-1000"
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${bgColor}15 0%, #0a0e1a 60%, #060a14 100%)`,
      }}
    >
      <StarField count={40} />

      {/* Sparkle effect */}
      <AnimatePresence>
        {isSparkle && (
          <motion.div
            key="sparkle"
            className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sparkleParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.width,
                  height: p.height,
                  backgroundColor: bgColor,
                  boxShadow: `0 0 6px ${bgColor}`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                  y: p.dy,
                  x: p.dx,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-10 pb-28 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {!isDone ? (
            <motion.div
              key={`step-${step}`}
              className="flex flex-col flex-1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-8">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: i <= step ? bgColor : 'rgba(255,255,255,0.15)',
                      boxShadow: i === step ? `0 0 8px ${bgColor}` : 'none',
                    }}
                  />
                ))}
              </div>

              <p className="text-xs text-white/40 mb-2 font-medium tracking-wider uppercase">
                {currentPrompt.label}
              </p>
              <h2 className="text-xl font-bold text-white mb-6 leading-snug">
                {currentPrompt.question}
              </h2>

              <textarea
                className="w-full rounded-2xl p-4 text-white/90 placeholder-white/20 resize-none outline-none text-base leading-relaxed min-h-40 mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${suggestedFactor ? bgColor + '44' : 'rgba(255,255,255,0.1)'}`,
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color 0.3s',
                }}
                placeholder={placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {/* Factor suggestion */}
              <div className="min-h-8 mb-6">
                <AnimatePresence>
                  {suggestedFactor && (
                    <motion.div
                      key={suggestedFactor}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xs text-white/40">自動分類：</span>
                      <FactorBadge factorId={suggestedFactor} size="sm" />
                      {confidence > 0 && (
                        <span className="text-xs text-white/30">
                          ({Math.round(confidence * 100)}%)
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={handleConfirm}
                disabled={!text.trim()}
                className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all disabled:opacity-30"
                style={{
                  background: text.trim()
                    ? `linear-gradient(135deg, ${bgColor}cc, ${bgColor}88)`
                    : `${bgColor}33`,
                  boxShadow: text.trim() ? `0 4px 24px ${bgColor}44` : 'none',
                }}
                whileHover={text.trim() ? { scale: 1.02 } : {}}
                whileTap={text.trim() ? { scale: 0.98 } : {}}
              >
                {step < 2 ? '✨ 確認して次へ' : '🚀 宇宙へ送る'}
              </motion.button>

              {/* Previous entries */}
              {entries.length > 0 && (
                <div className="mt-6 space-y-2">
                  {entries.map((e, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-2 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FactorBadge factorId={e.factorId} size="sm" />
                      <p className="text-xs text-white/50 leading-relaxed">{e.text}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="done"
              className="flex flex-col flex-1 items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                🌟
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">
                今日も3つの光を
                <br />
                宇宙に放ちました！
              </h2>
              <p className="text-white/50 mb-4 leading-relaxed">
                あなたの幸せが銀河に刻まれました。
              </p>

              <div className="flex gap-2 mb-10 flex-wrap justify-center">
                {entries.map((e, i) => (
                  <FactorBadge key={i} factorId={e.factorId} size="sm" />
                ))}
              </div>

              <motion.button
                onClick={() => router.push('/galaxy')}
                className="px-10 py-4 rounded-full font-bold text-white text-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                ギャラクシーを見る →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Navigation />
    </div>
  );
}
