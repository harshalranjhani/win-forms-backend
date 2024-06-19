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
exports.getSearch = exports.putEdit = exports.deleteSubmission = exports.getRead = exports.postSubmit = void 0;
const helpers_1 = require("./helpers");
const postSubmit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    const database = (0, helpers_1.loadDatabase)();
    database.submissions.push(newSubmission);
    (0, helpers_1.saveDatabase)(database);
    //   await sendEmail(name, email, phone, github_link, stopwatch_time);
    return res.status(201).json({ success: true, data: newSubmission });
});
exports.postSubmit = postSubmit;
const getRead = (req, res) => {
    const index = parseInt(req.query.index);
    if (isNaN(index)) {
        return res.status(400).json({ error: "Invalid index" });
    }
    const database = (0, helpers_1.loadDatabase)();
    if (index < 0 || index >= database.submissions.length) {
        return res.status(404).json({ error: "Submission not found" });
    }
    return res
        .status(200)
        .json({ success: true, data: database.submissions[index] });
};
exports.getRead = getRead;
const deleteSubmission = (req, res) => {
    const index = parseInt(req.params.index);
    if (isNaN(index)) {
        return res.status(400).json({ error: "Invalid index" });
    }
    const database = (0, helpers_1.loadDatabase)();
    if (index < 0 || index >= database.submissions.length) {
        return res.status(404).json({ error: "Submission not found" });
    }
    database.submissions.splice(index, 1);
    (0, helpers_1.saveDatabase)(database);
    return res.status(200).json({ success: true, message: "Submission deleted" });
};
exports.deleteSubmission = deleteSubmission;
const putEdit = (req, res) => {
    const index = parseInt(req.params.index);
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    if (isNaN(index)) {
        return res.status(400).json({ error: "Invalid index" });
    }
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const database = (0, helpers_1.loadDatabase)();
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
    (0, helpers_1.saveDatabase)(database);
    return res.status(200).json({ success: true, message: "Submission updated" });
};
exports.putEdit = putEdit;
const getSearch = (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const database = (0, helpers_1.loadDatabase)();
    const results = database.submissions.filter((submission) => submission.email === email);
    return res.status(200).json({ success: true, data: results });
};
exports.getSearch = getSearch;
