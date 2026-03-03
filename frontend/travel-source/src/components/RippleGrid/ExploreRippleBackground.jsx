import { useState, useEffect } from "react";
import RippleGrid from "../RippleGrid/RippleGrid";

const ExploreRippleBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <RippleGrid
        gridColor="#3f9e8f"
        rippleIntensity={isMobile ? 0.03 : 0.05}
        gridSize={isMobile ? 8.0 : 10.0}
        gridThickness={18.0}
        fadeDistance={1.5}
        vignetteStrength={2.5}
        glowIntensity={0.08}
        opacity={0.12}
        gridRotation={0}
        mouseInteraction={!isMobile}
        mouseInteractionRadius={1}
        enableRainbow={false}
      />
    </div>
  );
};

export default ExploreRippleBackground;
