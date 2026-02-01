import { TripsList } from "../components/Trips";
import { Reviews } from "../components/Reviews";
import { WhyChooseUs } from "../components/WhyChooseUs";

const Home = () => {
  return (
    <>
      <TripsList />
      <Reviews />
      <WhyChooseUs />
    </>
  );
};

export default Home;
