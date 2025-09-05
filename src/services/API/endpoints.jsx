export const BASE_URL = 'http://localhost:3001';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/user/login`,
  },
  PROJECT: {
    GET_ALL: (userId, roleName)=> `${BASE_URL}/project/${userId}/role/${roleName}`,
    CREATE: `${BASE_URL}/project`,
  },
  SUITE: {
    GET_ALL: `${BASE_URL}/suite`,
    CREATE: `${BASE_URL}/suite`,
    GET_BY_ID: (id) => `${BASE_URL}/suite/${id}`,
    BY_PROJECT: (projectId) => `${BASE_URL}/suite/project/${projectId}`, 
  }
};
