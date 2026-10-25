import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import BadgesCertificates from "./pages/BadgesCertificates";
import DonationDetails from "./pages/DonationDetails";
import MapPage from "./pages/MapPage";
import CreateDonation from "./pages/CreateDonation";
import { useEffect, useState } from "react";
import Preloader from "./components/Preloader";
export default function App() {
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 2200);

  return () => clearTimeout(timer);
}, []);

if (loading) {
  return <Preloader />;
}
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/donor-dashboard"
        element={<DonorDashboard />}
      />

      <Route
        path="/volunteer-dashboard"
        element={<VolunteerDashboard />}
      />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      <Route path="/profile" element={<Profile />} />

      <Route
        path="/notifications"
        element={<Notifications />}
      />

      <Route
        path="/achievements"
        element={<BadgesCertificates />}
      />

      <Route
        path="/donation/:id"
        element={<DonationDetails />}
      />

      <Route path="/map" element={<MapPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/create-donation" element={<CreateDonation />} />
    </Routes>
  );
}