import { Component, OnInit } from '@angular/core';
import { AuditLog } from '../models/auditlog';
import { AuthService } from '../user/auth.service';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.css'
})
export class AuditLogComponent implements OnInit {

  auditLogs: AuditLog[] = [];
  page: number = 1; // Default page number

  searchUsername: string = '';
log!: { details: string|undefined; id: number; };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.authService.getAuditLogs(this.searchUsername).subscribe(logs => {
      this.auditLogs = logs;
    });
  }

  onEdit(log: { details: string | undefined; id: number; }) {
    const newDetails = prompt('Enter new details:', log.details);
    if (newDetails) {
      this.authService.editAuditLogDetails(log.id, newDetails).subscribe(() => {
        this.loadAuditLogs();  // Refresh the list
      });
    }
  }
   // Check if the log was updated within the last 24 hours
   isRecentlyUpdated(timestamp: string): boolean {
    const updatedTime = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return (now - updatedTime) <= oneDay; // Return true if the log was updated within the last 24 hours
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this log?')) {
      this.authService.deleteAuditLog(id).subscribe(() => {
        this.loadAuditLogs();  // Refresh the list
      });
    }
  }

  onSearch(): void {
    this.loadAuditLogs();
  }

}
