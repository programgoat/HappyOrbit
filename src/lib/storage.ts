import type { StorageData, Happiness } from './types';

const STORAGE_KEY = 'happyorbit_data';

function getDefaultData(): StorageData {
  return { happinesses: [], detoxCount: 0 };
}

export function loadData(): StorageData {
  if (typeof window === 'undefined') return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return JSON.parse(raw) as StorageData;
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: StorageData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addHappiness(happiness: Happiness): void {
  const data = loadData();
  data.happinesses.push(happiness);
  saveData(data);
}

export function incrementDetoxCount(): void {
  const data = loadData();
  data.detoxCount += 1;
  saveData(data);
}

export function getHappinessesByDate(date: string): Happiness[] {
  const data = loadData();
  return data.happinesses.filter((h) => h.date === date);
}

export function getHappinessesByMonth(yearMonth: string): Happiness[] {
  const data = loadData();
  return data.happinesses.filter((h) => h.date.startsWith(yearMonth));
}

export function getAllHappinesses(): Happiness[] {
  return loadData().happinesses;
}

export function getDetoxCount(): number {
  return loadData().detoxCount;
}
