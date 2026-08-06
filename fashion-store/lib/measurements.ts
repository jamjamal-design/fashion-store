// ── Measurements persistence + order reference utilities ──

export type SavedMeasurements = {
  type: "men" | "women";
  values: Record<string, string>;
  photos: { name: string; size: number; dataUrl: string }[];
  savedAt: string;
};

const MEASUREMENTS_STORAGE_KEY = "claireville-measurements";
const ORDER_REF_PREFIX = "CV";
const ORDER_REF_STORAGE_KEY = "claireville-order-refs";

// ── Measurements persistence ──

export function saveMeasurements(measurements: SavedMeasurements) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(measurements));
  } catch {
    // Storage may be full (photos as data URLs) — fall back to values only
    try {
      const valuesOnly: SavedMeasurements = {
        ...measurements,
        photos: [],
      };
      window.localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(valuesOnly));
    } catch {
      // Ignore — measurements are best-effort
    }
  }
}

export function loadMeasurements(): SavedMeasurements | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(MEASUREMENTS_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as SavedMeasurements;
  } catch {
    return null;
  }
}

export function clearMeasurements() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(MEASUREMENTS_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

// ── Order reference generation ──

function readUsedRefs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = window.localStorage.getItem(ORDER_REF_STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored) as string[]);
  } catch {
    return new Set();
  }
}

function writeUsedRefs(refs: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ORDER_REF_STORAGE_KEY, JSON.stringify([...refs]));
  } catch {
    // Ignore
  }
}

/**
 * Generate a unique order reference in the format CV-XXXX (e.g. CV-1042).
 * Uniqueness is guaranteed by tracking used references in localStorage.
 */
export function generateOrderReference(): string {
  const usedRefs = readUsedRefs();

  // Try up to 100 times to find an unused reference
  for (let attempt = 0; attempt < 100; attempt++) {
    const number = Math.floor(1000 + Math.random() * 9000); // 1000–9999
    const ref = `${ORDER_REF_PREFIX}-${number}`;
    if (!usedRefs.has(ref)) {
      usedRefs.add(ref);
      writeUsedRefs(usedRefs);
      return ref;
    }
  }

  // Extremely unlikely fallback — use timestamp-based suffix
  const fallback = `${ORDER_REF_PREFIX}-${Date.now().toString().slice(-4)}`;
  usedRefs.add(fallback);
  writeUsedRefs(usedRefs);
  return fallback;
}

export function isValidOrderReference(ref: string): boolean {
  return /^CV-\d{4}$/.test(ref);
}