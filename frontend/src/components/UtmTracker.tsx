"use client";

import { useEffect } from "react";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export const UtmTracker: React.FC = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const capturedUtms: Record<string, string> = {};
      let hasUtm = false;

      UTM_KEYS.forEach((key) => {
        const val = urlParams.get(key);
        if (val) {
          capturedUtms[key] = val;
          hasUtm = true;
        }
      });

      if (hasUtm) {
        sessionStorage.setItem("bts_utm_params", JSON.stringify(capturedUtms));
      }
    } catch {
      // ignore storage restrictions
    }
  }, []);

  return null;
};
