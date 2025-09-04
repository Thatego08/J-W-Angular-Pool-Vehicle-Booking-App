import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { BookingService } from '../../services/booking.service';
import { DashboardService } from '../../services/dashboard-service.service';
import { TripService } from '../../services/trip.service';
import { Vehicle } from '../../models/vehicle.model';
import { BookingModel } from '../../models/booking.model';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrl: './dashboards.component.css'
})
export class DashboardsComponent implements OnInit, OnDestroy {
 // Dashboard metrics
  // Dashboard metrics
  totalVehicles: number = 0;
  availableVehicles: number = 0;
  activeBookings: number = 0;
  maintenanceVehicles: number = 0;
  
  // Data collections
  recentBookings: BookingModel[] = [];
  vehicleList: Vehicle[] = [];
  
  // Charts
  bookingsChart: any;
  vehicleStatusChart: any;
  
  // Loading states
  isLoading: boolean = true;
  statsLoading: boolean = true;
  bookingsLoading: boolean = true;
  vehiclesLoading: boolean = true;
  
  // Search filter
  searchTerm: string = '';

  // Track which API endpoints are available
  apiEndpointsAvailable = {
    metrics: true,
    recentBookings: true,
    recentVehicles: true, // Now this endpoint is implemented
    bookingStatistics: true,
    vehicleStatusDistribution: true
  };

  constructor(
    private vehicleService: VehicleService,
    private bookingService: BookingService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // This lifecycle hook ensures the view is initialized before creating charts
  }

  ngOnDestroy(): void {
    // Clean up charts to prevent memory leaks
    if (this.bookingsChart) {
      this.bookingsChart.destroy();
    }
    if (this.vehicleStatusChart) {
      this.vehicleStatusChart.destroy();
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load all data in sequence to avoid race conditions
    this.loadDashboardMetrics()
      .then(() => this.loadRecentBookings())
      .then(() => this.loadVehicleList())
      .then(() => {
        // After data is loaded, create charts
        setTimeout(() => {
          this.loadBookingStatistics(30);
          this.loadVehicleStatusDistribution();
          this.isLoading = false;
          this.cdr.detectChanges(); // Force change detection
        }, 100);
      })
      .catch(error => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      });
  }

  async loadDashboardMetrics(): Promise<void> {
    this.statsLoading = true;
    
    try {
      // Use the dashboard service for metrics
      const metrics = await this.dashboardService.getDashboardMetrics().toPromise();
      
      if (metrics) {
        this.totalVehicles = metrics.totalVehicles || 0;
        this.availableVehicles = metrics.availableVehicles || 0;
        this.maintenanceVehicles = metrics.maintenanceVehicles || 0;
        this.activeBookings = metrics.activeBookings || 0;
        
        console.log('Dashboard metrics loaded:', metrics);
      } else {
        // Fallback to individual services
        await this.loadMetricsFromIndividualServices();
      }
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
      this.apiEndpointsAvailable.metrics = false;
      // Fallback to individual services
      await this.loadMetricsFromIndividualServices();
    } finally {
      this.statsLoading = false;
    }
  }

  async loadMetricsFromIndividualServices(): Promise<void> {
    try {
      // Fetch all vehicles
      const vehicles = await this.vehicleService.getAllVehicles().toPromise();
      // Fetch all bookings
      const bookings = await this.bookingService.getBookings().toPromise();
      
      if (vehicles && bookings) {
        // Calculate metrics
        this.totalVehicles = vehicles.length;
        this.availableVehicles = vehicles.filter(v => v.statusID === 1).length;
        this.maintenanceVehicles = vehicles.filter(v => v.statusID === 3).length;
        
        // Active bookings should have statusId = 2 (Booked)
        this.activeBookings = bookings.filter(b => b.statusId === 2).length;
        
        console.log('Metrics from individual services:', {
          totalVehicles: this.totalVehicles,
          availableVehicles: this.availableVehicles,
          maintenanceVehicles: this.maintenanceVehicles,
          activeBookings: this.activeBookings
        });
      }
    } catch (error) {
      console.error('Error loading metrics from individual services:', error);
    }
  }

