import { HeroSection } from "../components/HeroSection";
import { TripsList } from "../components/Trips";
import { PromoBanner } from "../components/PromoBanner";
import { Reviews } from "../components/Reviews";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { JourneyInFrames } from "../components/JourneyInFrames";
import { DiscoverJourney } from "../components/DiscoverJourney";
import ContactUs from "../components/ContactUs";
import { TrendingDestinations } from "../components/TrendingDestinations";
import { LongWeekendBanner } from "../components/LongWeekendBanner/LongWeekendBanner";
import { NightAdventure } from "../components/NightAdventure";

const Home = () => {
  return (
    <>
      <HeroSection />
      <TripsList />
      <PromoBanner />
      <TrendingDestinations />
      <LongWeekendBanner />
      <NightAdventure />
      <Reviews />
      <WhyChooseUs />
      <DiscoverJourney />
      <JourneyInFrames />
      <ContactUs />
    </>
  );
};

export default Home;
