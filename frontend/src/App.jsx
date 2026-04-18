import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { medicalToolsPattern } from "./assets/dummyStyles";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage/HomePage";
import DoctorsPage from "./components/DoctorsPage/DoctorsPage";
import DoctorDetail from "./pages/DoctorDetail/DoctorDetail";
import ServicesPage from "./components/ServicePage/ServicePage";
import ServiceDetailPage from "./pages/ServiceDetailPage/ServiceDetailPage";
import AppointmentsPage from "./components/AppointmentPage/AppointmentPage";
import ContactPage from "./components/ContactPage/ContactPage";
import LoginPage from "./components/LoginPage/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePatients from "./pages/admin/ManagePatients";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManageAppointments from "./pages/admin/ManageAppointments";
import ManageServices from "./pages/admin/ManageServices";
import ManagePrescriptions from "./pages/admin/ManagePrescriptions";
import DoctorDetailView from "./pages/admin/DoctorDetailView";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorPatients from "./doctor/PatientsPage/PatientsPage";
import StaffDashboard from "./pages/staff/StaffDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";

function AppLayout({ children }) {
  return ( 
    <div className="min-h-screen text-slate-900" style={{ backgroundImage: medicalToolsPattern, backgroundAttachment: "fixed" }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        }
      />
      <Route
        path="/doctors"
        element={
          <AppLayout>
            <DoctorsPage />
          </AppLayout>
        }
      />
      <Route
        path="/doctors/:id"
        element={
          <AppLayout>
            <DoctorDetail />
          </AppLayout>
        }
      />
      <Route
        path="/services"
        element={
          <AppLayout>
            <ServicesPage />
          </AppLayout>
        }
      />
      <Route
        path="/services/:id"
        element={
          <AppLayout>
            <ServiceDetailPage />
          </AppLayout>
        }
      />
      <Route
        path="/appointments"
        element={
          <AppLayout>
            <AppointmentsPage />
          </AppLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <AppLayout>
            <ContactPage />
          </AppLayout>
        }
      />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <ManagePatients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <ManageDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors/:id"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <DoctorDetailView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <ManageAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <ManageServices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/prescriptions"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <ManagePrescriptions />
          </ProtectedRoute>
        }
      />

      {/* Doctor Dashboard Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute requiredRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute requiredRoles={["doctor"]}>
            <DoctorPatients />
          </ProtectedRoute>
        }
      />

      {/* Staff Dashboard Routes */}
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute requiredRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* Patient Dashboard Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute requiredRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
