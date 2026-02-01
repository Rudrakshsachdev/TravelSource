const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/`);

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
};


export const fetchTripDetail = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/v1/trips/${id}/`
  );

  if (!response.ok) {
    throw new Error("Trip not found");
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

export const submitEnquiry = async (data) => {
  const token = localStorage.getItem("accessToken");
  
  const headers = {
    "Content-Type": "application/json",
  };
  
  // Include auth token if user is logged in
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/v1/enquiries/`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Failed to submit enquiry");
  }

  return result;
};

export const fetchMyEnquiries = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Please log in to view your enquiries");
  }

  const response = await fetch(
    `${API_BASE_URL}/v1/my-enquiries/`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }
  );

  // Handle expired/invalid token
  if (response.status === 401) {
    // Clear invalid token
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error("Failed to load enquiries");
  }

  return response.json();
};


export const fetchAdminEnquiries = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_BASE_URL}/v1/admin/enquiries/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!response.ok) {
    throw new Error("Failed to load enquiries");
  }

  return response.json();
};


export const fetchAdminTrips = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_BASE_URL}/v1/admin/trips/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!response.ok) {
    throw new Error("Failed to load trips");
  }

  return response.json();
};


export const createTrip = async (data) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_BASE_URL}/v1/admin/trips/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || JSON.stringify(errorData) || "Failed to create trip";
    throw new Error(errorMessage);
  }

  return response.json();
};

export const toggleTrip = async (id) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_BASE_URL}/v1/admin/trips/${id}/toggle/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update trip");
  }

  return response.json();
};


export const updateTrip = async (id, data) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_BASE_URL}/v1/admin/trips/${id}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update trip");
  }

  return response.json();
};
