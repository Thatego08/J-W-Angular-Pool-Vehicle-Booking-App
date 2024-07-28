export interface Rate {
    RateID: number;
    RateTypeName: string; // Assuming this is fetched from RateType
    RateValue: number;
    ProjectNumber: number; // Assuming this is fetched from Project
    ApplicableTimePeriod: string;
    Conditions: string;
  
   
  }
  