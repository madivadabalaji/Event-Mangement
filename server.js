const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'database.json');
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Server-Sent Events (SSE) clients for real-time live updates
let sseClients = [];

function sendSSE(eventType, data) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(message);
    } catch (err) {
      console.error('Error sending SSE to client:', err.message);
    }
  });
}

// Initial Database Seeding (Clean, without any specific team names or project review tags)
const initialSeed = {
  users: [
    {
      id: "usr_stu_1",
      role: "student",
      email: "student@campus.edu",
      password: "student123",
      name: "Aarav Sharma",
      studentId: "STU-2026-01",
      department: "Computer Science"
    },
    {
      id: "usr_stu_2",
      role: "student",
      email: "sneha@campus.edu",
      password: "student123",
      name: "Sneha Patel",
      studentId: "STU-2026-02",
      department: "Data Science & AI"
    },
    {
      id: "usr_stu_3",
      role: "student",
      email: "vikram@campus.edu",
      password: "student123",
      name: "Vikram Rao",
      studentId: "STU-2026-03",
      department: "Information Technology"
    },
    {
      id: "usr_org_1",
      role: "organizer",
      email: "organizer@campus.edu",
      password: "admin123",
      name: "Lead Event Organizer",
      organization: "Central Event Committee"
    }
  ],
  events: [
    {
      id: "EVT-101",
      title: "AI & Deep Learning Conclave 2026",
      category: "Artificial Intelligence",
      venue: "Main Auditorium, Block C",
      date: "2026-10-15",
      time: "10:00 AM - 04:30 PM",
      description: "Annual symposium on Generative AI, LLMs, Neural Architectures, and Computer Vision with industry experts.",
      organizer: "AI & Innovation Cell",
      capacity: 120,
      bannerColor: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      status: "Published",
      createdAt: "2026-10-01T09:00:00.000Z"
    },
    {
      id: "EVT-102",
      title: "National Tech Hackathon (36 Hours)",
      category: "Hackathon",
      venue: "Innovation & Incubation Hall",
      date: "2026-10-22",
      time: "09:00 AM (36 Hours)",
      description: "Intense competitive coding hackathon solving real-world challenges in FinTech, Healthcare, and Smart Automation.",
      organizer: "Technology & Coding Club",
      capacity: 80,
      bannerColor: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
      status: "Published",
      createdAt: "2026-10-02T11:30:00.000Z"
    },
    {
      id: "EVT-103",
      title: "Cloud & DevOps Engineering Workshop",
      category: "Workshop",
      venue: "Computer Science Center, Lab 4",
      date: "2026-10-08",
      time: "02:00 PM - 05:00 PM",
      description: "Hands-on masterclass covering containerization with Docker, Kubernetes cluster orchestration, and automated CI/CD pipelines.",
      organizer: "Cloud Infrastructure Guild",
      capacity: 45,
      bannerColor: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      status: "Published",
      createdAt: "2026-10-03T14:15:00.000Z"
    },
    {
      id: "EVT-104",
      title: "Cyber Defense & Security Summit",
      category: "Cybersecurity",
      venue: "Seminar Hall 2",
      date: "2026-10-18",
      time: "11:00 AM - 03:00 PM",
      description: "Practical deep-dive into zero-trust network defenses, vulnerability hunting, and cyber risk mitigation.",
      organizer: "Cyber Defense Society",
      capacity: 60,
      bannerColor: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
      status: "Published",
      createdAt: "2026-10-04T08:45:00.000Z"
    },
    {
      id: "EVT-105",
      title: "Annual Campus Cultural Fest",
      category: "Cultural",
      venue: "Open Air Amphitheatre",
      date: "2026-10-28",
      time: "06:00 PM - 10:30 PM",
      description: "Grand annual celebration with musical concerts, theatrical showcases, and creative arts.",
      organizer: "Cultural Committee",
      capacity: 350,
      bannerColor: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
      status: "Published",
      createdAt: "2026-10-04T16:00:00.000Z"
    }
  ],
  registrations: [
    {
      ticketId: "TK-AI-10101",
      eventId: "EVT-101",
      name: "Aarav Sharma",
      email: "student@campus.edu",
      rollNo: "STU-2026-01",
      phone: "+91 98451 22341",
      department: "Computer Science",
      registeredAt: "2026-10-02T10:14:00.000Z",
      status: "Attended",
      checkedInAt: "2026-10-05T17:45:10.000Z",
      qrCodeDataUrl: ""
    },
    {
      ticketId: "TK-AI-10102",
      eventId: "EVT-101",
      name: "Sneha Patel",
      email: "sneha@campus.edu",
      rollNo: "STU-2026-02",
      phone: "+91 97012 33499",
      department: "Data Science & AI",
      registeredAt: "2026-10-02T11:20:00.000Z",
      status: "Attended",
      checkedInAt: "2026-10-05T17:50:33.000Z",
      qrCodeDataUrl: ""
    },
    {
      ticketId: "TK-AI-10103",
      eventId: "EVT-101",
      name: "Vikram Rao",
      email: "vikram@campus.edu",
      rollNo: "STU-2026-03",
      phone: "+91 98881 77123",
      department: "Information Technology",
      registeredAt: "2026-10-03T09:15:00.000Z",
      status: "Confirmed",
      checkedInAt: null,
      qrCodeDataUrl: ""
    },
    {
      ticketId: "TK-HK-10201",
      eventId: "EVT-102",
      name: "Aarav Sharma",
      email: "student@campus.edu",
      rollNo: "STU-2026-01",
      phone: "+91 98451 22341",
      department: "Computer Science",
      registeredAt: "2026-10-03T12:00:00.000Z",
      status: "Confirmed",
      checkedInAt: null,
      qrCodeDataUrl: ""
    },
    {
      ticketId: "TK-CD-10301",
      eventId: "EVT-103",
      name: "Sneha Patel",
      email: "sneha@campus.edu",
      rollNo: "STU-2026-02",
      phone: "+91 97012 33499",
      department: "Data Science & AI",
      registeredAt: "2026-10-04T10:05:00.000Z",
      status: "Attended",
      checkedInAt: "2026-10-05T18:10:05.000Z",
      qrCodeDataUrl: ""
    }
  ],
  attendanceLogs: [
    {
      id: "LOG-1",
      ticketId: "TK-AI-10101",
      eventId: "EVT-101",
      name: "Aarav Sharma",
      department: "Computer Science",
      scannedAt: "2026-10-05T17:45:10.000Z",
      method: "QR Scanner",
      gate: "Gate A - Main Lobby"
    },
    {
      id: "LOG-2",
      ticketId: "TK-AI-10102",
      eventId: "EVT-101",
      name: "Sneha Patel",
      department: "Data Science & AI",
      scannedAt: "2026-10-05T17:50:33.000Z",
      method: "QR Scanner",
      gate: "Gate A - Main Lobby"
    },
    {
      id: "LOG-3",
      ticketId: "TK-CD-10301",
      eventId: "EVT-103",
      name: "Sneha Patel",
      department: "Data Science & AI",
      scannedAt: "2026-10-05T18:10:05.000Z",
      method: "Manual Check-In",
      gate: "Lab 4 Entrance"
    }
  ],
  notifications: [
    {
      id: "NOTIF-1",
      type: "system",
      title: "System Initialized",
      message: "Event Management Portal connected and operational.",
      time: "2026-10-05T17:30:00.000Z",
      read: false
    },
    {
      id: "NOTIF-2",
      type: "attendance",
      title: "Check-in Verified",
      message: "Aarav Sharma (TK-AI-10101) checked into AI & Deep Learning Conclave 2026.",
      time: "2026-10-05T17:45:10.000Z",
      read: false
    },
    {
      id: "NOTIF-3",
      type: "attendance",
      title: "Check-in Verified",
      message: "Sneha Patel (TK-AI-10102) successfully verified via QR pass.",
      time: "2026-10-05T17:50:33.000Z",
      read: false
    }
  ]
};

