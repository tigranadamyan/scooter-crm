import axios from "axios";
import type {
  DashboardData,
  PaginatedResponse,
  Rental,
  Scooter,
  User,
} from "@/types";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Strip empty-string params so they don't fail backend enum validation
api.interceptors.request.use((config) => {
  if (config.params) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(config.params)) {
      if (value !== "" && value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    }
    config.params = cleaned;
  }
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export interface ScooterFilters {
  search?: string;
  status?: string;
  battery_min?: number;
  battery_max?: number;
  sort?: string;
  direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface RentalFilters {
  search?: string;
  status?: string;
  user_id?: number;
  scooter_id?: number;
  sort?: string;
  direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface CreateScooterData {
  number: string;
  model: string;
  status?: string;
  battery_level: number;
  latitude: number;
  longitude: number;
}

export interface UpdateScooterData {
  number?: string;
  model?: string;
  status?: string;
  battery_level?: number;
  latitude?: number;
  longitude?: number;
}

export interface CreateRentalData {
  user_id: number;
  scooter_id: number;
}

export const scooterApi = {
  list: (filters?: ScooterFilters) =>
    api.get<PaginatedResponse<Scooter>>("/scooters", { params: filters }),

  get: (id: number) => api.get<Scooter>(`/scooters/${id}`),

  create: (data: CreateScooterData) =>
    api.post<Scooter>("/scooters", data),

  update: (id: number, data: UpdateScooterData) =>
    api.put<Scooter>(`/scooters/${id}`, data),

  delete: (id: number) => api.delete(`/scooters/${id}`),
};

export const rentalApi = {
  list: (filters?: RentalFilters) =>
    api.get<PaginatedResponse<Rental>>("/rentals", { params: filters }),

  get: (id: number) => api.get<Rental>(`/rentals/${id}`),

  create: (data: CreateRentalData) => api.post<Rental>("/rentals", data),

  complete: (id: number) => api.patch<Rental>(`/rentals/${id}/complete`),
};

export const dashboardApi = {
  get: () => api.get<DashboardData>("/dashboard"),
};

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: AuthUser; token: string }>("/login", { email, password }),

  logout: () => api.post("/logout"),
};

export const userApi = {
  list: () => api.get<{ data: User[] }>("/users"),
};

export default api;
