export interface Rate {
  RateID: number;
  RateTypeID: number; // Foreign key to RateType
  rateTypeName: string; // Name from RateType
  rateValue: number;
  ProjectID: number; // Foreign key to Project
  projectNumber: number; // Project Number from Project
  applicableTimePeriod: string;
  conditions: string;
}
