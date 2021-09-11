import axios from 'axios';

import { CurrentUser } from '../context/AuthProvider';
import { RegisterResponse } from '../pages/Register';

axios.defaults.withCredentials = true;

console.log();
export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await axios.get(`/api/users/current`);
  return response.data;
}

export async function loginUser(params: {
  email: string;
  password: string;
}): Promise<CurrentUser> {
  const response = await axios.post(`/api/login`, params);
  return response.data;
}
export async function registerUser(params: {
  email: string;
  password: string;
  name: string;
}): Promise<RegisterResponse> {
  const response = await axios.post(`/api/register`, params);
  return response.data;
}
