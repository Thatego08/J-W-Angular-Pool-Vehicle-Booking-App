export interface AuditLog {
    id: number;
    userName: string;
    action: string;
    details: string;
    timestamp: Date;
  }
  