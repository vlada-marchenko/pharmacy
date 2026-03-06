import axios from "axios";
import Cookies from "js-cookie";

const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_API || 'https://pharmacy-backend-app.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
    });

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.error('Backend server is sleeping (Render free tier). Please wait...');
    }

    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('shopId');
      localStorage.removeItem('user');
      localStorage.removeItem('shopId');

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
