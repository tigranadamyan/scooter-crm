import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RequirePermissionProps {
  permission: string;
  children: React.ReactNode;
}

export default function RequirePermission({ permission, children }: RequirePermissionProps) {
  const { can } = useAuth();

  if (!can(permission)) {
    // Find the first page the user can access
    if (can("dashboard.view")) return <Navigate to="/dashboard" replace />;
    if (can("scooters.view")) return <Navigate to="/scooters" replace />;
    if (can("rentals.view")) return <Navigate to="/rentals" replace />;
    // No permissions at all — show access denied instead of looping back to login
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}
