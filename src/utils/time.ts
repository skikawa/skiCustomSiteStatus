import dayjs from "dayjs";

interface FormatTimeOptions {
  // 是否显示时分秒
  showTime?: boolean;
  // 若为今日，是否仅显示时分秒
  showOnlyTimeIfToday?: boolean;
}

/**
 * 格式化时间
 */
export const formatTime = (
  time: number,
  options: FormatTimeOptions = {}
): string => {
  if (!time) return "未知时间";
  const { showTime = false, showOnlyTimeIfToday = false } = options;
  const correctedTime = time < 10000000000 ? time * 1000 : time;

  const date = dayjs(correctedTime);
  const today = dayjs().startOf("day");

  if (showOnlyTimeIfToday && date.isSame(today, "day")) {
    return date.format("HH:mm:ss");
  }
  const formatString = showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
  return date.format(formatString);
};

/**
 * 格式化时长（秒数）为中文描述
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0 || days > 0) parts.push(`${hours}小时`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}分`);
  parts.push(`${secs}秒`);

  return parts.join("");
};

/**
 * 格式化检测周期
 */
export const formatInterval = (interval: number): string => {
  if (interval >= 3600) {
    const hours = Math.floor(interval / 3600);
    const minutes = Math.floor((interval % 3600) / 60);
    return minutes > 0 ? `${hours}小时 ${minutes}分` : `${hours}小时`;
  } else if (interval >= 60) {
    const minutes = Math.floor(interval / 60);
    const seconds = interval % 60;
    return seconds > 0 ? `${minutes}分 ${seconds}秒` : `${minutes}分`;
  } else {
    return `${interval}秒`;
  }
};
