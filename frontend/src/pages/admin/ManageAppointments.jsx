import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { Edit, Trash2, ArrowLeft, X, CheckCircle, Clock, AlertCircle, Search, Plus } from "lucide-react";

export default function ManageAppointments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    doctorName: "",
    date: "",
    time: "",
    status: "Pending",
    notes: "",
  });

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    // Filter appointments based on search query and status
    const filtered = appointments.filter((apt) => {
      const matchesSearch =
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.date.includes(searchQuery);
      const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredAppointments(filtered);
  }, [searchQuery, filterStatus, appointments]);

  async function fetchAppointments() {
    try {
      setLoading(true);
      const currentToken = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/api/appointments?t=${Date.now()}`, {
        headers: { 
          Authorization: `Bearer ${currentToken}`,
          'Cache-Control': 'no-cache'
        },
      });
      const data = await response.json();
      setAppointments(data.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load appointments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setFormData({
      patientName: "",
      patientEmail: "",
      doctorName: "",
      date: "",
      time: "",
      status: "Pending",
      notes: "",
    });
    setEditingId(null);
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const currentToken = localStorage.getItem("token");
      const url = editingId
        ? `${API_BASE}/api/appointments/${editingId}`
        : `${API_BASE}/api/appointments`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save appointment");
      }

      await fetchAppointments();
      closeModal();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const currentToken = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/api/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (!response.ok) throw new Error("Failed to delete appointment");

      await fetchAppointments();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(appointment) {
    setFormData({
      patientName: appointment.patientName || "",
      patientEmail: appointment.patientEmail || "",
      doctorName: appointment.doctorName || "",
      date: appointment.date || "",
      time: appointment.time || "",
      status: appointment.status || "Pending",
      notes: appointment.notes || "",
    });
    setEditingId(appointment._id);
    setShowModal(true);
  }

  async function updateStatus(id, newStatus) {
    try {
      const currentToken = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      await fetchAppointments();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }



  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundImage: medicalToolsPattern, backgroundAttachment: "fixed" }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <h1 className="text-2xl font-bold text-slate-900">Manage Appointments</h1>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by patient name, email, doctor, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          {["all", "Pending", "Confirmed", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === status
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {status === "all" ? "All Appointments" : status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">No appointments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment._id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm">
                          <div className="font-semibold text-slate-900">{appointment.patientName}</div>
                          <div className="text-xs text-slate-500">{appointment.patientEmail}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{appointment.doctorName}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {appointment.date} at {appointment.time}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(appointment.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <select
                            value={appointment.status}
                            onChange={(e) => updateStatus(appointment._id, e.target.value)}
                            className="px-2 py-1 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleEdit(appointment)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(appointment._id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Edit Appointment</h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="patientName"
                  placeholder="Patient Name"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="patientEmail"
                  placeholder="Patient Email"
                  value={formData.patientEmail}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <input
                type="text"
                name="doctorName"
                placeholder="Doctor Name"
                value={formData.doctorName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
                >
                  Update Appointment
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