// Database helper
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      saveDB(initialSeed);
      return JSON.parse(JSON.stringify(initialSeed));
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading DB:', err);
    return JSON.parse(JSON.stringify(initialSeed));
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// Generate QR code data URL helper
async function generateQRCode(text) {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 280,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code generation failed:', err);
    return '';
  }
}

// Seed QR codes for pre-registered items if missing
async function ensureQRCodes() {
  const db = loadDB();
  let changed = false;
  for (const reg of db.registrations) {
    if (!reg.qrCodeDataUrl) {
      reg.qrCodeDataUrl = await generateQRCode(JSON.stringify({
        ticketId: reg.ticketId,
        eventId: reg.eventId,
        name: reg.name,
        rollNo: reg.rollNo
      }));
      changed = true;
    }
  }
  if (changed) {
    saveDB(db);
  }
}

ensureQRCodes();

// -------------------------------------------------------------
// SSE Endpoint
// -------------------------------------------------------------
app.get('/api/live-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = Date.now() + Math.random().toString(36).substring(2);
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  res.write(`event: connected\ndata: ${JSON.stringify({ clientId, message: 'Connected to Real-Time Event Management stream' })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

setInterval(() => {
  sseClients.forEach(c => {
    try {
      c.res.write(': heartbeat\n\n');
    } catch (e) {}
  });
}, 25000);

// -------------------------------------------------------------
// AUTHENTICATION APIS (STUDENT & ORGANIZER)
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const db = loadDB();
  const cleanEmail = email.trim().toLowerCase();

  const user = db.users.find(u => 
    u.email.toLowerCase() === cleanEmail && 
    u.password === password &&
    (!role || u.role === role)
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      error: `Invalid credentials for ${role === 'organizer' ? 'Organizer' : 'Student'} login.`
    });
  }

  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

app.post('/api/auth/student-register', (req, res) => {
  const { name, email, password, studentId, department } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
  }

  const db = loadDB();
  const cleanEmail = email.trim().toLowerCase();

  if (db.users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `usr_stu_${Date.now()}`,
    role: "student",
    email: cleanEmail,
    password,
    name: name.trim(),
    studentId: studentId ? studentId.trim() : `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    department: department ? department.trim() : "General"
  };

  db.users.push(newUser);
  saveDB(db);

  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, user: safeUser });
});

