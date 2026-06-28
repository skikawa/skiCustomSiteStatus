import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import HomeIcon from "@mui/icons-material/Home";
import EmailIcon from "@mui/icons-material/Email";

import { jumpLink } from "../utils/helper";

export const SiteFooter: React.FC = () => {
  const linkData = {
    github: "https://github.com/skikawa/skiCustomSiteStatus",
    home: "https://iski.ink",
    email: "mailto:skikawa@outlook.com",
  };

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px 56px",
        marginTop: "auto",
        zIndex: 100,
        textAlign: "center",
        borderTop: "1px solid #e7e2d8",
        backgroundColor: "#fcfbf8",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <IconButton size="small" color="inherit" onClick={() => jumpLink(linkData.github)} title="GitHub" sx={{ bgcolor: "#f3f4f6", borderRadius: 1 }}>
          <GitHubIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="inherit" onClick={() => jumpLink(linkData.home)} title="Home" sx={{ bgcolor: "#f3f4f6", borderRadius: 1 }}>
          <HomeIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="inherit" onClick={() => jumpLink(linkData.email)} title="Email" sx={{ bgcolor: "#f3f4f6", borderRadius: 1 }}>
          <EmailIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.6 }}>
        <Link component="button" variant="body2" onClick={() => jumpLink(linkData.github)} sx={{ fontWeight: 700, color: "text.primary", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
          SiteStatus
        </Link>{" "}
        Version 3.0.0
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.6, display: "block" }}>
        基于{" "}
        <Link component="button" variant="caption" onClick={() => jumpLink("https://uptimerobot.com/")} sx={{ fontWeight: 700, color: "text.primary", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
          UptimeRobot
        </Link>{" "}
        接口 | 检测频率 5 分钟
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        Copyright © 2026 - {currentYear}{" "}
        <Link component="button" variant="caption" onClick={() => jumpLink(linkData.home)} sx={{ fontWeight: 700, color: "text.primary", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
          iski
        </Link>
      </Typography>
    </Box>
  );
};

export default SiteFooter;
