import serverInterfaceService from "./serverInterfaceService";

export const readingService = {
  fetchStories: (params?: Record<string, any>, signal?: AbortSignal) => {
    return serverInterfaceService.get(`/reading/passages`, params, signal);
  },
  fetchStoryById: (storyId: string) =>
    serverInterfaceService.get(`/reading/passages/${storyId}`),
  evaluateReading: (
    passageId: string,
    audioData: Array<{ text: string; startTime: number; endTime: number }>
  ) =>
    serverInterfaceService.post("/reading/evaluate-reading", {
      passage_id: passageId,
      audio_data: audioData,
    }),
  fetchEvaluationHistory: (passageId: string) =>
    serverInterfaceService.get(`/reading/passages/${passageId}/submissions`),
  // Fetch all submissions for the user
  fetchAllSubmissions: () =>
    serverInterfaceService.get(`/reading/passages/submissions`),
};
