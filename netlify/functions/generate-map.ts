import { Handler } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

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

export const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { passion } = body;

    if (!passion || typeof passion !== "string" || passion.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Passion name is required and must be a non-empty string." }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GEMINI_API_KEY is not configured on Netlify. Please set it in your environment variables." }),
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are Passion Compass, an expert knowledge mapper and passionate guide. 
Your purpose is to help people explore and deepen their interests by generating structured, insightful knowledge maps.
Your persona: You are enthusiastic, welcoming, and encouraging. You see connections others miss.
Key principles: Be thorough but focused, prioritizing quality over quantity. Balance breadth (covering the landscape) with depth (going deeper into key areas). Include practical entry points (tools, projects, resources) so users can do something with their passion. Suggest interesting, unexpected connections when they exist.

The user might describe their passion in casual, freeform, or regular writing (e.g., a sentence or a paragraph about what they like). 
Your first job is to understand what core passion or intersection they are describing, and then generate a comprehensive, beautifully structured Passion Map for it.
Make sure the "passion" field in your JSON response contains a beautifully summarized, elegant title of their passion (e.g., "Sourdough Microbiology & Chemistry" instead of their full long query).

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

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    console.error("Error in generate-map serverless function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "An error occurred while communicating with the Gemini API.",
      }),
    };
  }
};
