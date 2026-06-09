import Layout from "./components/Layout";
import MenuPage from "./pages/MenuPage/index";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PublicRoute from "./components/PublicRoute";
import DiningPage from "./pages/DiningPage/index";
import TablePage from "./pages/TablePage";
import OrderPage from "./pages/OrderPage/index";
import Reservation from "./pages/reservation";
import PaymentPage from "./pages/PaymentPage";
import KDSPage from "./pages/KDSPage/Kdspage";
import SessionDetailPage from "./pages/SessionDetailPage";
import SessionPaymentPage from "./pages/SessionPaymentPage";
import SettingsPage from "./pages/SettingPage";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/menus"
            element={
              <ProtectedRoute>
                <Layout>
                  <MenuPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dining"
            element={
              <ProtectedRoute>
                <Layout>
                  <DiningPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dining/:tableId"
            element={
              <ProtectedRoute>
                <Layout>
                  <SessionDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dining/payment"
            element={
              <ProtectedRoute>
                <Layout>
                  <SessionPaymentPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables"
            element={
              <ProtectedRoute>
                <Layout>
                  <TablePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
                <Layout>
                  <OrderPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reservation />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="payments"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaymentPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="kitchen"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "KITCHEN"]}>
                <Layout>
                  <KDSPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
