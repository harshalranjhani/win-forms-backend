"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchVercel = exports.putEditVercel = exports.deleteVercel = exports.getReadVercel = exports.postSubmitVercel = void 0;
const send_1 = require("../mails/send");
let submissions = [];
const postSubmitVercel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    // In-memory submissions array
    submissions.push(newSubmission);
    yield (0, send_1.sendEmail)(name, email, phone, github_link, stopwatch_time);
    return res.status(201).json({ success: true, data: newSubmission });
});
exports.postSubmitVercel = postSubmitVercel;
const getReadVercel = (req, res) => {
    const index = parseInt(req.query.index);
    if (isNaN(index)) {
        return res.status(400).json({ error: "Invalid index" });
    }
    if (index < 0 || index >= submissions.length) {
        return res.status(404).json({ error: "Submission not found" });
    }
    return res.status(200).json({ success: true, data: submissions[index] });
};
exports.getReadVercel = getReadVercel;
const deleteVercel = (req, res) => {
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
exports.deleteVercel = deleteVercel;
const putEditVercel = (req, res) => {
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
exports.putEditVercel = putEditVercel;
const getSearchVercel = (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const results = submissions.filter((submission) => submission.email === email);
    return res.status(200).json({ success: true, data: results });
};
exports.getSearchVercel = getSearchVercel;
