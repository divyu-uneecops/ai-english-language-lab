import serverInterfaceService from "./serverInterfaceService";

export const readingService = {
  fetchStories: (page: number = 1, pageSize: number = 10) =>
    serverInterfaceService.get(
      `/reading/stories?page=${page}&page_size=${pageSize}`
    ),
  fetchStoryById: (storyId: string) =>
    serverInterfaceService.get(`/reading/stories/${storyId}`),
  verifyAnswers: (
    storyId: string,
    answers: Array<{ question_id: string; answer: string }>
  ) =>
    serverInterfaceService.post("/reading/verify", {
      story_id: storyId,
      answers: answers,
    }),
};
