import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import { useStatusStore } from "./store/useStatusStore";
import { theme } from "./theme";
import SiteNav from "./components/SiteNav";
import SiteHeader from "./components/SiteHeader";
import SiteCards from "./components/SiteCards";
import SiteFooter from "./components/SiteFooter";

function App() {
  const { siteStatus, siteData, setScrollTop } = useStatusStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollTop]);

  useEffect(() => {
    const siteTitle = "SkikawaStatus";
    const isError = siteStatus === "error" || siteStatus === "warn";
    const errorCount = (siteData?.status?.error || 0) + (siteData?.status?.unknown || 0);

    document.title = isError ? `( ${errorCount} ) ${siteTitle}` : siteTitle;

    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (link) {
      link.href = isError ? "/favicon-error.ico" : "/favicon.ico";
    }
  }, [siteStatus, siteData]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "background.default",
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <SiteNav />
          <SiteHeader />
          <Box component="main" sx={{ flexGrow: 1, position: "relative" }}>
            <SiteCards />
          </Box>
          <SiteFooter />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
