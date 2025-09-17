import serverInterfaceService from "./serverInterfaceService";

export const vocabularyService = {
  // Fetch vocabulary words
  fetchVocabulary: (page: number = 1, pageSize: number = 10) =>
    serverInterfaceService.get(
      `/vocabulary?page=${page}&page_size=${pageSize}`
    ),
};
