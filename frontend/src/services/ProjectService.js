import api from './api.js';

export const createProject = async ({ title, prompt, language, code }) => {
  const response = await api.post('/api/v1/Projects', { title, prompt, language, code });
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get('/api/v1/MyProjects');
  return response.data;
};

export const getProject = async (projectId) => {
  const response = await api.get(`/api/v1/MyProjects/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId, data) => {
  const response = await api.patch(`/api/v1/MyProjects/${projectId}`, data);
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/api/v1/MyProjects/${projectId}`);
  return response.data;
};