// -------------------------------------------------------------
// Event Management APIs
// -------------------------------------------------------------
app.get('/api/events', (req, res) => {
  const db = loadDB();
  const eventsWithStats = db.events.map(evt => {
    const eventRegs = db.registrations.filter(r => r.eventId === evt.id);
    const registeredCount = eventRegs.length;
    const checkedInCount = eventRegs.filter(r => r.status === 'Attended').length;
    const capacityRemaining = Math.max(0, evt.capacity - registeredCount);
    const fillPercentage = Math.round((registeredCount / evt.capacity) * 100);
    const attendancePercentage = registeredCount > 0 ? Math.round((checkedInCount / registeredCount) * 100) : 0;

    return {
      ...evt,
      stats: {
        registeredCount,
        checkedInCount,
        capacityRemaining,
        fillPercentage,
        attendancePercentage,
        isFull: registeredCount >= evt.capacity
      }
    };
  });

  res.json({ success: true, data: eventsWithStats });
});

app.get('/api/events/:id', (req, res) => {
  const db = loadDB();
  const evt = db.events.find(e => e.id === req.params.id);
  if (!evt) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }

  const attendees = db.registrations.filter(r => r.eventId === evt.id);
  const checkedInCount = attendees.filter(r => r.status === 'Attended').length;

  res.json({
    success: true,
    data: {
      ...evt,
      attendees,
      stats: {
        registeredCount: attendees.length,
        checkedInCount,
        capacityRemaining: Math.max(0, evt.capacity - attendees.length),
        fillPercentage: Math.round((attendees.length / evt.capacity) * 100)
      }
    }
  });
});

