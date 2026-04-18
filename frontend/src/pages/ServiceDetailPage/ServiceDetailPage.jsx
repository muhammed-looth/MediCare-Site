import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CircleCheckBig, ShieldCheck } from "lucide-react";
import { getServiceById } from "../../lib/api";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    getServiceById(id).then((item) => setService(item || null));
  }, [id]);

  if (!service) {
    return (
      <section className="py-16">
        <div className="section-shell">
          <div className="glass-card p-10 text-center text-slate-500">Loading service details...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="section-shell">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <article className="glass-card overflow-hidden">
            <div className="bg-linear-to-br from-emerald-100 via-white to-amber-50 p-8">
              <img src={service.imageUrl} alt={service.name} className="h-80 w-full rounded-[30px] object-cover" />
            </div>
            <div className="p-8">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal-700">Healthcare Service</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">{service.name}</h1>
              <p className="mt-4 text-base leading-8 text-slate-600">{service.about}</p>
            </div>
          </article>

          <article className="glass-card p-8 sm:p-10">
            <div className="rounded-[28px] border border-teal-100 bg-teal-50 p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Service Pricing</div>
              <div className="mt-3 text-4xl font-black text-slate-900">₹{service.price}</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Final pricing can vary by diagnostics, specialist review, and add-on tests once the backend is connected.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {[
                "Role-based scheduling support for admin, staff, and patient flows",
                "Secure booking, rescheduling, and cancellation workflow ready",
                "Designed to connect with departments, doctors, and MongoDB records",
              ].map((point) => (
                <div key={point} className="flex gap-3 rounded-3xl border border-slate-200 bg-white p-4">
                  <CircleCheckBig className="mt-0.5 h-5 w-5 text-teal-700" />
                  <span className="text-sm leading-7 text-slate-600">{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] bg-slate-950 p-6 text-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-amber-300" />
                <h2 className="text-xl font-bold">Deployment-ready direction</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                This page is ready to consume real service content from Express + MongoDB once we finish the backend APIs.
              </p>
            </div>

            <Link
              to="/appointments"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
            >
              Continue to booking
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
