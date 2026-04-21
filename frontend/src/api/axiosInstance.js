import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error   ||
      err.message                 ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;