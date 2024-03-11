export type ResultType<T> = {
  data?: T;
  paging?: {
    current_page: number;
    page_count: number;
    page_size: number;
    row_count: number;
  };
  message?: string;
  status?: number | string | undefined;
  is_error?: boolean;
};
