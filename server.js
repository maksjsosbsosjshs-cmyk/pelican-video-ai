
import express from "express";
import { fal } from "@fal-ai/client";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.static("public"));

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    app: "Pelican Video AI"
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body || {};

    if (typeof prompt !== "string" ||
        prompt.trim().length < 3 ||
        prompt.length > 1500) {
      return res.status(400).json({
        error: "Descrição inválida."
      });
    }

    if (!process.env.FAL_KEY) {
      return res.status(503).json({
        error: "API ainda não configurada."
      });
    }

    const result = await fal.subscribe(
      "fal-ai/wan/v2.7/text-to-video",
      {
        input: {
          prompt: prompt.trim(),
          duration: 2,
          resolution: "720p",
          aspect_ratio: "16:9"
        }
      }
    );

    res.json({
      success: true,
      video: result.data.video.url
    });

  } catch (error) {
    console.error("Fal API error:", error);

    res.status(500).json({
      error: "Não foi possível gerar o vídeo."
    });
  }
});

app.listen(PORT, () => {
  console.log("Pelican Video AI online!");
});
