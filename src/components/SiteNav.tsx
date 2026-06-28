import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/Info";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useStatusStore } from "../store/useStatusStore";
import { jumpLink } from "../utils/helper";

export const SiteNav: React.FC = () => {
  const { scrollTop } = useStatusStore();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  const isScrolled = scrollTop > 0;
  const isTransparent = !isScrolled;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: isTransparent ? "#fcfbf8" : "#fcfbf8",
          borderBottom: "1px solid #e7e2d8",
          color: isTransparent ? "#111827" : "#111827",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          px: { xs: 1.6, sm: 2 },
          pt: { xs: 0.8, sm: 1 },
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 940,
            width: "100%",
            margin: "0 auto",
            justifyContent: "space-between",
            px: { xs: 1, sm: 2 },
            minHeight: { xs: 64, sm: 72 },
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              letterSpacing: "-0.5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Box
              component="span"
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#3b82f6",
                display: "inline-block",
                boxShadow: "none",
                transition: "all 0.3s",
              }}
            />
            SkikawaStatus
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <IconButton
              color="inherit"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{
                borderRadius: 1,
                bgcolor: "#f6f3eb",
                border: "1px solid #e7e2d8",
                transition: "background-color 0.2s",
                color: "inherit",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              slotProps={{
                paper: {
                  sx: {
                    borderRadius: 1,
                    mt: 1,
                    boxShadow: "none",
                    border: "1px solid #e7e2d8",
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  jumpLink("https://github.com/skikawa/skiCustomSiteStatus");
                  setMenuAnchor(null);
                }}
                sx={{ py: 1.2, px: 2, fontSize: "0.875rem" }}
              >
                <GitHubIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
                GitHub
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAboutOpen(true);
                  setMenuAnchor(null);
                }}
                sx={{ py: 1.2, px: 2, fontSize: "0.875rem" }}
              >
                <InfoIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
                关于本站
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              p: 1.5,
              maxWidth: 420,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>关于本站</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.875rem", lineHeight: 1.7 }}>
            <strong>SiteStatus v3.0.0</strong>
            <br />
            一个基于 UptimeRobot API 的轻量级、高性能网站状态监测页面。采用 React 19、Vite 与最新的 MUI v9 进行重构，完全遵循 Material Design 3 的视觉审美与交互逻辑。
            <br />
            <br />
            由 iski 倾情制作。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAboutOpen(false)} variant="contained" color="primary">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SiteNav;
