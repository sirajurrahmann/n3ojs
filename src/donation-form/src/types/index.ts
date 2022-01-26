export enum DonationFormMode {
  full = "Full",
  quick = "Quick",
}

export interface ApiErrorResponse {
  status: number;
  title?: string;
  errors?: {
    [key: string]: string;
  };
}
