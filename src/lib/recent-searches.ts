import { useSyncExternalStore } from "react";

export type SearchProduct = "hotel" | "tour" | "ticket";

export type RecentSearch = {
  id: string;
  product: SearchProduct;
  dest: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms: number;
  at: number;
};

const KEY = "dfxtrip:recent-searches";
const EMPTY: RecentSearch[] = [];
const MAX = 3;
let cache: RecentSearch[] | null = null;
const listeners = new Set<() => void>();

function isIso(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isProduct(value: unknown): value is SearchProduct {
  return value === "hotel" || value === "tour" || value === "ticket";
}

function normalize(row: unknown): RecentSearch | null {
  if (!row || typeof row !== "object") return null;
  const item = row as Record<string, unknown>;
  if (!isProduct(item.product)) return null;
  if (typeof item.dest !== "string") return null;
  if (!isIso(item.checkIn) || !isIso(item.checkOut)) return null;
  const adults = Number(item.adults);
  const rooms = Number(item.rooms);
  const at = Number(item.at);
  if (!Number.isFinite(adults) || !Number.isFinite(rooms) || !Number.isFinite(at)) return null;
  return {
    id: typeof item.id === "string" ? item.id : `${item.product}:${item.dest}:${item.checkIn}:${at}`,
    product: item.product,
    dest: item.dest.trim(),
    checkIn: item.checkIn,
    checkOut: item.checkOut,
    adults: Math.min(8, Math.max(1, Math.round(adults))),
    rooms: Math.min(6, Math.max(1, Math.round(rooms))),
    at,
  };
}

function readLocal(): RecentSearch[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.map(normalize).filter((row): row is RecentSearch => Boolean(row)).slice(0, MAX);
  } catch {
    return [];
  }
}

function read() {
  if (cache) return cache;
  cache = typeof localStorage === "undefined" ? [] : readLocal();
  return cache;
}

function emit(next: RecentSearch[]) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export function rememberSearch(input: Omit<RecentSearch, "id" | "at"> & { at?: number }) {
  const at = input.at ?? Date.now();
  const entry: RecentSearch = {
    ...input,
    dest: input.dest.trim(),
    id: `${input.product}:${input.dest.trim()}:${input.checkIn}:${input.checkOut}:${input.adults}:${input.rooms}`,
    at,
  };
  const current = read().filter((row) => row.id !== entry.id);
  emit([entry, ...current].slice(0, MAX));
}

export function useRecentSearches() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => EMPTY,
  );
}

export function productLabel(product: SearchProduct) {
  if (product === "tour") return "Tour";
  if (product === "ticket") return "Vé";
  return "Khách sạn";
}
