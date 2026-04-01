# HappyOrbit 🪐

**幸せを宇宙に記録する、幸福筋力トレーニング・アプリ**

A happiness journaling app based on positive psychology (幸福学), where your daily good things become stars in your personal galaxy.

## ✨ Features

### 🗑️ Detox (リセット)
Write down your stress and negative feelings. Press **DESTROY** and watch them explode into particles that get sucked into a black hole — releasing you from negativity.

### ⚡ Charge (チャージ)
Record 3 good things that happened today through a guided 3-step wizard. Each entry is **automatically classified** into one of the 4 happiness factors using keyword analysis.

### 🌌 Galaxy (ギャラクシー)
View your happiness entries as glowing stars in your personal universe. 4 nebulae represent the 4 happiness factors, with your stars drifting gently toward their corresponding nebula.

### 📅 Calendar (カレンダー)
Monthly calendar view showing your daily completion status with color-coded factor dots.

## 🎯 4 Happiness Factors (前野隆司モデル)

| Factor | Color | Description |
|--------|-------|-------------|
| 🚀 やってみよう | Sunset Orange | Growth · Challenge · Curiosity |
| 💖 ありがとう | Soft Rose | Connection · Gratitude · Love |
| 🌈 なんとかなる | Sky Blue | Optimism · Release · Peace |
| 🌿 ありのままに | Mint Green | Independence · Self-acceptance |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Storage**: localStorage (PWA-ready, no backend needed)
- **PWA**: Manifest + meta tags for home screen install

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start your happiness journey.

## 📱 PWA

The app supports installation as a PWA. Add to your phone's home screen for the full experience.

## 🏗️ Project Structure

```
src/
  app/
    page.tsx          # Welcome screen
    detox/page.tsx    # Detox / stress release
    charge/page.tsx   # 3 Good Things input
    galaxy/page.tsx   # Galaxy map visualization
    calendar/page.tsx # Monthly calendar
  components/
    Navigation.tsx    # Bottom navigation
    StarField.tsx     # Animated star background
    FactorBadge.tsx   # Factor color badge
  lib/
    types.ts          # TypeScript types
    factors.ts        # Factor definitions & colors
    classify.ts       # Keyword-based classification
    storage.ts        # localStorage CRUD
    utils.ts          # Utility functions
```

## 📊 Data Structure

```typescript
interface Happiness {
  id: string;
  userId: string;
  date: string;       // YYYY-MM-DD
  text: string;
  factorId: 1 | 2 | 3 | 4;
  order: 1 | 2 | 3;
  createdAt: string;
}
```

---

*HappyOrbit — Because every small happiness deserves its own star in the universe.*
