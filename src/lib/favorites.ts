import { useSyncExternalStore } from "react";

const KEY = "dfxtrip:favorites";
const EMPTY: string[] = [];
let cache: string[] | null = null;
const listeners = new Set<() => void>();

function readLocal(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function read() {
  if (cache) return cache;
  cache = typeof localStorage === "undefined" ? [] : readLocal();
  return cache;
}

function emit(next: string[]) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export function toggleFavorite(id: string) {
  const current = read();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  emit(next);
}

export function useFavorites() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => EMPTY,
  );
}
