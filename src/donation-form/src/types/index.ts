export interface ApiErrorResponse {
  status: number;
  title?: string;
  errors?: {
    [key: string]: string;
  };
}

export enum DonationFormType {
  Full = "full",
  Quick = "quick",
}
