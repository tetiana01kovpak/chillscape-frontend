import axios from 'axios';

const getBaseURL = () => {
  const isServer = typeof window === 'undefined';

  if (!isServer) {
    return '/api';
  }

  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw new Error('BACKEND_URL is not configured');
  }

  return `${backendUrl}/api`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});
