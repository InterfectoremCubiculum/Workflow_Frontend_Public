import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
      'Content-Type': 'application/json',
  },
  withCredentials: true,
});


let errorHandler: ((problem: any) => void) | null = null;

export function setGlobalErrorHandler(handler: (problem: any) => void) {
  errorHandler = handler;
}

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const contentType = error.response?.headers['content-type'] || '';

      if (status === 401) {
        return Promise.reject(error);
      }
      if (contentType.includes('application/problem+json') && error.response) {
        const problem = error.response.data;
        if (errorHandler) {
          errorHandler(problem);
        }
      } else {
        console.error('Global Axios Interceptor: An error occurred:', status, error.response?.data);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
