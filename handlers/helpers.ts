import { Request, Response } from "express";
import fs from "fs";
import path from "path";

// Load database from file
export const loadDatabase = () => {
  const dataPath = path.join(__dirname, "db.json");
  if (fs.existsSync(dataPath)) {
    const jsonData = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(jsonData);
  }
  return { submissions: [] };
};

// Save database to file
export const saveDatabase = (data: any) => {
  const dataPath = path.join(__dirname, "db.json");
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

export const getRoot = (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Slidely Forms App</title>
        <description>View, edit and add data in windows forms!</description>
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
            padding: 20px;
          }
          h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
          }
          .video-container {
            width: 100%;
            max-width: 640px;
            margin-bottom: 20px;
          }
          .video-container iframe {
            width: 100%;
            height: 360px;
            border: none;
            border-radius: 10px;
          }
          .button-container {
            text-align: center;
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
            transition: background-color 0.3s ease;
          }
          button:hover {
            background-color: #17a445;
          }
        </style>
      </head>
      <body>
        <h1>Slidely Forms App</h1>
        <div class="video-container">
          <iframe src="https://drive.google.com/file/d/1hRXGwJhsb85QyGYnRF0gcDPqCYDE_DhF/preview" allow="autoplay"></iframe>
        </div>
        <div class="button-container">
          <a href="https://www.icloud.com/iclouddrive/0252qjT_lBAp86sDKj21bzeIA#Slidely_Form_App">
            <button>Download Windows Executable</button>
          </a>
        </div>
      </body>
    </html>
  `;
  res.send(html);
};

export const getPing = (req: Request, res: Response) => {
  return res.status(200).json({ success: true });
};
