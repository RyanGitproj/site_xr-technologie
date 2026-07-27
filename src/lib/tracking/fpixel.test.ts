import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearPendingMetaEvents,
  fbEvent,
  fbEventOnce,
  flushPendingMetaEvents,
  stashLeadContentName,
  takeLeadContentName,
} from "./fpixel";

const PENDING_KEY = "xr_meta_pending";

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
  fbq?: (...args: unknown[]) => void;
}

let win: TestWindow;

beforeEach(() => {
  win = new TestWindow();
  vi.stubGlobal("window", win);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fbEvent", () => {
  it("envoie directement quand le pixel est monté", () => {
    win.fbq = vi.fn();
    fbEvent("ViewContent", { content_name: "Retail" });
    expect(win.fbq).toHaveBeenCalledWith("track", "ViewContent", {
      content_name: "Retail",
    });
    expect(win.sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("met en file quand le pixel n'est pas monté (consentement non refusé)", () => {
    fbEvent("Lead", { value: 1 });
    const raw = win.sessionStorage.getItem(PENDING_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw ?? "[]")).toEqual([{ name: "Lead", params: { value: 1 } }]);
  });

  it("n'enfile rien si le consentement est refusé", () => {
    win.localStorage.setItem("cookie_consent", "denied");
    fbEvent("Lead");
    expect(win.sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("plafonne la file d'attente à 20 événements", () => {
    for (let i = 0; i < 25; i += 1) fbEvent("ViewContent", { i });
    const raw = win.sessionStorage.getItem(PENDING_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw ?? "[]")).toHaveLength(20);
  });
});

describe("flushPendingMetaEvents", () => {
  it("rejoue la file au montage du pixel puis la vide", () => {
    fbEvent("ViewContent", { i: 1 });
    fbEvent("Lead", { i: 2 });
    const fbq = vi.fn();
    win.fbq = fbq;
    flushPendingMetaEvents();
    expect(fbq).toHaveBeenCalledTimes(2);
    expect(fbq).toHaveBeenNthCalledWith(1, "track", "ViewContent", { i: 1 });
    expect(fbq).toHaveBeenNthCalledWith(2, "track", "Lead", { i: 2 });
    expect(win.sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });
});

describe("clearPendingMetaEvents", () => {
  it("purge la file sans envoi (refus)", () => {
    fbEvent("Lead", { i: 1 });
    clearPendingMetaEvents();
    expect(win.sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });
});

describe("fbEventOnce", () => {
  it("n'envoie qu'une fois par session pour une même clé", () => {
    const fbq = vi.fn();
    win.fbq = fbq;
    fbEventOnce("lead", "Lead", { a: 1 });
    fbEventOnce("lead", "Lead", { a: 1 });
    expect(fbq).toHaveBeenCalledTimes(1);
  });
});

describe("stash/takeLeadContentName", () => {
  it("lit puis efface le nom mémorisé", () => {
    stashLeadContentName("Retail");
    expect(takeLeadContentName()).toBe("Retail");
    expect(takeLeadContentName()).toBeNull();
  });
});
