import { NextRequest, NextResponse } from "next/server";
import { SarvamAIClient } from "sarvamai";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Sarvam API key not configured" },
        { status: 500 }
      );
    }

    // Create Sarvam client
    const client = new SarvamAIClient({
      apiSubscriptionKey: apiKey,
    });

    // Use REST API for text to speech conversion
    const response = await client.textToSpeech.convert({
      text: text,
      speaker: "arya",
      target_language_code: "en-IN", // English (India)
      pitch: 0.0, // Neutral tone — keeps it natural and comfortable
      pace: 1.0, // Normal speaking speed (you can go 0.9 for a calmer tone)
      loudness: 1.0, // Standard volume for clarity
    });

    // response.audios is an array, get the first audio
    const audio = response.audios[0];

    return NextResponse.json({
      audio: audio,
      mimeType: "audio/wav",
      requestId: response.request_id,
    });
  } catch (error) {
    console.error("TTS generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