  async loadRecentBookings(): Promise<void> {
    this.bookingsLoading = true;
    
    try {
      // Use the dashboard service for recent bookings
      const recentBookingsData = await this.dashboardService.getRecentBookings().toPromise();
      
      if (recentBookingsData && recentBookingsData.length > 0) {
        // Map the API response to match our BookingModel
        this.recentBookings = recentBookingsData.map((booking: any) => ({
          bookingID: booking.id,
          userName: booking.customer,
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate),
          vehicleName: booking.vehicleName,
          statusId: booking.status,
          // These fields might not be in the API response
          event: '',
          projectNumber: undefined,
          reminderSent: false
        }));
        
        console.log('Recent bookings loaded:', this.recentBookings);
      } else {
        // Fallback to booking service
        const allBookings = await this.bookingService.getBookings().toPromise();
        if (allBookings) {
          // Sort by start date (newest first) and take top 5
          this.recentBookings = allBookings
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            .slice(0, 5);
        }
      }
    } catch (error) {
      console.error('Error loading recent bookings:', error);
      this.apiEndpointsAvailable.recentBookings = false;
      // Fallback to booking service
      try {
        const allBookings = await this.bookingService.getBookings().toPromise();
        if (allBookings) {
          this.recentBookings = allBookings
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            .slice(0, 5);
        }
      } catch (fallbackError) {
        console.error('Error loading bookings from fallback:', fallbackError);
      }
    } finally {
      this.bookingsLoading = false;
    }
  }

  async loadVehicleList(): Promise<void> {
    this.vehiclesLoading = true;
    
    try {
      // Use the dashboard service for recent vehicles (now implemented)
      const recentVehiclesData = await this.dashboardService.getRecentlyAddedVehicles().toPromise();
      
      if (recentVehiclesData && recentVehiclesData.length > 0) {
        // Map the API response to match our Vehicle model
        this.vehicleList = recentVehiclesData.map((vehicle: any) => ({
          vehicleID: vehicle.vehicleID,
          name: vehicle.name,
          registrationNumber: vehicle.registrationNumber,
          statusID: vehicle.statusID,
          // Add other required properties with default values
          vehicleType: vehicle.vehicleType || 'Unknown',
          description: '',
          vehicleMakeID: 0,
          vehicleModelID: 0,
          dateAcquired: new Date(),
          licenseExpiryDate: new Date(),
          insuranceCoverID: 0,
          VIN: '',
          engineNo: '',
          colourID: 0,
          fuelTypeID: 0,
          cabinType: '',
          driveType: '',
          transmission: '',
          hasTowBar: false,
          hasCanopy: false,
          compliance: '',
          protection: ''
        }));
        
        console.log('Recent vehicles loaded:', this.vehicleList);
      } else {
        // Fallback to vehicle service
        const allVehicles = await this.vehicleService.getAllVehicles().toPromise();
        if (allVehicles) {
          // Take top 4 vehicles
          this.vehicleList = allVehicles.slice(0, 4);
        }
      }
    } catch (error) {
      console.error('Error loading vehicle list:', error);
      this.apiEndpointsAvailable.recentVehicles = false;
      // Fallback to vehicle service
      try {
        const allVehicles = await this.vehicleService.getAllVehicles().toPromise();
        if (allVehicles) {
          this.vehicleList = allVehicles.slice(0, 4);
        }
      } catch (fallbackError) {
        console.error('Error loading vehicles from fallback:', fallbackError);
      }
    } finally {
      this.vehiclesLoading = false;
    }
  }

  async loadBookingStatistics(days: number): Promise<void> {
    try {
      // Use the dashboard service for booking statistics
      const statistics = await this.dashboardService.getBookingStatistics(days).toPromise();
      
      if (statistics && statistics.length > 0) {
        // Prepare data for chart
        const labels = statistics.map((stat: any) => {
          const date = new Date(stat.date);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        
        const bookingsData = statistics.map((stat: any) => stat.bookingsCount);
        const completedData = statistics.map((stat: any) => stat.completedCount);
        
        // Create or update chart
        this.createBookingsChart(labels, bookingsData, completedData);
      } else {
        // Fallback to calculating from bookings
        await this.calculateBookingStatisticsFromBookings(days);
      }
    } catch (error) {
      console.error('Error loading booking statistics:', error);
      this.apiEndpointsAvailable.bookingStatistics = false;
      // Fallback to calculating from bookings
      await this.calculateBookingStatisticsFromBookings(days);
    }
  }

  async calculateBookingStatisticsFromBookings(days: number): Promise<void> {
    try {
      const bookings = await this.bookingService.getBookings().toPromise();
      
      if (bookings) {
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        // Filter bookings by date range
        const filteredBookings = bookings.filter(b => {
          if (!b.startDate) return false;
          const bookingDate = new Date(b.startDate);
          return bookingDate >= startDate && bookingDate <= endDate;
        });
        
        // Group by day
        const dailyStats: { [key: string]: { bookings: number, completed: number } } = {};
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateString = this.formatDateShort(date);
          dailyStats[dateString] = { bookings: 0, completed: 0 };
        }
        
        // Count bookings and completed bookings per day
        filteredBookings.forEach(booking => {
          if (booking.startDate) {
            const dateString = this.formatDateShort(new Date(booking.startDate));
            if (dailyStats[dateString]) {
              dailyStats[dateString].bookings++;
              if (booking.statusId === 3) { // Completed status
                dailyStats[dateString].completed++;
              }
            }
          }
        });
        
        // Prepare data for chart
        const labels = Object.keys(dailyStats).reverse();
        const bookingsData = labels.map(date => dailyStats[date].bookings);
        const completedData = labels.map(date => dailyStats[date].completed);
        
        // Create or update chart
        this.createBookingsChart(labels, bookingsData, completedData);
      }
    } catch (error) {
      console.error('Error calculating booking statistics:', error);
    }
  }

  createBookingsChart(labels: string[], bookingsData: number[], completedData: number[]): void {
    // Check if canvas element exists before creating chart
    const ctx = document.getElementById('bookingsChart');
    if (!ctx) {
      console.error('Bookings chart canvas not found');
      return;
    }
    
    // Create or update chart
    if (this.bookingsChart) {
      this.bookingsChart.destroy();
    }
    
    this.bookingsChart = new Chart(ctx as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'New Bookings',
          data: bookingsData,
          backgroundColor: 'rgba(52, 152, 219, 0.5)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 1
        },
        {
          label: 'Completed',
          data: completedData,
          backgroundColor: 'rgba(46, 204, 113, 0.5)',
          borderColor: 'rgba(46, 204, 113, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  async loadVehicleStatusDistribution(): Promise<void> {
    try {
      // Use the dashboard service for vehicle status distribution
      const statusData = await this.dashboardService.getVehicleStatusDistribution().toPromise();
      
      if (statusData && statusData.length > 0) {
        // Prepare data for chart
        const labels = statusData.map((stat: any) => {
          switch (stat.statusId) {
            case 1: return 'Available';
            case 2: return 'Booked';
            case 3: return 'Maintenance';
            default: return 'Unknown';
          }
        });
        
        const data = statusData.map((stat: any) => stat.count);
        
        // Create or update chart
        this.createVehicleStatusChart(labels, data);
      } else {
        // Fallback to calculating from vehicles
        await this.calculateVehicleStatusFromVehicles();
      }
    } catch (error) {
      console.error('Error loading vehicle status distribution:', error);
      this.apiEndpointsAvailable.vehicleStatusDistribution = false;
      // Fallback to calculating from vehicles
      await this.calculateVehicleStatusFromVehicles();
    }
  }

  async calculateVehicleStatusFromVehicles(): Promise<void> {
    try {
      const vehicles = await this.vehicleService.getAllVehicles().toPromise();
      
      if (vehicles) {
        // Count vehicles by status
        const statusCounts = {
          'Available': vehicles.filter(v => v.statusID === 1).length,
          'Booked': vehicles.filter(v => v.statusID === 2).length,
          'Maintenance': vehicles.filter(v => v.statusID === 3).length
        };
        
        // Create or update chart
        this.createVehicleStatusChart(
          ['Available', 'Booked', 'Maintenance'],
          [statusCounts['Available'], statusCounts['Booked'], statusCounts['Maintenance']]
        );
      }
    } catch (error) {
      console.error('Error calculating vehicle status distribution:', error);
    }
  }

  createVehicleStatusChart(labels: string[], data: number[]): void {
    // Check if canvas element exists before creating chart
    const ctx = document.getElementById('vehicleStatusChart');
    if (!ctx) {
      console.error('Vehicle status chart canvas not found');
      return;
    }
    
    // Create or update chart
    if (this.vehicleStatusChart) {
      this.vehicleStatusChart.destroy();
    }
    
    this.vehicleStatusChart = new Chart(ctx as HTMLCanvasElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(46, 204, 113, 0.7)',
            'rgba(243, 156, 18, 0.7)',
            'rgba(231, 76, 60, 0.7)'
          ],
          borderColor: [
            'rgba(46, 204, 113, 1)',
            'rgba(243, 156, 18, 1)',
            'rgba(231, 76, 60, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  onTimeRangeChange(days: string): void {
    this.loadBookingStatistics(parseInt(days, 10));
  }

  getStatusClass(statusId: number): string {
    // Map status IDs to CSS classes based on your backend Status model
    switch (statusId) {
      case 1: return 'available';     // Available
      case 2: return 'booked';        // Booked
      case 3: return 'maintenance';   // In For Service
      case 4: return 'maintenance';   // Cancelled
      case 5: return 'booked';        // Active
      case 6: return 'available';     // Complete
      case 7: return 'booked';        // In-Progress
      default: return 'maintenance';  // Unknown/Other
    }
  }

  getStatusText(statusId: number): string {
    // Map status IDs to text labels based on your backend Status model
    switch (statusId) {
      case 1: return 'Available';
      case 2: return 'Booked';
      case 3: return 'In Service';
      case 4: return 'Cancelled';
      case 5: return 'Active';
      case 6: return 'Complete';
      case 7: return 'In Progress';
      default: return 'Unknown';
    }
  }

  formatDate(dateInput: any): string {
    if (!dateInput) return 'N/A';
    
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  formatDateShort(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }

  viewAllBookings(): void {
    // Navigate to bookings page - implementation depends on your routing
    console.log('Navigate to bookings page');
  }

  viewAllVehicles(): void {
    // Navigate to vehicles page - implementation depends on your routing
    console.log('Navigate to vehicles page');
  }
}
