import serverInterfaceService from "./serverInterfaceService";

export const readingService = {
  fetchStories: () => serverInterfaceService.get("/reading/stories"),
};
