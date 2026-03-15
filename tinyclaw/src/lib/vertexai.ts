import { VertexAI } from "@google-cloud/vertexai";

let _vertexClient: VertexAI | null = null;

function getVertexClient(): VertexAI {
  if (_vertexClient) return _vertexClient;

  const projectId = process.env.GOOGLE_VERTEX_PROJECT_ID;
  // 'global' 不是有效的 API 区域，fallback 到 us-central1
  const rawLocation = process.env.GOOGLE_VERTEX_LOCATION || "us-central1";
  const location = rawLocation === "global" ? "us-central1" : rawLocation;
  const saJsonB64 = process.env.GOOGLE_VERTEX_SA_JSON_B64;

  if (!projectId) throw new Error("GOOGLE_VERTEX_PROJECT_ID not set");

  if (saJsonB64) {
    const saJson = JSON.parse(Buffer.from(saJsonB64, "base64").toString("utf-8"));
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON = JSON.stringify(saJson);
    _vertexClient = new VertexAI({
      project: projectId,
      location,
      googleAuthOptions: { credentials: saJson },
    });
  } else {
    _vertexClient = new VertexAI({ project: projectId, location });
  }

  return _vertexClient;
}

export async function geminiAnalyze(
  systemPrompt: string,
  userMessage: string,
  model = "gemini-3.1-pro-preview"
): Promise<string> {
  const vertex = getVertexClient();
  const generativeModel = vertex.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.3,
    },
  });

  const result = await generativeModel.generateContent({
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
  });

  const response = result.response;
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || "(no response)";
}

export async function geminiStream(
  systemPrompt: string,
  userMessage: string,
  onChunk: (text: string) => void,
  model = "gemini-3.1-pro-preview"
): Promise<void> {
  const vertex = getVertexClient();
  const generativeModel = vertex.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.3,
    },
  });

  const streamResult = await generativeModel.generateContentStream({
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
  });

  for await (const chunk of streamResult.stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) onChunk(text);
  }
}
