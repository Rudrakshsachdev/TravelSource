import { HeroSection } from "../components/HeroSection";
import { TripsList } from "../components/Trips";
import { Reviews } from "../components/Reviews";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { JourneyInFrames } from "../components/JourneyInFrames";
import ContactUs from "../components/ContactUs";
import { TrendingDestinations } from "../components/TrendingDestinations";

const Home = () => {
  return (
    <>
      <HeroSection />
      <TripsList />
      <TrendingDestinations />
      <Reviews />
      <WhyChooseUs />
      <JourneyInFrames />
      <ContactUs />
    </>
  );
};

export default Home;
