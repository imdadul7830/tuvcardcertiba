import "express-async-errors";
import express from "express";
import { db } from "../src/db/index";
import { users, trainees, settings, siteContent, invoices, notices } from "../src/db/schema";
import { eq, or, isNull } from "drizzle-orm";
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
    res.json({ success: true, token: "mock-jwt-token", user: { id: user.id, username: user.username, name: user.name, role: user.role, due: user.due, iqamaNumber: user.iqamaNumber, companyName: user.companyName, companyCrNumber: user.companyCrNumber } });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  const allUsers = await db.select().from(users);
  const safeUsers = allUsers.map(u => ({ id: u.id, username: u.username, name: u.name, role: u.role, due: u.due, iqamaNumber: u.iqamaNumber, companyName: u.companyName, companyCrNumber: u.companyCrNumber }));
  res.json(safeUsers);
});

// Add new user
app.post("/api/users", async (req, res) => {
  const { username, password, name, role, iqamaNumber, companyName, companyCrNumber } = req.body;
  const existing = await db.select().from(users).where(eq(users.username, username));
  if (existing.length > 0) {
    return res.status(400).json({ success: false, message: "Username already exists" });
  }
  const newId = Date.now().toString();
  await db.insert(users).values({ id: newId, username, password, name, role: role || 'user', due: 0, iqamaNumber, companyName, companyCrNumber });
  
  const allUsers = await db.select().from(users);
  const safeUsers = allUsers.map(u => ({ id: u.id, username: u.username, name: u.name, role: u.role, due: u.due, iqamaNumber: u.iqamaNumber, companyName: u.companyName, companyCrNumber: u.companyCrNumber }));
  res.json({ success: true, users: safeUsers });
});

