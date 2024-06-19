import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { sendEmail } from "../mails/send";
import { loadDatabase, saveDatabase } from "./helpers";

export const postSubmit = async (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newSubmission = { name, email, phone, github_link, stopwatch_time };

  const database = loadDatabase();
  database.submissions.push(newSubmission);
  saveDatabase(database);

//   await sendEmail(name, email, phone, github_link, stopwatch_time);

  return res.status(201).json({ success: true, data: newSubmission });
};

export const getRead = (req: Request, res: Response) => {
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
};

export const deleteSubmission = (req: Request, res: Response) => {
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
};

export const putEdit = (req: Request, res: Response) => {
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
};

export const getSearch = (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const database = loadDatabase();
  const results = database.submissions.filter(
    (submission: any) => submission.email === email
  );

  return res.status(200).json({ success: true, data: results });
};
