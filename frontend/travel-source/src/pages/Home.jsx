import { TripsList } from "../components/Trips";
import { Reviews } from "../components/Reviews";
import { WhyChooseUs } from "../components/WhyChooseUs";
import ContactUs from "../components/ContactUs";

const Home = () => {
  return (
    <>
      <TripsList />
      <Reviews />
      <WhyChooseUs />
      <ContactUs />
    </>
  );
};

export default Home;
