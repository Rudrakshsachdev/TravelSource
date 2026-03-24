const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTrips = async (categorySlug = null) => {
  let url = `${API_BASE_URL}/v1/trips/`;
  if (categorySlug) {
    url += `?category=${encodeURIComponent(categorySlug)}`;
  }
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/categories/`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

export const createCategory = async (data) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/v1/admin/categories/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg =
      errorData.detail ||
      errorData.slug?.[0] ||
      errorData.name?.[0] ||
      JSON.stringify(errorData) ||
      "Failed to create category";
    throw new Error(msg);
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

export const fetchMyBookingDetail = async (id) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/bookings/my/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch booking details");
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
  const response = await fetch(`${API_BASE_URL}/v1/trips/international/`);
  if (!response.ok) {
    throw new Error("Failed to load international trips");
  }
  return response.json();
};

export const fetchAllInternationalTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_international=true`);
  if (!response.ok) {
    throw new Error("Failed to load all international trips");
  }
  return response.json();
};

export const fetchGoodFridayTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/good-friday/`);
  if (!response.ok) {
    throw new Error("Failed to load Good Friday trips");
  }
  return response.json();
};

export const fetchAllGoodFridayTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/good-friday/all/`);
  if (!response.ok) {
    throw new Error("Failed to load all Good Friday trips");
  }
  return response.json();
};

/** Fetch India trips + section config for the scrolling showcase */
export const fetchIndiaTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/india/`);
  if (!res.ok) throw new Error("Failed to fetch India trips");
  return res.json();
};

export const fetchAllIndiaTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_india_trip=true`);
  if (!response.ok) {
    throw new Error("Failed to load all India trips");
  }
  return response.json();
};

/** Fetch North India trips + section config for the scrolling showcase */
export const fetchNorthIndiaTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/north-india/`);
  if (!res.ok) throw new Error("Failed to fetch North India trips");
  return res.json();
};

export const fetchAllNorthIndiaTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_north_india_trip=true`);
  if (!response.ok) {
    throw new Error("Failed to load all North India trips");
  }
  return response.json();
};

/** Fetch Honeymoon trips + section config for the scrolling showcase */
export const fetchHoneymoonTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/honeymoon/`);
  if (!res.ok) throw new Error("Failed to fetch Honeymoon trips");
  return res.json();
};

export const fetchAllHoneymoonTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_honeymoon=true`);
  if (!response.ok) {
    throw new Error("Failed to load all Honeymoon trips");
  }
  return response.json();
};

/** Fetch Adventure trips + section config for the scrolling showcase */
export const fetchAdventureTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/adventure/`);
  if (!res.ok) throw new Error("Failed to fetch Adventure trips");
  return res.json();
};

export const fetchAllAdventureTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_adventure_trip=true`);
  if (!response.ok) {
    throw new Error("Failed to load all Adventure trips");
  }
  return response.json();
};

/** Fetch Adventure section config (ADMIN) */
export const fetchAdventureConfig = async () => {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_BASE_URL}/v1/admin/adventure-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch adventure config");
  return res.json();
};

/** Update Adventure section config (ADMIN) */
export const updateAdventureConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/adventure-config/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update adventure config");
  return res.json();
};

/** Fetch Honeymoon section config (ADMIN) */
export const fetchHoneymoonConfig = async () => {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_BASE_URL}/v1/admin/honeymoon-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch honeymoon config");
  return res.json();
};

/** Update Honeymoon section config (ADMIN) */
export const updateHoneymoonConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/honeymoon-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update honeymoon config");
  return res.json();
};

/** Fetch Himalayan trips + section config for the scrolling showcase */
export const fetchHimalayanTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/himalayan/`);
  if (!res.ok) throw new Error("Failed to fetch Himalayan trips");
  return res.json();
};

export const fetchAllHimalayanTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_himalayan_trek=true`);
  if (!response.ok) {
    throw new Error("Failed to load all Himalayan trips");
  }
  return response.json();
};

/** Fetch Himalayan section config (ADMIN) */
export const fetchHimalayanConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/himalayan-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Himalayan config");
  return res.json();
};

/** Update Himalayan section config (ADMIN) */
export const updateHimalayanConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/himalayan-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Himalayan config");
  return res.json();
};

export const fetchInternationalConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/international-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch International config");
  return res.json();
};

export const updateInternationalConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/international-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update International config");
  return res.json();
};

export const fetchIndiaConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/india-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch India config");
  return res.json();
};

export const updateIndiaConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/india-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update India config");
  return res.json();
};

export const fetchBackpackingTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/backpacking/`);
  if (!res.ok) throw new Error("Failed to fetch Backpacking trips");
  return res.json();
};

export const fetchAllBackpackingTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_backpacking_trip=true`);
  if (!response.ok) {
    throw new Error("Failed to load all Backpacking trips");
  }
  return response.json();
};

