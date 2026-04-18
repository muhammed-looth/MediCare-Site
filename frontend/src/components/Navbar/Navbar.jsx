import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Stethoscope } from "lucide-react";
import logo from "../../assets/logo.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Doctors", to: "/doctors" },
  { label: "Services", to: "/services" },
  { label: "Appointments", to: "/appointments" },
  { label: "Contact", to: "/contact" },
];

function linkClass({ isActive }) {
  return [
    "rounded-full px-4 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-teal-600 text-white shadow-md shadow-teal-900/10"
      : "text-slate-600 hover:bg-teal-50 hover:text-teal-700",
  ].join(" ");
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="MediCare" className="h-12 w-12 rounded-2xl object-cover shadow-md" />
          <div>
            <div className="text-lg font-black tracking-[0.18em] text-teal-900">MEDICARE</div>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
              Smart care, modern workflow
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="ml-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700 shadow-md shadow-teal-900/10"
          >
            Role Login
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur-lg lg:hidden">
          <div className="section-shell flex flex-col gap-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-teal-600 px-5 py-3 text-center text-sm font-bold text-white shadow-md"
            >
              Role Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
