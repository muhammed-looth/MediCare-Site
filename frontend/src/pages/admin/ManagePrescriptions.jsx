import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { Plus, Edit, Trash2, ArrowLeft, X, Search, FileText } from "lucide-react";

export default function ManagePrescriptions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    date: new Date().toISOString().split("T")[0],
    diagnosis: "",
    notes: "",
  });

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    const filtered = prescriptions.filter((rx) => {
      const matchesSearch =
        rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.date.includes(searchQuery);
      return matchesSearch;
    });
    setFilteredPrescriptions(filtered);
  }, [searchQuery, prescriptions]);

  async function fetchPrescriptions() {
    try {
      setLoading(true);
      const currentToken = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/api/prescriptions`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      const data = await response.json();
      setPrescriptions(data.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load prescriptions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleMedicationChange(index, field, value) {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  }

  function addMedicationField() {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  }

  function removeMedicationField(index) {
    setMedications(medications.filter((_, i) => i !== index));
  }

  function resetForm() {
    setFormData({
      patientName: "",
      doctorName: "",
      date: new Date().toISOString().split("T")[0],
      diagnosis: "",
      notes: "",
    });
    setMedications([]);
    setEditingId(null);
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (medications.length === 0) {
        setError("Add at least one medication");
        return;
      }

      const currentToken = localStorage.getItem("token");
      const url = editingId
        ? `${API_BASE}/api/prescriptions/${editingId}`
        : `${API_BASE}/api/prescriptions`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          ...formData,
          medications,
          patientName: formData.patientName,
          doctorName: formData.doctorName || user?.name || "Dr. Unknown",
        }),
      });

      if (!response.ok) throw new Error("Failed to save prescription");

      await fetchPrescriptions();
      closeModal();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this prescription?")) return;

    try {
      const currentToken = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/prescriptions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (!response.ok) throw new Error("Failed to delete prescription");

      await fetchPrescriptions();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(prescription) {
    setFormData({
      patientName: prescription.patientName || "",
      doctorName: prescription.doctorName || "",
      date: prescription.date || "",
      diagnosis: prescription.diagnosis || "",
      notes: prescription.notes || "",
    });
    setMedications(prescription.medications || []);
    setEditingId(prescription._id);
    setShowModal(true);
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
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <FileText className="h-8 w-8 text-teal-600" />
                Manage Prescriptions
              </h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              <Plus className="h-4 w-4" />
              New Prescription
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name, doctor, or date..."
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
            {filteredPrescriptions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  {searchQuery ? "No prescriptions found." : "No prescriptions yet. Create one to get started!"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Diagnosis</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Medications</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrescriptions.map((rx) => (
                      <tr key={rx._id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{rx.patientName}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{rx.doctorName}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{rx.date}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{rx.diagnosis}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {rx.medications?.length || 0} meds
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              rx.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : rx.status === "Completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {rx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleEdit(rx)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(rx._id)}
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Prescription" : "New Prescription"}
              </h2>
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
                  type="text"
                  name="doctorName"
                  placeholder="Doctor Name"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <textarea
                name="diagnosis"
                placeholder="Diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />

              {/* Medications */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Medications</h3>
                  <button
                    type="button"
                    onClick={addMedicationField}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Add Medication
                  </button>
                </div>

                {medications.length > 0 ? (
                  <div className="space-y-4">
                    {medications.map((med, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold text-slate-900">Medication {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeMedicationField(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Medicine Name"
                            value={med.name}
                            onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Dosage (e.g., 500mg)"
                            value={med.dosage}
                            onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Frequency (e.g., Twice daily)"
                            value={med.frequency}
                            onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g., 5 days)"
                            value={med.duration}
                            onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Special Instructions (optional)"
                          value={med.instructions}
                          onChange={(e) => handleMedicationChange(index, "instructions", e.target.value)}
                          className="w-full mt-3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-8 border border-dashed border-slate-300 rounded-lg">
                    No medications added. Click "Add Medication" to add one.
                  </p>
                )}
              </div>

              <textarea
                name="notes"
                placeholder="Additional Notes (optional)"
                value={formData.notes}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
                >
                  {editingId ? "Update Prescription" : "Create Prescription"}
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