export const fetchBackpackingConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/backpacking-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Backpacking config");
  return res.json();
};

export const updateBackpackingConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/backpacking-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Backpacking config");
  return res.json();
};

// ─── Himachal Trips ────────────────────────────────────────────────────────

export const fetchHimachalTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/himachal/`);
  if (!res.ok) throw new Error("Failed to fetch Himachal trips");
  return res.json();
};

export const fetchAllHimachalTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_himachal_trip=true`);
  if (!response.ok) {
    throw new Error("Failed to load all Himachal trips");
  }
  return response.json();
};

export const fetchHimachalConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/himachal-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Himachal config");
  return res.json();
};

export const updateHimachalConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/himachal-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Himachal config");
  return res.json();
};

// ─── Uttarakhand Trips ─────────────────────────────────────────────────────

export const fetchUttarakhandTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/uttarakhand/`);
  if (!res.ok) throw new Error("Failed to fetch Uttarakhand trips");
  return res.json();
};

export const fetchAllUttarakhandTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_uttarakhand_trip=true`);
  if (!response.ok) {
    throw new Error("Failed to load all Uttarakhand trips");
  }
  return response.json();
};

export const fetchUttarakhandConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/uttarakhand-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Uttarakhand config");
  return res.json();
};

export const updateUttarakhandConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/uttarakhand-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Uttarakhand config");
  return res.json();
};


export const fetchSummerTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/summer/`);
  if (!res.ok) throw new Error("Failed to fetch Summer trips");
  return res.json();
};

export const fetchAllSummerTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_summer_trek=true`);
  if (!response.ok) {
    throw new Error("Failed to load all Summer trips");
  }
  return response.json();
};

export const fetchSummerConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/summer-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Summer config");
  return res.json();
};

export const updateSummerConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/summer-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Summer config");
  return res.json();
};

export const fetchMonsoonTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/monsoon/`);
  if (!res.ok) throw new Error("Failed to fetch Monsoon trips");
  return res.json();
};

export const fetchAllMonsoonTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_monsoon_trek=true`);
  if (!response.ok) {
    throw new Error("Failed to load all Monsoon trips");
  }
  return response.json();
};

export const fetchMonsoonConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/monsoon-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Monsoon config");
  return res.json();
};

export const updateMonsoonConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/monsoon-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Monsoon config");
  return res.json();
};

/** Fetch Community trips + section config for the scrolling showcase */
export const fetchCommunityTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/community/`);
  if (!res.ok) throw new Error("Failed to fetch Community trips");
  return res.json();
};

export const fetchAllCommunityTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_community_trip=true`);
  if (!response.ok) {
    throw new Error("Failed to load all Community trips");
  }
  return response.json();
};

/** Fetch Community section config (ADMIN) */
export const fetchCommunityConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/community-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Community config");
  return res.json();
};

/** Update Community section config (ADMIN) */
export const updateCommunityConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/community-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Community config");
  return res.json();
};

/** Fetch Festival trips + section config for the scrolling showcase */
export const fetchFestivalTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/festival/`);
  if (!res.ok) throw new Error("Failed to fetch Festival trips");
  return res.json();
};

export const fetchAllFestivalTrips = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/trips/?is_festival_trip=true`);
  if (!response.ok) {
    throw new Error("Failed to load all Festival trips");
  }
  return response.json();
};

/** Fetch Festival section config (ADMIN) */
export const fetchFestivalConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/festival-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Festival config");
  return res.json();
};

/** Update Festival section config (ADMIN) */
export const updateFestivalConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/festival-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Festival config");
  return res.json();
};

// ─── Forgot Password ────────────────────────────────────────────────────────

export const requestPasswordReset = async (email) => {
  const response = await fetch(`${API_BASE_URL}/v1/auth/request-reset/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to send reset code");
  }
  return result;
};

export const verifyResetOTP = async (email, otp) => {
  const response = await fetch(`${API_BASE_URL}/v1/auth/verify-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Invalid reset code");
  }
  return result;
};

export const resetPassword = async (email, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/v1/auth/reset-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, new_password: newPassword }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to reset password");
  }
  return result;
};

// ─── Journey in Frames (Gallery) ────────────────────────────────────────────

export const fetchJourneyInFramesTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/gallery/journey-frames/`);
  if (!res.ok) throw new Error("Failed to fetch Journey in Frames trips");
  return res.json();
};

export const fetchTripGalleryImages = async (tripId = "") => {
  const url = tripId ? `${API_BASE_URL}/v1/gallery/images/?trip_id=${tripId}&type=GALLERY` : `${API_BASE_URL}/v1/gallery/images/?type=GALLERY`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch gallery images");
  return res.json();
};

export const addTripGalleryImage = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/gallery/images/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add gallery image");
  return res.json();
};

export const deleteTripGalleryImage = async (id) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/gallery/images/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete gallery image");
  return true;
};

/** Fetch featured trips for the Featured Destination highlight section */
export const fetchFeaturedTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/featured/`);
  if (!res.ok) throw new Error("Failed to fetch featured trips");
  return res.json();
};

