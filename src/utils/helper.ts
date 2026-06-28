import { useStatusStore } from "../store/useStatusStore";

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

    if (response.status === 401) {
      store.setLoginStatus(false);
      store.setSiteStatus("unknown");
      return;
    }

    const result = await response.json();
    if (result.code !== 200 || !result.data) {
      throw new Error(result.message || "Error to get site data");
    }

    const { status } = result.data;
    store.setSiteData(result.data);
    
    // Determine overall status
    const nextStatus =
      status.count === status.ok
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
