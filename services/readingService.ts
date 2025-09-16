import serverInterfaceService from "./serverInterfaceService";

export const readingService = {
  fetchStories: (page: number = 1, pageSize: number = 10) =>
    serverInterfaceService.get(
      `/reading/stories?page=${page}&page_size=${pageSize}`
    ),
};
