
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

export const getProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await API.put("/profile", data);
  return response.data;
};
