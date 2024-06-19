"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("./handlers/helpers");
const vercel_1 = require("./handlers/vercel");
const local_1 = require("./handlers/local");
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
// Vercel-friendly routes
app.get("/", helpers_1.getRoot);
app.get("/ping", helpers_1.getPing);
app.post("/submit-vercel", vercel_1.postSubmitVercel);
app.get("/read-vercel", vercel_1.getReadVercel);
app.delete("/delete-vercel/:index", vercel_1.deleteVercel);
app.put("/edit-vercel/:index", vercel_1.putEditVercel);
app.get("/search-vercel", vercel_1.getSearchVercel);
// Local routes with file system operations
app.post("/submit", local_1.postSubmit);
app.get("/read", local_1.getRead);
app.delete("/delete/:index", local_1.deleteSubmission);
app.put("/edit/:index", local_1.putEdit);
app.get("/search", local_1.getSearch);
// Start the server locally
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
exports.default = app;
