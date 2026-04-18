import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { LogOut, Calendar, Users, Stethoscope, Zap } from "lucide-react";

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ appointments: 0, patients: 0, doctors: 0 });
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStaffStats();
  }, []);

  async function fetchStaffStats() {
    try {
      setLoading(true);
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        fetch(`${API_BASE}/api/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/patients`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/doctors`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [appointments, patients, doctors] = await Promise.all([
        appointmentsRes.json(),
        patientsRes.json(),
        doctorsRes.json(),
      ]);

      setStats({
        appointments: appointments.data?.length || 0,
        patients: patients.data?.length || 0,
        doctors: doctors.data?.length || 0,
      });
    } catch (err) {
      console.error("Failed to fetch staff stats:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(circle at top left, rgba(20, 184, 166, 0.12), transparent 28%), radial-gradient(circle at top right, rgba(245, 158, 11, 0.1), transparent 22%), linear-gradient(180deg, #fcfffe 0%, #f4fbf9 45%, #eff8f5 100%), ${medicalToolsPattern}`
    }}>
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-teal-900">Staff Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Welcome, {user?.name} 👋 | Hospital Operations</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition duration-300 transform hover:scale-105 font-semibold"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Appointments Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Total Appointments</p>
                <p className="text-4xl font-bold mt-2">{stats.appointments}</p>
                <p className="text-purple-200 text-xs mt-2">Active today</p>
              </div>
              <Calendar className="h-12 w-12 text-purple-300 opacity-40 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>

          {/* Patients Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Patients</p>
                <p className="text-4xl font-bold mt-2">{stats.patients}</p>
                <p className="text-blue-200 text-xs mt-2">Registered</p>
              </div>
              <Users className="h-12 w-12 text-blue-300 opacity-40 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>

          {/* Doctors Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-teal-600 to-teal-800 p-6 text-white shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Total Doctors</p>
                <p className="text-4xl font-bold mt-2">{stats.doctors}</p>
                <p className="text-teal-100 text-xs mt-2">Available</p>
              </div>
              <Stethoscope className="h-12 w-12 text-teal-200 opacity-40" />
            </div>
          </div>
        </div>

        {/* Staff Functions */}
        <div className="rounded-2xl bg-white shadow-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-teal-900 mb-6">Staff Functions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border border-purple-300/50 hover:border-purple-400 p-6 transition duration-300">
              <div className="absolute -right-6 -top-6 h-20 w-20 bg-purple-500/5 rounded-full blur-lg group-hover:bg-purple-500/10"></div>
              <Calendar className="h-8 w-8 text-purple-600 mb-3 group-hover:scale-110 transition" />
              <h3 className="font-bold text-slate-900 mb-2">Appointment Management</h3>
              <p className="text-sm text-slate-600 mb-4">Schedule, reschedule, or cancel appointments</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:to-purple-800 transition text-sm font-semibold">
                Manage Appointments
              </button>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-300/50 hover:border-blue-400 p-6 transition duration-300">
              <div className="absolute -right-6 -top-6 h-20 w-20 bg-blue-500/5 rounded-full blur-lg group-hover:bg-blue-500/10"></div>
              <Users className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition" />
              <h3 className="font-bold text-slate-900 mb-2">Patient Support</h3>
              <p className="text-sm text-slate-600 mb-4">Assist patients with inquiries and registrations</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:to-blue-800 transition text-sm font-semibold">
                Support Tickets
              </button>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 hover:from-emerald-500/20 hover:to-emerald-600/20 border border-emerald-300/50 hover:border-emerald-400 p-6 transition duration-300">
              <div className="absolute -right-6 -top-6 h-20 w-20 bg-emerald-500/5 rounded-full blur-lg group-hover:bg-emerald-500/10"></div>
              <Stethoscope className="h-8 w-8 text-emerald-600 mb-3 group-hover:scale-110 transition" />
              <h3 className="font-bold text-slate-900 mb-2">Doctor Coordination</h3>
              <p className="text-sm text-slate-600 mb-4">Coordinate with doctors and manage schedules</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:to-emerald-800 transition text-sm font-semibold">
                Doctor Coordination
              </button>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 border border-orange-300/50 hover:border-orange-400 p-6 transition duration-300">
              <div className="absolute -right-6 -top-6 h-20 w-20 bg-orange-500/5 rounded-full blur-lg group-hover:bg-orange-500/10"></div>
              <Zap className="h-8 w-8 text-orange-600 mb-3 group-hover:scale-110 transition" />
              <h3 className="font-bold text-slate-900 mb-2">Reports</h3>
              <p className="text-sm text-slate-600 mb-4">View appointments and performance reports</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:to-orange-800 transition text-sm font-semibold">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
