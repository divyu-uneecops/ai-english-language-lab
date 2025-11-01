import serverInterfaceService from "./serverInterfaceService";

export const writingService = {
  // Fetch writing topics by category
  fetchTopics: async (params?: Record<string, any>) =>
    serverInterfaceService.get(`/writing/topics`, params),

  // Fetch a single writing topic by ID
  fetchTopicById: async (topicId: string) =>
    serverInterfaceService.get(`/writing/topics/${topicId}`),

  // Submit writing for evaluation
  submitForEvaluation: async (content: string, topicId: string) =>
    serverInterfaceService.post("/writing/verify", {
      your_answer: content,
      topic_id: topicId,
    }),

  // Fetch all submissions for the user
  fetchAllSubmissions: async () =>
    serverInterfaceService.get(`/writing/topics/submissions`),
};