app.post('/api/events', (req, res) => {
  const { title, category, venue, date, time, description, organizer, capacity } = req.body;

  if (!title || !venue || !date || !capacity) {
    return res.status(400).json({ success: false, error: 'Title, venue, date, and capacity are required.' });
  }

  const db = loadDB();
  const newId = `EVT-${Math.floor(100 + Math.random() * 900)}`;

  const gradients = [
    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
    "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)"
  ];
  const bannerColor = req.body.bannerColor || gradients[Math.floor(Math.random() * gradients.length)];

  const newEvent = {
    id: newId,
    title: title.trim(),
    category: category || "General",
    venue: venue.trim(),
    date,
    time: time || "10:00 AM - 01:00 PM",
    description: description || "No description provided.",
    organizer: organizer || "Event Coordinator",
    capacity: parseInt(capacity, 10),
    bannerColor,
    status: "Published",
    createdAt: new Date().toISOString()
  };

  db.events.unshift(newEvent);

  const notif = {
    id: `NOTIF-${Date.now()}`,
    type: "system",
    title: "New Event Published",
    message: `"${newEvent.title}" has been created with a capacity of ${newEvent.capacity} seats.`,
    time: new Date().toISOString(),
    read: false
  };
  db.notifications.unshift(notif);

  saveDB(db);

  sendSSE('event_created', { event: newEvent, notification: notif });

  res.status(201).json({ success: true, data: newEvent });
});

app.delete('/api/events/:id', (req, res) => {
  const db = loadDB();
  const index = db.events.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }

  const deleted = db.events.splice(index, 1)[0];
  saveDB(db);

  sendSSE('event_deleted', { eventId: req.params.id });
  res.json({ success: true, data: deleted });
});

// -------------------------------------------------------------
// Registration & Capacity Tracking APIs
// -------------------------------------------------------------
app.get('/api/registrations', (req, res) => {
  const db = loadDB();
  const { eventId, search, status, email } = req.query;

  let list = db.registrations;

  if (email) {
    list = list.filter(r => r.email.toLowerCase() === email.toLowerCase());
  }

  if (eventId) {
    list = list.filter(r => r.eventId === eventId);
  }

  if (status) {
    list = list.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.ticketId.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.rollNo && r.rollNo.toLowerCase().includes(q))
    );
  }

  const enriched = list.map(reg => {
    const ev = db.events.find(e => e.id === reg.eventId);
    return {
      ...reg,
      eventTitle: ev ? ev.title : "Event",
      eventVenue: ev ? ev.venue : "",
      eventDate: ev ? ev.date : "",
      eventTime: ev ? ev.time : ""
    };
  });

  res.json({ success: true, data: enriched });
});

app.post('/api/registrations', async (req, res) => {
  const { eventId, name, email, rollNo, phone, department } = req.body;

  if (!eventId || !name || !email) {
    return res.status(400).json({ success: false, error: 'Event, full name, and email are required.' });
  }

  const db = loadDB();
  const targetEvent = db.events.find(e => e.id === eventId);
  if (!targetEvent) {
    return res.status(404).json({ success: false, error: 'Selected event not found.' });
  }

  const currentCount = db.registrations.filter(r => r.eventId === eventId).length;
  if (currentCount >= targetEvent.capacity) {
    return res.status(409).json({
      success: false,
      error: `Event capacity limit reached (${targetEvent.capacity}/${targetEvent.capacity}). Registration closed.`
    });
  }

  const duplicate = db.registrations.find(r => r.eventId === eventId && r.email.toLowerCase() === email.trim().toLowerCase());
  if (duplicate) {
    return res.status(400).json({
      success: false,
      error: 'You are already registered for this event. Ticket ID: ' + duplicate.ticketId,
      existingTicket: duplicate
    });
  }

  const prefix = targetEvent.category.substring(0, 2).toUpperCase() || 'TK';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const ticketId = `TK-${prefix}-${randomNum}`;

  const qrPayload = JSON.stringify({
    ticketId,
    eventId: targetEvent.id,
    name: name.trim(),
    rollNo: rollNo ? rollNo.trim() : 'N/A'
  });

  const qrCodeDataUrl = await generateQRCode(qrPayload);

  const newReg = {
    ticketId,
    eventId: targetEvent.id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    rollNo: rollNo ? rollNo.trim() : 'N/A',
    phone: phone ? phone.trim() : '',
    department: department ? department.trim() : 'General',
    registeredAt: new Date().toISOString(),
    status: "Confirmed",
    checkedInAt: null,
    qrCodeDataUrl
  };

  db.registrations.unshift(newReg);

  const remaining = targetEvent.capacity - (currentCount + 1);
  const notif = {
    id: `NOTIF-${Date.now()}`,
    type: "registration",
    title: "New Participant Registered",
    message: `${newReg.name} registered for "${targetEvent.title}". ${remaining} seats left.`,
    time: new Date().toISOString(),
    read: false
  };
  db.notifications.unshift(notif);

  saveDB(db);

  sendSSE('registration_created', {
    registration: { ...newReg, eventTitle: targetEvent.title },
    eventId: targetEvent.id,
    notification: notif
  });

  res.status(201).json({
    success: true,
    data: {
      ...newReg,
      eventTitle: targetEvent.title,
      eventVenue: targetEvent.venue,
      eventDate: targetEvent.date,
      eventTime: targetEvent.time
    }
  });
});

