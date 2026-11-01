import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

export const createServiceRequest = async (message) => {
  const response = await API.post("/service-requests", {
    message
  });

  return response.data;
};

export const getServiceRequests = async () => {
  const response = await API.get("/service-requests");
  return response.data;
};

export const getServiceRequest = async (id) => {
  const response = await API.get(`/service-requests/${id}`);
  return response.data;
};