import { create } from "zustand";

export type SiteType = "loading" | "unknown" | "normal" | "error" | "warn";

interface StatusState {
  siteStatus: SiteType;
  siteData: any;
  scrollTop: number;
  setSiteStatus: (status: SiteType) => void;
  setSiteData: (data: any) => void;
  setScrollTop: (top: number) => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  siteStatus: "loading",
  siteData: null,
  scrollTop: 0,
  setSiteStatus: (status) => set({ siteStatus: status }),
  setSiteData: (data) => set({ siteData: data }),
  setScrollTop: (top) => set({ scrollTop: top }),
}));
export default useStatusStore;
