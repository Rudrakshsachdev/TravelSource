import { TripsList } from "../components/Trips";
import { fetchTrips } from "../services/api";
import { useEffect, useState } from "react";
import TripCard from "../components/Trips/TripCard";

const Home = () => {
return <TripsList />
};

export default Home;
