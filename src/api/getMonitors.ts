import dayjs from "dayjs";

interface GetMonitorsEnv {
  [key: string]: string | undefined;
}

interface GetMonitorsInput {
  request?: Request | { method?: string };
  env?: GetMonitorsEnv;
}

let memoryCache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_TTL = 60 * 1000;

function getEnvValue(env: GetMonitorsEnv | undefined, key: string) {
  return env?.[key] || "";
}

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

export async function handleGetMonitors(input: GetMonitorsInput): Promise<Response> {
  const requestMethod = input.request?.method || "GET";
  if (requestMethod !== "POST") {
    return new Response(JSON.stringify({ code: 405, message: "Method Not Allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const env = input.env || (typeof process !== "undefined" ? process.env : {});
    const apiUrl = getEnvValue(env, "API_URL") || "https://api.uptimerobot.com/v2/";
    const apiKey = getEnvValue(env, "API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          code: 200,
          message: "No API key configured; returning empty monitor data",
          data: {
            status: { count: 0, ok: 0, error: 0, unknown: 0 },
            data: [],
            timestamp: Date.now(),
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const now = Date.now();
    if (memoryCache && now - memoryCache.timestamp < CACHE_TTL) {
      return new Response(
        JSON.stringify({
          code: 200,
          message: "success",
          source: "cache",
          data: memoryCache.data,
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    const countDays = Number(getEnvValue(env, "COUNT_DAYS") || "60");
    const dates: dayjs.Dayjs[] = [];
    const today = dayjs().startOf("day");

    for (let d = 0; d < countDays; d++) {
      dates.push(today.subtract(d, "day"));
    }

    const ranges = dates.map((date) => `${date.unix()}_${date.add(1, "day").unix()}`);
    const start = dates[dates.length - 1].unix();
    const end = dates[0].add(1, "day").unix();
    ranges.push(`${start}_${end}`);

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

    const showLink = getEnvValue(env, "SHOW_LINK") !== "false";
    const formattedData = formatSiteData(result, dates, showLink);
    memoryCache = { data: formattedData, timestamp: now };

    return new Response(
      JSON.stringify({
        code: 200,
        message: "success",
        source: "api",
        data: formattedData,
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error in getMonitors handler:", err);
    return new Response(JSON.stringify({ code: 500, message: err.message || "Internal server error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
