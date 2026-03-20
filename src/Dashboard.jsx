import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Dharmic SVG Mandala Background ─── */
const MandalaBg = () => (
  <svg
    className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.04]"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 800"
    preserveAspectRatio="xMidYMid slice"
  >
    <g transform="translate(400,400)">
      {[...Array(12)].map((_, i) => (
        <g key={i} transform={`rotate(${i * 30})`}>
          <ellipse rx="180" ry="30" fill="none" stroke="#b8860b" strokeWidth="0.8" />
          <ellipse rx="240" ry="15" fill="none" stroke="#b8860b" strokeWidth="0.5" />
          <line x1="0" y1="-120" x2="0" y2="-300" stroke="#b8860b" strokeWidth="0.6" />
          <polygon points="0,-140 8,-120 -8,-120" fill="#b8860b" opacity="0.6" />
        </g>
      ))}
      {[60, 100, 150, 200, 260, 320].map((r) => (
        <circle key={r} r={r} fill="none" stroke="#b8860b" strokeWidth="0.5" />
      ))}
      <circle r="18" fill="#b8860b" opacity="0.3" />
    </g>
  </svg>
);

/* ─── Om Symbol ─── */
const OmSymbol = () => (
  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-amber-600 bg-amber-50 shadow-lg shadow-amber-200 mb-5">
    <span style={{ fontFamily: "serif", fontSize: "2.6rem", color: "#92400e", lineHeight: 1 }}>
      ॐ
    </span>
  </div>
);

/* ─── Decorative Divider ─── */
const Divider = () => (
  <div className="flex items-center gap-3 my-6">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
    <span style={{ color: "#b8860b", fontSize: "1.1rem" }}>✦</span>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
  </div>
);

/* ─── Stat Card ─── */
const StatCard = ({ icon, label, value }) => (
  <div className="relative bg-white border border-amber-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-300 group overflow-hidden">
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(ellipse at top left, rgba(251,191,36,0.08) 0%, transparent 70%)",
      }}
    />
    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">{label}</p>
      <p
        className="text-base font-bold text-stone-800 mt-0.5 leading-snug"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {value}
      </p>
    </div>
  </div>
);

/* ─── Quick Action Card ─── */
const ActionCard = ({ icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="group relative bg-white border border-amber-200 rounded-2xl p-7 text-center hover:border-amber-500 hover:shadow-xl transition-all duration-300 overflow-hidden w-full"
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(ellipse at bottom, rgba(251,191,36,0.12) 0%, transparent 65%)",
      }}
    />
    <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
      {icon}
    </div>
    <p
      className="text-base font-bold text-stone-800"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {title}
    </p>
    <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">{desc}</p>
    <div className="mt-4 h-0.5 w-10 mx-auto bg-amber-400 rounded-full transition-all duration-300 group-hover:w-16 group-hover:bg-amber-600" />
  </button>
);

