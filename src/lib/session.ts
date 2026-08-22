import { useEffect, useState } from "react";

export type Member = {
  id: string;
  username: string;
  mobile: string;
  district: string;
  department: string | null;
  yearOfStudy: string | null;
  referralCode: string;
  credits: number;
};

export type ProjectAnalysis = {
  title: string;
  description: string;
  detectedLanguage: string;
  summary: string;
  workingPrinciple: string[];
  blockDiagram: string[];
  components: {
    name: string;
    category: string;
    quantity: string;
    specification: string;
    role: string;
    estimatedPriceInr: number;
    searchQuery: string;
    guide: string;
  }[];
};

const MEMBER_KEY = "riyastech.member";
const PROJECT_KEY = "riyastech.project";
const CART_KEY = "riyastech.cart";
const EVENT = "riyastech-store";

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  if (value === null) window.localStorage.removeItem(key);
  else window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}

export const setMember = (m: Member | null) => write(MEMBER_KEY, m);
export const setProject = (p: ProjectAnalysis | null) => write(PROJECT_KEY, p);
export const setCart = (c: string[]) => write(CART_KEY, c);

function useStored<T>(key: string): T | null {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    const sync = () => setValue(read<T>(key));
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);
  return value;
}

export const useMember = () => useStored<Member>(MEMBER_KEY);
export const useProject = () => useStored<ProjectAnalysis>(PROJECT_KEY);
export const useCart = () => useStored<string[]>(CART_KEY) ?? [];

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
/* ---------- College + premium access ---------- */

const COLLEGE_KEY = "riyastech.college";
const PREMIUM_KEY = "riyastech.premium";

export type Premium = { analysis: boolean; viva: boolean };

export const setCollege = (name: string | null) => write(COLLEGE_KEY, name);
export const useCollege = () => useStored<string>(COLLEGE_KEY);

export const setPremium = (p: Premium) => write(PREMIUM_KEY, p);
export const usePremium = (): Premium =>
  useStored<Premium>(PREMIUM_KEY) ?? { analysis: false, viva: false };

export const isSeniorYear = (year: string | null | undefined) =>
  !!year && (year.startsWith("3rd") || year.startsWith("4th"));
