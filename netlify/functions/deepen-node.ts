import { Handler } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

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
    const { passion, parentArea, subArea } = body;

    if (!passion || !subArea) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "passion and subArea parameters are required." }),
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

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    console.error("Error in deepen-node serverless function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "An error occurred while communicating with the Gemini API.",
      }),
    };
  }
};
