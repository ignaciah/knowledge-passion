import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization of Gemini client to avoid startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured. Please add it via the Secrets panel in Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Map generation schema definition
const mapSchema = {
  type: Type.OBJECT,
  properties: {
    passion: { type: Type.STRING, description: "The name of the passion/interest being mapped." },
    tagline: { type: Type.STRING, description: "An enthusiastic, highly motivating 1-sentence tagline for this passion." },
    intro: { type: Type.STRING, description: "A warm, deeply encouraging introductory paragraph (3-4 sentences) that frames this passion and ignites the user's curiosity." },
    landscape: {
      type: Type.ARRAY,
      description: "A comprehensive coverage of 4 distinct broad landscape areas. Quality and focus are paramount.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique identifier for this area, e.g., 'foundation', 'creative', 'technical', 'advanced'." },
          name: { type: Type.STRING, description: "An elegant, descriptive name for this landscape section." },
          description: { type: Type.STRING, description: "A highly engaging explanation of what this area covers." },
          depthAreas: {
            type: Type.ARRAY,
            description: "3 highly focused, progressive sub-topics/specializations going deeper into this area.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "A unique identifier, e.g., 'sub-1', 'sub-2'." },
                name: { type: Type.STRING, description: "Name of the sub-topic." },
                description: { type: Type.STRING, description: "Deeper insights, key concepts, or theories related to this sub-topic." },
                difficulty: { type: Type.STRING, description: "Beginner, Intermediate, or Advanced" },
                entryPoints: {
                  type: Type.ARRAY,
                  description: "Practical entry points for action.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, description: "Either 'Tool', 'Project', or 'Resource'" },
                      name: { type: Type.STRING, description: "Name of the tool, project idea, or learning resource." },
                      description: { type: Type.STRING, description: "An encouraging call-to-action description of what the user should do with this tool/project/resource." }
                    },
                    required: ["type", "name", "description"]
                  }
                }
              },
              required: ["id", "name", "description", "difficulty", "entryPoints"]
            }
          }
        },
        required: ["id", "name", "description", "depthAreas"]
      }
    },
    unexpectedConnections: {
      type: Type.ARRAY,
      description: "Exactly 2 surprising, exciting, or non-obvious connections where this passion overlaps with another entirely different discipline.",
      items: {
        type: Type.OBJECT,
        properties: {
          connectedTo: { type: Type.STRING, description: "The surprising sister discipline (e.g., 'Thermodynamics of Coffee Roasting', 'The Mathematics of Origami')." },
          story: { type: Type.STRING, description: "A mind-expanding, high-energy explanation of how these two fields connect." },
          sparkIdea: { type: Type.STRING, description: "A concrete, exciting crossover project idea that combines both fields." }
        },
        required: ["connectedTo", "story", "sparkIdea"]
      }
    },
    nextSteps: {
      type: Type.ARRAY,
      description: "Exactly 3 quick-win, concrete actions the user can take today to kickstart their journey.",
      items: { type: Type.STRING }
    }
  },
  required: ["passion", "tagline", "intro", "landscape", "unexpectedConnections", "nextSteps"]
};

// Node deepening schema definition
const deepenSchema = {
  type: Type.OBJECT,
  properties: {
    subAreaName: { type: Type.STRING, description: "The name of the sub-area being deepened." },
    conceptBreakdown: {
      type: Type.ARRAY,
      description: "A breakdown of 3 core concepts/theories crucial to mastering this topic.",
      items: {
        type: Type.OBJECT,
        properties: {
          concept: { type: Type.STRING, description: "Name of the core concept." },
          explanation: { type: Type.STRING, description: "A clear, insightful, and accessible explanation of the concept." }
        },
        required: ["concept", "explanation"]
      }
    },
    quickStartGuides: {
      type: Type.ARRAY,
      description: "2 step-by-step beginner-friendly guides to practical projects.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Name of the project guide." },
          estimatedTime: { type: Type.STRING, description: "Estimated time to complete, e.g., '45 minutes', '1 weekend'." },
          steps: {
            type: Type.ARRAY,
            description: "An ordered array of clear, actionable steps.",
            items: { type: Type.STRING }
          }
        },
        required: ["title", "estimatedTime", "steps"]
      }
    },
    curatedResources: {
      type: Type.ARRAY,
      description: "3 highly specific real-world recommendations (specific web tools, famous books, open-source repos, or courses).",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the resource." },
          type: { type: Type.STRING, description: "Type of resource, e.g., 'Book', 'GitHub Repo', 'Online Tool', 'Course'." },
          description: { type: Type.STRING, description: "Why this resource is essential and how it helps." },
          urlQuery: { type: Type.STRING, description: "A specific search or reference query the user can use to find it." }
        },
        required: ["name", "type", "description", "urlQuery"]
      }
    },
    encouragingMessage: { type: Type.STRING, description: "A personal, highly encouraging closing word from Passion Compass." }
  },
  required: ["subAreaName", "conceptBreakdown", "quickStartGuides", "curatedResources", "encouragingMessage"]
};

// API Endpoint for generating knowledge maps
app.post("/api/generate-map", async (req, res) => {
  const { passion } = req.body;
  if (!passion || typeof passion !== "string" || passion.trim() === "") {
    return res.status(400).json({ error: "Passion name is required and must be a non-empty string." });
  }

  try {
    const ai = getGeminiClient();
    const systemInstruction = `You are Passion Compass, an expert knowledge mapper and passionate guide. 
Your purpose is to help people explore and deepen their interests by generating structured, insightful knowledge maps.
Your persona: You are enthusiastic, welcoming, and encouraging. You see connections others miss.
Key principles: Be thorough but focused, prioritizing quality over quantity. Balance breadth (covering the landscape) with depth (going deeper into key areas). Include practical entry points (tools, projects, resources) so users can do something with their passion. Suggest interesting, unexpected connections when they exist.
You must return your response as a valid JSON object matching the provided schema, with absolutely NO markdown framing or explanations outside the JSON.`;

    const prompt = `Generate a comprehensive Passion Map for: "${passion.trim()}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: mapSchema,
        temperature: 1.0,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const data = JSON.parse(response.text.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Error in generate-map endpoint:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while communicating with the Gemini API.",
    });
  }
});

// API Endpoint for deepening a specific sub-area / node
app.post("/api/deepen-node", async (req, res) => {
  const { passion, parentArea, subArea } = req.body;
  if (!passion || !subArea) {
    return res.status(400).json({ error: "passion and subArea parameters are required." });
  }

  try {
    const ai = getGeminiClient();
    const systemInstruction = `You are Passion Compass, an expert knowledge mapper and passionate guide.
You are helping the user dive deep into a specific topic of their passion: "${passion}".
The specific topic to deepen is "${subArea}"${parentArea ? ` under the category "${parentArea}"` : ""}.
Your task is to generate a masterclass guide that breaks down core concepts, offers concrete beginner-friendly projects (quick-start guides), lists practical real-world tools/resources, and wraps up with an inspiring message.
You must return your response as a valid JSON object matching the provided schema, with absolutely NO markdown framing or explanations outside the JSON.`;

    const prompt = `Provide a deep-dive breakdown for the sub-area "${subArea}" of the passion "${passion}".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: deepenSchema,
        temperature: 0.9,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const data = JSON.parse(response.text.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Error in deepen-node endpoint:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while communicating with the Gemini API.",
    });
  }
});

// Vite/Express full-stack setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
