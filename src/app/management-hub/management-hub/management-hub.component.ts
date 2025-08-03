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
totalVehicles: any;
availableVehicles: any;
bookedVehicles: any;
todayBookings: any;

  constructor(
    private dashboardService: DashboardService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardSummary().subscribe(summary => {
      this.dashboardSummary = summary;
    });

    this.dashboardService.getRecentBookings().subscribe(bookings => {
      this.recentBookings = bookings;
    });

    this.dashboardService.getRecentlyAddedVehicles().subscribe(vehicles => {
      this.recentVehicles = vehicles;
      this.loading = false;
    });

    this.dashboardService.getActiveIssues().subscribe(issues => {
      this.activeIssues = issues;
    });

    this.dashboardService.getOverdueBookings().subscribe(bookings => {
      this.overdueBookings = bookings;
    });
  }

  getStatusBadge(statusID: number): string {
    return statusID === 1 ? 'badge bg-success' : 'badge bg-warning';
  }

  getStatusText(statusID: number): string {
    return statusID === 1 ? 'Available' : 'Booked';
  }
}
