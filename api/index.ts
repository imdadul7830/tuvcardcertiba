import express from "express";
import { db } from "../src/db/index";
import { users, trainees, settings, siteContent } from "../src/db/schema";
import { eq, or } from "drizzle-orm";
import { seedDatabase } from "../src/db/seed";

const app = express();

app.use(express.json());

// Seed DB
seedDatabase().then(() => {
  console.log("Database seeded successfully");
}).catch(err => {
  console.error("Error seeding database:", err);
});

// --- API Routes ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running!" });
});

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const userRecords = await db.select().from(users).where(eq(users.username, username));
  const user = userRecords[0];
  if (user && user.password === password) {
    res.json({ success: true, token: "mock-jwt-token", user: { id: user.id, username: user.username, name: user.name } });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  const allUsers = await db.select().from(users);
  const safeUsers = allUsers.map(u => ({ id: u.id, username: u.username, name: u.name }));
  res.json(safeUsers);
});

// Add new user
app.post("/api/users", async (req, res) => {
  const { username, password, name } = req.body;
  const existing = await db.select().from(users).where(eq(users.username, username));
  if (existing.length > 0) {
    return res.status(400).json({ success: false, message: "Username already exists" });
  }
  const newId = Date.now().toString();
  await db.insert(users).values({ id: newId, username, password, name });
  
  const allUsers = await db.select().from(users);
  const safeUsers = allUsers.map(u => ({ id: u.id, username: u.username, name: u.name }));
  res.json({ success: true, users: safeUsers });
});

// Update user password
app.put("/api/users/:id/password", async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const existing = await db.select().from(users).where(eq(users.id, id));
  if (existing.length > 0) {
    await db.update(users).set({ password: newPassword }).where(eq(users.id, id));
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

// Delete user
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const allUsers = await db.select().from(users);
  if (allUsers.length <= 1) {
    return res.status(400).json({ success: false, message: "Cannot delete the last user" });
  }
  await db.delete(users).where(eq(users.id, id));
  res.json({ success: true });
});

// Get site content
app.get("/api/content", async (req, res) => {
  const contentRecs = await db.select().from(siteContent).where(eq(siteContent.id, "default"));
  if (contentRecs.length > 0) {
    res.json(contentRecs[0].data);
  } else {
    res.json({});
  }
});

// Update site content
app.put("/api/content", async (req, res) => {
  const contentRecs = await db.select().from(siteContent).where(eq(siteContent.id, "default"));
  if (contentRecs.length > 0) {
    const currentData = contentRecs[0].data as Record<string, any>;
    const newData = { ...currentData, ...req.body };
    await db.update(siteContent).set({ data: newData }).where(eq(siteContent.id, "default"));
    res.json({ success: true, siteContent: newData });
  } else {
    res.status(404).json({ success: false, message: "Content not found" });
  }
});

// Get all trainees
app.get("/api/trainees", async (req, res) => {
  const allTrainees = await db.select().from(trainees);
  res.json(allTrainees);
});

// Add new trainee
app.post("/api/trainees", async (req, res) => {
  const { name, iqama, company, project, course, photoUrl, issueDate, expiryDate, trainedBy, approvedBy, levelCategory } = req.body;
  
  // Generate simple ID if none provided, or use iqama
  const newId = iqama || `ID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`;

  const newTrainee = {
    id: newId,
    name,
    iqama,
    company,
    project: project || "N/A",
    course,
    photoUrl: photoUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256",
    issueDate: issueDate || new Date().toISOString().split('T')[0],
    expiryDate: expiryDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
    trainedBy: trainedBy || "Certiva Instructor",
    approvedBy: approvedBy || "Certiva Admin",
    levelCategory: levelCategory || "NA",
    status: "Valid"
  };

  await db.insert(trainees).values(newTrainee);
  res.json({ success: true, trainee: newTrainee });
});

// Delete trainee
app.delete("/api/trainees/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(trainees).where(eq(trainees.id, id));
  res.json({ success: true });
});

// Get settings
app.get("/api/settings", async (req, res) => {
  const settingsRecs = await db.select().from(settings).where(eq(settings.id, "default"));
  if (settingsRecs.length > 0) {
    res.json({ courses: settingsRecs[0].courses, branches: settingsRecs[0].branches });
  } else {
    res.json({ courses: [], branches: [] });
  }
});

// Add course
app.post("/api/courses", async (req, res) => {
  const { course } = req.body;
  const settingsRecs = await db.select().from(settings).where(eq(settings.id, "default"));
  if (settingsRecs.length > 0) {
    const currentCourses = settingsRecs[0].courses as string[];
    if (course && !currentCourses.includes(course)) {
      currentCourses.push(course);
      await db.update(settings).set({ courses: currentCourses }).where(eq(settings.id, "default"));
    }
    res.json({ success: true, courses: currentCourses });
  } else {
    res.status(404).json({ success: false });
  }
});

// Add branch
app.post("/api/branches", async (req, res) => {
  const { branch } = req.body;
  const settingsRecs = await db.select().from(settings).where(eq(settings.id, "default"));
  if (settingsRecs.length > 0) {
    const currentBranches = settingsRecs[0].branches as string[];
    if (branch && !currentBranches.includes(branch)) {
      currentBranches.push(branch);
      await db.update(settings).set({ branches: currentBranches }).where(eq(settings.id, "default"));
    }
    res.json({ success: true, branches: currentBranches });
  } else {
    res.status(404).json({ success: false });
  }
});

// Verify Certificate or ID Card
app.get("/api/verify/:id", async (req, res) => {
  const { id } = req.params;
  
  const matchedTrainees = await db.select().from(trainees).where(or(eq(trainees.id, id), eq(trainees.iqama, id)));
  const trainee = matchedTrainees[0];
  
  if (trainee) {
    return res.json({
      success: true,
      type: "id_card",
      data: {
        id: trainee.id,
        name: trainee.name,
        role: trainee.course,
        organization: trainee.company,
        project: trainee.project,
        validUntil: trainee.expiryDate,
        status: trainee.status,
        iqama: trainee.iqama,
        photoUrl: trainee.photoUrl
      }
    });
  }

  // Mock for generic certificates starting with CERT
  if (id.startsWith("CERT-")) {
    return res.json({
      success: true,
      type: "certificate",
      data: {
        id: id,
        name: "Verified Student",
        course: "General Training",
        issueDate: "2023-10-15",
        expiryDate: "2026-10-14",
        status: "Valid"
      }
    });
  } 

  return res.status(404).json({
    success: false,
    message: "Record not found. Please check the ID and try again."
  });
});

// Example backend route for contact form
app.post("/api/contact", (req, res) => {
  const { firstName, lastName, email, service, message } = req.body;
  console.log("Received contact form submission:", { firstName, lastName, email, service, message });
  res.json({ 
    success: true, 
    message: "Thank you for contacting Certiva TUV. We will get back to you shortly." 
  });
});

export default app;
