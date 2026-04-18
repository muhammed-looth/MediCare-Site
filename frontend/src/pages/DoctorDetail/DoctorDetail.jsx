import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, BadgeIndianRupee, Award, Star } from "lucide-react";
import { getDoctorById } from "../../lib/api";

export default function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching doctor with ID:", id);
        const item = await getDoctorById(id);
        console.log("Fetched doctor data:", item);
        if (!item) {
          console.log("No doctor data returned");
          setError("Doctor not found");
          setDoctor(null);
        } else {
          console.log("Setting doctor state:", item.name);
          setDoctor(item);
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to load doctor details");
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [id]);

  const scheduleEntries = useMemo(() => Object.entries(doctor?.schedule || {}), [doctor]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mx-auto mb-6"></div>
          <p className="text-xl text-slate-600 font-semibold">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    console.log("Rendering error state. Error:", error, "Doctor:", doctor);
    return (
      <div className="py-16 sm:py-20">
        <div className="section-shell">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to doctors
          </Link>
          <div className="w-full bg-white rounded-3xl shadow-lg p-10 border-2 border-red-200">
            <div className="text-center">
              <div className="text-red-100 flex justify-center mb-4">
                <div className="bg-red-50 border-2 border-red-300 rounded-full p-4">
                  <span className="text-4xl text-red-600">⚠</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Unable to Load Doctor</h2>
              <p className="text-slate-600 mb-6 text-base">{error || "Doctor not found"}</p>
              <Link
                to="/doctors"
                className="inline-block mt-4 px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 font-medium transition"
              >
                Return to Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="section-shell">
        <Link to="/doctors" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
          <ArrowLeft className="h-4 w-4" />
          Back to doctors
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="glass-card overflow-hidden">
            <div className="bg-linear-to-br from-teal-100 via-emerald-50 to-white p-8">
              <img
                src={doctor.imageUrl || "/placeholder-doctor.jpg"}
                alt={doctor.name}
                className="mx-auto h-80 w-full max-w-sm rounded-[32px] object-cover object-top"
                onError={(e) => {
                  e.target.src = "/placeholder-doctor.jpg";
                }}
              />
            </div>
            <div className="space-y-5 p-8">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal-700">
                  {typeof doctor.department === "object" ? doctor.department?.name : doctor.department || "General"}
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">{doctor.name || "Doctor"}</h1>
                <p className="mt-2 text-lg text-slate-600">{doctor.specialization || "Specialist"}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <BadgeIndianRupee className="h-4 w-4 text-teal-700" />
                    Consultation Fee
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">₹{doctor.fee || "—"}</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <Star className="h-4 w-4 text-amber-500" />
                    Patient Rating
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{doctor.rating || "—"} / 5</div>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                {doctor.qualifications && (
                  <p className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-teal-700" />
                    {doctor.qualifications}
                  </p>
                )}
                {doctor.location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-700" />
                    {doctor.location}
                  </p>
                )}
                {doctor.experience && (
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-teal-700" />
                    {doctor.experience} of experience
                  </p>
                )}
              </div>
            </div>
          </article>

          <article className="glass-card p-8 sm:p-10">
            <h2 className="text-3xl font-bold text-slate-900">About the doctor</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {doctor.about || "No additional information available."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5">
                <div className="text-sm text-slate-500">Patients served</div>
                <div className="mt-2 text-2xl font-black text-slate-900">{doctor.patients || "—"}</div>
              </div>
              <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5">
                <div className="text-sm text-slate-500">Success rate</div>
                <div className="mt-2 text-2xl font-black text-slate-900">{doctor.success || "—"}</div>
              </div>
              <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5">
                <div className="text-sm text-slate-500">Current status</div>
                <div className="mt-2 text-2xl font-black text-slate-900">{doctor.availability || "Available"}</div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-bold text-slate-900">Available slots</h3>
              {scheduleEntries.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {scheduleEntries.map(([date, slots]) => (
                    <div key={date} className="rounded-[26px] border border-slate-200 bg-white p-5">
                      <div className="text-sm font-bold uppercase tracking-[0.25em] text-teal-700">{date}</div>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {Array.isArray(slots) && slots.length > 0 ? (
                          slots.map((slot) => (
                            <span
                              key={`${date}-${slot}`}
                              className="rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800"
                            >
                              {slot}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No slots available</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-slate-500 text-center p-6 bg-slate-50 rounded-lg">
                  No schedule available
                </p>
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/appointments"
                className="rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                Proceed to booking
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Contact support
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
