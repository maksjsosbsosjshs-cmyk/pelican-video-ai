
import express from "express";
import { fal } from "@fal-ai/client";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
  res.send("Pelican Video AI está online!");
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return res.status(400).json({
        error: "Descreva o vídeo que deseja criar."
      });
    }

    if (prompt.length > 1500) {
      return res.status(400).json({
        error: "A descrição deve ter até 1500 caracteres."
      });
    }

    const result = await fal.subscribe(
      "fal-ai/wan/v2.7/text-to-video",
      {
        input: {
          prompt: prompt.trim(),
          aspect_ratio: "16:9"
        },
        logs: true
      }
    );

    res.json({
      success: true,
      video: result.data.video.url
    });

  } catch (error) {
    console.error("Erro na geração:", error);

    res.status(500).json({
      error: "Não foi possível gerar o vídeo. Verifique a API e os créditos."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Pelican online na porta ${PORT}`);
});
