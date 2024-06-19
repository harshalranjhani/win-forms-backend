import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { sendEmail } from "../mails/send";
import { loadDatabase, saveDatabase } from "./helpers";

export const postSubmitVercel = async (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newSubmission = { name, email, phone, github_link, stopwatch_time };

  // In-memory submissions array
  const submissions = loadDatabase().submissions;
  submissions.push(newSubmission);

  await sendEmail(name, email, phone, github_link, stopwatch_time);

  return res.status(201).json({ success: true, data: newSubmission });
};

export const getReadVercel = (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string);

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

  const submissions = loadDatabase().submissions;

  if (index < 0 || index >= submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  return res.status(200).json({ success: true, data: submissions[index] });
};

export const deleteVercel = (req: Request, res: Response) => {
  const index = parseInt(req.params.index);

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

  const submissions = loadDatabase().submissions;

  if (index < 0 || index >= submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  submissions.splice(index, 1);
  saveDatabase({ submissions });

  return res.status(200).json({ success: true, message: "Submission deleted" });
};

export const putEditVercel = (req: Request, res: Response) => {
  const index = parseInt(req.params.index);
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const submissions = loadDatabase().submissions;

  if (index < 0 || index >= submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  submissions[index] = { name, email, phone, github_link, stopwatch_time };
  saveDatabase({ submissions });

  return res.status(200).json({ success: true, message: "Submission updated" });
};

export const getSearchVercel = (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const submissions = loadDatabase().submissions;
  const results = submissions.filter(
    (submission: any) => submission.email === email
  );

  return res.status(200).json({ success: true, data: results });
};
