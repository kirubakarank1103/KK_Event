// ============================================================
// EventVault - Complete Backend (server.js)
// Node.js + Express + MongoDB + JWT + Nodemailer
// ============================================================
const express    = require("express");
const mongoose   = require("mongoose");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const cors       = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// ─── DB CONNECT ─────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/eventvault")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB Error:", err));

// ─── SCHEMAS ────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: String,
  category:    String,
  date:        { type: Date, required: true },
  time:        String,
  venue:       String,
  price:       { type: Number, default: 0 },
  totalSeats:  { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 },
  image:       String,
  tags:        [String],
  featured:    { type: Boolean, default: false },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt:   { type: Date, default: Date.now }
});

const BookingSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event:         { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  qty:           { type: Number, default: 1 },
  totalAmount:   Number,
  paymentId:     String,
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  reminderSent:  { type: Boolean, default: false },
  bookedAt:      { type: Date, default: Date.now }
});

const User    = mongoose.model("User",    UserSchema);
const Event   = mongoose.model("Event",   EventSchema);
const Booking = mongoose.model("Booking", BookingSchema);

// ─── MIDDLEWARE ──────────────────────────────────────────────
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "eventvault_secret_key");
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin access required" });
  next();
};

// ─── EMAIL HELPER ────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: `"EventVault" <${process.env.EMAIL_USER}>`, to, subject, html });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("Email error:", err.message);
  }
};

const bookingEmailHTML = (user, event, booking) => `
  <div style="font-family:sans-serif;max-width:540px;margin:auto;background:#12121A;color:#F0EDE4;border-radius:16px;overflow:hidden;border:1px solid rgba(201,168,76,0.3)">
    <div style="background:linear-gradient(135deg,#C9A84C,#8B6914);padding:28px;text-align:center">
      <h1 style="margin:0;font-size:1.6rem;color:#0A0A0F">🎟 Booking Confirmed!</h1>
    </div>
    <div style="padding:28px">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your booking for <strong>${event.title}</strong> is confirmed.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        ${[
          ["Event",    event.title],
          ["Date",     new Date(event.date).toLocaleDateString("en-IN", {day:"numeric",month:"long",year:"numeric"})],
          ["Time",     event.time],
          ["Venue",    event.venue],
          ["Tickets",  booking.qty],
          ["Total",    event.price === 0 ? "FREE" : `₹${(event.price * booking.qty).toLocaleString("en-IN")}`],
          ["Booking ID", booking._id],
        ].map(([k,v]) => `
          <tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
            <td style="padding:10px 0;color:#7A7A9A;font-size:0.9rem">${k}</td>
            <td style="padding:10px 0;font-weight:600;text-align:right">${v}</td>
          </tr>
        `).join("")}
      </table>
      <p style="color:#7A7A9A;font-size:0.85rem">You will receive a reminder 24 hours before the event.</p>
    </div>
    <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;color:#7A7A9A;font-size:0.8rem">
      © 2025 EventVault · Made with ❤️ in Bangalore
    </div>
  </div>
`;

// ─── AUTH ROUTES ─────────────────────────────────────────────

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });
    if (await User.findOne({ email })) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "eventvault_secret_key", { expiresIn: "7d" });

    await sendEmail(email, "Welcome to EventVault! 🎉", `<h2>Welcome ${name}!</h2><p>Your account is ready. Start exploring amazing events!</p>`);

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "eventvault_secret_key", { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
app.get("/api/auth/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ─── EVENT ROUTES ────────────────────────────────────────────

// GET /api/events  (public)
app.get("/api/events", async (req, res) => {
  try {
    const { category, search, sort = "date", page = 1, limit = 12 } = req.query;
    const query = {};
    if (category && category !== "All") query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { venue: { $regex: search, $options: "i" } }
    ];

    const sortMap = { date: { date: 1 }, price: { price: 1 }, popular: { bookedSeats: -1 } };
    const events = await Event.find(query)
      .sort(sortMap[sort] || { date: 1 })
      .skip((page - 1) * limit).limit(Number(limit));
    const total = await Event.countDocuments(query);

    res.json({ events, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:id  (public)
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events  (auth required)
app.post("/api/events", auth, async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/events/:id  (auth, owner/admin)
app.put("/api/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Not authorized" });

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/events/:id  (auth, owner/admin)
app.delete("/api/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Not authorized" });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── BOOKING ROUTES ──────────────────────────────────────────

// POST /api/bookings  (create booking + simulated payment)
app.post("/api/bookings", auth, async (req, res) => {
  try {
    const { eventId, qty = 1, paymentId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const seatsLeft = event.totalSeats - event.bookedSeats;
    if (qty > seatsLeft) return res.status(400).json({ error: `Only ${seatsLeft} seats available` });

    // Check if already booked
    const existing = await Booking.findOne({ user: req.user.id, event: eventId });
    if (existing) return res.status(400).json({ error: "You already booked this event" });

    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      qty,
      totalAmount: event.price * qty,
      paymentId: paymentId || `PAY_${Date.now()}`,
      paymentStatus: "paid"
    });

    // Update seat count
    await Event.findByIdAndUpdate(eventId, { $inc: { bookedSeats: qty } });

    // Send confirmation email
    const user = await User.findById(req.user.id);
    await sendEmail(user.email, `Booking Confirmed: ${event.title}`, bookingEmailHTML(user, event, booking));

    await booking.populate(["user", "event"]);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/mine  (user's bookings)
app.get("/api/bookings/mine", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("event").sort({ bookedAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/all  (admin only)
app.get("/api/bookings/all", auth, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user event").sort({ bookedAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/bookings/:id  (cancel booking)
app.delete("/api/bookings/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ error: "Not authorized" });

    await Event.findByIdAndUpdate(booking.event._id, { $inc: { bookedSeats: -booking.qty } });
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── REMINDER CRON (runs every hour) ────────────────────────
const sendReminders = async () => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const inTwoHours = new Date(Date.now() + 2 * 60 * 60 * 1000);

  const upcomingEvents = await Event.find({
    date: { $gte: inTwoHours, $lte: tomorrow }
  });

  for (const event of upcomingEvents) {
    const bookings = await Booking.find({
      event: event._id,
      reminderSent: false,
      paymentStatus: "paid"
    }).populate("user");

    for (const booking of bookings) {
      await sendEmail(
        booking.user.email,
        `⏰ Reminder: ${event.title} is Tomorrow!`,
        `<div style="font-family:sans-serif;color:#F0EDE4;background:#12121A;padding:28px;border-radius:16px">
          <h2 style="color:#C9A84C">⏰ Event Reminder</h2>
          <p>Hi ${booking.user.name}, your event is coming up!</p>
          <p><strong>${event.title}</strong></p>
          <p>📅 ${new Date(event.date).toLocaleDateString("en-IN", {day:"numeric",month:"long",year:"numeric"})} at ${event.time}</p>
          <p>📍 ${event.venue}</p>
          <p>🎟 ${booking.qty} ticket(s) booked</p>
          <p style="color:#7A7A9A;font-size:0.85rem">See you there! — EventVault Team</p>
        </div>`
      );
      await Booking.findByIdAndUpdate(booking._id, { reminderSent: true });
    }
  }
  if (upcomingEvents.length > 0) console.log(`📧 Reminders sent for ${upcomingEvents.length} events`);
};

// Run reminder check every hour
setInterval(sendReminders, 60 * 60 * 1000);

// ─── HEALTH CHECK ────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "✅ EventVault API Running", version: "1.0.0" }));
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date() }));

// ─── START SERVER ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));