// -------------------------------------------------------------
// QR Attendance Verification APIs
// -------------------------------------------------------------
app.post('/api/attendance/check-in', (req, res) => {
  let { ticketId, gate, method } = req.body;

  if (!ticketId) {
    return res.status(400).json({ success: false, error: 'Ticket ID or QR string is required.' });
  }

  if (typeof ticketId === 'string' && ticketId.startsWith('{')) {
    try {
      const parsed = JSON.parse(ticketId);
      if (parsed.ticketId) {
        ticketId = parsed.ticketId;
      }
    } catch (e) {}
  }

  const db = loadDB();
  const cleanTicketId = ticketId.trim();
  const reg = db.registrations.find(r => r.ticketId.toUpperCase() === cleanTicketId.toUpperCase());

  if (!reg) {
    return res.status(404).json({
      success: false,
      error: `Invalid Ticket ID: "${cleanTicketId}". No matching registration found in database.`
    });
  }

  const targetEvent = db.events.find(e => e.id === reg.eventId);

  if (reg.status === 'Attended') {
    const formattedCheckIn = new Date(reg.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return res.status(409).json({
      success: false,
      alreadyCheckedIn: true,
      error: `Duplicate Check-In Detected: ${reg.name} was already verified at ${formattedCheckIn}.`,
      registration: reg,
      eventTitle: targetEvent ? targetEvent.title : 'Event'
    });
  }

  const nowIso = new Date().toISOString();
  reg.status = 'Attended';
  reg.checkedInAt = nowIso;

  const logEntry = {
    id: `LOG-${Date.now()}`,
    ticketId: reg.ticketId,
    eventId: reg.eventId,
    name: reg.name,
    department: reg.department,
    scannedAt: nowIso,
    method: method || "QR Scanner",
    gate: gate || "Main Check-In Desk"
  };

  db.attendanceLogs.unshift(logEntry);

  const notif = {
    id: `NOTIF-${Date.now()}`,
    type: "attendance",
    title: "Live Check-in Verified",
    message: `${reg.name} (${reg.ticketId}) successfully checked in to "${targetEvent ? targetEvent.title : 'Event'}".`,
    time: nowIso,
    read: false
  };
  db.notifications.unshift(notif);

  saveDB(db);

  sendSSE('attendance_verified', {
    log: logEntry,
    registration: reg,
    eventTitle: targetEvent ? targetEvent.title : 'Event',
    notification: notif
  });

  res.json({
    success: true,
    message: 'Attendance Verified Successfully!',
    data: {
      log: logEntry,
      registration: reg,
      event: targetEvent
    }
  });
});

app.get('/api/attendance/logs', (req, res) => {
  const db = loadDB();
  const enriched = db.attendanceLogs.map(log => {
    const ev = db.events.find(e => e.id === log.eventId);
    return {
      ...log,
      eventTitle: ev ? ev.title : "Event"
    };
  });
  res.json({ success: true, data: enriched });
});

// -------------------------------------------------------------
// Notifications Module APIs
// -------------------------------------------------------------
app.get('/api/notifications', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.notifications });
});

