import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { Users, Stethoscope, Calendar, Briefcase, LogOut, Plus, Activity, TrendingUp, FileText } from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, services: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      const [patientsRes, doctorsRes, appointmentsRes, servicesRes] = await Promise.all([
        fetch(`${API_BASE}/api/patients`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/doctors`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/services`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [patients, doctors, appointments, services] = await Promise.all([
        patientsRes.json(),
        doctorsRes.json(),
        appointmentsRes.json(),
        servicesRes.json(),
      ]);

      setStats({
        patients: patients.data?.length || 0,
        doctors: doctors.data?.length || 0,
        appointments: appointments.data?.length || 0,
        services: services.data?.length || 0,
      });
    } catch (err) {
      setError("Failed to fetch statistics");
      console.error(err);
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
    <div className="min-h-screen" style={{ backgroundImage: medicalToolsPattern, backgroundAttachment: "fixed"
    }}>
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-teal-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Welcome back, {user?.name} 👋</p>
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

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Patients Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 text-slate-900 shadow-sm hover:shadow-md transition duration-300 cursor-pointer transform hover:scale-105">
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Patients</p>
                <p className="text-4xl font-bold mt-2">{stats.patients}</p>
                <p className="text-teal-600 text-xs mt-2 flex items-center gap-1 font-bold"><TrendingUp className="h-3 w-3" /> 12% increase</p>
              </div>
              <Users className="h-12 w-12 text-slate-300 group-hover:text-teal-500/40 transition" />
            </div>
          </div>

          {/* Doctors Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium">Total Doctors</p>
                <p className="text-4xl font-bold mt-2">{stats.doctors}</p>
                <p className="text-emerald-200 text-xs mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> 8% increase</p>
              </div>
              <Stethoscope className="h-12 w-12 text-emerald-300 opacity-40 group-hover:opacity-60 transition" />
            </div>
          </div>

          {/* Appointments Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Total Appointments</p>
                <p className="text-4xl font-bold mt-2">{stats.appointments}</p>
                <p className="text-purple-200 text-xs mt-2 flex items-center gap-1"><Activity className="h-3 w-3" /> Active today</p>
              </div>
              <Calendar className="h-12 w-12 text-purple-300 opacity-40 group-hover:opacity-60 transition" />
            </div>
          </div>

          {/* Services Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-600 to-orange-800 p-6 text-white shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">Total Services</p>
                <p className="text-4xl font-bold mt-2">{stats.services}</p>
                <p className="text-orange-200 text-xs mt-2">Available now</p>
              </div>
              <Briefcase className="h-12 w-12 text-orange-300 opacity-40 group-hover:opacity-60 transition" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 p-6 shadow-xl mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link
              to="/admin/patients"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 p-4 transition duration-300"
            >
              <div className="relative">
                <div className="absolute -right-4 -top-4 h-16 w-16 bg-blue-500/5 rounded-full blur-lg group-hover:bg-blue-500/10"></div>
                <Users className="h-6 w-6 text-blue-400 mb-3 group-hover:scale-110 transition" />
                <p className="font-semibold text-white">Manage Patients</p>
                <p className="text-xs text-slate-400 mt-1">View & manage all patients</p>
              </div>
            </Link>

            <Link
              to="/admin/doctors"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 border border-emerald-500/30 hover:border-emerald-500/50 p-4 transition duration-300"
            >
              <div className="relative">
                <div className="absolute -right-4 -top-4 h-16 w-16 bg-emerald-500/5 rounded-full blur-lg group-hover:bg-emerald-500/10"></div>
                <Stethoscope className="h-6 w-6 text-emerald-400 mb-3 group-hover:scale-110 transition" />
                <p className="font-semibold text-white">Manage Doctors</p>
                <p className="text-xs text-slate-400 mt-1">View & manage all doctors</p>
              </div>
            </Link>

            <Link
              to="/admin/appointments"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 p-4 transition duration-300"
            >
              <div className="relative">
                <div className="absolute -right-4 -top-4 h-16 w-16 bg-purple-500/5 rounded-full blur-lg group-hover:bg-purple-500/10"></div>
                <Calendar className="h-6 w-6 text-purple-400 mb-3 group-hover:scale-110 transition" />
                <p className="font-semibold text-white">Manage Appointments</p>
                <p className="text-xs text-slate-400 mt-1">View & manage all appointments</p>
              </div>
            </Link>

            <Link
              to="/admin/services"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 border border-orange-500/30 hover:border-orange-500/50 p-4 transition duration-300"
            >
              <div className="relative">
                <div className="absolute -right-4 -top-4 h-16 w-16 bg-orange-500/5 rounded-full blur-lg group-hover:bg-orange-500/10"></div>
                <Briefcase className="h-6 w-6 text-orange-400 mb-3 group-hover:scale-110 transition" />
                <p className="font-semibold text-white">Manage Services</p>
                <p className="text-xs text-slate-400 mt-1">View & manage all services</p>
              </div>
            </Link>

            <Link
              to="/admin/prescriptions"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 hover:border-red-500/50 p-4 transition duration-300"
            >
              <div className="relative">
                <div className="absolute -right-4 -top-4 h-16 w-16 bg-red-500/5 rounded-full blur-lg group-hover:bg-red-500/10"></div>
                <FileText className="h-6 w-6 text-red-400 mb-3 group-hover:scale-110 transition" />
                <p className="font-semibold text-white">Manage Prescriptions</p>
                <p className="text-xs text-slate-400 mt-1">View & manage prescriptions</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
