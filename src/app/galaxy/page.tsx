'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { getHappinessesByMonth, getHappinessesByDate } from '@/lib/storage';
import { getYearMonthString, getTodayString } from '@/lib/utils';
import { FACTORS } from '@/lib/factors';
import type { Happiness, FactorId } from '@/lib/types';

interface StarEntry extends Happiness {
  canvasX: number;
  canvasY: number;
  angle: number;
  radius: number;
}

const NEBULA_CENTERS: Record<FactorId, { x: number; y: number }> = {
  1: { x: 0.72, y: 0.28 }, // top-right orange
  2: { x: 0.28, y: 0.28 }, // top-left pink
  3: { x: 0.72, y: 0.72 }, // bottom-right blue
  4: { x: 0.28, y: 0.72 }, // bottom-left green
};

export default function GalaxyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [stars, setStars] = useState<StarEntry[]>([]);
  const [selectedStar, setSelectedStar] = useState<StarEntry | null>(null);
  const [monthStats, setMonthStats] = useState({ total: 0, today: 0 });
  const timeRef = useRef(0);

  const loadEntries = useCallback(() => {
    const yearMonth = getYearMonthString();
    const monthEntries = getHappinessesByMonth(yearMonth);
    const todayEntries = getHappinessesByDate(getTodayString());

    setMonthStats({ total: monthEntries.length, today: todayEntries.length });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    const starEntries: StarEntry[] = monthEntries.map((entry, i) => {
      const center = NEBULA_CENTERS[entry.factorId];
      const angle = ((i * 137.5) * Math.PI) / 180; // golden angle
      const radius = 20 + (i % 8) * 18;
      return {
        ...entry,
        canvasX: center.x * w + Math.cos(angle) * radius,
        canvasY: center.y * h + Math.sin(angle) * radius,
        angle,
        radius,
      };
    });

    setStars(starEntries);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      loadEntries();
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [loadEntries]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgStars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.01 + 0.005,
    }));

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Background stars
      bgStars.forEach((s) => {
        const opacity = 0.3 + 0.4 * Math.sin(s.twinkle + t * s.speed * 60);
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      // Nebulae
      (Object.entries(NEBULA_CENTERS) as [string, { x: number; y: number }][]).forEach(([id, center]) => {
        const factorId = Number(id) as FactorId;
        const factor = FACTORS[factorId];
        const cx = center.x * w;
        const cy = center.y * h;
        const radius = Math.min(w, h) * 0.22;

        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grd.addColorStop(0, `${factor.color}30`);
        grd.addColorStop(0.5, `${factor.color}12`);
        grd.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Factor label
        ctx.font = `bold 13px sans-serif`;
        ctx.fillStyle = `${factor.color}bb`;
        ctx.textAlign = 'center';
        ctx.fillText(factor.name, cx, cy + radius * 0.85);
      });

      // Happiness stars
      stars.forEach((star, i) => {
        const factor = FACTORS[star.factorId];
        const drift = Math.sin(t * 0.5 + i * 0.7) * 3;
        const driftX = Math.cos(t * 0.3 + i * 1.1) * 2;
        const x = star.canvasX + driftX;
        const y = star.canvasY + drift;
        const pulse = 0.7 + 0.3 * Math.sin(t * 2 + i);
        const r = 4 * pulse;

        // Outer glow
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
        grd.addColorStop(0, `${factor.color}cc`);
        grd.addColorStop(0.4, `${factor.color}44`);
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = factor.color;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [stars]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const cx = clickX * scaleX;
      const cy = clickY * scaleY;

      const hit = stars.find((s) => {
        const dx = s.canvasX - cx;
        const dy = s.canvasY - cy;
        return Math.sqrt(dx * dx + dy * dy) < 18;
      });

      setSelectedStar(hit ?? null);
    },
    [stars]
  );

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-space-900">
      {/* Header */}
      <div className="relative z-10 px-6 pt-10 pb-4">
        <motion.h1
          className="text-2xl font-bold text-white mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🌌 今月の銀河
        </motion.h1>
        <motion.div
          className="flex gap-4 text-sm text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span>今月 {monthStats.total} 個の星</span>
          <span>今日 {monthStats.today}/3</span>
        </motion.div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 mx-4 mb-24 rounded-3xl overflow-hidden border border-white/8"
        style={{ minHeight: '60vh' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
          style={{ background: 'radial-gradient(ellipse at 50% 50%, #0d1530 0%, #0a0e1a 100%)' }}
        />

        {stars.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/30">
              <p className="text-4xl mb-3">✨</p>
              <p className="text-sm">まだ星がありません</p>
              <p className="text-xs mt-1">チャージして最初の星を輝かせよう</p>
            </div>
          </div>
        )}
      </div>

      {/* Star popup */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            className="absolute bottom-28 left-4 right-4 z-30 glass rounded-2xl p-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-white/40 mb-1">{selectedStar.date}</p>
                <p className="text-white/90 text-sm leading-relaxed">{selectedStar.text}</p>
              </div>
              <button
                onClick={() => setSelectedStar(null)}
                className="text-white/30 hover:text-white/60 text-xl leading-none shrink-0 mt-0.5"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation />
    </div>
  );
}
