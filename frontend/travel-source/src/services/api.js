const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/`);

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(
    `${API_BASE_URL}/v1/auth/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.detail || "Invalid login credentials"
    );
  }

  return response.json();
};



export const signupUser = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/v1/auth/signup/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = new Error("Signup failed");
    error.data = result; // Attach the actual backend validation errors
    throw error;
  }

  return result;
};