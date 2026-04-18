import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { Plus, Edit, Trash2, ArrowLeft, X, Search, Eye, Heart } from "lucide-react";

export default function ManagePatients() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [healthStatusFilter, setHealthStatusFilter] = useState("All");
  const [modalTab, setModalTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    address: "",
    profilePhoto: "",
    height: "",
    weight: "",
    bmi: "",
    healthStatus: "Good",
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
    healthReports: [],
    diseaseRecords: [],
    prescriptions: [],
  });
  const [newHealthReport, setNewHealthReport] = useState({
    reportType: "Blood Test",
    findings: "",
    doctorName: "",
    status: "Normal",
    reportUrl: "",
  });
  const [newDiseaseRecord, setNewDiseaseRecord] = useState({
    diseaseName: "",
    severity: "Mild",
    description: "",
    treatmentStatus: "Active",
    doctorName: "",
  });
  const [newPrescription, setNewPrescription] = useState({
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    doctorName: "",
    notes: "",
  });

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    // Filter patients based on search query and health status
    const filtered = patients.filter(
      (patient) =>
        (patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.phone.includes(searchQuery) ||
          patient.bloodGroup.includes(searchQuery.toUpperCase())) &&
        (healthStatusFilter === "All" || patient.healthStatus === healthStatusFilter)
    );
    setFilteredPatients(filtered);
  }, [searchQuery, healthStatusFilter, patients]);

  async function fetchPatients() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/patients?t=${Date.now()}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        },
      });
      const data = await response.json();
      setPatients(data.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load patients");
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
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      bloodGroup: "",
      address: "",
      profilePhoto: "",
      height: "",
      weight: "",
      bmi: "",
      healthStatus: "Good",
      medicalHistory: "",
      allergies: "",
      currentMedications: "",
      healthReports: [],
      diseaseRecords: [],
      prescriptions: [],
    });
    setNewHealthReport({
      reportType: "Blood Test",
      findings: "",
      doctorName: "",
      status: "Normal",
      reportUrl: "",
    });
    setNewDiseaseRecord({
      diseaseName: "",
      severity: "Mild",
      description: "",
      treatmentStatus: "Active",
      doctorName: "",
    });
    setNewPrescription({
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      doctorName: "",
      notes: "",
    });
    setModalTab("basic");
    setEditingId(null);
  }

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
      const url = editingId
        ? `${API_BASE}/api/patients/${editingId}`
        : `${API_BASE}/api/patients`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          bmi: formData.bmi ? parseFloat(formData.bmi) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save patient");
      }

      await fetchPatients();
      closeModal();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      const response = await fetch(`${API_BASE}/api/patients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete patient");

      await fetchPatients();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(patient) {
    setFormData({
      name: patient.name || "",
      email: patient.email || "",
      phone: patient.phone || "",
      age: patient.age || "",
      gender: patient.gender || "",
      bloodGroup: patient.bloodGroup || "",
      address: patient.address || "",
      profilePhoto: patient.profilePhoto || "",
      height: patient.height || "",
      weight: patient.weight || "",
      bmi: patient.bmi || "",
      healthStatus: patient.healthStatus || "Good",
      medicalHistory: patient.medicalHistory || "",
      allergies: patient.allergies || "",
      currentMedications: patient.currentMedications || "",
      healthReports: patient.healthReports || [],
      diseaseRecords: patient.diseaseRecords || [],
      prescriptions: patient.prescriptions || [],
    });
    setEditingId(patient._id);
    setShowModal(true);
  }

  function addHealthReport() {
    if (!newHealthReport.reportType) return;
    setFormData((prev) => ({
      ...prev,
      healthReports: [...prev.healthReports, { ...newHealthReport, date: new Date().toISOString() }],
    }));
    setNewHealthReport({
      reportType: "Blood Test",
      findings: "",
      doctorName: "",
      status: "Normal",
      reportUrl: "",
    });
  }

  function removeHealthReport(index) {
    setFormData((prev) => ({
      ...prev,
      healthReports: prev.healthReports.filter((_, i) => i !== index),
    }));
  }

  function addDiseaseRecord() {
    if (!newDiseaseRecord.diseaseName) return;
    setFormData((prev) => ({
      ...prev,
      diseaseRecords: [...prev.diseaseRecords, { ...newDiseaseRecord, date: new Date().toISOString() }],
    }));
    setNewDiseaseRecord({
      diseaseName: "",
      severity: "Mild",
      description: "",
      treatmentStatus: "Active",
      doctorName: "",
    });
  }

  function removeDiseaseRecord(index) {
    setFormData((prev) => ({
      ...prev,
      diseaseRecords: prev.diseaseRecords.filter((_, i) => i !== index),
    }));
  }

  function addPrescription() {
    if (!newPrescription.medicineName || !newPrescription.dosage) return;
    setFormData((prev) => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { ...newPrescription, date: new Date().toISOString() }],
    }));
    setNewPrescription({
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      doctorName: "",
      notes: "",
    });
  }

  function removePrescription(index) {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index),
    }));
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
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Manage Patients</h1>
                <p className="text-sm text-slate-500">Manage patient records, health reports, and medical history</p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              <Plus className="h-4 w-4" />
              Add Patient
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or blood group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
            <select
              value={healthStatusFilter}
              onChange={(e) => setHealthStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            >
              <option value="All">All Health Status</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Critical">Critical</option>
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  {searchQuery || healthStatusFilter !== "All"
                    ? "No patients found matching your search."
                    : "No patients found. Add one to get started!"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Blood Group</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Health Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Reports</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient._id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{patient.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{patient.email}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{patient.phone}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{patient.age || "—"}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                            {patient.bloodGroup || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              patient.healthStatus === "Good"
                                ? "bg-green-100 text-green-700"
                                : patient.healthStatus === "Fair"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {patient.healthStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="text-slate-600">
                            {(patient.healthReports?.length || 0) +
                              (patient.diseaseRecords?.length || 0) +
                              (patient.prescriptions?.length || 0)}{" "}
                            reports
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleEdit(patient)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(patient._id)}
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
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Patient" : "Add New Patient"}
              </h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50">
              {["basic", "health", "disease", "prescription"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  className={`py-3 px-6 font-semibold transition ${
                    modalTab === tab
                      ? "border-b-2 border-teal-600 text-teal-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab === "basic" && "Basic Info"}
                  {tab === "health" && "Health Checks"}
                  {tab === "disease" && "Diseases"}
                  {tab === "prescription" && "Prescriptions"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* BASIC INFO TAB */}
              {modalTab === "basic" && (
                <div className="space-y-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="age"
                      placeholder="Age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />

                  <input
                    type="text"
                    name="profilePhoto"
                    placeholder="Profile Photo URL"
                    value={formData.profilePhoto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="height"
                      placeholder="Height (cm)"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="weight"
                      placeholder="Weight (kg)"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="bmi"
                      placeholder="BMI"
                      value={formData.bmi}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <select
                    name="healthStatus"
                    value={formData.healthStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="Good">Health Status - Good</option>
                    <option value="Fair">Health Status - Fair</option>
                    <option value="Critical">Health Status - Critical</option>
                  </select>

                  <textarea
                    name="medicalHistory"
                    placeholder="Medical History"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />

                  <textarea
                    name="allergies"
                    placeholder="Allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />

                  <textarea
                    name="currentMedications"
                    placeholder="Current Medications"
                    value={formData.currentMedications}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* HEALTH REPORTS TAB */}
              {modalTab === "health" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Add Health Report</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                    <select
                      value={newHealthReport.reportType}
                      onChange={(e) => setNewHealthReport({ ...newHealthReport, reportType: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Blood Test">Blood Test</option>
                      <option value="X-Ray">X-Ray</option>
                      <option value="Scan">Scan</option>
                      <option value="ECG">ECG</option>
                      <option value="Ultrasound">Ultrasound</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Doctor Name"
                      value={newHealthReport.doctorName}
                      onChange={(e) => setNewHealthReport({ ...newHealthReport, doctorName: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <textarea
                    placeholder="Report Findings"
                    value={newHealthReport.findings}
                    onChange={(e) => setNewHealthReport({ ...newHealthReport, findings: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Report URL"
                      value={newHealthReport.reportUrl}
                      onChange={(e) => setNewHealthReport({ ...newHealthReport, reportUrl: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    />
                    <select
                      value={newHealthReport.status}
                      onChange={(e) => setNewHealthReport({ ...newHealthReport, status: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="Normal">Status - Normal</option>
                      <option value="Abnormal">Status - Abnormal</option>
                      <option value="Pending">Status - Pending</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={addHealthReport}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Add Health Report
                  </button>

                  {formData.healthReports.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold text-slate-900">Reports List</h4>
                      {formData.healthReports.map((report, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{report.reportType}</p>
                            <p className="text-sm text-slate-600">{report.findings} — {report.status}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeHealthReport(index)}
                            className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* DISEASE RECORDS TAB */}
              {modalTab === "disease" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Add Disease Record</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Disease Name"
                      value={newDiseaseRecord.diseaseName}
                      onChange={(e) => setNewDiseaseRecord({ ...newDiseaseRecord, diseaseName: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                      required
                    />
                    <select
                      value={newDiseaseRecord.severity}
                      onChange={(e) => setNewDiseaseRecord({ ...newDiseaseRecord, severity: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="Mild">Severity - Mild</option>
                      <option value="Moderate">Severity - Moderate</option>
                      <option value="Severe">Severity - Severe</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Doctor Name"
                      value={newDiseaseRecord.doctorName}
                      onChange={(e) => setNewDiseaseRecord({ ...newDiseaseRecord, doctorName: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    />
                    <select
                      value={newDiseaseRecord.treatmentStatus}
                      onChange={(e) => setNewDiseaseRecord({ ...newDiseaseRecord, treatmentStatus: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="Active">Status - Active</option>
                      <option value="Recovered">Status - Recovered</option>
                      <option value="Chronic">Status - Chronic</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Description"
                    value={newDiseaseRecord.description}
                    onChange={(e) => setNewDiseaseRecord({ ...newDiseaseRecord, description: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addDiseaseRecord}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Add Disease Record
                  </button>

                  {formData.diseaseRecords.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold text-slate-900">Disease Records</h4>
                      {formData.diseaseRecords.map((disease, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{disease.diseaseName}</p>
                            <p className="text-sm text-slate-600">{disease.severity} • {disease.treatmentStatus}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDiseaseRecord(index)}
                            className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PRESCRIPTIONS TAB */}
              {modalTab === "prescription" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Add Prescription</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      value={newPrescription.medicineName}
                      onChange={(e) => setNewPrescription({ ...newPrescription, medicineName: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 500mg)"
                      value={newPrescription.dosage}
                      onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Frequency (e.g., Twice daily)"
                      value={newPrescription.frequency}
                      onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 7 days)"
                      value={newPrescription.duration}
                      onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Doctor Name"
                      value={newPrescription.doctorName}
                      onChange={(e) => setNewPrescription({ ...newPrescription, doctorName: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <textarea
                    placeholder="Notes (optional)"
                    value={newPrescription.notes}
                    onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addPrescription}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Add Prescription
                  </button>

                  {formData.prescriptions.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold text-slate-900">Prescriptions</h4>
                      {formData.prescriptions.map((prescription, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{prescription.medicineName}</p>
                            <p className="text-sm text-slate-600">{prescription.dosage} • {prescription.frequency} • {prescription.duration}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePrescription(index)}
                            className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
                >
                  {editingId ? "Update Patient" : "Add Patient"}
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
