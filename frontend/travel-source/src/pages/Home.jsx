import { HeroSection } from "../components/HeroSection";
import { TripsList } from "../components/Trips";
import { Reviews } from "../components/Reviews";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { JourneyInFrames } from "../components/JourneyInFrames";
import { DiscoverJourney } from "../components/DiscoverJourney";
import ContactUs from "../components/ContactUs";
import { TrendingDestinations } from "../components/TrendingDestinations";
import { NightAdventure } from "../components/NightAdventure";

const Home = () => {
  return (
    <>
      <HeroSection />
      <TripsList />
      <TrendingDestinations />
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
