import { Link } from "react-router-dom";
import { HeartPulse, MapPin, Phone, Mail } from "lucide-react";

const links = [
  { label: "Home", to: "/" },
  { label: "Doctors", to: "/doctors" },
  { label: "Services", to: "/services" },
  { label: "Appointments", to: "/appointments" },
];

export default function Footer() {
  return (
    <footer className="border-t border-teal-100 bg-slate-950 text-slate-200">
      <div className="section-shell grid gap-10 py-14 lg:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-teal-500/20 p-3 text-teal-300">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-[0.2em] text-white">MEDICARE</h2>
              <p className="text-sm text-slate-400">Patient-first healthcare platform</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            Built to support modern hospitals and clinics with appointment scheduling,
            staff coordination, doctor workflows, and secure patient journeys.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-teal-300">Quick Links</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-teal-300">Contact</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-amber-300" />
              <span>Medicare Digital Hospital Campus, Chennai, Tamil Nadu</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-amber-300" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-amber-300" />
              <span>support@medicarehealth.in</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © 2026 Medicare. Designed for scalable MERN healthcare workflows.
      </div>
    </footer>
  );
}
