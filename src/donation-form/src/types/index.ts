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

export interface IconDefinitions {
  donateButton: Icon;
}

interface Icon {
  icon: string;
  variety: IconVariety;
}

export type IconVariety = "filled" | "outlined" | "rounded" | "sharp";
