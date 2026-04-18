import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, CalendarClock } from "lucide-react";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { getDoctors } from "../../lib/api";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  
  // Fetch doctors on mount and when returning to the page
  useEffect(() => {
    const fetchDoctors = () => {
      getDoctors().then((items) => setDoctors(Array.isArray(items) ? items : []));
    };
    
    fetchDoctors();
    
    // Refetch when window regains focus (user returns to tab)
    window.addEventListener("focus", fetchDoctors);
    
    return () => {
      window.removeEventListener("focus", fetchDoctors);
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return doctors;
    return doctors.filter((doctor) =>
      [
        doctor.name,
        doctor.specialization,
        typeof doctor.department === "object" ? doctor.department?.name : doctor.department,
        doctor.location,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [doctors, query]);

  return (
    <div className="min-h-screen" style={{ backgroundImage: medicalToolsPattern, backgroundAttachment: "fixed"
    }}>
    <section className="py-12 sm:py-16">
      <div className="section-shell">
        <div className="glass-card overflow-hidden p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-teal-700">Medical Team</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                Find specialists your patients can trust
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Browse doctors by specialty, compare consultation fees, and review available schedules.
              </p>
            </div>
            <label className="flex w-full max-w-md items-center gap-3 rounded-full border border-teal-100 bg-white px-5 py-4 shadow-sm focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-500 transition-all">
              <Search className="h-5 w-5 text-teal-700" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, department, or specialty"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((doctor) => (
            <article
              key={doctor._id}
              className="group overflow-hidden rounded-[30px] border border-teal-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
            >
              <div className="relative bg-linear-to-br from-teal-100 via-emerald-50 to-white p-6">
                <span className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-bold text-teal-700 shadow-sm">
                  {doctor.availability}
                </span>
                <div className="overflow-hidden rounded-[28px] mx-auto h-56 w-56">
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="h-full w-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                  {typeof doctor.department === "object" ? doctor.department?.name : doctor.department || "General"}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{doctor.name}</h2>
                <p className="mt-2 text-base text-slate-600">{doctor.specialization}</p>
                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-slate-400">Fee</div>
                    <div className="mt-1 font-bold text-slate-900">₹{doctor.fee}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-slate-400">Rating</div>
                    <div className="mt-1 flex items-center gap-1 font-bold text-slate-900">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {doctor.rating}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-slate-400">Experience</div>
                    <div className="mt-1 font-bold text-slate-900">{doctor.experience}</div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <CalendarClock className="h-4 w-4 text-teal-700" />
                    {Object.keys(doctor.schedule || {}).length} schedule days
                  </span>
                  <Link
                    to={`/doctors/${doctor._id}`}
                    className="rounded-full bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
