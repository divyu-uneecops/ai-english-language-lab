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
  evaluation_data?: SpeakingEvaluationData;
}

export interface SpeakingEvaluationData {
  fluency_score: number;
  pronunciation_score: number;
  content_relevance_score: number;
  overall_score: number;
  feedback: {
    strengths: string[];
    areas_for_improvement: string[];
  };
  detailed_feedback: string;
  example_response: string;
}

export interface SpeakingTopicComponentProps {
  topic: SpeakingTopic;
  onBack: () => void;
}
