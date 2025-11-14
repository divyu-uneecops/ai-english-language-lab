// Internal Story interface
export interface Story {
  passage_id: string;
  title: string;
  level: string;
  difficulty: string;
  readTime?: string;
  passage: string;
}

export interface PaginatedResponse {
  page: number;
  page_size: number;
  total: number;
  results: Story[];
}
