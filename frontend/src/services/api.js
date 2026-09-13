import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

export const getProject = async (projectId) => {
  const response = await axios.get(`${API_URL}/MyProjects/${projectId}`, {
    withCredentials: true,
  });

  return response.data.data;
};
