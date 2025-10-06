// WritingInterface

export interface PaginatedResponse {
  page: number;
  page_size: number;
  total: number;
  results: WritingPrompt[];
}

// WritingEditor

export interface WritingPrompt {
  topic_id: string;
  category: string;
  title: string;
  description: string;
  difficulty: string;
  level: string;
  guidelines: string[];
  solved: boolean;
  evaluation_data?: {
    your_answer: string;
    score: number;
    feedback: {
      strengths: string[];
      areas_for_improvement: string[];
    };
    example_answer: string;
  };
}

export interface WritingEditorProps {
  prompt: WritingPrompt;
  onBack: () => void;
}

// EvaluationResults

export interface EvaluationData {
  your_answer: string;
  score: number;
  feedback: {
    strengths: string[];
    areas_for_improvement: string[];
  };
  example_answer: string;
}

export interface EvaluationResultsProps {
  evaluation: EvaluationData;
  onClose: () => void;
  onRevise: () => void;
}
