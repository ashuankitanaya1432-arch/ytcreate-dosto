import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.ELEVENLABS_API_KEY) {
  console.warn("Warning: ELEVENLABS_API_KEY is not set. Add it to .env");
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "30kb" }));
app.use(express.static("public"));

const apiLimiter = rateLimit({ windowMs: 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

app.get("/api/voices", apiLimiter, async (_req, res) => {
  try {
    const r = await fetch("https://api.elevenlabs.io/v2/voices", {
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY }
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.detail?.message || "Could not load voices" });
    res.json({ voices: (data.voices || []).map(v => ({
      voice_id: v.voice_id, name: v.name,
      category: v.category || "", labels: v.labels || {}
    })) });
  } catch {
    res.status(502).json({ error: "ElevenLabs से voices लोड नहीं हो पाईं।" });
  }
});

app.post("/api/tts", apiLimiter, async (req, res) => {
  const { text, voice_id, model_id = "eleven_multilingual_v2", speed = 1 } = req.body || {};
  if (typeof text !== "string" || !text.trim()) return res.status(400).json({ error: "कृपया टेक्स्ट लिखें।" });
  if (text.length > 3000) return res.status(400).json({ error: "एक बार में अधिकतम 3000 अक्षर भेजें।" });
  if (typeof voice_id !== "string" || !/^[\w-]{5,80}$/.test(voice_id)) return res.status(400).json({ error: "कृपया वैध voice चुनें।" });
  const safeSpeed = Math.min(1.2, Math.max(0.7, Number(speed) || 1));
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice_id)}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: safeSpeed }
      })
    });
    if (!r.ok) {
      const detail = await r.text();
      return res.status(r.status).json({ error: `ElevenLabs error (${r.status}): ${detail.slice(0, 500)}` });
    }
    const audio = Buffer.from(await r.arrayBuffer());
    res.set({ "Content-Type": "audio/mpeg", "Content-Length": audio.length, "Cache-Control": "no-store" });
    res.send(audio);
  } catch {
    res.status(502).json({ error: "Voice generate नहीं हो पाई। बाद में फिर कोशिश करें।" });
  }
});

app.listen(PORT, () => console.log(`YTcreate Dosto running at http://localhost:${PORT}`));
