import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { ArrowLeft, Mail, Phone, MapPin, Award, Briefcase, User, DollarSign } from "lucide-react";

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctorDetails();
    
    // Refetch when window regains focus (user returns to tab)
    window.addEventListener("focus", fetchDoctorDetails);
    
    return () => {
      window.removeEventListener("focus", fetchDoctorDetails);
    };
  }, [id]);

  async function fetchDoctorDetails() {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching doctor with ID:", id);
      
      if (!id) {
        setError("No doctor ID provided");
        return;
      }

      const response = await fetch(`${API_BASE}/api/doctors/${id}?t=${Date.now()}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store',
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch doctor details");
      }

      const data = await response.json();
      console.log("Doctor data received:", data);
      
      setDoctor(data.data || data || null);
      if (!data.data && !data) {
        setError("No doctor data received");
      }
    } catch (err) {
      console.error("Error fetching doctor:", err);
      setError(err.message || "Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundImage: medicalToolsPattern }}>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600 font-semibold">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen" style={{ backgroundImage: medicalToolsPattern }}>
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate("/admin/doctors")}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Doctors
            </button>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="text-red-100 flex justify-center mb-4">
                <div className="bg-red-50 border-2 border-red-300 rounded-full p-4">
                  <span className="text-4xl text-red-600">⚠</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Unable to Load Doctor</h2>
              <p className="text-slate-600 mb-4">{error || "Doctor not found"}</p>
              <button
                onClick={() => navigate("/admin/doctors")}
                className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition"
              >
                Return to Doctors List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundImage: medicalToolsPattern, backgroundAttachment: "fixed" }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/admin/doctors")}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Doctors
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Profile Card */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
          {/* Banner Section */}
          <div className="h-32 bg-gradient-to-r from-teal-600 to-teal-800"></div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Profile Header with Photo */}
            <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-8">
              {/* Photo */}
              <div className="flex-shrink-0">
                {doctor.imageUrl ? (
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="h-40 w-40 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="h-40 w-40 rounded-full border-4 border-white shadow-lg bg-teal-100 flex items-center justify-center">
                    <User className="h-20 w-20 text-teal-600" />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-grow pt-4">
                <h1 className="text-3xl font-bold text-slate-900">{doctor.name}</h1>
                <p className="text-lg text-teal-600 font-semibold mt-1">{doctor.specialization}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{doctor.phone}</span>
                  </div>
                  {doctor.location && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                {/* Fee */}
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">₹{doctor.fee}</p>
                  <p className="text-xs text-orange-700">Consultation Fee</p>
                </div>

                {/* Rating */}
                {doctor.rating && (
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-2xl font-bold text-amber-600">{doctor.rating}</p>
                    <p className="text-xs text-amber-700">Rating</p>
                  </div>
                )}

                {/* Patients */}
                {doctor.patients && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-2xl font-bold text-blue-600">{doctor.patients}</p>
                    <p className="text-xs text-blue-700">Patients</p>
                  </div>
                )}
              </div>
            </div>

            {/* About Section */}
            {doctor.about && (
              <div className="mb-8 pb-8 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900 mb-3">About</h2>
                <p className="text-slate-600 leading-relaxed">{doctor.about}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                {/* Qualifications */}
                {doctor.qualifications && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-5 w-5 text-teal-600" />
                      <h3 className="text-lg font-semibold text-slate-900">Qualifications</h3>
                    </div>
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                      <p className="text-slate-700">{doctor.qualifications}</p>
                    </div>
                  </div>
                )}

                {/* Experience */}
                {doctor.experience && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">Experience</h3>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-slate-700">{doctor.experience}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div>
                {/* Department */}
                {doctor.department && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Department</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-slate-700 font-semibold">{doctor.department.name}</p>
                      {doctor.department.description && (
                        <p className="text-slate-600 text-sm mt-2">{doctor.department.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Success Rate */}
                {doctor.success && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Success Rate</h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-2xl font-bold text-purple-600">{doctor.success}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule */}
            {doctor.schedule && Object.keys(doctor.schedule).length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Available Schedule</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(doctor.schedule).map(([date, slots]) => (
                    <div key={date} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">{date}</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(slots) && slots.map((slot) => (
                          <span
                            key={`${date}-${slot}`}
                            className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
