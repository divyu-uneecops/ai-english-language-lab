import serverInterfaceService from "./serverInterfaceService";

export const speakingService = {
  // Fetch speaking topics with filters and pagination
  fetchTopics: async (params?: Record<string, any>, signal?: AbortSignal) =>
    serverInterfaceService.get(`/speaking/topics`, params, signal),

  // Fetch a single speaking topic by ID
  fetchTopicById: async (topicId: string) =>
    serverInterfaceService.get(`/speaking/topics/${topicId}`),

  // Submit speech for evaluation (if applicable in the future)
  submitForEvaluation: async (
    transcription: Array<{ text: string; startTime: number; endTime: number }>,
    topicId: string
  ) =>
    serverInterfaceService.post("/speaking/verify", {
      transcription,
      topic_id: topicId,
    }),

  // Fetch all submissions for the user
  fetchAllSubmissions: async () =>
    serverInterfaceService.get(`/speaking/topics/submissions`),
};
