import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { sendEmail } from "../mails/send";
let submissions: any[] = [];

export const postSubmitVercel = async (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newSubmission = { name, email, phone, github_link, stopwatch_time };

  // In-memory submissions array
  submissions.push(newSubmission);

  await sendEmail(name, email, phone, github_link, stopwatch_time);

  return res.status(201).json({ success: true, data: newSubmission });
};

export const getReadVercel = (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string);

  if (isNaN(index)) {
    return res.status(400).json({ error: "Invalid index" });
  }

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

  if (index < 0 || index >= submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  submissions.splice(index, 1);

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

  if (index < 0 || index >= submissions.length) {
    return res.status(404).json({ error: "Submission not found" });
  }

  submissions[index] = { name, email, phone, github_link, stopwatch_time };

  return res.status(200).json({ success: true, message: "Submission updated" });
};

export const getSearchVercel = (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const results = submissions.filter(
    (submission: any) => submission.email === email
  );

  return res.status(200).json({ success: true, data: results });
};
