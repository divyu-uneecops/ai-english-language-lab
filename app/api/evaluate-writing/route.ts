import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, writingType, prompt } = await request.json()

    // Simulate AI evaluation (in real app, this would call an AI service)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock evaluation results
    const evaluation = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      feedback: {
        grammar: {
          score: Math.floor(Math.random() * 20) + 80,
          issues: [
            { text: "Consider using more varied sentence structures", severity: "medium" },
            { text: "Check subject-verb agreement in paragraph 2", severity: "low" },
          ],
        },
        structure: {
          score: Math.floor(Math.random() * 25) + 75,
          issues: [
            { text: "Strong introduction that clearly states the purpose", severity: "positive" },
            { text: "Consider adding transition words between paragraphs", severity: "medium" },
          ],
        },
        content: {
          score: Math.floor(Math.random() * 20) + 80,
          issues: [
            { text: "Good use of specific examples to support your points", severity: "positive" },
            { text: "Could benefit from more detailed explanations", severity: "medium" },
          ],
        },
        vocabulary: {
          score: Math.floor(Math.random() * 15) + 85,
          issues: [
            { text: "Excellent use of topic-specific vocabulary", severity: "positive" },
            { text: "Try to avoid repeating the same words", severity: "low" },
          ],
        },
      },
      suggestions: [
        "Add more descriptive adjectives to make your writing more engaging",
        "Consider using active voice instead of passive voice where possible",
        "Include more specific examples to support your main points",
        "Review punctuation usage, especially with complex sentences",
      ],
      strengths: [
        "Clear and logical organization",
        "Good understanding of the topic",
        "Appropriate tone for the audience",
      ],
      improvements: [
        "Work on sentence variety and complexity",
        "Expand on key ideas with more detail",
        "Proofread for minor grammatical errors",
      ],
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    return NextResponse.json({ error: "Failed to evaluate writing" }, { status: 500 })
  }
}
