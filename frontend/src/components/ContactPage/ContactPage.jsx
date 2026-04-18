import { Mail, MapPin, PhoneCall } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="glass-card p-8 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-teal-700">Contact Us</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
            Let’s shape the final healthcare workflow together
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            As we keep building, you can give me anything still missing such as exact departments,
            staff workflow rules, real hospital contact details, or deployment credentials.
          </p>

          <div className="mt-8 space-y-4 text-sm text-slate-600">
            <div className="flex gap-3 rounded-3xl bg-slate-50 p-4">
              <MapPin className="mt-0.5 h-5 w-5 text-teal-700" />
              <span>Chennai, Tamil Nadu, India</span>
            </div>
            <div className="flex gap-3 rounded-3xl bg-slate-50 p-4">
              <PhoneCall className="mt-0.5 h-5 w-5 text-teal-700" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex gap-3 rounded-3xl bg-slate-50 p-4">
              <Mail className="mt-0.5 h-5 w-5 text-teal-700" />
              <span>support@medicarehealth.in</span>
            </div>
          </div>
        </article>

        <article className="glass-card p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Project input form</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Send these details when ready and I’ll wire them into the real backend logic.
          </p>
          <div className="mt-6 grid gap-4">
            {[
              "MongoDB URI or local MongoDB confirmation",
              "JWT secret for secure authentication",
              "Final department list",
              "Role permissions for admin, doctor, staff, and patient",
              "Any real logo, hospital address, or contact numbers",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
