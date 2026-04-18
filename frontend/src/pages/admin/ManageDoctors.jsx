import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { Plus, Edit, Trash2, ArrowLeft, X, Eye, Search, Calendar, Clock } from "lucide-react";

export default function ManageDoctors() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeSlots, setTimeSlots] = useState({});
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotTime, setNewSlotTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualifications: "",
    experience: "",
    location: "",
    fee: "",
    about: "",
    department: "",
    imageUrl: "",
    password: "", // Added password field for new account creation
  });

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchDoctorsAndDepartments();
  }, []);

  useEffect(() => {
    // Filter doctors based on search query
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.phone.includes(searchQuery)
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  async function fetchDoctorsAndDepartments() {
    try {
      setLoading(true);
      const currentToken = localStorage.getItem("token");

      const [doctorsRes, deptRes] = await Promise.all([
        fetch(`${API_BASE}/api/doctors?t=${Date.now()}`, {
          headers: { 
            Authorization: `Bearer ${currentToken}`,
            'Cache-Control': 'no-cache'
          },
        }),
        // Ensure the token is used for departments too
        fetch(`${API_BASE}/api/departments?t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${currentToken}` },
        }),
      ]);

      const doctorsData = await doctorsRes.json();
      const deptData = await deptRes.json();

      setDoctors(doctorsData.data || []);
      setDepartments(deptData.data || []);
      setError(null);
    } catch (err) {
      console.error("Network Error:", err);
      setError(
        err.message === "Failed to fetch" 
          ? `Backend unreachable at ${API_BASE}. Check your network connection and server IP.` 
          : "Failed to load doctors and departments"
      );
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
      name: "",
      email: "",
      phone: "",
      specialization: "",
      qualifications: "",
      experience: "",
      location: "",
      fee: "",
      about: "",
      department: "",
      imageUrl: "",
      password: "",
    });
    setTimeSlots({});
    setNewSlotDate("");
    setNewSlotTime("");
    setEditingId(null);
  }

  const formatTimeTo12H = (time24) => {
    if (!time24) return "";
    const [h, m] = time24.split(":");
    const hr = parseInt(h);
    const ampm = hr >= 12 ? "PM" : "AM";
    const h12 = hr % 12 || 12;
    return `${h12.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) throw new Error("No admin token found. Please login again.");

      const url = editingId
        ? `${API_BASE}/api/doctors/${editingId}`
        : `${API_BASE}/api/auth/register-doctor`; // Use registration endpoint for new doctors
      const method = editingId ? "PUT" : "POST";
      
      // Prepare the payload carefully to avoid 403 errors
      // Only include schedule in payload if it actually has data to avoid accidental wipes
      const finalSchedule = (timeSlots && Object.keys(timeSlots).length > 0) ? timeSlots : undefined;
      
      const payload = {
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        qualifications: formData.qualifications,
        experience: formData.experience,
        location: formData.location,
        fee: formData.fee !== "" ? Number(formData.fee) : 0,
        about: formData.about,
        imageUrl: formData.imageUrl,
        department: typeof formData.department === "object" ? formData.department._id : formData.department,
      };
      if (finalSchedule) payload.schedule = finalSchedule;

      // DO NOT send email or password during a PUT update to avoid 403 Forbidden
      if (!editingId) {
        payload.email = formData.email;
        payload.password = formData.password;
        payload.role = "doctor";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save doctor");
      }

      // Short delay to allow DB indexing for Map/Object types before refetching
      await new Promise(resolve => setTimeout(resolve, 600));
      
      await fetchDoctorsAndDepartments();
      closeModal();
      setError(null);
      alert(editingId ? "Doctor updated successfully!" : "Doctor added successfully!");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const currentToken = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/doctors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (!response.ok) throw new Error("Failed to delete doctor");

      await fetchDoctorsAndDepartments();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEdit(doctor) {
    try {
      setLoading(true);
      const currentToken = localStorage.getItem("token");
      
      // Fetch the full doctor details to ensure we have the complete schedule
      // The list view often omits the schedule field for performance
      const res = await fetch(`${API_BASE}/api/doctors/${doctor._id || doctor.id}?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      
      const data = await res.json();
      // Extract the doctor object from the common wrapper patterns
      const fullDoctor = data.data || data.doctor || data.doc || (data.name ? data : null);
      
      if (!fullDoctor || typeof fullDoctor !== 'object') {
        console.error("API Response structure:", data);
        throw new Error("Doctor not found in server response");
      }

      setFormData({
        name: fullDoctor.name || "",
        email: fullDoctor.email || "",
        phone: fullDoctor.phone || "",
        specialization: fullDoctor.specialization || "",
        qualifications: fullDoctor.qualifications || "",
        experience: fullDoctor.experience || "",
        location: fullDoctor.location || "",
        fee: fullDoctor.fee || "",
        about: fullDoctor.about || "",
        department: fullDoctor.department?._id || fullDoctor.department || "",
        imageUrl: fullDoctor.imageUrl || "",
        password: "",
      });

      // If schedule exists and has keys, use it. Otherwise, check if we're creating new or editing
      const incomingSchedule = fullDoctor.schedule || fullDoctor.timeSlots || {};
      if (incomingSchedule && typeof incomingSchedule === 'object' && !Array.isArray(incomingSchedule)) {
        setTimeSlots({ ...incomingSchedule });
      }
      
      setEditingId(fullDoctor._id);
      setShowModal(true);
    } catch (err) {
      setError("Failed to load doctor details for editing");
    } finally {
      setLoading(false);
    }
  }

  function addTimeSlot() {
    if (!newSlotDate || !newSlotTime) {
      alert("Please select both date and time for the slot");
      return;
    }

    setTimeSlots((prev) => {
      const updated = { ...prev };
      const formattedTime = formatTimeTo12H(newSlotTime);
      if (!updated[newSlotDate]) {
        updated[newSlotDate] = [];
      }
      // Check if slot already exists
      if (!updated[newSlotDate].includes(formattedTime)) {
        updated[newSlotDate].push(formattedTime);
        updated[newSlotDate].sort();
      }
      return updated;
    });
    setNewSlotTime("");
  }

  function removeTimeSlot(date, time) {
    setTimeSlots((prev) => {
      const updated = { ...prev };
      if (updated[date]) {
        updated[date] = updated[date].filter((slot) => slot !== time);
        if (updated[date].length === 0) {
          delete updated[date];
        }
      }
      return updated;
    });
  }

  function removeDate(date) {
    setTimeSlots((prev) => {
      const updated = { ...prev };
      delete updated[date];
      return updated;
    });
  }

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
              <h1 className="text-2xl font-bold text-slate-900">Manage Doctors</h1>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              <Plus className="h-4 w-4" />
              Add Doctor
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  {searchQuery ? "No doctors found matching your search." : "No doctors found. Add one to get started!"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Specialization</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Fee</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Appointments</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Slots</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor._id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-3">
                            {/* Profile Picture */}
                            {doctor.imageUrl ? (
                              <img
                                src={doctor.imageUrl}
                                alt={doctor.name}
                                className="h-8 w-8 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-teal-600">
                                  {doctor.name?.charAt(0).toUpperCase() || "D"}
                                </span>
                              </div>
                            )}
                            <span className="font-medium text-slate-900">{doctor.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{doctor.specialization}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {doctor.department?.name || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{doctor.experience}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">₹{doctor.fee || "—"}</td>
                        <td className="px-6 py-4 text-sm">
                          <button 
                            onClick={() => navigate(`/admin/appointments?doctor=${doctor.name}`)}
                            className="text-teal-600 font-bold hover:underline">
                            View List
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            doctor.schedule && Object.keys(doctor.schedule).length > 0 ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {doctor.schedule ? `${Object.keys(doctor.schedule).length} Days` : "No Data"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/doctors/${doctor._id}`)}
                            className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(doctor)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor._id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                            title="Delete"
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Doctor" : "Add New Doctor"}
              </h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {!editingId && (
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="password"
                    name="password"
                    placeholder="Initial Password for Doctor"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required={!editingId}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="qualifications"
                  placeholder="Qualifications (e.g., MBBS, MD)"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="experience"
                  placeholder="Experience (e.g., 10 years)"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="number"
                  name="fee"
                  placeholder="Consultation Fee"
                  value={formData.fee}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />

              <input
                type="text"
                name="imageUrl"
                placeholder="Profile Picture URL"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />

              {formData.imageUrl && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Preview:</p>
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-20 w-20 rounded-lg object-cover border border-slate-300"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <textarea
                name="about"
                placeholder="About / Bio"
                value={formData.about}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />

              {/* Time Slots Management */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  Available Time Slots
                </h3>
                
                {/* Add New Slot */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">Add New Slot</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="date"
                      value={newSlotDate}
                      onChange={(e) => setNewSlotDate(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="time"
                      value={newSlotTime}
                      onChange={(e) => setNewSlotTime(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={addTimeSlot}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Slot
                    </button>
                  </div>
                </div>

                {/* List of Time Slots */}
                {Object.keys(timeSlots).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(timeSlots)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([date, slots]) => (
                        <div key={date} className="border border-slate-200 rounded-lg p-3 bg-white">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-teal-600" />
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeDate(date)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Remove Date
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(slots) &&
                              slots.map((time) => (
                                <div
                                  key={`${date}-${time}`}
                                  className="flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  <Clock className="h-3 w-3" />
                                  {time}
                                  <button
                                    type="button"
                                    onClick={() => removeTimeSlot(date, time)}
                                    className="ml-1 hover:text-teal-900 font-bold"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4 border border-dashed border-slate-300 rounded-lg">
                    No time slots added yet. Add dates and times above.
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
                >
                  {editingId ? "Update Doctor" : "Add Doctor"}
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
