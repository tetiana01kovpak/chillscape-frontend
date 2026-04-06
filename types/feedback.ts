export type Feedback = {
  _id: string;
  place: string;
  userName?: string;
  user?: {
    _id: string;
    name: string;
  };
  rate: number;
  rating?: number;
  description: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
};

export type FeedbacksResponse = {
  page: number;
  perPage: number;
  totalFeedbacks: number;
  totalPages: number;
  feedbacks: Feedback[];
};
