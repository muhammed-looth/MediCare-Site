import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { getServices } from "../../lib/api";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  
  useEffect(() => {
    getServices().then((items) => setServices(Array.isArray(items) ? items : []));
  }, []);
  
  return (
    <div className="min-h-screen" style={{ backgroundImage: medicalToolsPattern, backgroundAttachment: "fixed"
    }}>
    <section className="py-12 sm:py-16">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-teal-700">Clinical Services</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
            Care packages shaped for outpatient and specialty workflows
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            These service cards are ready to connect with real backend records, pricing, slots,
            and booking rules.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {services.map((service, index) => (
            <article
              key={service._id}
              className={`overflow-hidden rounded-[30px] border ${
                index % 2 === 0 ? "border-teal-100" : "border-amber-100"
              } bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)]`}
            >
              <div className="grid gap-0 md:grid-cols-[0.85fr_1.15fr]">
                <div className="bg-linear-to-br from-teal-100 via-white to-emerald-50 p-6">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="h-full min-h-64 w-full rounded-[24px] object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                    <Sparkles className="h-4 w-4" />
                    {service.availability}
                  </div>
                  <h2 className="mt-4 text-2xl font-black text-slate-900">{service.name}</h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">{service.shortDescription}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-500">Starting price</div>
                      <div className="text-3xl font-black text-slate-900">₹{service.price}</div>
                    </div>
                    <Link
                      to={`/services/${service._id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                    >
                      View service
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
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
