// SpeakingInterface

export interface PaginatedResponse {
  page: number;
  page_size: number;
  total: number;
  results: SpeakingTopic[];
}

// SpeakingTopicComponent

export interface SpeakingTopic {
  topic_id: string;
  title: string;
  description: string;
  difficulty: string;
  level: string;
  solved: boolean;
  evaluation_data?: {
    your_answer: string;
    score: number;
    feedback: {
      strengths: string[];
      areas_for_improvement: string[];
    };
  };
}

export interface SpeakingTopicComponentProps {
  topic: SpeakingTopic;
  onBack: () => void;
}
