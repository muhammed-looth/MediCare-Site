import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { LogOut, Calendar, BookOpen, Heart, ArrowRight, Stethoscope } from "lucide-react";

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPatientAppointments();
  }, []);

  async function fetchPatientAppointments() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch appointments");

      const data = await response.json();
      setAppointments(data.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const upcomingAppointments = appointments.filter((a) => a.status !== "Completed" && a.status !== "Canceled");
  const pastAppointments = appointments.filter((a) => a.status === "Completed" || a.status === "Canceled");

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
            <h1 className="text-3xl font-bold text-teal-900">Your Health Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Welcome, {user?.name} 💙 | Your wellness is our priority</p>
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Appointments */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 text-slate-900 shadow-sm hover:shadow-md transition duration-300 transform hover:scale-105 cursor-pointer">
            <div className="absolute -right-12 -top-12 h-40 w-40 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Upcoming Appointments</p>
                <p className="text-5xl font-bold mt-3">{upcomingAppointments.length}</p>
                <p className="text-teal-600 text-sm mt-3 font-semibold">Your next visit is scheduled</p>
              </div>
              <Calendar className="h-16 w-16 text-slate-200 opacity-50 group-hover:text-teal-500/40 transition" />
            </div>
          </div>

          {/* Completed Appointments */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="absolute -right-12 -top-12 h-40 w-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium uppercase tracking-wide">Completed Appointments</p>
                <p className="text-5xl font-bold mt-3">{pastAppointments.length}</p>
                <p className="text-emerald-200 text-sm mt-3">Thank you for your visits</p>
              </div>
              <BookOpen className="h-16 w-16 text-emerald-300 opacity-50 group-hover:opacity-70 transition" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/appointments")}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl hover:to-teal-800 transition duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Heart className="h-5 w-5" />
            Book New Appointment
            <ArrowRight className="h-5 w-5" />
          </button>
          <button className="px-8 py-4 bg-white border-2 border-teal-600 text-teal-600 rounded-2xl hover:bg-teal-50 transition duration-300 font-bold text-lg">
            View My Medical Records
          </button>
        </div>

        {/* Upcoming Appointments */}
        <div className="rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-700 to-teal-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Upcoming Appointments</h2>
                <p className="text-teal-100 text-sm mt-1">Your scheduled consultations</p>
              </div>
              <Calendar className="h-8 w-8 text-teal-200 opacity-50" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-cyan-900 uppercase">Doctor</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-cyan-900 uppercase">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-cyan-900 uppercase">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-cyan-900 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="font-medium text-slate-600">No upcoming appointments</p>
                      <p className="text-sm text-slate-500">Book one now to get started</p>
                    </td>
                  </tr>
                ) : (
                  upcomingAppointments.map((appt) => (
                    <tr key={appt._id} className="border-b border-slate-100 hover:bg-teal-50/30 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{appt.doctorName}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{appt.departmentName}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-teal-600" />
                          {appt.date} at {appt.time}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
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

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div className="rounded-lg bg-white shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Past Appointments</h2>
                  <p className="text-slate-300 text-sm mt-1">Your medical history</p>
                </div>
                <BookOpen className="h-8 w-8 text-slate-300 opacity-50" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">Doctor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastAppointments.map((appt) => (
                    <tr key={appt._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{appt.doctorName}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{appt.departmentName}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{appt.date}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-3 py-2 rounded-full text-xs font-bold ${
                          appt.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
