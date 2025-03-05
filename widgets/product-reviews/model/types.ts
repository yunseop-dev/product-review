export interface Review {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
  };
}

export interface ReviewFormData {
  body: string;
}

export interface ReviewsResponse {
  comments: Review[];
  total: number;
  skip: number;
  limit: number;
}
