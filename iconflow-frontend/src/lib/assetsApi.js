// // src/lib/assetsApi.js
// import { apiFetch } from "@/lib/api";

// export const getHistory = () => apiFetch("/api/assets/history");
// export const getFavorites = () => apiFetch("/api/assets/favorites");
// export const toggleFavorite = (id) => apiFetch(`/api/assets/${id}/favorite`, { method: "POST" });
// export const renameAsset = (id, title) => apiFetch(`/api/assets/${id}/rename`, {
//   method: "PATCH",
//   body: JSON.stringify({ title }),
// });
// export const deleteAsset = (id) => apiFetch(`/api/assets/${id}`, { method: "DELETE" });
// export const getAsset = (id) => apiFetch(`/api/assets/${id}`);

import api from "@/lib/axios";

export const getHistory = async () => {
  const res = await api.get("/api/assets/history");
  return res.data;
};

export const getFavorites = async () => {
  const res = await api.get("/api/assets/favorites");
  return res.data;
};

export const getAsset = async (id) => {
  const res = await api.get(`/api/assets/${id}`);
  return res.data;
};

export const toggleFavorite = async (id) => {
  const res = await api.post(`/api/assets/${id}/favorite`);
  return res.data;
};

export const renameAsset = async (id, title) => {
  const res = await api.patch(`/api/assets/${id}/rename`, { title });
  return res.data;
};

export const deleteAsset = async (id) => {
  const res = await api.delete(`/api/assets/${id}`);
  return res.data;
};