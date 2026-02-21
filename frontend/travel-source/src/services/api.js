const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/`);

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
};

export const fetchTripDetail = async (id) => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/${id}/`);

  if (!response.ok) {
    throw new Error("Trip not found");
  }

  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/v1/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.detail || "Invalid login credentials");
  }

  return response.json();
};

export const signupUser = async (data) => {
  const response = await fetch(`${API_BASE_URL}/v1/auth/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

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

  const response = await fetch(`${API_BASE_URL}/v1/enquiries/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

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

  const response = await fetch(`${API_BASE_URL}/v1/my-enquiries/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

  const response = await fetch(`${API_BASE_URL}/v1/admin/enquiries/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

  const response = await fetch(`${API_BASE_URL}/v1/admin/trips/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

  const response = await fetch(`${API_BASE_URL}/v1/admin/trips/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.detail || JSON.stringify(errorData) || "Failed to create trip";
    throw new Error(errorMessage);
  }

  return response.json();
};

export const toggleTrip = async (id) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/v1/admin/trips/${id}/toggle/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update trip");
  }

  return response.json();
};

export const updateTrip = async (id, data) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/v1/admin/trips/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update trip");
  }

  return response.json();
};

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();
  return data.secure_url;
};

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔹 Fetch all users (ADMIN)
export const fetchUsers = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE_URL}/v1/admin/users/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

// 🔹 Update user role
export const updateUserRole = async (userId, role) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE_URL}/v1/admin/users/${userId}/role/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    throw new Error("Failed to update role");
  }

  return res.json();
};

// 🔹 Delete user
export const deleteUser = async (userId) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE_URL}/v1/admin/users/${userId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return true;
};

export const deleteTrip = async (id) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/admin/trips/${id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to delete trip");
  }

  return true;
};

export const sendContactMessage = async (data) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/contact/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
};

export const fetchContactMessages = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/admin/contact-messages/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch contact messages");
  }

  return res.json();
};

export const deleteContactMessage = async (id) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/admin/contact-messages/${id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete contact message");
  }

  return true;
};

export const createBooking = async (data) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/bookings/create/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to create booking");
  }

  return res.json();
};

export const fetchMyBookings = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/bookings/my/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return res.json();
};

export const fetchAdminBookings = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/admin/bookings/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch admin bookings");
  }

  return res.json();
};

export const updateBookingStatus = async (id, status) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/admin/bookings/${id}/status/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to update booking status");
  }

  return res.json();
};

// ─── Personalization ────────────────────────────────────────────────────────

/**
 * Record that the current user viewed a trip (fire-and-forget, no throw).
 * Only sends if the user is logged in (access_token in localStorage).
 */
export const recordTripView = async (tripId) => {
  const token = localStorage.getItem("access_token");
  if (!token) return;
  try {
    await fetch(`${API_BASE_URL}/v1/trips/${tripId}/view/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // silently ignore — non-critical telemetry
  }
};

/**
 * Fetch recommended trips from the backend.
 * Passes locally-tracked viewed IDs for anonymous users.
 */
export const fetchRecommendedTrips = async (excludeIds = []) => {
  const token = localStorage.getItem("access_token");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const params =
    !token && excludeIds.length ? `?exclude=${excludeIds.join(",")}` : "";

  const res = await fetch(`${API_BASE_URL}/v1/trips/recommended/${params}`, {
    headers,
  });

  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
};

/** Fetch all reviews from the backend (newest first). */
export const fetchReviews = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/reviews/`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

/** Submit a new review. Payload: { name, country, trip, rating, review } */
export const submitReview = async (data) => {
  const res = await fetch(`${API_BASE_URL}/v1/reviews/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
  return res.json();
};

// ─── Site Stats (public) ────────────────────────────────────────────────────

/** Fetch all public site stats (animated counters, trips completed, etc.) */
export const fetchSiteStats = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/site-stats/`);
  if (!res.ok) throw new Error("Failed to fetch site stats");
  return res.json();
};

/** Fetch international trips + section config for the scrolling showcase */
export const fetchInternationalTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/international/`);
  if (!res.ok) throw new Error("Failed to fetch international trips");
  return res.json();
};
