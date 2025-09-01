import axios from 'axios';
import { ENDPOINTS } from './endpoints';

export const fetchSuites = async () => {
    const res = await axios.get(ENDPOINTS.SUITE.GET_ALL);
    return res.data;
};

export const createSuite = async (suiteData) => {
    const res = await axios.post(ENDPOINTS.SUITE.CREATE, suiteData);
    return res.data;
};


export const fetchSuiteById = async (id) => {
    const res = await axios.get(`${ENDPOINTS.SUITE.GET_BY_ID}/${id}`);
    return res.data;
};


export const fetchSuitesByProjectId = async (projectId) => {
  const res = await axios.get(ENDPOINTS.SUITE.BY_PROJECT(projectId)); 
  return res.data;
};
