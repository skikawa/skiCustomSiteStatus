import { useStatusStore } from "../store/useStatusStore";

export interface NormalizedSiteData {
  status: {
    count: number;
    ok: number;
    error: number;
    unknown: number;
  };
  data: any[];
  timestamp: number;
}

export const normalizeSitePayload = (payload: any): NormalizedSiteData | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (Array.isArray(payload)) {
    return {
      status: { count: payload.length, ok: 0, error: 0, unknown: 0 },
      data: payload,
      timestamp: Date.now(),
    };
  }

  if (Array.isArray(payload?.data) && payload?.status) {
    return {
      status: payload.status,
      data: payload.data,
      timestamp: payload.timestamp || Date.now(),
    };
  }

  if (payload?.data && typeof payload.data === "object" && Array.isArray(payload.data.data)) {
    return {
      status: payload.data.status || { count: 0, ok: 0, error: 0, unknown: 0 },
      data: payload.data.data,
      timestamp: payload.data.timestamp || Date.now(),
    };
  }

  if (payload?.monitors) {
    const data = Array.isArray(payload.monitors) ? payload.monitors : [];
    return {
      status: {
        count: data.length,
        ok: 0,
        error: 0,
        unknown: 0,
      },
      data,
      timestamp: Date.now(),
    };
  }

  return null;
};

/**
 * Jump to a link in a new tab
 */
export const jumpLink = (url: string) => {
  if (url) window.open(url, "_blank");
};

/**
 * Format a number to 2 decimal places
 */
export const formatNumber = (num: number) => Math.floor(num * 100) / 100;

/**
 * Sleep for a certain amount of time
 */
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate SHA-256 hash using native Web Crypto API (Browser-side)
 */
export const sha256 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Fetch site data from the Hono API and update the Zustand store
 */
export const getSiteData = async (): Promise<void> => {
  const store = useStatusStore.getState();
  try {
    store.setSiteStatus("loading");

    const response = await fetch("/api/getMonitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const errorPayload = await response.json();
        message = errorPayload?.message || message;
      } catch {
        // Ignore JSON parse failures and keep the fallback message.
      }
      throw new Error(message);
    }

    let result: any;
    try {
      result = await response.json();
    } catch {
      throw new Error("The API returned an invalid response format.");
    }

    console.log("API response payload", result);

    if (result.code !== 200) {
      throw new Error(result.message || "Error to get site data");
    }

    const normalized = normalizeSitePayload(result.data || result);
    console.log("Normalized payload", normalized);
    if (!normalized || !Array.isArray(normalized.data)) {
      throw new Error("The API response did not contain any monitor data.");
    }

    const { status } = normalized;
    store.setSiteData(normalized);

    const nextStatus =
      status.count === 0
        ? "normal"
        : status.count === status.ok
        ? "normal"
        : status.count === status.error
        ? "error"
        : "warn";

    store.setSiteStatus(nextStatus);
  } catch (error) {
    console.error("error to get site data", error);
    store.setSiteStatus("unknown");
  }
};
