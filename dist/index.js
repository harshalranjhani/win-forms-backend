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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const send_1 = require("./mails/send");
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
let submissions = [];
// Load database from file
const loadDatabase = () => {
    const dataPath = path_1.default.join(__dirname, "db.json");
    if (fs_1.default.existsSync(dataPath)) {
        const jsonData = fs_1.default.readFileSync(dataPath, "utf-8");
        return JSON.parse(jsonData);
    }
    return { submissions: [] };
};
// Save database to file
const saveDatabase = (data) => {
    const dataPath = path_1.default.join(__dirname, "db.json");
    fs_1.default.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};
// Vercel-friendly routes
app.get("/", (req, res) => {
    res.send("Slidely Forms App Backend!");
});
app.get("/ping", (req, res) => {
    return res.status(200).json({ success: true });
});
app.post("/submit-vercel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield (0, send_1.sendEmail)(name, email, phone, github_link, stopwatch_time);
    return res.status(201).json({ success: true, data: newSubmission });
}));
app.get("/read-vercel", (req, res) => {
    const index = parseInt(req.query.index);
    if (isNaN(index)) {
        return res.status(400).json({ error: "Invalid index" });
    }
    if (index < 0 || index >= submissions.length) {
        return res.status(404).json({ error: "Submission not found" });
    }
    return res.status(200).json({ success: true, data: submissions[index] });
});
app.delete("/delete-vercel/:index", (req, res) => {
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
app.put("/edit-vercel/:index", (req, res) => {
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
app.get("/search-vercel", (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const results = submissions.filter((submission) => submission.email === email);
    return res.status(200).json({ success: true, data: results });
});
// Local routes with file system operations
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield (0, send_1.sendEmail)(name, email, phone, github_link, stopwatch_time);
    return res.status(201).json({ success: true, data: newSubmission });
}));
app.get("/read", (req, res) => {
    const index = parseInt(req.query.index);
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
app.delete("/delete/:index", (req, res) => {
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
app.put("/edit/:index", (req, res) => {
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
app.get("/search", (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const database = loadDatabase();
    const results = database.submissions.filter((submission) => submission.email === email);
    return res.status(200).json({ success: true, data: results });
});
// Start the server locally
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
exports.default = app;
