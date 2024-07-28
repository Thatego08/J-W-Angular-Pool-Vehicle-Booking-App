export class Rate {
    RateID?: number;
    RateTypeID?: number;
    RateTypeName?: string; // Assuming this is fetched from RateType
    RateValue?: number;
    ProjectID?: number;
    ProjectNumber?: number; // Assuming this is fetched from Project
    applicableTimePeriod?: string;
    conditions?: string;
  
    constructor(init?: Partial<Rate>) {
      Object.assign(this, init);
    }
  }
  