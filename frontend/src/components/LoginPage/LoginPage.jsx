import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { medicalToolsPattern } from "../../assets/dummyStyles";
import { useAuth } from "../../contexts/AuthContext";
import { Shield, UserCog, Stethoscope, Users } from "lucide-react";

const roles = [
  {
    title: "Admin",
    copy: "Manage doctors, patients, departments, staff, and the system dashboard.",
    icon: UserCog,
  },
  {
    title: "Doctor",
    copy: "Update profile, manage schedule, and review appointments from a role-based workspace.",
    icon: Stethoscope,
  },
  {
    title: "Staff",
    copy: "Coordinate front-desk scheduling, approvals, and patient support operations.",
    icon: Users,
  },
  {
    title: "Patient",
    copy: "Register, book appointments, and track consultations securely.",
    icon: Shield,
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        const dashboardMap = {
          admin: "/admin/dashboard",
          doctor: "/doctor/dashboard",
          staff: "/staff/dashboard",
          patient: "/patient/dashboard",
        };
        navigate(dashboardMap[result.user.role] || "/");
      } else {
        await register(formData.name, formData.email, formData.password, formData.phone);
        navigate("/patient/dashboard");
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 px-4 py-12" style={{ backgroundImage: medicalToolsPattern, backgroundAttachment: "fixed" }}>
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[36px] border border-slate-200 bg-white/40 p-8 text-slate-900 backdrop-blur-xl sm:p-10 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-teal-700">Secure Access</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-teal-900">Role-Based Healthcare Portal</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Secure JWT-based authentication for every role. Sign in with your credentials or register as a new patient.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {roles.map(({ title, copy, icon: Icon }) => (
              <div key={title} className="rounded-[28px] border border-slate-200 bg-white/60 p-5 shadow-sm">
                <Icon className="h-6 w-6 text-teal-600" />
                <h2 className="mt-4 text-xl font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </article>

    <article className={`rounded-[36px] p-8 sm:p-10 transition-all duration-500 shadow-xl border ${
      isLogin ? "bg-white/80 border-transparent" : "bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 border-teal-100"
    }`}>
          <div className="mb-6 flex border-b border-slate-200">
            <button
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`mr-4 px-4 py-2 font-semibold ${
                isLogin ? "text-teal-700 border-b-2 border-teal-700 -mb-1" : "text-slate-500"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              className={`px-4 py-2 font-semibold ${
                !isLogin ? "text-teal-700 border-b-2 border-teal-700 -mb-1" : "text-slate-500"
              }`}
            >
              Register
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">{isLogin ? "Sign In" : "Create Account"}</h2>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 inline-flex justify-center rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:opacity-50"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {!isLogin && "Only patients can self-register. Contact admin for doctor/staff accounts."}
          </p>
        </article>
      </div>
    </section>
  );
}
