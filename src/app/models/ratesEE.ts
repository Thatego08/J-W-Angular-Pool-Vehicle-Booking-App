export interface RatesEE {
  rateId?: number;
  rateName: string;
  rateValue: number;
  effectiveDate?: string;   // ISO date string
  expiryDate?: string;
  isActive: boolean;
  projectId: number;
  projectNumber?: number;      // optional, for display
  description?: string;      // optional, for display
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}