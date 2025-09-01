import axios from 'axios';
import { ENDPOINTS } from './endpoints';

export const loginUser = async (email, password) => {
  const response = await axios.post(ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });
  return response.data;
};
