const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/`);

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
};
