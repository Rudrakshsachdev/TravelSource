import { useState, useEffect } from "react";

const MQ = "(max-width: 767px)";

/**
 * useIsMobile — returns true when the viewport is ≤ 767 px.
 * Uses matchMedia + change listener so re-renders happen live on resize.
 */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MQ).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(MQ);
    const handler = (e) => setMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return mobile;
};

export default useIsMobile;
