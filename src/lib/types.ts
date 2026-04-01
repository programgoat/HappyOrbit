export type FactorId = 1 | 2 | 3 | 4;

export interface Happiness {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  text: string;
  factorId: FactorId;
  order: 1 | 2 | 3;
  createdAt: string;
}

export interface DetoxEntry {
  id: string;
  text: string;
  createdAt: string;
}

export interface Factor {
  id: FactorId;
  name: string;
  color: string;
  description: string;
  keywords: string[];
}

export interface StorageData {
  happinesses: Happiness[];
  detoxCount: number;
}
