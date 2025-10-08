// Speaking topics service
export interface SpeakingTopic {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  duration: string;
  tips: string[];
}

export interface SpeakingTopicsResponse {
  topics: SpeakingTopic[];
  total: number;
}

class SpeakingService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  async fetchRandomTopic(
    level: "beginner" | "intermediate" | "advanced",
    difficulty: "easy" | "medium" | "hard"
  ): Promise<SpeakingTopic> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/speaking/topics/random`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ level, difficulty }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.topic;
    } catch (error) {
      console.error("Error fetching random speaking topic:", error);
      // Return a fallback topic if API fails
      return this.getFallbackTopic(level, difficulty);
    }
  }

  async fetchTopics(
    level?: "beginner" | "intermediate" | "advanced",
    difficulty?: "easy" | "medium" | "hard",
    page = 1,
    pageSize = 10
  ): Promise<SpeakingTopicsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (level) params.append("level", level);
      if (difficulty) params.append("difficulty", difficulty);

      const response = await fetch(
        `${this.baseUrl}/api/speaking/topics?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching speaking topics:", error);
      // Return fallback data if API fails
      return {
        topics: this.getFallbackTopics(level, difficulty),
        total: 0,
      };
    }
  }

  private getFallbackTopic(
    level: "beginner" | "intermediate" | "advanced",
    difficulty: "easy" | "medium" | "hard"
  ): SpeakingTopic {
    const topics = this.getFallbackTopics(level, difficulty);
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private getFallbackTopics(
    level?: "beginner" | "intermediate" | "advanced",
    difficulty?: "easy" | "medium" | "hard"
  ): SpeakingTopic[] {
    const allTopics: SpeakingTopic[] = [
      // Beginner topics
      {
        id: "1",
        title: "Introducing Yourself",
        description: "Practice introducing yourself in different situations",
        level: "beginner",
        difficulty: "easy",
        topic:
          "Tell me about yourself. Include your name, where you're from, what you do, and one interesting fact about yourself.",
        duration: "2-3 minutes",
        tips: [
          "Speak clearly and at a comfortable pace",
          "Use simple, everyday vocabulary",
          "Maintain eye contact (imagine you're talking to someone)",
          "Practice your introduction beforehand",
        ],
      },
      {
        id: "2",
        title: "Your Daily Routine",
        description: "Describe your typical day",
        level: "beginner",
        difficulty: "easy",
        topic:
          "Walk me through your typical day from morning to evening. What do you usually do?",
        duration: "3-4 minutes",
        tips: [
          "Use time expressions (in the morning, at noon, in the evening)",
          "Use present simple tense",
          "Include specific activities and times",
          "Speak naturally, as if telling a friend",
        ],
      },
      {
        id: "3",
        title: "Your Hobbies",
        description: "Talk about what you enjoy doing in your free time",
        level: "beginner",
        difficulty: "medium",
        topic:
          "What are your favorite hobbies and why do you enjoy them? How often do you do these activities?",
        duration: "3-4 minutes",
        tips: [
          "Use descriptive adjectives",
          "Explain why you like each hobby",
          "Use frequency adverbs (often, sometimes, rarely)",
          "Share personal experiences",
        ],
      },
      // Intermediate topics
      {
        id: "4",
        title: "A Memorable Trip",
        description: "Describe a travel experience that was special to you",
        level: "intermediate",
        difficulty: "medium",
        topic:
          "Tell me about a memorable trip you've taken. Where did you go, what did you do, and what made it special?",
        duration: "4-5 minutes",
        tips: [
          "Use past tense correctly",
          "Include sensory details (what you saw, heard, felt)",
          "Use descriptive language",
          "Structure your story with a clear beginning, middle, and end",
        ],
      },
      {
        id: "5",
        title: "Technology in Daily Life",
        description: "Discuss how technology affects your daily routine",
        level: "intermediate",
        difficulty: "medium",
        topic:
          "How has technology changed your daily life? What are the positive and negative impacts?",
        duration: "4-5 minutes",
        tips: [
          "Use comparative language (more than, less than)",
          "Present balanced arguments",
          "Use examples from your own experience",
          "Use linking words to connect ideas",
        ],
      },
      {
        id: "6",
        title: "Future Goals",
        description: "Talk about your aspirations and plans",
        level: "intermediate",
        difficulty: "hard",
        topic:
          "What are your goals for the next five years? How do you plan to achieve them?",
        duration: "4-5 minutes",
        tips: [
          "Use future tenses appropriately",
          "Be specific about your goals",
          "Explain your action plan",
          "Use conditional language when appropriate",
        ],
      },
      // Advanced topics
      {
        id: "7",
        title: "Environmental Issues",
        description: "Discuss environmental challenges and solutions",
        level: "advanced",
        difficulty: "hard",
        topic:
          "What do you think is the most pressing environmental issue today? What solutions would you propose?",
        duration: "5-6 minutes",
        tips: [
          "Use complex sentence structures",
          "Present well-reasoned arguments",
          "Use academic vocabulary",
          "Support your points with evidence",
        ],
      },
      {
        id: "8",
        title: "Cultural Differences",
        description: "Reflect on cultural diversity and understanding",
        level: "advanced",
        difficulty: "hard",
        topic:
          "How do you think cultural differences affect communication? Share your experiences with cross-cultural interactions.",
        duration: "5-6 minutes",
        tips: [
          "Use abstract concepts and vocabulary",
          "Provide nuanced perspectives",
          "Use sophisticated linking words",
          "Demonstrate critical thinking",
        ],
      },
      {
        id: "9",
        title: "The Future of Work",
        description: "Discuss how work is changing in the modern world",
        level: "advanced",
        difficulty: "hard",
        topic:
          "How do you think the nature of work will change in the next decade? What skills will be most valuable?",
        duration: "5-6 minutes",
        tips: [
          "Use speculative language",
          "Present multiple perspectives",
          "Use professional vocabulary",
          "Structure complex arguments clearly",
        ],
      },
    ];

    // Filter topics based on level and difficulty
    let filteredTopics = allTopics;

    if (level) {
      filteredTopics = filteredTopics.filter((topic) => topic.level === level);
    }

    if (difficulty) {
      filteredTopics = filteredTopics.filter(
        (topic) => topic.difficulty === difficulty
      );
    }

    return filteredTopics;
  }
}

export const speakingService = new SpeakingService();
