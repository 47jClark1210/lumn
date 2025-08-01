import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Fetch current user's profile
export async function fetchUserProfile(token) {
  const res = await axios.get(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
}

// Update current user's profile
export async function updateProfile(data, token) {
  const res = await axios.put(`${API_BASE}/users/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
}

// Change password
export async function changePassword(oldPassword, newPassword, token) {
  const res = await axios.post(
    `${API_BASE}/users/me/change-password`,
    { oldPassword, newPassword },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    },
  );
  return res.data;
}

// Upload avatar
export async function uploadAvatar(file, token) {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await axios.post(`${API_BASE}/users/me/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data;
}

export async function searchAll(query, token) {
  const res = await axios.get(
    `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    },
  );
  return res.data.results;
}

// Add an item to the user's favorites
export async function addFavorite(favorite, token) {
  // favorite: { key, type, label, route, avatar }
  const res = await axios.post(`${API_BASE}/users/me/favorites`, favorite, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
}

// Optionally: fetch all favorites
export async function fetchFavorites(token) {
  const res = await axios.get(`${API_BASE}/users/me/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
}
