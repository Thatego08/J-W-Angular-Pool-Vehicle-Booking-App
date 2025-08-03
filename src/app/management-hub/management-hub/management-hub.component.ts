import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service.service';
import { AuthService } from '../../user/auth.service';

@Component({
  selector: 'app-management-hub',
  templateUrl: './management-hub.component.html',
  styleUrl: './management-hub.component.css'
})

export class ManagementHubComponent implements OnInit {
 dashboardSummary: any = {};
  recentBookings: any[] = [];
  recentVehicles: any[] = [];
  activeIssues: any[] = [];
  overdueBookings: any[] = [];
  loading = true;

  constructor(
    private dashboardService: DashboardService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (summary) => {
        this.dashboardSummary = summary;
      },
      error: (err) => console.error('Failed to load summary', err)
    });

    this.dashboardService.getRecentBookings().subscribe({
      next: (bookings) => {
        this.recentBookings = bookings;
      },
      error: (err) => console.error('Failed to load bookings', err)
    });

    this.dashboardService.getRecentlyAddedVehicles().subscribe({
      next: (vehicles) => {
        this.recentVehicles = vehicles;
      },
      error: (err) => console.error('Failed to load vehicles', err)
    });

    this.dashboardService.getActiveIssues().subscribe({
      next: (issues) => {
        this.activeIssues = issues;
      },
      error: (err) => console.error('Failed to load issues', err)
    });

    this.dashboardService.getOverdueBookings().subscribe({
      next: (bookings) => {
        this.overdueBookings = bookings;
        this.loading = false;
      },
      error: (err) => console.error('Failed to load overdue bookings', err)
    });
  }

  getStatusBadge(statusID: number): string {
    return statusID === 1 ? 'badge bg-success' : 'badge bg-warning';
  }

  getStatusText(statusID: number): string {
    return statusID === 1 ? 'Available' : 'Booked';
  }
}
