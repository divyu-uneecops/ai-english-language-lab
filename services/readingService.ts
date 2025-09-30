import serverInterfaceService from "./serverInterfaceService";

export const readingService = {
  fetchStories: (params?: Record<string, any>) => {
    return serverInterfaceService.get(`/reading/passages`, params);
  },
  fetchStoryById: (storyId: string) =>
    serverInterfaceService.get(`/reading/passages/${storyId}`),
  verifyAnswers: (
    storyId: string,
    answers: Array<{ question_id: string; answer: string }>
  ) =>
    serverInterfaceService.post("/reading/verify", {
      story_id: storyId,
      answers: answers,
    }),
  evaluateReading: (
    passageId: string,
    audioData: Array<{ text: string; startTime: number; endTime: number }>
  ) =>
    serverInterfaceService.post("/reading/evaluate-reading", {
      passage_id: passageId,
      audio_data: audioData,
    }),
};
