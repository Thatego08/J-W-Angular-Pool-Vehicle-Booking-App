export interface Rate {
  RateID: number ;
 rateValue: number;
  projectID: number; // Foreign key to Project
  projectNumber: number; // Project Number from Project
  applicableTimePeriod: string;
  conditions: string;
}
