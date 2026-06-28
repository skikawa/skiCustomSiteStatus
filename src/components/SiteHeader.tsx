import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useStatusStore } from "../store/useStatusStore";
import { formatTime } from "../utils/time";
import { getSiteData } from "../utils/helper";

export const SiteHeader: React.FC = () => {
  const { siteStatus, siteData } = useStatusStore();
  const [countdown, setCountdown] = useState(300);

  const statusConfig = useMemo(() => {
    const configs: Record<string, { background: string; text: string; tag: string; accent: string }> = {
      loading: {
        background: "#fcfbf8",
        text: "正在载入运行状态...",
        tag: "Live Sync",
        accent: "#4b5563",
      },
      unknown: {
        background: "#f8fafc",
        text: "无法获取运行状态",
        tag: "Pending",
        accent: "#6b7280",
      },
      normal: {
        background: "#f8fbff",
        text: "所有服务运行正常",
        tag: "Healthy",
        accent: "#3b5bdb",
      },
      warn: {
        background: "#fffaf2",
        text: "部分服务出现异常",
        tag: "Watch",
        accent: "#d97706",
      },
      error: {
        background: "#fff7f7",
        text: "部分服务发生故障",
        tag: "Alert",
        accent: "#dc2626",
      },
    };
    return configs[siteStatus] || configs.loading;
  }, [siteStatus]);

  const countdownText = useMemo(() => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return minutes > 0 ? `${minutes} 分 ${seconds} 秒` : `${seconds} 秒`;
  }, [countdown]);

  const handleRefresh = async () => {
    const lastUpdate = siteData?.timestamp || 0;
    if (lastUpdate && Date.now() - lastUpdate < 10 * 1000) {
      alert("请勿频繁刷新数据，请稍后再试！");
      return;
    }
    setCountdown(300);
    await getSiteData();
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          getSiteData();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: 250, sm: 280 },
        display: "flex",
        alignItems: "center",
        background: statusConfig.background,
        color: "#111827",
        overflow: "hidden",
        pt: { xs: 6, sm: 7 },
        pb: { xs: 6, sm: 7 },
        boxSizing: "border-box",
        zIndex: 1,
        borderBottom: "1px solid #e7e2d8",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          maxWidth: 940,
          width: "100%",
          margin: "0 auto",
          px: { xs: 3, sm: 4 },
          boxSizing: "border-box",
        }}
      >
        <Box
          className="point"
          sx={{
            position: "relative",
            width: { xs: 38, sm: 46 },
            height: { xs: 38, sm: 46 },
            backgroundColor: statusConfig.accent,
            borderRadius: "50%",
            mr: { xs: 2.25, sm: 3 },
            flexShrink: 0,
            boxShadow: "0 0 0 6px rgba(59, 91, 219, 0.08)",
            "&::after": {
              content: '""',
              backgroundColor: statusConfig.accent,
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              opacity: 0.2,
              animation: "breathing 1.5s ease infinite",
            },
          }}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, width: "100%" }}>
          <Chip
            label={statusConfig.tag}
            size="small"
            sx={{
              width: "fit-content",
              bgcolor: "#ffffff",
              color: "#111827",
              border: "1px solid #e7e2d8",
              fontWeight: 700,
              letterSpacing: "0.3px",
            }}
          />

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.7rem", sm: "2.3rem" },
              lineHeight: 1.1,
              letterSpacing: "-0.7px",
            }}
          >
            {statusConfig.text}
          </Typography>

          {siteStatus === "loading" && (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              正在加载监测数据，请稍候...
            </Typography>
          )}

          {siteStatus === "unknown" && (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              无法连接到服务状态接口，稍后将自动重试。
            </Typography>
          )}

          {siteStatus !== "loading" && siteStatus !== "unknown" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                opacity: 0.94,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                最近更新于 {formatTime(siteData?.timestamp || 0, { showTime: true, showOnlyTimeIfToday: true })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "inline" } }}>
                •
              </Typography>
              <Typography variant="body2" color="text.secondary">将于 {countdownText} 后自动刷新</Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={handleRefresh}
                sx={{
                  ml: 0.25,
                  borderRadius: 1,
                  borderColor: "#e7e2d8",
                  color: "#111827",
                  textTransform: "none",
                  px: 1.2,
                }}
                startIcon={<RefreshIcon fontSize="small" />}
              >
                刷新
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SiteHeader;
