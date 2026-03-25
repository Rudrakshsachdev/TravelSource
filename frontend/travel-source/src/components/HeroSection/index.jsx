import useIsMobile from "../../hooks/useIsMobile";
import HeroPremium from "./HeroPremium";
import MobileHero from "./MobileHero";

/**
 * HeroSection Wrapper
 * Conditionally renders the mobile-first app-like hero on small viewports
 * and the cinematic premium hero on larger screens, preventing hydration mismatched media queries.
 */
const HeroSection = () => {
  const isMobile = useIsMobile();

  return isMobile ? <MobileHero /> : <HeroPremium />;
};

export { HeroSection };
