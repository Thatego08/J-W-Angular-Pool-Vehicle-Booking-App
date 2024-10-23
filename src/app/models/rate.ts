export interface Rate {
  RateID: number;
 rateValue: number;
  ProjectID: number; // Foreign key to Project
  ProjectNumber: number; // Project Number from Project
  applicableTimePeriod: string;
  conditions: string;
}