/* ─── Main Dashboard ─── */
function Dashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("MahakalToken");
      if (!token) { navigate("/login"); return; }

      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/admin/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 401) {
          localStorage.removeItem("MahakalToken");
          navigate("/login");
          return;
        }
        const data = await res.json();
        setAdmin(data.admin);
      } catch (error) {
        console.error(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div
          className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin mb-5"
        />
        <p
          className="text-stone-600 tracking-widest uppercase text-xs font-semibold"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Loading Sacred Space…
        </p>
      </div>
    );
  }

  /* ─── Render ─── */
  return (
    <div
      className="relative min-h-screen bg-white text-stone-800"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* Mandala watermark */}
      <MandalaBg />

      {/* Top decorative band */}
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(90deg, #92400e 0%, #d97706 25%, #f59e0b 50%, #d97706 75%, #92400e 100%)",
        }}
      />

      {/* Subtle dot-grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #d4a017 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.04,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-5 py-14">

        {/* ── Header ── */}
        <header className="text-center mb-14">
          <OmSymbol />

          {/* Sanskrit strip */}
          <p
            className="text-amber-700 text-xs tracking-[0.35em] uppercase font-semibold mb-3 opacity-70"
          >
            ॥ श्री महाकाल प्रशासन पैनल ॥
          </p>

          <h1
            className="text-4xl md:text-5xl font-bold text-stone-800 leading-tight mb-3"
            style={{ letterSpacing: "-0.01em" }}
          >
            Mahakal Admin Dashboard
          </h1>

          <p className="text-stone-500 text-base">
            Welcome back,{" "}
            <span className="text-amber-700 font-semibold">{admin?.name}</span>
          </p>

          <Divider />
        </header>

        {/* ── Profile Card ── */}
        <div className="bg-white border border-amber-200 rounded-3xl shadow-xl overflow-hidden mb-10">
          {/* Card top bar */}
          <div
            className="px-8 py-5 flex items-center gap-3"
            style={{
              background:
                "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
            }}
          >
            <span className="text-amber-200 text-xl">🔱</span>
            <h2 className="text-white font-bold text-xl tracking-wide">
              Admin Sanctum
            </h2>
            <div className="ml-auto flex gap-1.5">
              {["bg-red-400","bg-amber-400","bg-green-400"].map((c,i)=>(
                <span key={i} className={`w-2.5 h-2.5 rounded-full ${c} opacity-70`}/>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* Profile details */}
              <div className="space-y-4">
                <StatCard icon="👤" label="Full Name" value={admin?.name} />
                <StatCard icon="✉️" label="Email Address" value={admin?.email} />
                <StatCard
                  icon="🏅"
                  label="Role"
                  value={admin?.role?.toUpperCase()}
                />
                <StatCard
                  icon="📅"
                  label="Joined On"
                  value={new Date(admin?.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              </div>

              {/* Status & logout */}
              <div className="flex flex-col justify-between gap-6">
                {/* Status badge */}
                <div className="bg-stone-50 border border-amber-100 rounded-2xl p-6">
                  <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold mb-3">
                    Account Status
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        admin?.isBlocked ? "bg-red-500" : "bg-emerald-500"
                      } shadow-md`}
                      style={{
                        boxShadow: admin?.isBlocked
                          ? "0 0 8px rgba(239,68,68,0.6)"
                          : "0 0 8px rgba(16,185,129,0.6)",
                      }}
                    />
                    <span
                      className={`text-sm font-bold tracking-wider ${
                        admin?.isBlocked ? "text-red-600" : "text-emerald-700"
                      }`}
                    >
                      {admin?.isBlocked ? "BLOCKED" : "ACTIVE — BLESSED"}
                    </span>
                  </div>

                  {/* Devotional quote */}
                  <div className="mt-5 pt-4 border-t border-amber-100">
                    <p className="text-xs italic text-stone-400 leading-relaxed">
                      "कर्म करो, फल की चिंता मत करो।"
                    </p>
                    <p className="text-xs text-stone-400 mt-1">— Bhagavad Gita</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    localStorage.removeItem("MahakalToken");
                    navigate("/login");
                  }}
                  className="group relative w-full overflow-hidden rounded-2xl py-4 px-6 font-bold text-white tracking-wider transition-all duration-300 shadow-md hover:shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)",
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>🚪</span>
                    <span>Logout</span>
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, #991b1b 0%, #b91c1c 50%, #dc2626 100%)",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amber-500" />
            <h3 className="text-sm uppercase tracking-widest text-stone-600 font-semibold">
              Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ActionCard icon="📦" title="Manage Orders" desc="View and process customer orders" />
            <ActionCard icon="👥" title="View Users" desc="Manage registered devotees" />
            <ActionCard icon="🛍️" title="Products" desc="Add, edit or remove sacred products" />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-14 text-center">
          <Divider />
          <p className="text-xs text-stone-400 tracking-widest uppercase">
            ॥ हर हर महादेव ॥
          </p>
        </footer>
      </div>

      {/* Bottom decorative band */}
      <div
        className="w-full h-1.5"
        style={{
          background:
            "linear-gradient(90deg, #92400e 0%, #d97706 25%, #f59e0b 50%, #d97706 75%, #92400e 100%)",
        }}
      />
    </div>
  );
}

export default Dashboard;