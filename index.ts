import express, { Express } from "express";
import dotenv from "dotenv";
import { getPing, getRoot } from "./handlers/helpers";
import { deleteVercel, getReadVercel, getSearchVercel, postSubmitVercel, putEditVercel } from "./handlers/vercel";
import { deleteSubmission, getRead, getSearch, postSubmit, putEdit } from "./handlers/local";

const app: Express = express();

app.use(express.json());
dotenv.config();

// Vercel-friendly routes
app.get("/", getRoot);
app.get("/ping", getPing);
app.post("/submit-vercel", postSubmitVercel);
app.get("/read-vercel", getReadVercel);
app.delete("/delete-vercel/:index", deleteVercel);
app.put("/edit-vercel/:index", putEditVercel);
app.get("/search-vercel", getSearchVercel);

// Local routes with file system operations
app.post("/submit", postSubmit);
app.get("/read", getRead);
app.delete("/delete/:index", deleteSubmission);
app.put("/edit/:index", putEdit);
app.get("/search", getSearch);

// Start the server locally
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
