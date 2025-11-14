export interface ReadingEvaluationResult {
  overall_score: number;
  scoreBreakdown: {
    accuracy: number;
    fluency: number;
    consistency: number;
  };
  detailedMetrics: {
    accuracy: string;
    fluency: string;
    consistency: string;
  };
  feedback: {
    accuracy: string[];
    fluency: string[];
    consistency: string[];
    overall: string[];
  };
}

export interface ReadingEvaluationResultProps {
  result: ReadingEvaluationResult | null;
  onClose: () => void;
  onRetry: () => void;
}

// EvaluationResults

export interface WritingEvaluationResult {
  your_answer: string;
  overall_score: number;
  feedback: {
    strengths: string[];
    areas_for_improvement: string[];
  };
  example_answer: string;
}

export interface WritingEvaluationResultsProps {
  evaluation: WritingEvaluationResult;
  onClose: () => void;
  onRevise: () => void;
}

export interface SpeakingEvaluationResultsProps {
  evaluation: {
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
  };
  onClose: () => void;
  onRevise: () => void;
}
