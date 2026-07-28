export type ScooterStatus = "available" | "in_use" | "maintenance" | "offline";

export type RentalStatus = "active" | "completed";

export interface Scooter {
  id: number;
  number: string;
  model: string;
  status: ScooterStatus;
  status_label: string;
  battery_level: number;
  latitude: number;
  longitude: number;
  last_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface Rental {
  id: number;
  user_id: number;
  scooter_id: number;
  start_time: string;
  end_time: string | null;
  status: RentalStatus;
  status_label: string;
  user: User | null;
  scooter: Scooter | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  scooters: {
    available: number;
    in_use: number;
    maintenance: number;
    offline: number;
  };
  active_rentals: number;
  average_battery: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
