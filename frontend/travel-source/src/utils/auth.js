/*
this file is used to store and retrieve authentication data from the local storage
auth data includes access token, refresh token, role and username
*/

export const getAuthData = () => {
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  if (!accessToken || !role) return null;

  return { accessToken, role, username };
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
};
