import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

interface OrderResponse {
  id: string;
  order_number: string;
  status: string;
  total_amount: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: string;
    product?: {
      id: string;
      name: string;
      price: number;
      image_url: string;
      description?: string;
      category?: string;
    };
  }>;
  shipping_address: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  payment_method: string;
  shipping_method: string;
  created_at: string;
  updated_at: string;
  order_date: string;
  estimated_delivery: string;
}

interface OrderRequest {
  items: Array<{
    product_id: string;
    quantity: number;
    price: string;
  }>;
  shipping_address: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  payment_method: string;
  shipping_method: string;
  total_amount: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log the response for debugging
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Product API
export const productApi = {
  getAllProducts: async () => {
    const response = await api.get('/api/products/');
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/api/products/${id}/`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string) => {
    const response = await api.get(`/products/?category=${category}`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get('/products/categories/');
    return response.data;
  },
};

// Order API
export const orderApi = {
  createOrder: async (orderData: any) => {
    const response = await api.post('/api/orders/', orderData);
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await api.get(`/api/orders/${orderId}/`);
    return response.data;
  },

  // Get user's orders
  getUserOrders: async (): Promise<OrderResponse[]> => {
    const response = await api.get<OrderResponse[]>('/orders/user/');
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string): Promise<OrderResponse> => {
    const response = await api.patch<OrderResponse>(`/orders/${orderId}/`, { status });
    return response.data;
  },
};

// Auth API
export const authApi = {
  // Login
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  // Register
  register: async (userData: any) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/user/');
    return response.data;
  },
};

export async function registerUser(data: {
  email: string;
  fullname: string;
  username: string;
  phone: string;
  password: string;
}) {
  try {
    const response = await api.post('/users/register/', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
    throw error;
  }
}

export default api; 
