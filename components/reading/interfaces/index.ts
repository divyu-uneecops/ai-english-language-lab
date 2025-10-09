export interface AnalysisResult {
  score: number;
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

export interface AnalysisResultsProps {
  result: AnalysisResult | null;
  onClose: () => void;
  onRetry: () => void;
}
