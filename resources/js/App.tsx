import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RequirePermission from "./components/RequirePermission";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ScootersPage from "./pages/ScootersPage";
import RentalsPage from "./pages/RentalsPage";
import MapPage from "./pages/MapPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <RequirePermission permission="dashboard.view">
                  <DashboardPage />
                </RequirePermission>
              }
            />
            <Route
              path="scooters"
              element={
                <RequirePermission permission="scooters.view">
                  <ScootersPage />
                </RequirePermission>
              }
            />
            <Route
              path="rentals"
              element={
                <RequirePermission permission="rentals.view">
                  <RentalsPage />
                </RequirePermission>
              }
            />
            <Route path="map" element={<MapPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
