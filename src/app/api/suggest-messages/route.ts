import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free", // Use free models router for guaranteed free access
        messages: [
          {
            role: "user",
            content: `Generate 4 short anonymous feedback messages or general question type messages for a person named ${username}. Mix of positive, honest, and slightly emotional tone or funny. Format each message on a new line`,
          },
        ],
        max_tokens: 500, // Add token limit for cost control
        temperature: 0.8, // Add some creativity
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "TrueFeedback",
          "Content-Type": "application/json",
        },
      },
    );
    console.log("API KEY:", process.env.OPENROUTER_API_KEY);
    const text = response.data.choices[0].message.content;

   
    const suggestions = text
      .split("\n")
      .map((s: string) => s.trim())
      .filter((s: string) => s !== "" && s.length > 5) // Filter out empty and very short lines
      .map((s: string) => s.replace(/^\d+\.\s*/, "")) // Remove numbering if present
      .slice(0, 5); // Ensure we only return 5 suggestions

    return NextResponse.json({
      suggestions,
      modelUsed: response.data.model, // Include which model was actually used
    });
  } catch (error) {
    console.error("OpenRouter API Error:", error);

    // Better error handling
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.error?.message || "API request failed";
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
