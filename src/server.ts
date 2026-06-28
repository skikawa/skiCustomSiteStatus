import { Hono } from "hono";
import { onRequest as getMonitorsHandler } from "./api/getMonitors";

const app = new Hono().basePath("/api");

// Simple in-memory cache for UptimeRobot API responses
let memoryCache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_TTL = 60 * 1000; // 1 minute

// Helper to get environment variables
const getEnvVal = (key: string): string => {
  return (typeof process !== "undefined" ? process.env[key] : "") || "";
};

// Get Monitors (UptimeRobot API Proxy) - Public Access
app.all("/getMonitors", async (c) => {
  if (c.req.method !== "POST") {
    return c.json({ code: 405, message: "Method Not Allowed" }, 405);
  }

  return getMonitorsHandler({ request: c.req.raw, env: process.env, context: c });
});

app.post("/getMonitors", async (c) => {
  try {
    const apiUrl = getEnvVal("API_URL") || "https://api.uptimerobot.com/v2/";
    const apiKey = getEnvVal("API_KEY");

    if (!apiKey) {
      return c.json({ code: 500, message: "Missing API_KEY in environment variables" }, 500);
    }

    // Check memory cache
    const now = Date.now();
    if (memoryCache && now - memoryCache.timestamp < CACHE_TTL) {
      return c.json({
        code: 200,
        message: "success",
        source: "cache",
        data: memoryCache.data,
      });
    }

    // Prepare date ranges (UptimeRobot logs)
    const countDays = Number(getEnvVal("COUNT_DAYS") || "60");
    const dates: dayjs.Dayjs[] = [];
    const today = dayjs().startOf("day");

    for (let d = 0; d < countDays; d++) {
      dates.push(today.subtract(d, "day"));
    }

    const ranges = dates.map(
      (date) => `${date.unix()}_${date.add(1, "day").unix()}`
    );
    const start = dates[dates.length - 1].unix();
    const end = dates[0].add(1, "day").unix();
    ranges.push(`${start}_${end}`);

    // Request UptimeRobot API
    const response = await fetch(apiUrl + "getMonitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        format: "json",
        logs: 1,
        log_types: "1-2",
        logs_start_date: start,
        logs_end_date: end,
        custom_uptime_ranges: ranges.join("-"),
      }),
    });

    if (!response.ok) {
      throw new Error(`UptimeRobot API returned status ${response.status}`);
    }

    const result: any = await response.json();
    if (!result?.monitors) {
      throw new Error("Invalid response from UptimeRobot API");
    }

    // Format Data
    const showLink = getEnvVal("SHOW_LINK") !== "false";
    const formattedData = formatSiteData(result, dates, showLink);

    // Update Cache
    memoryCache = {
      data: formattedData,
      timestamp: now,
    };

    return c.json({
      code: 200,
      message: "success",
      source: "api",
      data: formattedData,
    });
  } catch (err: any) {
    console.error("Error in getMonitors:", err);
    return c.json({
      code: 500,
      message: err.message || "Internal server error",
    }, 500);
  }
});

// Helper: Format UptimeRobot site data
function formatSiteData(data: any, dates: dayjs.Dayjs[], showLink: boolean) {
  const sites = data.monitors || [];

  const formatData = sites.map((site: any) => {
    const ranges = site.custom_uptime_ranges.split("-");
    const percent = Math.floor(Number(ranges.pop() || 0) * 100) / 100;
    const dailyData: any[] = [];
    const timeMap = new Map();

    dates.forEach((date, index) => {
      timeMap.set(date.format("YYYYMMDD"), index);
      dailyData[index] = {
        date: date.unix(),
        percent: Math.floor(Number(ranges[index] || 0) * 100) / 100,
        down: { times: 0, duration: 0 },
      };
    });

    const total = { times: 0, duration: 0 };
    (site.logs || []).forEach((log: any) => {
      if (log.type === 1 || log.type === 99) {
        const date = dayjs.unix(log.datetime).format("YYYYMMDD");
        const dateIndex = timeMap.get(date);
        if (dateIndex !== undefined && dailyData[dateIndex]) {
          dailyData[dateIndex].down.times += 1;
          dailyData[dateIndex].down.duration += log.duration;
        }
        total.times += 1;
        total.duration += log.duration;
      }
    });

    return {
      id: site.id,
      name: site.friendly_name || "Unnamed Site",
      url: showLink ? site.url : undefined,
      status: site.status ?? 8,
      type: site.type ?? 1,
      interval: site.interval ?? 0,
      percent,
      days: dailyData.reverse(),
      down: total,
    };
  });

  const statusSummary = formatData.reduce(
    (acc: any, site: any) => {
      if (site.status === 2) acc.ok++;
      else if (site.status === 8 || site.status === 9) acc.error++;
      else if (site.status === 0 || site.status === 1) acc.unknown++;
      return acc;
    },
    { count: formatData.length, ok: 0, error: 0, unknown: 0 }
  );

  return {
    status: statusSummary,
    data: formatData,
    timestamp: Date.now(),
  };
}

export default app;
export { app };
