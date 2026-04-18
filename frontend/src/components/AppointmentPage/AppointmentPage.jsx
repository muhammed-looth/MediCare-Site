import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, Clock3, ShieldCheck, RotateCw } from "lucide-react";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const initialForm = {
  patientName: "",
  mobile: "",
  department: "",
  doctorId: "",
  date: "",
  time: "",
  notes: "",
};

export default function AppointmentsPage() {
  const { user } = useAuth(); // Get user from AuthContext
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false); // New state for submit loading

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // Use direct fetch with cache-busting to ensure we get the absolute latest schedule data
      const res = await fetch(`${API_BASE}/api/doctors?t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      const list = data.data || data.doctors || data || [];
      console.log("Doctors loaded:", list);
      setDoctors(Array.isArray(list) ? list : []);
      setError(null);
    } catch (err) {
      console.error("Network Error:", err);
      setError(
        err.message === "Failed to fetch" 
          ? `Network Error: Cannot reach ${API_BASE}/api/doctors. Check firewall and ensure your device is on the same WiFi.` 
          : "Failed to load doctors"
      );
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();

    // Refetch doctors when window regains focus (user tabs back)
    const handleFocus = () => {
      console.log("Page regained focus, refreshing doctor data...");
      fetchDoctors();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const selectedDoctor = useMemo(() => {
    if (!doctors || doctors.length === 0 || !form.doctorId) return null;
    return doctors.find((doc) => (doc._id === form.doctorId || doc.id === form.doctorId)) || null;
  }, [doctors, form.doctorId]);

  const slotOptions = useMemo(() => {
    const schedule = selectedDoctor?.schedule || {};
    const availableDates = Object.keys(schedule);
    
    if (availableDates.length === 0) return { date: "", slots: [], availableDates: [] };
    
    // Use the selected date if available, otherwise use the first available date
    // This ensures we don't show an empty slot list if a previous doctor's date was selected
    const dateToUse = (form.date && availableDates.includes(form.date)) ? form.date : availableDates[0];
    const slotsForDate = schedule[dateToUse] || [];
    
    return {
      date: dateToUse,
      slots: Array.isArray(slotsForDate) ? slotsForDate : [],
      availableDates: availableDates,
    };
  }, [form.date, selectedDoctor]);
  
  // Auto-set first available date when doctor is selected
  useEffect(() => {
    const schedule = selectedDoctor?.schedule || {};
    const dates = Object.keys(schedule);

    if (dates.length > 0) {
      // Immediately set the date to the first available if current date is invalid
      setForm(prev => ({ 
        ...prev, 
        date: (prev.date && dates.includes(prev.date)) ? prev.date : dates[0],
        time: "" 
      }));
    } else {
      setForm(prev => ({ ...prev, date: "", time: "" }));
    }
  }, [form.doctorId, selectedDoctor]); // Rerun when doctor selection OR doctor data changes

  // Reset time if date changes
  useEffect(() => {
    setForm((current) => ({ ...current, time: "" }));
  }, [form.date]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true); // Start submitting
    setError(null);

    const currentToken = localStorage.getItem("token"); // Get token from localStorage
    if (!currentToken) {
      setError("You must be logged in to book an appointment.");
      setSubmitting(false);
      return;
    }

    // Map the ID of the logged-in user to 'patientId'.
    // The backend now handles looking up the Patient profile via this User reference.
    const payload = {
      patientId: user?._id || user?.id,
      doctorId: form.doctorId, 
      date: form.date,
      time: form.time,
      patientName: form.patientName,
      mobile: form.mobile,
      department: form.department,
      notes: form.notes,
      doctorName: selectedDoctor?.name || "",
      status: "Pending",
    };

    try {
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`, // Add Authorization header
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to book appointment");

      setSubmitted(payload);
      setForm(initialForm);
      // Optionally, refetch doctors to update their schedules if a slot was consumed
      // fetchDoctors();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false); // End submitting
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundImage: medicalToolsPattern, backgroundAttachment: "fixed"
    }}>
    <section className="py-12 sm:py-16">
      <div className="section-shell">
        {loading ? (
          <div className="glass-card p-8 sm:p-10">
            <p className="text-center text-slate-500">Loading appointment form...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="glass-card p-8 sm:p-10">
            <p className="text-center text-amber-600 font-semibold">No doctors available. Please start the backend server.</p>
            {error && <p className="mt-4 text-center text-sm text-amber-700">{error}</p>}
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="glass-card p-8 sm:p-10">
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-teal-700">Appointment Desk</p>
                <button
                  type="button"
                  onClick={fetchDoctors}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition disabled:opacity-50"
                  title="Refresh doctor list and time slots"
                >
                  <RotateCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Book a patient visit
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Schedule an appointment with our healthcare professionals.
              </p>

              {error && ( // Display error message
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <p className="font-semibold">Error:</p>
                  <p>{error}</p>
                </div>
              )}

              <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
                <input
                  name="patientName"
                  value={form.patientName}
                  onChange={updateField}
                  placeholder="Patient full name"
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-teal-500 focus:scale-[1.01] transition-all"
                  required
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={updateField}
                    placeholder="Mobile number"
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-teal-500 focus:scale-[1.01] transition-all"
                    required
                  />
                  <input
                    name="department"
                    value={form.department}
                    onChange={updateField}
                    placeholder="Department"
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-teal-500 focus:scale-[1.01] transition-all"
                    required
                  />
                </div>
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={updateField}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-teal-500 focus:scale-[1.01] transition-all"
                  required
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                <div className="grid gap-5 sm:grid-cols-2">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={updateField}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-teal-500 focus:scale-[1.01] transition-all"
                    required
                  />
                  <select
                    name="time"
                    value={form.time}
                    onChange={updateField}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-teal-500 focus:scale-[1.01] transition-all"
                    required
                  >
                    <option value="">Select time slot</option>
                    {slotOptions.slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={updateField}
                  rows="5"
                  placeholder="Symptoms or notes"
                  className="rounded-3xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-teal-500 focus:scale-[1.01] transition-all"
                />
                <button
                  type="submit"
                  disabled={submitting} // Disable button while submitting
                  className="rounded-full bg-teal-700 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-teal-800 active:scale-95 shadow-lg hover:shadow-teal-700/20"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <RotateCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Save booking request"
                  )}
                </button>
              </form>
            </article>

            <article className="space-y-6">
              <div className="glass-card p-8">
                <div className="flex items-center gap-3">
                  <CalendarCheck2 className="h-6 w-6 text-teal-700" />
                  <h2 className="text-2xl font-bold text-slate-900">Workflow preview</h2>
                </div>
                <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                  <p>Admin and staff can later confirm, reschedule, or cancel these records.</p>
                  <p>Doctors will get their own dashboard for appointment visibility and schedule updates.</p>
                  <p>Patients will be able to review booking history once auth is connected.</p>
                </div>
              </div>

              <div className="glass-card p-8">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-6 w-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Full Availability</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {selectedDoctor?.schedule && Object.keys(selectedDoctor.schedule).length > 0 ? (
                    Object.entries(selectedDoctor.schedule)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([date, slots]) => (
                      <div key={date} className="rounded-2xl bg-slate-50 border border-slate-100 p-4 shadow-sm">
                        <div className="font-bold text-teal-800 flex items-center gap-2">
                          <CalendarCheck2 className="h-4 w-4" />
                          {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Array.isArray(slots) && slots.map((slot) => (
                            <span key={`${date}-${slot}`} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm border border-slate-100 hover:border-teal-400 hover:text-teal-700 transition-colors cursor-default">
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Choose a doctor to see available slots.</p>
                  )}
                </div>
              </div>

              {submitted && (
                <div className="rounded-[30px] bg-slate-950 p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-amber-300" />
                    <h2 className="text-2xl font-bold">Draft booking saved</h2>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {submitted.patientName} requested an appointment with {submitted.doctorName} on {submitted.date} at {submitted.time}.
                  </p>
                </div>
              )}
            </article>
          </div>
        )}
      </div>
    </section>
    </div>
  );
}
