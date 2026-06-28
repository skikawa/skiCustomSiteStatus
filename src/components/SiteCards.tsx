import React, { useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import LaunchIcon from "@mui/icons-material/Launch";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PauseIcon from "@mui/icons-material/Pause";

import { useStatusStore } from "../store/useStatusStore";
import { formatTime, formatDuration, formatInterval } from "../utils/time";
import { getSiteData, jumpLink } from "../utils/helper";

export const SiteCards: React.FC = () => {
  const { siteData, siteStatus } = useStatusStore();

  useEffect(() => {
    if (!siteData) {
      getSiteData();
    }
  }, [siteData]);

  const siteStatusMap = useMemo(() => ({
    0: { text: "已暂停", color: "#64748b" },
    1: { text: "状态未知", color: "#64748b" },
    2: { text: "运行正常", color: "#22c55e" },
    8: { text: "服务异常", color: "#f59e0b" },
    9: { text: "无法访问", color: "#ef4444" },
  }), []);

  const siteTypeMap = useMemo(() => ({
    1: { tag: "HTTP", text: "HTTP(S) 网页监测" },
    2: { tag: "KEYWORD", text: "关键词内容监测" },
    3: { tag: "PING", text: "Ping 服务器监测" },
    4: { tag: "PORT", text: "TCP 端口开放监测" },
    5: { tag: "HEARTBEAT", text: "心跳主动信号监测" },
  }), []);

  const getDayStatusColor = (percent: number): string => {
    if (percent >= 100) return "#22c55e";
    if (percent >= 80) return "#4ade80";
    if (percent >= 50) return "#fbbf24";
    if (percent > 0) return "#f87171";
    return "#e2e8f0";
  };

  const handleRetry = () => {
    getSiteData();
  };

  const sites = Array.isArray(siteData?.data) ? siteData.data : [];

  if (!siteData && siteStatus !== "unknown") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: -4, mb: 6, px: 3 }}>
        <Card sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 220, borderRadius: 2, bgcolor: "#fcfbf8" }}>
          <CircularProgress color="primary" sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            正在获取运行状态数据...
          </Typography>
        </Card>
      </Box>
    );
  }

  if (siteStatus === "unknown" && !siteData) {
    return (
      <Box sx={{ maxWidth: 640, margin: "-48px auto 40px", px: 3, position: "relative", zIndex: 2 }}>
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 2, bgcolor: "#fcfbf8" }}>
          <WarningAmberIcon color="error" sx={{ fontSize: 56, mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            运行数据加载失败
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            无法连接到服务接口，未能获取到最新的监控状态。
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleRetry}>
            重试
          </Button>
        </Card>
      </Box>
    );
  }

  if (!sites.length) {
    return (
      <Box sx={{ maxWidth: 640, margin: "-48px auto 40px", px: 3, position: "relative", zIndex: 2 }}>
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 2, bgcolor: "#fcfbf8" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            暂无可展示的监控站点
          </Typography>
          <Typography variant="body2" color="text.secondary">
            当前接口返回了空的监控数据，请稍后再试或检查监控配置。
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 940,
        margin: "-48px auto 40px",
        position: "relative",
        zIndex: 2,
        px: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {sites.map((site: any, index: number) => {
        const currentStatus = siteStatusMap[site.status] || { text: "状态未知", color: "#64748b" };
        const totalDays = site.days?.length || 0;

        return (
          <Card
            key={site.id || index}
            sx={{
              p: { xs: 2.5, sm: 3 },
              animation: "float-up 0.5s ease-out forwards",
              animationDelay: `${index * 0.08}s`,
              opacity: 0,
              borderRadius: 2,
              bgcolor: "#fcfbf8",
              borderLeft: `4px solid ${currentStatus.color}`,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5, mb: 2.25 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.25px" }}>
                  {site.name}
                </Typography>

                <Tooltip title={siteTypeMap[site.type]?.text || "HTTP 监测"}>
                  <Chip
                    label={`${siteTypeMap[site.type]?.tag || "HTTP"} / ${formatInterval(site.interval)}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 24, fontSize: "0.75rem", borderRadius: 1, px: 0.6 }}
                  />
                </Tooltip>

                {site.url && (
                  <IconButton size="small" onClick={() => jumpLink(site.url)} sx={{ p: 0.25, color: "text.secondary" }}>
                    <LaunchIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {site.status === 0 ? (
                  <PauseIcon sx={{ color: currentStatus.color, fontSize: 18 }} />
                ) : (
                  <Box
                    sx={{
                      position: "relative",
                      width: 10,
                      height: 10,
                      backgroundColor: currentStatus.color,
                      borderRadius: "50%",
                      mr: 0.25,
                      "&::after": {
                        content: '""',
                        backgroundColor: currentStatus.color,
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        opacity: 0.8,
                        animation: "breathing 1.5s ease infinite",
                      },
                    }}
                  />
                )}
                <Typography variant="body2" sx={{ color: currentStatus.color, fontWeight: 700 }}>
                  {currentStatus.text}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: "4px", height: 24, width: "100%", my: 2 }}>
              {site.days?.map((day: any, dayIdx: number) => {
                const dayColor = getDayStatusColor(day.percent);
                const tooltipTitle = (
                  <Box sx={{ p: 0.3 }}>
                    <Typography variant="caption" display="block" sx={{ color: "rgba(255,255,255,0.72)" }}>
                      {day.date ? formatTime(day.date) : "未知日期"}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.2, fontWeight: 700 }}>
                      {day.percent >= 100
                        ? `可用率 ${day.percent}%`
                        : day.percent > 0
                        ? `发生故障 ${day.down?.times || 0} 次，累计 ${formatDuration(day.down?.duration || 0)}，可用率 ${day.percent}%`
                        : "无监测数据"}
                    </Typography>
                  </Box>
                );

                return (
                  <Tooltip key={day.date || dayIdx} title={tooltipTitle} arrow placement="top" enterTouchDelay={0}>
                    <Box
                      sx={{
                        flex: 1,
                        backgroundColor: dayColor,
                        borderRadius: 1,
                        cursor: "pointer",
                        transition: "transform 0.15s ease-in-out, filter 0.15s",
                        "&:hover": {
                          transform: "scaleY(1.25)",
                          filter: "brightness(0.9)",
                        },
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "text.secondary", mt: 2, gap: 1.5, flexWrap: "wrap", bgcolor: "#f7f5ef", p: 1.5, borderRadius: 1.5, border: "1px solid #e7e2d8" }}>
              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                {formatTime(site.days?.[0]?.date || 0)}
              </Typography>

              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.75rem", textAlign: "center", flex: 1 }}>
                {site.down?.times ? `最近 ${totalDays} 天内发生过 ${site.down.times} 次故障，累计故障时长 ${formatDuration(site.down.duration)}，平均在线率 ${site.percent}%` : `最近 ${totalDays} 天内可用率 ${site.percent}%`}
              </Typography>

              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                今天
              </Typography>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
};

export default SiteCards;
