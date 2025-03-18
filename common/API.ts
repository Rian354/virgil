import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_CONFIG } from "./config"; 

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 360000, // Timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  }
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

// Generic API request function
export const apiRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  endpoint: string,
  data?: any,
  params?: any
): Promise<T> => {
  try {
    await attachAuthToken(); // Ensure the token is set before making a request

    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      data,
      params,
    };

    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};