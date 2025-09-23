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

    // Connect to streaming TTS
    const socket = await client.textToSpeechStreaming.connect({
      model: "bulbul:v2",
    });

    return new Promise((resolve) => {
      const audioChunks: Buffer[] = [];
      let closeTimeout: NodeJS.Timeout | null = null;

      socket.on("open", () => {
        console.log("Sarvam TTS connection opened");

        // Configure for English only
        socket.configureConnection({
          type: "config",
          data: {
            speaker: "default", // Use default English voice
            target_language_code: "en-IN", // English (India)
          },
        });

        console.log("English TTS configuration sent");

        // Send text for conversion
        socket.convert(text);
        console.log("Text sent for conversion");

        // Set timeout to force close if it takes too long
        closeTimeout = setTimeout(() => {
          console.log("Forcing socket close after timeout");
          socket.close();
        }, 30000); // 30 second timeout
      });

      socket.on("message", (message) => {
        if (message.type === "audio") {
          const audioBuffer = Buffer.from(message.data.audio, "base64");
          audioChunks.push(audioBuffer);
          console.log(`Received audio chunk of ${audioBuffer.length} bytes`);
        } else {
          console.log("Received non-audio message:", message);
        }
      });

      socket.on("close", (event) => {
        console.log("Sarvam TTS connection closed");
        if (closeTimeout) clearTimeout(closeTimeout);

        // Combine all audio chunks
        const combinedAudio = Buffer.concat(audioChunks);
        const base64Audio = combinedAudio.toString("base64");

        resolve(
          NextResponse.json({
            audio: base64Audio,
            mimeType: "audio/mpeg",
            textLength: text.length,
            chunksReceived: audioChunks.length,
          })
        );
      });

      socket.on("error", (error) => {
        console.error("Sarvam TTS error occurred:", error);
        if (closeTimeout) clearTimeout(closeTimeout);

        resolve(
          NextResponse.json(
            { error: `TTS generation failed: ${error.message}` },
            { status: 500 }
          )
        );
      });
    });
  } catch (error) {
    console.error("TTS generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
