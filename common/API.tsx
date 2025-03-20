import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_CONFIG } from "./config";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 360000, // Timeout in milliseconds
});

// Function to set Authorization token dynamically
const attachAuthToken = async () => {
  const token = await API_CONFIG.getAuthToken();
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export const apiRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  endpoint: string,
  data?: any,
  params?: any,
  customConfig?: AxiosRequestConfig
): Promise<T> => {
  try {
    // Uncomment if you need to attach auth token:
    // await attachAuthToken();
    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      data,
      params,
      ...customConfig, // Merge custom config (e.g., custom headers)
    };

    const response = await apiClient(config);
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
