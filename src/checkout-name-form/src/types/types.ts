export interface ICheckoutNameForm {
  title: FieldConfig;
  firstName: FieldConfig;
  lastName: FieldConfig;
}

export interface FieldConfig {
  mandatory: boolean;
  label: string;
  order: number;
}

export enum LayoutOption {
  Vertical = "vertical",
  Horizontal = "horizontal",
}
