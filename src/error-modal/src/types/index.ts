export interface ApiErrorResponse {
  status: number;
  title?: string;
  errors?: {
    [key: string]: string;
  };
}