app.post('/api/notifications/broadcast', (req, res) => {
  const { title, message, type, eventId } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, error: 'Title and message are required.' });
  }

  const db = loadDB();
  let targetEventTitle = "All Events";
  if (eventId && eventId !== 'all') {
    const ev = db.events.find(e => e.id === eventId);
    if (ev) targetEventTitle = ev.title;
  }

  const newNotif = {
    id: `NOTIF-${Date.now()}`,
    type: type || 'broadcast',
    title: title.trim(),
    message: `[${targetEventTitle}] ${message.trim()}`,
    time: new Date().toISOString(),
    read: false
  };

  db.notifications.unshift(newNotif);
  saveDB(db);

  sendSSE('broadcast_message', { notification: newNotif });

  res.status(201).json({ success: true, data: newNotif });
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const db = loadDB();
  const notif = db.notifications.find(n => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    saveDB(db);
  }
  res.json({ success: true });
});

app.post('/api/notifications/mark-all-read', (req, res) => {
  const db = loadDB();
  db.notifications.forEach(n => { n.read = true; });
  saveDB(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// Analytics Dashboard APIs
// -------------------------------------------------------------
app.get('/api/analytics', (req, res) => {
  const db = loadDB();

  const totalEvents = db.events.length;
  const totalCapacity = db.events.reduce((sum, e) => sum + e.capacity, 0);
  const totalRegistrations = db.registrations.length;
  const totalCheckedIn = db.registrations.filter(r => r.status === 'Attended').length;
  const overallAttendanceRate = totalRegistrations > 0 ? Math.round((totalCheckedIn / totalRegistrations) * 100) : 0;
  const overallCapacityFillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  const eventMetrics = db.events.map(e => {
    const regs = db.registrations.filter(r => r.eventId === e.id);
    const checked = regs.filter(r => r.status === 'Attended').length;
    return {
      id: e.id,
      title: e.title,
      category: e.category,
      capacity: e.capacity,
      registered: regs.length,
      checkedIn: checked,
      attendanceRate: regs.length > 0 ? Math.round((checked / regs.length) * 100) : 0,
      fillRate: Math.round((regs.length / e.capacity) * 100)
    };
  });

  const categoryCounts = {};
  db.registrations.forEach(r => {
    const ev = db.events.find(e => e.id === r.eventId);
    const cat = ev ? ev.category : 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const departmentCounts = {};
  db.registrations.forEach(r => {
    const dept = r.department || 'General';
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  const hourlyCheckIns = { "10 AM": 0, "11 AM": 0, "12 PM": 0, "01 PM": 0, "02 PM": 0, "03 PM": 0, "04 PM": 0, "05 PM": 0, "06 PM": 0 };
  db.attendanceLogs.forEach(log => {
    const hour = new Date(log.scannedAt).getHours();
    if (hour >= 10 && hour <= 12) {
      hourlyCheckIns[`${hour} AM`] = (hourlyCheckIns[`${hour} AM`] || 0) + 1;
    } else if (hour === 12) {
      hourlyCheckIns["12 PM"] = (hourlyCheckIns["12 PM"] || 0) + 1;
    } else if (hour > 12 && hour <= 18) {
      const hStr = `0${hour - 12}`.slice(-2);
      hourlyCheckIns[`${hStr} PM`] = (hourlyCheckIns[`${hStr} PM`] || 0) + 1;
    }
  });

  res.json({
    success: true,
    data: {
      kpi: {
        totalEvents,
        totalCapacity,
        totalRegistrations,
        totalCheckedIn,
        overallAttendanceRate,
        overallCapacityFillRate
      },
      eventMetrics,
      categoryCounts,
      departmentCounts,
      hourlyCheckIns,
      recentLogs: db.attendanceLogs.slice(0, 8)
    }
  });
});

// Reset demo data endpoint
app.post('/api/reset-data', async (req, res) => {
  saveDB(initialSeed);
  await ensureQRCodes();
  sendSSE('system_reset', { message: 'Database reset to default seed' });
  res.json({ success: true, message: 'Database reset to default seed.' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Real-Time Event Management Portal is RUNNING!`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
