import serverInterfaceService from "./serverInterfaceService";

export const speakingService = {
  // Fetch speaking topics with filters and pagination
  fetchTopics: async (params?: Record<string, any>) =>
    serverInterfaceService.get(`/speaking/topics`, params),

  // Fetch a single speaking topic by ID
  fetchTopicById: async (topicId: string) =>
    serverInterfaceService.get(`/speaking/topics/${topicId}`),

  // Submit speech for evaluation (if applicable in the future)
  submitForEvaluation: async (transcription: string, topicId: string) =>
    serverInterfaceService.post("/speaking/verify", {
      transcription,
      topic_id: topicId,
    }),
};
