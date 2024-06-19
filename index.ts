import express, { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";

import { mailTemplate } from "./mails/template";
import dotenv from "dotenv";
import { sendEmail } from "./mails/send";
const app: Express = express();

app.use(express.json());
dotenv.config();

let submissions: any[] = [];

// Load database from file
const loadDatabase = () => {
  const dataPath = path.join(__dirname, "db.json");
  if (fs.existsSync(dataPath)) {
    const jsonData = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(jsonData);
  }
  return { submissions: [] };
};

// Save database to file
const saveDatabase = (data: any) => {
  const dataPath = path.join(__dirname, "db.json");
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Vercel-friendly routes
app.get("/", (req: Request, res: Response) => {
  res.send("Slidely Forms App Backend!");
});

app.get("/ping", (req: Request, res: Response) => {
  return res.status(200).json({ success: true });
});

app.post("/submit-vercel", async (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newSubmission = {
    name,
    email,
    phone,
    github_link,
    stopwatch_time,
  };

  submissions.push(newSubmission);
  await sendEmail(name, email, phone, github_link, stopwatch_time);

  return res.status(201).json({ success: true, data: newSubmission });
});

app.get("/read-vercel", (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string);

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

  if (index < 0 || index >= submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  return res.status(200).json({ success: true, data: submissions[index] });
});

app.delete("/delete-vercel/:index", (req: Request, res: Response) => {
  const index = parseInt(req.params.index);

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

  if (index < 0 || index >= submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  submissions.splice(index, 1);

  return res.status(200).json({ success: true, message: "Submission deleted" });
});

app.put("/edit-vercel/:index", (req: Request, res: Response) => {
  const index = parseInt(req.params.index);
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (index < 0 || index >= submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  submissions[index] = { name, email, phone, github_link, stopwatch_time };

  return res.status(200).json({ success: true, message: "Submission updated" });
});

app.get("/search-vercel", (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const results = submissions.filter(
    (submission: any) => submission.email === email
  );

  return res.status(200).json({ success: true, data: results });
});

// Local routes with file system operations
app.post("/submit", async (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newSubmission = {
    name,
    email,
    phone,
    github_link,
    stopwatch_time,
  };

  const database = loadDatabase();
  database.submissions.push(newSubmission);
  saveDatabase(database);

  await sendEmail(name, email, phone, github_link, stopwatch_time);

  return res.status(201).json({ success: true, data: newSubmission });
});

app.get("/read", (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string);

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

  const database = loadDatabase();

  if (index < 0 || index >= database.submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  return res
    .status(200)
    .json({ success: true, data: database.submissions[index] });
});

app.delete("/delete/:index", (req: Request, res: Response) => {
  const index = parseInt(req.params.index);

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

  const database = loadDatabase();

  if (index < 0 || index >= database.submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  database.submissions.splice(index, 1);
  saveDatabase(database);

  return res.status(200).json({ success: true, message: "Submission deleted" });
});

app.put("/edit/:index", (req: Request, res: Response) => {
  const index = parseInt(req.params.index);
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const database = loadDatabase();

  if (index < 0 || index >= database.submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  database.submissions[index] = {
    name,
    email,
    phone,
    github_link,
    stopwatch_time,
  };
  saveDatabase(database);

  return res.status(200).json({ success: true, message: "Submission updated" });
});

app.get("/search", (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const database = loadDatabase();
  const results = database.submissions.filter(
    (submission: any) => submission.email === email
  );

  return res.status(200).json({ success: true, data: results });
});

// Start the server locally
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
