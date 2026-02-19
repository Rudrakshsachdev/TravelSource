import { HeroSection } from "../components/HeroSection";
import { TripsList } from "../components/Trips";
import { Reviews } from "../components/Reviews";
import { WhyChooseUs } from "../components/WhyChooseUs";
import ContactUs from "../components/ContactUs";

const Home = () => {
  return (
    <>
      <HeroSection />
      <TripsList />
      <Reviews />
      <WhyChooseUs />
      <ContactUs />
    </>
  );
};

export default Home;
