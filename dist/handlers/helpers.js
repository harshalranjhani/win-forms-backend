"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPing = exports.getRoot = exports.saveDatabase = exports.loadDatabase = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load database from file
const loadDatabase = () => {
    const dataPath = path_1.default.join(__dirname, "db.json");
    if (fs_1.default.existsSync(dataPath)) {
        const jsonData = fs_1.default.readFileSync(dataPath, "utf-8");
        return JSON.parse(jsonData);
    }
    return { submissions: [] };
};
exports.loadDatabase = loadDatabase;
// Save database to file
const saveDatabase = (data) => {
    const dataPath = path_1.default.join(__dirname, "db.json");
    fs_1.default.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};
exports.saveDatabase = saveDatabase;
const getRoot = (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Slidely Forms App</title>
        <style>
          body {
            background-color: #121212;
            color: #ffffff;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          h1 {
            font-size: 2em;
            margin-bottom: 20px;
          }
          button {
            background-color: #1db954;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1em;
            cursor: pointer;
            border-radius: 5px;
            text-decoration: none;
          }
          button:hover {
            background-color: #17a445;
          }
        </style>
      </head>
      <body>
        <h1>Windows Form Executable Download</h1>
        <a href="https://www.icloud.com/iclouddrive/0f6PaEvPoGmgP4zOqxvEzYGDA#Slidely_Form_App">
          <button>Download</button>
        </a>
      </body>
    </html>
  `;
    res.send(html);
};
exports.getRoot = getRoot;
const getPing = (req, res) => {
    return res.status(200).json({ success: true });
};
exports.getPing = getPing;
