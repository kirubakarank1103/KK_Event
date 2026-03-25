import { useState, useEffect, useRef } from "react";

// ============================================================
// STYLES - Injected globally
// ============================================================
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --gold: #C9A84C;
        --gold-light: #E8C97A;
        --gold-dark: #8B6914;
        --black: #0A0A0F;
        --dark: #12121A;
        --card: #1A1A26;
        --card2: #22223A;
        --border: rgba(201,168,76,0.18);
        --text: #F0EDE4;
        --muted: #7A7A9A;
        --success: #2ECC71;
        --error: #E74C3C;
        --radius: 16px;
        --shadow: 0 8px 40px rgba(0,0,0,0.5);
      }

      html { scroll-behavior: smooth; }

      body {
        font-family: 'DM Sans', sans-serif;
        background: var(--black);
        color: var(--text);
        min-height: 100vh;
        overflow-x: hidden;
      }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: var(--dark); }
      ::-webkit-scrollbar-thumb { background: var(--gold-dark); border-radius: 3px; }

      /* Animations */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; } to { opacity: 1; }
      }
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
        50%       { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); } to { transform: rotate(360deg); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(100%); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-10px); }
      }
      @keyframes gradientShift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .animate-fadeUp  { animation: fadeUp 0.6s ease forwards; }
      .animate-fadeIn  { animation: fadeIn 0.4s ease forwards; }
      .animate-float   { animation: float 3s ease-in-out infinite; }

      /* Staggered children */
      .stagger > * { opacity: 0; animation: fadeUp 0.6s ease forwards; }
      .stagger > *:nth-child(1) { animation-delay: 0.05s; }
      .stagger > *:nth-child(2) { animation-delay: 0.15s; }
      .stagger > *:nth-child(3) { animation-delay: 0.25s; }
      .stagger > *:nth-child(4) { animation-delay: 0.35s; }
      .stagger > *:nth-child(5) { animation-delay: 0.45s; }
      .stagger > *:nth-child(6) { animation-delay: 0.55s; }

      /* Gold shimmer text */
      .gold-text {
        background: linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold), var(--gold-light), var(--gold-dark));
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }

      /* Buttons */
      .btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 12px 28px; border-radius: 50px; font-family: 'DM Sans', sans-serif;
        font-weight: 600; font-size: 0.95rem; cursor: pointer; border: none;
        transition: all 0.3s ease; text-decoration: none;
      }
      .btn-gold {
        background: linear-gradient(135deg, var(--gold), var(--gold-light));
        color: var(--black);
        box-shadow: 0 4px 20px rgba(201,168,76,0.35);
      }
      .btn-gold:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(201,168,76,0.5);
        animation: pulse 1.5s infinite;
      }
      .btn-outline {
        background: transparent;
        border: 1.5px solid var(--gold);
        color: var(--gold);
      }
      .btn-outline:hover {
        background: rgba(201,168,76,0.1);
        transform: translateY(-2px);
      }
      .btn-ghost {
        background: rgba(255,255,255,0.05);
        color: var(--text);
        border: 1px solid var(--border);
      }
      .btn-ghost:hover { background: rgba(255,255,255,0.1); }
      .btn-sm { padding: 8px 18px; font-size: 0.85rem; }
      .btn-full { width: 100%; justify-content: center; }

      /* Cards */
      .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
        transition: all 0.35s ease;
      }
      .card:hover {
        transform: translateY(-6px);
        border-color: rgba(201,168,76,0.4);
        box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1);
      }

      /* Inputs */
      .input {
        width: 100%; padding: 14px 18px;
        background: rgba(255,255,255,0.04);
        border: 1.5px solid var(--border);
        border-radius: 12px; color: var(--text);
        font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
        transition: all 0.3s ease; outline: none;
      }
      .input:focus { border-color: var(--gold); background: rgba(201,168,76,0.05); }
      .input::placeholder { color: var(--muted); }

      /* Badge */
      .badge {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 600;
      }
      .badge-gold { background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); }
      .badge-green { background: rgba(46,204,113,0.15); color: var(--success); }
      .badge-red { background: rgba(231,76,60,0.15); color: var(--error); }

      /* Modal */
      .modal-overlay {
        position: fixed; inset: 0; z-index: 1000;
        background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center; padding: 20px;
        animation: fadeIn 0.3s ease;
      }
      .modal-box {
        background: var(--dark);
        border: 1px solid var(--border);
        border-radius: 24px;
        width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;
        animation: fadeUp 0.4s ease;
      }

      /* Toast */
      .toast {
        position: fixed; bottom: 24px; right: 24px; z-index: 2000;
        padding: 14px 22px; border-radius: 12px;
        font-weight: 500; min-width: 260px;
        animation: slideIn 0.4s ease;
        box-shadow: var(--shadow);
      }
      .toast-success { background: linear-gradient(135deg, #1a3a2a, #243a2a); border: 1px solid var(--success); color: var(--success); }
      .toast-error   { background: linear-gradient(135deg, #3a1a1a, #3a2424); border: 1px solid var(--error);   color: var(--error); }
      .toast-info    { background: linear-gradient(135deg, #1a1a3a, #22223a); border: 1px solid var(--gold);    color: var(--gold); }

      /* Hero mesh bg */
      .mesh-bg {
        background: radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 20%, rgba(100,80,200,0.06) 0%, transparent 50%),
                    radial-gradient(ellipse at 60% 80%, rgba(201,168,76,0.05) 0%, transparent 50%);
      }

      /* Section divider */
      .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
        opacity: 0.3;
        margin: 0;
      }

      /* Grid layouts */
      .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 24px;
      }

      /* Stat bar */
      .stat-bar {
        display: flex; gap: 24px; flex-wrap: wrap;
      }
      .stat-item {
        text-align: center;
        padding: 20px 28px;
        background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
        flex: 1; min-width: 120px;
        transition: all 0.3s ease;
      }
      .stat-item:hover { border-color: var(--gold); transform: translateY(-3px); }

      /* Nav */
      nav {
        position: sticky; top: 0; z-index: 500;
        background: rgba(10,10,15,0.85); backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--border);
        padding: 0 clamp(16px, 5vw, 80px);
        height: 68px; display: flex; align-items: center; justify-content: space-between;
      }

      /* Loading spinner */
      .spinner {
        width: 36px; height: 36px;
        border: 3px solid rgba(201,168,76,0.2);
        border-top-color: var(--gold);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: auto;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .events-grid { grid-template-columns: 1fr; }
        .stat-bar { gap: 12px; }
        .stat-item { padding: 14px 16px; }
        .hide-mobile { display: none !important; }
      }
      @media (max-width: 480px) {
        .btn { padding: 10px 20px; font-size: 0.9rem; }
        .modal-box { border-radius: 18px; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_EVENTS = [
  {
    id: 1, title: "Bangalore Tech Summit 2025", category: "Technology",
    date: "2025-08-15", time: "09:00 AM", venue: "KTPO, Whitefield, Bangalore",
    price: 1500, totalSeats: 500, bookedSeats: 342,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    description: "South India's biggest tech summit featuring AI, Web3, and Cloud computing sessions with 50+ industry leaders.",
    tags: ["AI", "Cloud", "Web3"], featured: true,
  },
  {
    id: 2, title: "Classical Carnatic Night", category: "Music",
    date: "2025-07-28", time: "06:30 PM", venue: "Chowdaiah Memorial Hall, Bangalore",
    price: 800, totalSeats: 300, bookedSeats: 290,
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80",
    description: "An enchanting evening of Carnatic classical music performed by award-winning artists.",
    tags: ["Carnatic", "Classical"], featured: false,
  },
  {
    id: 3, title: "Startup Founders Meetup", category: "Business",
    date: "2025-08-02", time: "11:00 AM", venue: "91Springboard, Koramangala",
    price: 0, totalSeats: 150, bookedSeats: 89,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80",
    description: "Connect, collaborate, and grow with Bangalore's vibrant startup ecosystem. FREE entry!",
    tags: ["Networking", "Startup"], featured: true,
  },
  {
    id: 4, title: "Modern Art Exhibition", category: "Art",
    date: "2025-08-10", time: "10:00 AM", venue: "NGMA, Palace Road, Bangalore",
    price: 200, totalSeats: 200, bookedSeats: 45,
    image: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80",
    description: "Explore contemporary Indian art by emerging and established artists across 3 gallery halls.",
    tags: ["Art", "Gallery", "Culture"], featured: false,
  },
  {
    id: 5, title: "Yoga & Wellness Retreat", category: "Wellness",
    date: "2025-08-20", time: "06:00 AM", venue: "Nandi Hills, Bangalore",
    price: 3500, totalSeats: 50, bookedSeats: 32,
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80",
    description: "A 2-day immersive yoga and meditation retreat in the serene hills near Bangalore.",
    tags: ["Yoga", "Wellness", "Retreat"], featured: false,
  },
  {
    id: 6, title: "Food Festival — Taste of India", category: "Food",
    date: "2025-09-05", time: "12:00 PM", venue: "Palace Grounds, Bangalore",
    price: 500, totalSeats: 2000, bookedSeats: 780,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
    description: "India's top chefs, street food legends, and culinary masters in one grand celebration of food.",
    tags: ["Food", "Festival", "Culinary"], featured: true,
  },
];

const CATEGORIES = ["All", "Technology", "Music", "Business", "Art", "Wellness", "Food"];

// ============================================================
// UTILS
// ============================================================
const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const formatPrice = (p) => p === 0 ? "FREE" : `₹${p.toLocaleString("en-IN")}`;
const seatsLeft = (e) => e.totalSeats - e.bookedSeats;
const pct = (e) => Math.round((e.bookedSeats / e.totalSeats) * 100);

// ============================================================
// TOAST
// ============================================================
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`}>
      {toast.type === "success" ? "✅ " : toast.type === "error" ? "❌ " : "ℹ️ "}
      {toast.msg}
    </div>
  );
};

// ============================================================
// NAVBAR
// ============================================================
const Navbar = ({ page, setPage, user, setUser, setShowAuth }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav>
      <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("home")}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900, fontSize: "1.1rem", color: "var(--black)"
        }}>E</div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem" }}>
          <span className="gold-text">EventVault</span>
        </span>
      </div>

      {/* Desktop Nav */}
      <div className="hide-mobile" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {["home", "events", "dashboard"].map(p => (
          <button key={p} className="btn btn-ghost btn-sm"
            style={{ borderColor: page === p ? "var(--gold)" : "transparent", color: page === p ? "var(--gold)" : "var(--muted)", textTransform: "capitalize" }}
            onClick={() => setPage(p)}>
            {p === "home" ? "🏠 Home" : p === "events" ? "🎟 Events" : "📊 Dashboard"}
          </button>
        ))}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--gold)", fontSize: "0.9rem" }}>👤 {user.name}</span>
            <button className="btn btn-outline btn-sm" onClick={() => setUser(null)}>Logout</button>
          </div>
        ) : (
          <button className="btn btn-gold btn-sm" onClick={() => setShowAuth(true)}>Sign In</button>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className="btn btn-ghost btn-sm" style={{ display: "none" }}
        onClick={() => setMenuOpen(!menuOpen)}
        id="hamburger">☰</button>

      <style>{`
        @media (max-width: 768px) {
          #hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

// ============================================================
// HERO SECTION
// ============================================================
const Hero = ({ setPage }) => (
  <section className="mesh-bg" style={{ padding: "clamp(60px,12vw,120px) clamp(16px,5vw,80px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
    {/* Decorative circles */}
    <div style={{
      position: "absolute", top: -100, right: -100,
      width: 400, height: 400, borderRadius: "50%",
      border: "1px solid rgba(201,168,76,0.08)",
      pointerEvents: "none"
    }} />
    <div style={{
      position: "absolute", bottom: -80, left: -80,
      width: 300, height: 300, borderRadius: "50%",
      border: "1px solid rgba(201,168,76,0.06)",
      pointerEvents: "none"
    }} />

    <div className="animate-fadeUp" style={{ maxWidth: 760, margin: "0 auto" }}>
      <div className="badge badge-gold animate-float" style={{ margin: "0 auto 24px", width: "fit-content" }}>
        ✨ Bangalore's Premier Event Platform
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 7vw, 5rem)", lineHeight: 1.1, marginBottom: 24 }}>
        Discover &amp; Book<br />
        <span className="gold-text">Extraordinary Events</span>
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "clamp(1rem, 2.5vw, 1.2rem)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
        From tech summits to music nights — find, register, and experience the best events in your city with one seamless platform.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn btn-gold" onClick={() => setPage("events")}>
          🎟 Browse Events
        </button>
        <button className="btn btn-outline" onClick={() => setPage("dashboard")}>
          ➕ Create Event
        </button>
      </div>
    </div>

    {/* Stats */}
    <div className="stat-bar stagger" style={{ maxWidth: 700, margin: "60px auto 0" }}>
      {[["500+", "Events Hosted"], ["50K+", "Happy Attendees"], ["₹2Cr+", "Tickets Sold"], ["98%", "Satisfaction"]].map(([n, l]) => (
        <div key={l} className="stat-item">
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700 }} className="gold-text">{n}</div>
          <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 4 }}>{l}</div>
        </div>
      ))}
    </div>
  </section>
);

// ============================================================
// EVENT CARD
// ============================================================
const EventCard = ({ event, onBook }) => {
  const left = seatsLeft(event);
  const full = left === 0;
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img src={event.image} alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(10,10,15,0.9))" }} />
        {event.featured && (
          <div className="badge badge-gold" style={{ position: "absolute", top: 12, left: 12 }}>⭐ Featured</div>
        )}
        <div style={{ position: "absolute", bottom: 12, right: 12 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: event.price === 0 ? "var(--success)" : "var(--gold)" }}>
            {formatPrice(event.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div className="badge badge-gold" style={{ marginBottom: 8, fontSize: "0.7rem" }}>{event.category}</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3 }}>{event.title}</h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["📅", formatDate(event.date) + " · " + event.time],
            ["📍", event.venue],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "0.85rem", color: "var(--muted)" }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>

        {/* Seat bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--muted)", marginBottom: 6 }}>
            <span>{left} seats left</span>
            <span>{pct(event)}% filled</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct(event) + "%", background: pct(event) > 80 ? "var(--error)" : "linear-gradient(90deg, var(--gold-dark), var(--gold))", borderRadius: 99, transition: "width 1s ease" }} />
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {event.tags.map(t => <span key={t} style={{ fontSize: "0.72rem", padding: "3px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 50, color: "var(--muted)", border: "1px solid var(--border)" }}>{t}</span>)}
        </div>

        <button className={`btn ${full ? "btn-ghost" : "btn-gold"} btn-full`} style={{ marginTop: "auto" }}
          disabled={full} onClick={() => !full && onBook(event)}>
          {full ? "🚫 Sold Out" : "🎟 Book Now"}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// EVENTS PAGE
// ============================================================
const EventsPage = ({ onBook }) => {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");

  const filtered = MOCK_EVENTS
    .filter(e => cat === "All" || e.category === cat)
    .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "price" ? a.price - b.price : new Date(a.date) - new Date(b.date));

  return (
    <div style={{ padding: "40px clamp(16px,5vw,80px)", maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", marginBottom: 8 }}>
        Upcoming <span className="gold-text">Events</span>
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: 32 }}>{filtered.length} events found in Bangalore</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
        <input className="input" placeholder="🔍 Search events, venues..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300, flex: 1 }} />
        <select className="input" value={sort} onChange={e => setSort(e.target.value)}
          style={{ maxWidth: 160, background: "var(--card)", cursor: "pointer" }}>
          <option value="date">📅 By Date</option>
          <option value="price">💰 By Price</option>
        </select>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`btn btn-sm ${cat === c ? "btn-gold" : "btn-ghost"}`}
            onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="events-grid stagger">
        {filtered.map(e => <EventCard key={e.id} event={e} onBook={onBook} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: "80px 20px" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
          <p>No events found. Try a different search or category.</p>
        </div>
      )}
    </div>
  );
};

// ============================================================
// BOOKING MODAL
// ============================================================
const BookingModal = ({ event, user, onClose, onConfirm }) => {
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=success
  const [paying, setPaying] = useState(false);
  const [card, setCard] = useState({ num: "", exp: "", cvv: "", name: "" });

  const total = event.price * qty;

  const handlePay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 1800));
    setPaying(false);
    setStep(3);
    setTimeout(() => { onConfirm(event, qty); onClose(); }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div style={{ padding: "24px 28px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem" }}>
            {step === 1 ? "🎟 Book Tickets" : step === 2 ? "💳 Payment" : "🎉 Confirmed!"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "20px 28px 28px" }}>
          {step === 3 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>✅</div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", marginBottom: 8, color: "var(--success)" }}>Booking Confirmed!</h4>
              <p style={{ color: "var(--muted)" }}>Your tickets for <strong style={{ color: "var(--text)" }}>{event.title}</strong> have been booked.</p>
              <p style={{ color: "var(--muted)", marginTop: 8, fontSize: "0.9rem" }}>A reminder email will be sent 24 hours before the event.</p>
            </div>
          ) : step === 1 ? (
            <>
              {/* Event summary */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "16px", marginBottom: 20, border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{event.title}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>📅 {formatDate(event.date)} · {event.time}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>📍 {event.venue}</div>
              </div>

              <label style={{ display: "block", marginBottom: 6, fontSize: "0.9rem", color: "var(--muted)" }}>Number of Tickets</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, minWidth: 32, textAlign: "center" }}>{qty}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setQty(q => Math.min(seatsLeft(event), q + 1))}>+</button>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>(max {Math.min(seatsLeft(event), 10)})</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
                <span style={{ color: "var(--muted)" }}>Total Amount</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700 }} className="gold-text">{formatPrice(total)}</span>
              </div>

              <button className="btn btn-gold btn-full"
                onClick={() => total === 0 ? handlePay() : setStep(2)}>
                {total === 0 ? "✅ Confirm Free Booking" : "Continue to Payment →"}
              </button>
            </>
          ) : (
            <>
              <div style={{ background: "rgba(201,168,76,0.06)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, border: "1px solid rgba(201,168,76,0.2)", fontSize: "0.85rem", color: "var(--muted)" }}>
                🔒 Secure payment powered by Razorpay (Demo Mode)
              </div>

              {[
                ["Cardholder Name", "name", "text", "Name on card"],
                ["Card Number", "num", "text", "1234 5678 9012 3456"],
                ["Expiry Date", "exp", "text", "MM/YY"],
                ["CVV", "cvv", "password", "•••"],
              ].map(([label, key, type, ph]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--muted)" }}>{label}</label>
                  <input className="input" type={type} placeholder={ph}
                    value={card[key]} onChange={e => setCard(c => ({ ...c, [key]: e.target.value }))} />
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ color: "var(--muted)" }}>Total</span>
                <span className="gold-text" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700 }}>{formatPrice(total)}</span>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-gold btn-full" onClick={handlePay} disabled={paying}
                  style={{ flex: 1 }}>
                  {paying ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: 0 }} /> : `💳 Pay ${formatPrice(total)}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// AUTH MODAL
// ============================================================
const AuthModal = ({ onClose, onAuth }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    onAuth({ name: form.name || form.email.split("@")[0], email: form.email });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ padding: "28px" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: 6 }}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 24 }}>
            {mode === "login" ? "Sign in to book events" : "Join EventVault today"}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && (
              <input className="input" placeholder="Full Name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            )}
            <input className="input" type="email" placeholder="Email Address" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input className="input" type="password" placeholder="Password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>

          <button className="btn btn-gold btn-full" style={{ marginTop: 24 }} onClick={handle} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: 0 }} /> : (mode === "login" ? "Sign In" : "Create Account")}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, color: "var(--muted)", fontSize: "0.9rem" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(m => m === "login" ? "signup" : "login")}
              style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontWeight: 600 }}>
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>

          <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "var(--muted)", fontSize: "1.4rem", cursor: "pointer" }}>×</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DASHBOARD PAGE
// ============================================================
const Dashboard = ({ user, bookings, showToast }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Technology", date: "", time: "", venue: "", price: "", seats: "", description: "" });

  const handleCreate = (e) => {
    e.preventDefault();
    showToast("Event created successfully! (Demo mode)", "success");
    setShowCreate(false);
    setForm({ title: "", category: "Technology", date: "", time: "", venue: "", price: "", seats: "", description: "" });
  };

  return (
    <div style={{ padding: "40px clamp(16px,5vw,80px)", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.5rem)" }}>
            Dashboard <span className="gold-text">📊</span>
          </h2>
          <p style={{ color: "var(--muted)" }}>{user ? `Welcome back, ${user.name}!` : "Sign in to manage your events"}</p>
        </div>
        <button className="btn btn-gold" onClick={() => setShowCreate(true)}>➕ Create Event</button>
      </div>

      {/* Stats */}
      <div className="stat-bar stagger" style={{ marginBottom: 40 }}>
        {[
          ["🎟", bookings.length, "My Bookings"],
          ["🎉", MOCK_EVENTS.length, "Total Events"],
          ["💰", `₹${bookings.reduce((s, b) => s + b.event.price * b.qty, 0).toLocaleString("en-IN")}`, "Total Spent"],
          ["⏰", bookings.filter(b => new Date(b.event.date) > new Date()).length, "Upcoming"],
        ].map(([icon, val, label]) => (
          <div key={label} className="stat-item">
            <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{icon}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700 }} className="gold-text">{val}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* My Bookings */}
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", marginBottom: 20 }}>My Bookings</h3>
      {bookings.length === 0 ? (
        <div className="card" style={{ padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎭</div>
          <p style={{ color: "var(--muted)" }}>No bookings yet. Explore events and book your first ticket!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {bookings.map((b, i) => (
            <div key={i} className="card" style={{ padding: "20px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <img src={b.event.image} alt={b.event.title} style={{ width: 70, height: 70, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{b.event.title}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>📅 {formatDate(b.event.date)} · {b.qty} ticket{b.qty > 1 ? "s" : ""}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>📍 {b.event.venue}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="gold-text" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
                  {formatPrice(b.event.price * b.qty)}
                </div>
                <div className="badge badge-green" style={{ marginTop: 6 }}>✅ Confirmed</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="modal-box" style={{ maxWidth: 580 }}>
            <div style={{ padding: "28px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", marginBottom: 20 }}>Create New Event</h3>
              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input className="input" placeholder="Event Title *" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <select className="input" style={{ background: "var(--card)", cursor: "pointer" }}
                    value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input className="input" type="number" placeholder="Ticket Price (₹)" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input className="input" type="date" value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                  <input className="input" type="time" value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                </div>
                <input className="input" placeholder="Venue / Location" value={form.venue}
                  onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
                <input className="input" type="number" placeholder="Total Seats" value={form.seats}
                  onChange={e => setForm(f => ({ ...f, seats: e.target.value }))} />
                <textarea className="input" rows={3} placeholder="Event Description..."
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  style={{ resize: "vertical" }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                  <button type="submit" className="btn btn-gold" style={{ flex: 1 }}>🚀 Publish Event</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// HOME PAGE
// ============================================================
const HomePage = ({ setPage, onBook }) => (
  <>
    <Hero setPage={setPage} />
    <div className="divider" />
    <div style={{ padding: "60px clamp(16px,5vw,80px)", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem,3.5vw,2.2rem)" }}>
          Featured <span className="gold-text">Events</span>
        </h2>
        <button className="btn btn-outline btn-sm" onClick={() => setPage("events")}>View All →</button>
      </div>
      <div className="events-grid stagger">
        {MOCK_EVENTS.filter(e => e.featured).map(e => <EventCard key={e.id} event={e} onBook={onBook} />)}
      </div>
    </div>

    {/* CTA */}
    <div className="mesh-bg" style={{ textAlign: "center", padding: "80px clamp(16px,5vw,80px)", marginTop: 20 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,3rem)", marginBottom: 16 }}>
        Ready to Host Your <span className="gold-text">Event?</span>
      </h2>
      <p style={{ color: "var(--muted)", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.7 }}>
        Create, manage, and sell tickets for your events with EventVault's powerful platform.
      </p>
      <button className="btn btn-gold" onClick={() => setPage("dashboard")}>
        🚀 Start Creating Events
      </button>
    </div>

    {/* Footer */}
    <footer style={{ borderTop: "1px solid var(--border)", padding: "28px clamp(16px,5vw,80px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 0 }}>
      <span style={{ fontFamily: "'Playfair Display', serif" }}><span className="gold-text">EventVault</span></span>
      <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>© 2025 EventVault · Made with ❤️ in Bangalore</span>
    </footer>
  </>
);

// ============================================================
// ROOT APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [bookingEvent, setBookingEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBook = (event) => {
    if (!user) { setShowAuth(true); showToast("Please sign in to book tickets", "info"); return; }
    setBookingEvent(event);
  };

  const handleConfirm = (event, qty) => {
    setBookings(b => [...b, { event, qty, date: new Date() }]);
    showToast(`🎉 ${qty} ticket(s) booked for ${event.title}!`, "success");
  };

  return (
    <>
      <GlobalStyles />
      <Navbar page={page} setPage={setPage} user={user} setUser={setUser} setShowAuth={setShowAuth} />

      <main>
        {page === "home"      && <HomePage setPage={setPage} onBook={handleBook} />}
        {page === "events"    && <EventsPage onBook={handleBook} />}
        {page === "dashboard" && <Dashboard user={user} bookings={bookings} showToast={showToast} />}
      </main>

      {showAuth    && <AuthModal onClose={() => setShowAuth(false)} onAuth={u => { setUser(u); showToast(`Welcome, ${u.name}! 🎉`, "success"); }} />}
      {bookingEvent && <BookingModal event={bookingEvent} user={user} onClose={() => setBookingEvent(null)} onConfirm={handleConfirm} />}
      <Toast toast={toast} />
    </>
  );
}