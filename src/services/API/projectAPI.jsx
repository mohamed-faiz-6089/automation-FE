import axios from "axios";
import { ENDPOINTS } from "./endpoints";

export const fetchProjects = async () => {
  const res = await axios.get(ENDPOINTS.PROJECT.GET_ALL);
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await axios.post(ENDPOINTS.PROJECT.CREATE, projectData);
  return res.data;
};
