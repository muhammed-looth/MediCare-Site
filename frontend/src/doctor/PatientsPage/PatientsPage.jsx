import React, { useEffect, useState, useMemo } from "react";
import { Search, Plus, FileText, Pill, ChevronDown, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = "http://localhost:4000";

export default function DoctorPatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [reportForm, setReportForm] = useState({
    title: "",
    reportType: "General Checkup",
    findings: "",
    recommendations: "",
    diagnosis: "",
    status: "Pending",
    severity: "Mild",
    notes: "",
  });

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery)
    );
  }, [patients, searchQuery]);

  useEffect(() => {
    fetchPatients();
    fetchMyReports();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/reports/my-patients`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPatients(data.data || []);
      } else {
        setError(data.message || "Failed to load patients");
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Network error while loading patients");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReports = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reports/my-reports`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setReports(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const handleAddMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleRemoveMedication = (index) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmitPrescription = async () => {
    if (!selectedPatient || !medications.some((m) => m.name)) {
      alert("Please select a patient and add at least one medication");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          medications: medications.filter((m) => m.name),
          date: new Date(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Prescription created successfully!");
        setShowPrescriptionModal(false);
        setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
      } else {
        alert(data.message || "Failed to create prescription");
      }
    } catch (err) {
      console.error("Error creating prescription:", err);
      alert("Error creating prescription");
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedPatient || !reportForm.findings) {
      alert("Please select a patient and add findings");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          title: reportForm.title || `${reportForm.reportType} Report`,
          reportType: reportForm.reportType,
          findings: reportForm.findings,
          recommendations: reportForm.recommendations,
          diagnosis: reportForm.diagnosis,
          status: reportForm.status,
          severity: reportForm.severity,
          notes: reportForm.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Report created successfully!");
        setShowReportModal(false);
        setReportForm({
          title: "",
          reportType: "General Checkup",
          findings: "",
          recommendations: "",
          diagnosis: "",
          status: "Pending",
          severity: "Mild",
          notes: "",
        });
        fetchMyReports();
      } else {
        alert(data.message || "Failed to create report");
      }
    } catch (err) {
      console.error("Error creating report:", err);
      alert("Error creating report");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation Tabs */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <Link
              to="/doctor/dashboard"
              className="px-4 py-4 border-b-2 border-transparent text-slate-600 font-semibold text-sm hover:text-teal-700 hover:border-teal-600 transition"
            >
              <Calendar className="inline mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/doctor/patients"
              className="px-4 py-4 border-b-2 border-teal-600 text-teal-700 font-semibold text-sm hover:text-teal-800 transition"
            >
              <Users className="inline mr-2 h-4 w-4" />
              Patients
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Patients</h1>
          <p className="text-slate-600">Manage and interact with your patients</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Patients Grid */}
        {filteredPatients.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => (
              <div key={patient._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{patient.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{patient.email}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <span>📱 {patient.phone || "N/A"}</span>
                  </div>
                  <div className="flex gap-2 text-sm text-slate-600">
                    <span>👤 {patient.gender || "N/A"}</span>
                    <span>🎂 {patient.age ? `${patient.age} years` : "N/A"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-500 text-xs">Blood Group</p>
                    <p className="font-semibold text-slate-900">{patient.bloodGroup || "—"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-500 text-xs">Status</p>
                    <p className="font-semibold text-slate-900">{patient.healthStatus || "Good"}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setShowPrescriptionModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg font-medium transition text-sm"
                  >
                    <Pill className="h-4 w-4" />
                    Prescription
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setShowReportModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-3 rounded-lg font-medium transition text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-lg">No patients found</p>
            <p className="text-slate-400 text-sm mt-1">Start by scheduling appointments with patients</p>
          </div>
        )}

        {/* Prescription Modal */}
        {showPrescriptionModal && selectedPatient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Write Prescription</h2>
                <button onClick={() => setShowPrescriptionModal(false)} className="text-slate-500 hover:text-slate-700 text-2xl">
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-600">
                    <strong>Patient:</strong> {selectedPatient.name}
                  </p>
                  <p className="text-sm text-blue-600">
                    <strong>Age:</strong> {selectedPatient.age || "N/A"} years
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Medications</label>
                  <div className="space-y-3 mb-3">
                    {medications.map((med, idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Medicine name"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(idx, "name", e.target.value)}
                          className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Dosage"
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(idx, "dosage", e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Frequency"
                          value={med.frequency}
                          onChange={(e) => handleMedicationChange(idx, "frequency", e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Duration"
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(idx, "duration", e.target.value)}
                          className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        {medications.length > 1 && (
                          <button
                            onClick={() => handleRemoveMedication(idx)}
                            className="col-span-2 text-red-600 text-sm font-medium hover:bg-red-50 py-1 rounded"
                          >
                            Remove Medicine
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleAddMedication}
                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
                  >
                    <Plus className="h-4 w-4" /> Add Medicine
                  </button>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowPrescriptionModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPrescription}
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                  >
                    Create Prescription
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && selectedPatient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Write Report</h2>
                <button onClick={() => setShowReportModal(false)} className="text-slate-500 hover:text-slate-700 text-2xl">
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-purple-600">
                    <strong>Patient:</strong> {selectedPatient.name}
                  </p>
                  <p className="text-sm text-purple-600">
                    <strong>Age:</strong> {selectedPatient.age || "N/A"} years
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Report Title</label>
                  <input
                    type="text"
                    placeholder="Report title"
                    value={reportForm.title}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Report Type</label>
                    <select
                      value={reportForm.reportType}
                      onChange={(e) => setReportForm({ ...reportForm, reportType: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    >
                      <option>Blood Test</option>
                      <option>X-Ray</option>
                      <option>Scan</option>
                      <option>ECG</option>
                      <option>Ultrasound</option>
                      <option>General Checkup</option>
                      <option>Follow-up</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Status</label>
                    <select
                      value={reportForm.status}
                      onChange={(e) => setReportForm({ ...reportForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    >
                      <option>Pending</option>
                      <option>Normal</option>
                      <option>Abnormal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Severity</label>
                    <select
                      value={reportForm.severity}
                      onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    >
                      <option>Mild</option>
                      <option>Moderate</option>
                      <option>Severe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Diagnosis</label>
                    <input
                      type="text"
                      placeholder="Diagnosis"
                      value={reportForm.diagnosis}
                      onChange={(e) => setReportForm({ ...reportForm, diagnosis: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Findings *</label>
                  <textarea
                    placeholder="Enter detailed findings..."
                    value={reportForm.findings}
                    onChange={(e) => setReportForm({ ...reportForm, findings: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Recommendations</label>
                  <textarea
                    placeholder="Enter recommendations..."
                    value={reportForm.recommendations}
                    onChange={(e) => setReportForm({ ...reportForm, recommendations: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Notes</label>
                  <textarea
                    placeholder="Additional notes..."
                    value={reportForm.notes}
                    onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-16 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                  >
                    Create Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
