"use client";

import { useEffect } from "react";

export default function FullPageRefresh() {
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem("page-refreshed");

    if (!hasRefreshed) {
      sessionStorage.setItem("page-refreshed", "true");
      // Trigger full reload
      window.location.reload(true);
    }
  }, []);

  return null;
}
