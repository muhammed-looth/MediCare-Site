import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { LogOut, Calendar, Users, CheckCircle, Clock, AlertCircle, FileText, Pill } from "lucide-react";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ appointments: 0, patients: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctorData();
  }, []);

  async function fetchDoctorData() {
    try {
      setLoading(true);
      const appointmentsRes = await fetch(`${API_BASE}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const appointmentsData = await appointmentsRes.json();
      setAppointments(appointmentsData.data || []);
      setStats({
        appointments: appointmentsData.data?.length || 0,
        patients: new Set(appointmentsData.data?.map((a) => a.patient?._id)).size || 0,
      });
    } catch (err) {
      console.error("Failed to fetch doctor data:", err);
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
            <h1 className="text-3xl font-bold text-teal-900">Doctor Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Welcome back, Dr. {user?.name} 👨‍⚕️</p>
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

      {/* Navigation Tabs */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <Link
              to="/doctor/dashboard"
              className="px-4 py-4 border-b-2 border-teal-600 text-teal-700 font-semibold text-sm hover:text-teal-800 transition"
            >
              <Calendar className="inline mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/doctor/patients"
              className="px-4 py-4 border-b-2 border-transparent text-slate-600 font-semibold text-sm hover:text-teal-700 hover:border-teal-600 transition"
            >
              <Users className="inline mr-2 h-4 w-4" />
              Patients
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Appointments Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-white shadow-xl hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="absolute -right-12 -top-12 h-40 w-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium uppercase tracking-wide">Total Appointments</p>
                <p className="text-5xl font-bold mt-3">{stats.appointments}</p>
                <p className="text-purple-200 text-sm mt-3">This month's appointments</p>
              </div>
              <Calendar className="h-16 w-16 text-purple-300 opacity-50 group-hover:opacity-70 transition" />
            </div>
          </div>

          {/* Patients Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-teal-600 to-teal-800 p-8 text-white shadow-xl hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="absolute -right-12 -top-12 h-40 w-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium uppercase tracking-wide">Patients Served</p>
                <p className="text-5xl font-bold mt-3">{stats.patients}</p>
                <p className="text-teal-100 text-sm mt-3">Active patient relationships</p>
              </div>
              <Users className="h-16 w-16 text-teal-200 opacity-50 group-hover:opacity-70 transition" />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-700 to-teal-900 p-6">
            <h2 className="text-xl font-bold text-white">Your Appointments</h2>
            <p className="text-teal-100 text-sm mt-1">Manage your daily schedule</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                      <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="font-medium">No appointments scheduled</p>
                      <p className="text-sm">Your schedule is clear</p>
                    </td>
                  </tr>
                ) : (
                  appointments.map((appt) => (
                    <tr key={appt._id} className="border-b border-slate-100 hover:bg-teal-50/30 transition-all hover:translate-x-1">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{appt.patientName}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-teal-600" />
                          {appt.date} at {appt.time}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold ${
                            appt.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : appt.status === "Completed"
                              ? "bg-blue-100 text-blue-700"
                              : appt.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {appt.status === "Confirmed" && <CheckCircle className="h-3 w-3" />}
                          {appt.status === "Completed" && <CheckCircle className="h-3 w-3" />}
                          {appt.status === "Pending" && <Clock className="h-3 w-3" />}
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
