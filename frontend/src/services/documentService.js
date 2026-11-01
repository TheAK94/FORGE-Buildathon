
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

export const getDocuments = async () => {
  const response = await API.get("/documents");
  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await API.post(
    "/documents/upload",
    formData
  );

  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await API.delete(`/documents/${id}`);
  return response.data;
};

export const downloadDocument = async (id) => {
  const response = await API.get(
    `/documents/${id}/download`,
    { responseType: "blob" }
  );

  return response.data;
};
