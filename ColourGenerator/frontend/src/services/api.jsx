import axios from "axios";

const API_BASE_URL = "http://localhost:500/api";

export const uploadImage = async (imageFile, numColors = 5) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("num_colors", numColors);

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const healthCheck = async () => {
  const response = await axios.get(`${API_BASE_URL}/health`);
  return response.data;
};
