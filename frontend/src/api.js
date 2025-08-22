import axios from "axios";
import qs from "qs";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
  paramsSerializer: params => qs.stringify(params, { encode: true }),
});

export const getRecipes = async ({ page = 1, limit = 15 }) => {
  const { data } = await api.get("/api/recipes", { params: { page, limit } });
  return data; 
};

export const searchRecipes = async (filters) => {
  const qp = {};
  if (filters.title) qp.title = filters.title;
  if (filters.cuisine) qp.cuisine = filters.cuisine;
  if (filters.ratingOp && filters.ratingVal) qp.rating = `${filters.ratingOp}${filters.ratingVal}`;
  if (filters.totalOp && filters.totalVal) qp.total_time = `${filters.totalOp}${filters.totalVal}`;
  if (filters.calOp && filters.calVal) qp.calories = `${filters.calOp}${filters.calVal}`;

  const { data } = await api.get("/api/recipes/search", { params: qp });
  return data; 
};

export const getRecipeById = async (id) => {
  const { data } = await api.get(`/api/recipes/${id}`);
  return data; 
};
