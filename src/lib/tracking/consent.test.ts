import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getConsentChoice, resetConsentChoice, saveConsentChoice } from "./consent";

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? (map.get(key) as string) : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}

class TestWindow extends EventTarget {
  localStorage = memoryStorage();
  sessionStorage = memoryStorage();
}

let win: TestWindow;

beforeEach(() => {
  win = new TestWindow();
  vi.stubGlobal("window", win);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("consent store", () => {
  it("renvoie null côté serveur (window absent)", () => {
    vi.stubGlobal("window", undefined);
    expect(getConsentChoice()).toBeNull();
  });

  it("écrit le choix et le relit", () => {
    saveConsentChoice("granted");
    expect(getConsentChoice()).toBe("granted");
    expect(win.localStorage.getItem("cookie_consent")).toBe("granted");
  });

  it("notifie les abonnés à chaque écriture", () => {
    const onChange = vi.fn();
    win.addEventListener("cookie-consent-change", onChange);
    saveConsentChoice("denied");
    resetConsentChoice();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("resetConsentChoice efface le choix mémorisé", () => {
    saveConsentChoice("granted");
    resetConsentChoice();
    expect(getConsentChoice()).toBeNull();
    expect(win.localStorage.getItem("cookie_consent")).toBeNull();
  });

  it("ignore une valeur stockée inconnue", () => {
    win.localStorage.setItem("cookie_consent", "peut-être");
    expect(getConsentChoice()).toBeNull();
  });
});
