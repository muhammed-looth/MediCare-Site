import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck2, Building2, ShieldCheck, UsersRound, Star } from "lucide-react";
import { departments, doctors, heroImage, highlights, services, testimonials } from "../../lib/demoData";

function HeroSection() {
  return (
    <section className="overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-teal-800">
            <ShieldCheck className="h-4 w-4" />
            MERN Healthcare Platform
          </p>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Keep the same healthcare feel, rebuild it on a stronger foundation.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            This new shell keeps your existing project’s medical branding and image style while preparing the app for
            doctors, patients, staff, secure auth, appointment scheduling, and deployment-ready MERN architecture.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-6 py-4 text-sm font-bold text-white transition hover:bg-teal-800"
            >
              Book appointment
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/doctors"
              className="rounded-full border border-slate-300 px-6 py-4 text-sm font-bold text-slate-700 transition hover:bg-white"
            >
              Browse doctors
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Specialists", value: "40+" },
              { label: "Departments", value: "12" },
              { label: "Bookings handled", value: "10k+" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[26px] border border-white/60 bg-white/80 p-5 shadow-sm">
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-12 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
          <div className="absolute -right-6 bottom-0 h-56 w-56 rounded-full bg-teal-300/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-[36px] border border-white/50 bg-white/70 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.15)] backdrop-blur">
            <img src={heroImage} alt="Healthcare team" className="h-full w-full rounded-[30px] object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="py-10 sm:py-16">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-teal-700">Platform Features</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
            Designed around the exact workflow you asked for
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[30px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <img src={item.image} alt={item.title} className="h-52 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DepartmentSection() {
  return (
    <section className="py-10 sm:py-16">
      <div className="section-shell">
        <div className="glass-card p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-teal-700">Departments</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                Data-ready categories for doctors and appointments
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((department) => (
                <div key={department} className="inline-flex items-center gap-3 rounded-full bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  <Building2 className="h-4 w-4 text-teal-700" />
                  {department}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewSection() {
  return (
    <section className="py-10 sm:py-16">
      <div className="section-shell grid gap-8 lg:grid-cols-2">
        <article className="glass-card p-8">
          <div className="flex items-center gap-3">
            <UsersRound className="h-6 w-6 text-teal-700" />
            <h2 className="text-2xl font-bold text-slate-900">Doctor preview</h2>
          </div>
          <div className="mt-6 space-y-4">
            {doctors.slice(0, 3).map((doctor) => (
              <div key={doctor._id} className="flex items-center gap-4 rounded-[24px] bg-slate-50 p-4">
                <img src={doctor.imageUrl} alt={doctor.name} className="h-18 w-18 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900">{doctor.name}</div>
                  <div className="text-sm text-slate-500">{doctor.specialization}</div>
                </div>
                <div className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-bold text-teal-700">
                  ₹{doctor.fee}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card p-8">
          <div className="flex items-center gap-3">
            <CalendarCheck2 className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-slate-900">Service preview</h2>
          </div>
          <div className="mt-6 space-y-4">
            {services.slice(0, 3).map((service) => (
              <div key={service._id} className="flex items-center gap-4 rounded-[24px] bg-slate-50 p-4">
                <img src={service.imageUrl} alt={service.name} className="h-18 w-18 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900">{service.name}</div>
                  <div className="text-sm text-slate-500">{service.shortDescription}</div>
                </div>
                <div className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900">
                  ₹{service.price}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="py-10 pb-20 sm:py-16 sm:pb-24">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-teal-700">Trust Layer</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
            A UI that already feels credible for healthcare
          </h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.id} className="rounded-[30px] bg-slate-950 p-8 text-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
              <div className="flex gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-base leading-8 text-slate-300">"{item.quote}"</p>
              <div className="mt-6">
                <div className="font-bold">{item.name}</div>
                <div className="text-sm text-slate-400">{item.role}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <DepartmentSection />
      <PreviewSection />
      <TestimonialSection />
    </>
  );
}