/** Compose navbar content from existing public backend endpoints. */
export const fetchNavbarContent = async () => {
  const [
    trips,
    categories,
    featuredTrips,
    internationalData,
    indiaData,
    honeymoonData,
    himalayanData,
    backpackingData,
    summerData,
    monsoonData,
    communityData,
    festivalData,
    longWeekendData,
  ] = await Promise.allSettled([
    fetchTrips(),
    fetchCategories(),
    fetchFeaturedTrips(),
    fetchInternationalTrips(),
    fetchIndiaTrips(),
    fetchHoneymoonTrips(),
    fetchHimalayanTrips(),
    fetchBackpackingTrips(),
    fetchSummerTrips(),
    fetchMonsoonTrips(),
    fetchCommunityTrips(),
    fetchFestivalTrips(),
    fetchLongWeekendTrips(),
  ]);

  return {
    trips: trips.status === "fulfilled" ? trips.value : [],
    categories: categories.status === "fulfilled" ? categories.value : [],
    featuredTrips:
      featuredTrips.status === "fulfilled" ? featuredTrips.value : [],
    international:
      internationalData.status === "fulfilled"
        ? internationalData.value
        : { config: { is_enabled: false }, trips: [] },
    india:
      indiaData.status === "fulfilled"
        ? indiaData.value
        : { config: { is_enabled: false }, trips: [] },
    honeymoon:
      honeymoonData.status === "fulfilled"
        ? honeymoonData.value
        : { config: { is_enabled: false }, trips: [] },
    himalayan:
      himalayanData.status === "fulfilled"
        ? himalayanData.value
        : { config: { is_enabled: false }, trips: [] },
    backpacking:
      backpackingData.status === "fulfilled"
        ? backpackingData.value
        : { config: { is_enabled: false }, trips: [] },
    summer:
      summerData.status === "fulfilled"
        ? summerData.value
        : { config: { is_enabled: false }, trips: [] },
    monsoon:
      monsoonData.status === "fulfilled"
        ? monsoonData.value
        : { config: { is_enabled: false }, trips: [] },
    community:
      communityData.status === "fulfilled"
        ? communityData.value
        : { config: { is_enabled: false }, trips: [] },
    festival:
      festivalData.status === "fulfilled"
        ? festivalData.value
        : { config: { is_enabled: false }, trips: [] },
    long_weekend:
      longWeekendData.status === "fulfilled"
        ? longWeekendData.value
        : { config: { is_enabled: false }, trips: [] },
  };
};

// ─── Coupons ───────────────────────────────────────────────────────────────

export const validateCoupon = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/coupons/validate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to validate coupon");
  }

  return res.json();
};

export const fetchAdminCoupons = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/coupons/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch coupons");
  return res.json();
};

export const createAdminCoupon = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/coupons/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create coupon");
  }
  return res.json();
};

export const updateAdminCoupon = async (id, data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/coupons/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update coupon");
  }
  return res.json();
};

export const deleteAdminCoupon = async (id) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/coupons/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to delete coupon");
  return true;
};

export const fetchApplicableCoupons = async (tripId, bookingAmount) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    `${API_BASE_URL}/v1/coupons/applicable/?trip_id=${tripId}&booking_amount=${bookingAmount}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) return { best_coupon: null, all_coupons: [] };
    return res.json();
};

/** Fetch Long Weekend trips + section config for the scrolling showcase */
export const fetchLongWeekendTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/long-weekend/`);
  if (!res.ok) throw new Error("Failed to fetch Long Weekend trips");
  return res.json();
};

export const fetchAllLongWeekendTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/?is_long_weekend_trip=true`);
  if (!res.ok) throw new Error("Failed to load all Long Weekend trips");
  return res.json();
};

/** Fetch Long Weekend section config (ADMIN) */
export const fetchLongWeekendConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/long-weekend-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Long Weekend config");
  return res.json();
};

/** Update Long Weekend section config (ADMIN) */
export const updateLongWeekendConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/long-weekend-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Long Weekend config");
  return res.json();
};

/** Fetch Biking trips + section config for the scrolling showcase */
export const fetchBikingTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/biking/`);
  if (!res.ok) throw new Error("Failed to fetch Biking trips");
  return res.json();
};

export const fetchAllBikingTrips = async () => {
  const res = await fetch(`${API_BASE_URL}/v1/trips/?is_biking_trip=true`);
  if (!res.ok) throw new Error("Failed to load all Biking trips");
  return res.json();
};

/** Fetch Biking section config (ADMIN) */
export const fetchBikingConfig = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/biking-config/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Biking config");
  return res.json();
};

/** Update Biking section config (ADMIN) */
export const updateBikingConfig = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/v1/admin/biking-config/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Biking config");
  return res.json();
};
