import type { Factor, FactorId } from './types';

export const FACTORS: Record<FactorId, Factor> = {
  1: {
    id: 1 as const,
    name: 'やってみよう',
    color: '#FF6B35',
    description: '成長・挑戦',
    keywords: ['挑戦', '試した', '学ん', '成長', '新しい', '始め', '達成', '成功', '頑張', 'できた', '練習', '勉強', 'スキル', '趣味', '目標', '仕事', 'クリア', '上達'],
  },
  2: {
    id: 2 as const,
    name: 'ありがとう',
    color: '#FF6B8A',
    description: 'つながり・感謝',
    keywords: ['ありがとう', '感謝', '助け', '一緒', '友達', '家族', '会っ', '話し', '優し', '褒め', '笑っ', '楽し', '恋人', 'パートナー', 'チーム', '出会'],
  },
  3: {
    id: 3 as const,
    name: 'なんとかなる',
    color: '#4DA6FF',
    description: '楽観・解放',
    keywords: ['大丈夫', 'なんとか', 'うまくい', '解決', '乗り越', 'リラックス', '休ん', '休憩', '定時', '余裕', '乗り切', '気楽', '安心', 'のんびり'],
  },
  4: {
    id: 4 as const,
    name: 'ありのままに',
    color: '#4DDD9F',
    description: '独立・自己受容',
    keywords: ['自分', '自然', '散歩', '空', '海', '花', '美味し', '好きな', 'ゆっくり', '一人', '静か', '眺め', '気づい', 'リフレッシュ', '読ん', '音楽'],
  },
} as const;

export const FACTOR_LIST: Factor[] = Object.values(FACTORS);