// Update user details
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, iqamaNumber, companyName, companyCrNumber, role } = req.body;
  const existing = await db.select().from(users).where(eq(users.id, id));
  if (existing.length > 0) {
    await db.update(users).set({ name, iqamaNumber, companyName, companyCrNumber, role: role || existing[0].role }).where(eq(users.id, id));
    
    const allUsers = await db.select().from(users);
    const safeUsers = allUsers.map(u => ({ id: u.id, username: u.username, name: u.name, role: u.role, due: u.due, iqamaNumber: u.iqamaNumber, companyName: u.companyName, companyCrNumber: u.companyCrNumber }));
    res.json({ success: true, users: safeUsers });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
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

// Pay user bill
app.put("/api/users/:id/pay", async (req, res) => {
  const { id } = req.params;
  const existing = await db.select().from(users).where(eq(users.id, id));
  if (existing.length > 0) {
    await db.update(users).set({ due: 0 }).where(eq(users.id, id));
    await db.update(invoices).set({ status: 'paid' }).where(eq(invoices.userId, id));
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

// Adjust user due (manual debit/credit)
app.post("/api/users/:id/adjust-due", async (req, res) => {
  const { id } = req.params;
  const { amount, type } = req.body; // type: 'credit' | 'debit'
  const parsedAmount = parseInt(amount, 10);
  
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  const existing = await db.select().from(users).where(eq(users.id, id));
  if (existing.length > 0) {
    const currentDue = existing[0].due || 0;
    let newDue = currentDue;
    
    if (type === 'debit') {
      newDue += parsedAmount;
      const invoiceId = `INV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*1000)}`;
      await db.insert(invoices).values({
        id: invoiceId,
        userId: id,
        amount: parsedAmount,
        status: 'pending',
        createdAt: Date.now()
      });
    } else if (type === 'credit') {
      newDue = Math.max(0, currentDue - parsedAmount);
    }
    
    await db.update(users).set({ due: newDue }).where(eq(users.id, id));
    res.json({ success: true, newDue });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

// Notices
app.get("/api/notices", async (req, res) => {
  const userId = req.query.userId as string;
  let allNotices;
  if (userId) {
    allNotices = await db.select().from(notices).where(or(eq(notices.userId, userId), isNull(notices.userId)));
  } else {
    allNotices = await db.select().from(notices);
  }
  res.json(allNotices);
});

app.post("/api/notices", async (req, res) => {
  const { title, message, userId } = req.body;
  const newId = Date.now().toString();
  await db.insert(notices).values({
    id: newId,
    title,
    message,
    userId: userId || null,
    createdAt: Date.now()
  });
  res.json({ success: true, notice: { id: newId, title, message, userId: userId || null, createdAt: Date.now() } });
});

app.delete("/api/notices/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(notices).where(eq(notices.id, id));
  res.json({ success: true });
});

// Get invoices
app.get("/api/invoices", async (req, res) => {
  const userId = req.query.userId as string;
  let allInvoices;
  if (userId) {
    allInvoices = await db.select().from(invoices).where(eq(invoices.userId, userId));
  } else {
    allInvoices = await db.select().from(invoices);
  }
  
  // Join with users to get username
  const allUsers = await db.select().from(users);
  const userMap = new Map(allUsers.map(u => [u.id, u.username]));
  
  const formattedInvoices = allInvoices.map(inv => ({
    ...inv,
    username: userMap.get(inv.userId) || 'Unknown'
  }));
  
  res.json(formattedInvoices);
});

// Pay single invoice
app.put("/api/invoices/:id/pay", async (req, res) => {
  const { id } = req.params;
  const invRecords = await db.select().from(invoices).where(eq(invoices.id, id));
  if (invRecords.length > 0) {
    const inv = invRecords[0];
    if (inv.status === 'pending' || inv.status === 'overdue') {
      await db.update(invoices).set({ status: 'paid' }).where(eq(invoices.id, id));
      
      const userRecords = await db.select().from(users).where(eq(users.id, inv.userId));
      if (userRecords.length > 0) {
        const newDue = Math.max(0, (userRecords[0].due || 0) - inv.amount);
        await db.update(users).set({ due: newDue }).where(eq(users.id, inv.userId));
      }
    }
    // Simulate sending email notification
    console.log(`[EMAIL NOTIFICATION] Sent payment receipt to user for invoice ${id}`);
    res.json({ success: true, message: "Invoice marked as paid and email notification sent" });
  } else {
    res.status(404).json({ success: false, message: "Invoice not found" });
  }
});

// Notify/Overdue invoice
app.post("/api/invoices/:id/notify", async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'overdue_reminder'
  const invRecords = await db.select().from(invoices).where(eq(invoices.id, id));
  
  if (invRecords.length > 0) {
    if (type === 'overdue_reminder') {
      await db.update(invoices).set({ status: 'overdue' }).where(eq(invoices.id, id));
      console.log(`[EMAIL NOTIFICATION] Sent overdue reminder to user for invoice ${id}`);
      res.json({ success: true, message: "Invoice marked as overdue and reminder sent" });
    } else {
      res.json({ success: true });
    }
  } else {
    res.status(404).json({ success: false, message: "Invoice not found" });
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
  const userId = req.query.userId as string;
  const role = req.query.role as string;

  let allTrainees;
  if (role === 'user' && userId) {
    allTrainees = await db.select().from(trainees).where(eq(trainees.addedBy, userId));
  } else {
    allTrainees = await db.select().from(trainees);
  }
  res.json(allTrainees);
});

// Add new trainee
app.post("/api/trainees", async (req, res) => {
  const { name, iqama, company, project, course, photoUrl, issueDate, expiryDate, trainedBy, approvedBy, levelCategory, addedBy } = req.body;
  
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
    status: "Valid",
    addedBy: addedBy || null,
    createdAt: Date.now()
  };

  await db.insert(trainees).values(newTrainee);

  if (addedBy) {
    const userRecords = await db.select().from(users).where(eq(users.id, addedBy));
    if (userRecords.length > 0) {
      const currentDue = userRecords[0].due || 0;
      await db.update(users)
        .set({ due: currentDue + 50 })
        .where(eq(users.id, addedBy));

      // Create an invoice record
      const invoiceId = `INV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*1000)}`;
      await db.insert(invoices).values({
        id: invoiceId,
        userId: addedBy,
        amount: 50,
        status: 'pending',
        createdAt: Date.now()
      });
    }
  }

  res.json({ success: true, trainee: newTrainee });
});

// Update trainee
app.put("/api/trainees/:id", async (req, res) => {
  const { id } = req.params;
  const { name, iqama, company, project, course, photoUrl, issueDate, expiryDate, trainedBy, approvedBy, levelCategory } = req.body;
  
  const updatedTrainee = {
    name,
    iqama,
    company,
    project: project || "N/A",
    course,
    photoUrl: photoUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256",
    issueDate,
    expiryDate,
    trainedBy,
    approvedBy,
    levelCategory,
  };

  await db.update(trainees).set(updatedTrainee).where(eq(trainees.id, id));
  
  const fetched = await db.select().from(trainees).where(eq(trainees.id, id));
  
  res.json({ success: true, trainee: fetched[0] });
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

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error in API route:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;
