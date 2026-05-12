import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export interface GenerateImageParams {
  title: string;
  description?: string;
  style: string;
  includeText?: boolean;
  mood?: string;
}

// ---------------------
// Helper Function
// ---------------------
// Replace ONLY your generateText() function with this safer version

// REPLACE ONLY your generateText() function with this version.
// This fixes "Failed to generate content" when model is null or API key is missing.

async function generateText(prompt: string): Promise<string> {
  // Check API key/model before calling Gemini
  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file."
    );
  }

  if (!model) {
    throw new Error("Gemini model could not be initialized.");
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || !text.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    return text.trim();
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    const message =
      error?.message ||
      error?.toString?.() ||
      "Failed to generate content. Please try again.";

    if (message.includes("API key")) {
      throw new Error("Invalid Gemini API key.");
    }

    if (message.includes("quota")) {
      throw new Error("Gemini API quota exceeded.");
    }

    if (message.includes("429")) {
      throw new Error("Too many requests. Please try again in a minute.");
    }

    if (message.includes("503")) {
      throw new Error("Gemini service temporarily unavailable.");
    }

    throw new Error(message);
  }
}

// ---------------------
// Generate Hook
// ---------------------
export async function generateHook(
  topic: string,
  platform: string,
  style: string
): Promise<string> {
  const prompt = `
Generate ONE viral hook for a ${platform} short video.

Topic: ${topic}
Style: ${style}

Requirements:
- Maximum 20 words
- Highly engaging
- Curiosity-driven
- Return only the hook
`;

  return generateText(prompt);
}

// ---------------------
// Generate Full Script
// ---------------------
export async function generateScript(
  topic: string,
  niche: string,
  platform: string,
  style: string
): Promise<string> {
  const prompt = `
Create a viral short-form video script.

Topic: ${topic}
Niche: ${niche}
Platform: ${platform}
Style: ${style}

Requirements:
- 150 to 250 words
- Clear and engaging
- Optimized for short-form video
- Return only the script
`;

  return generateText(prompt);
}

// ---------------------
// Generate Hashtags
// ---------------------
export async function generateHashtags(
  topic: string,
  niche: string,
  platform: string
): Promise<string[]> {
  const prompt = `
Generate exactly 10 relevant hashtags for:

Topic: ${topic}
Niche: ${niche}
Platform: ${platform}

Rules:
- Return hashtags separated by commas only
- No explanations
- Do not include # symbol
`;

  const text = await generateText(prompt);

  return text
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean)
    .slice(0, 10);
}

// ---------------------
// Generate Scenes
// ---------------------
export async function generateScenes(script: string): Promise<any[]> {
  const prompt = `
Based on the following script, generate a JSON array of scene objects.

Each scene must contain:
- id
- timestamp
- description
- visual
- audio
- duration

Return ONLY valid JSON.

Script:
${script}
`;

  const text = await generateText(prompt);

  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    // Fallback
    return [
      {
        id: 1,
        timestamp: "0:00",
        description: "Introduction scene",
        visual: "Talking head",
        audio: "Voiceover",
        duration: 5,
      },
    ];
  }
}

// ---------------------
// Viral Score
// ---------------------
export async function calculateViralScore(
  topic: string,
  hook: string,
  platform: string
): Promise<number> {
  const prompt = `
Rate the viral potential of this content from 1 to 100.

Topic: ${topic}
Hook: ${hook}
Platform: ${platform}

Return ONLY the number.
`;

  const text = await generateText(prompt);
  const score = parseInt(text.match(/\d+/)?.[0] || "75", 10);

  return Math.min(Math.max(score, 1), 100);
}

// ---------------------
// Thumbnail Generator (Placeholder)
// ---------------------
export async function generateImage(
  params: GenerateImageParams
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  // Gradient styles
  const gradients: Record<string, string[]> = {
    minimal: ["#1e293b", "#334155"],
    bold: ["#dc2626", "#ea580c"],
    gradient: ["#8b5cf6", "#ec4899"],
    dark: ["#0f172a", "#000000"],
    neon: ["#06b6d4", "#a855f7"],
    pastel: ["#f9a8d4", "#c084fc"],
  };

  const colors = gradients[params.style] || gradients.gradient;

  const gradient = ctx.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
  );
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);

  // Background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative circles
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 180 + 60,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Title text
  if (params.includeText !== false) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 72px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxWidth = canvas.width - 120;
    const words = params.title.split(" ");
    const lines: string[] = [];

    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine + word + " ";
      const width = ctx.measureText(testLine).width;

      if (width > maxWidth && currentLine) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    const lineHeight = 90;
    const startY =
      canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.slice(0, 4).forEach((line, index) => {
      // Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillText(
        line,
        canvas.width / 2 + 4,
        startY + index * lineHeight + 4
      );

      // Main text
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        line,
        canvas.width / 2,
        startY + index * lineHeight
      );
    });
  }

  return canvas.toDataURL("image/png");
}
// ---------------------
// Storyboard Generator (Placeholder)
// ---------------------
export async function generateStoryboard(
  scenes: any[]
): Promise<string[]> {
  return [];
}