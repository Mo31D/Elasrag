import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import pdfParse from "pdf-parse";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('mo'));

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

if (!OPENAI_KEY) {
  console.warn("Warning: OPENAI_API_KEY is not set. Put it in a .env file.");
}

// Helper: read all files in data/ and extract text
async function readDataFolder() {
  const dataDir = path.resolve("./data");
  const files = fs.readdirSync(dataDir);
  let contents = [];
  for (const f of files) {
    const full = path.join(dataDir, f);
    const stat = fs.statSync(full);
    if (stat.isFile()) {
      const ext = path.extname(f).toLowerCase();
      try {
        if (ext === ".pdf") {
          const buffer = fs.readFileSync(full);
          const pdf = await pdfParse(buffer);
          contents.push({ source: f, text: pdf.text });
        } else {
          const text = fs.readFileSync(full, "utf8");
          contents.push({ source: f, text });
        }
      } catch (e) {
        console.error("Error reading", f, e.message);
      }
    }
  }
  return contents;
}

app.post("/api/ask", async (req, res) => {
  try {
    const question = req.body?.question;
    if (!question) return res.status(400).json({ error: "No question provided" });

    // Read data files
    const dataFiles = await readDataFolder();
    // Concatenate but keep sources
    let combined = "";
    for (const d of dataFiles) {
      combined += `\n\n--- SOURCE: ${d.source} ---\n${d.text}\n`;
    }
    // Limit system prompt size to avoid huge payloads (simple truncation)
    const MAX_CHARS = 30000;
    if (combined.length > MAX_CHARS) {
      combined = combined.slice(0, MAX_CHARS) + "\n\n[TRUNCATED]";
    }

    const systemPrompt = `
You are "Mo" — the conscious digital assistant. Answer as Mo, using Mo's files and personality.
Use Arabic or English depending on the user's language. If unsure about a fact, say you don't have enough information.
Here are Mo's files and profile (use them to form answers):

${combined}
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: question }
    ];

    // Call OpenAI Chat Completions
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const j = await resp.json();
    const answer = j?.choices?.[0]?.message?.content ?? "No answer from model.";
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Mo backend running on http://localhost:${port}`));