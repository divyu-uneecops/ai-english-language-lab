import serverInterfaceService from "./serverInterfaceService";

export const writingService = {
  // Fetch writing topics by category
  fetchTopics: async (
    category: string,
    page: number = 1,
    pageSize: number = 10
  ) =>
    serverInterfaceService.get(
      `/writing/topics?category=${category}&page=${page}&page_size=${pageSize}`
    ),

  // Submit writing for evaluation
  submitForEvaluation: async (content: string, topicId: string) =>
    serverInterfaceService.post("/writing/verify", {
      your_answer: content,
      topic_id: topicId,
    }),
};
