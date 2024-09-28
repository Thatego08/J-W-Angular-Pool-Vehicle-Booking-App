import { Component, OnInit } from '@angular/core';
import { VehicleReport, BookingTypeReport, TripReport, BookingStatusReport, ProjectReport, ReportService, VehicleMakeReport } from '../../services/report.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  vehicleMakeReport: VehicleMakeReport[] = [];
  vehicleStatusReport: VehicleReport[] = [];
  bookingTypeReport: BookingTypeReport[] = [];
  tripReport: TripReport[] = [];
  bookingStatusReport: BookingStatusReport[] = [];
  projectStatusReport: ProjectReport[] = [];
  totalTrips: number = 0; 
  totalVehicleStatus: number = 0;
  totalBookingType: number = 0;
  totalBookingStatus: number = 0;
  totalProjectStatus: number = 0;
  totalVehicleMake: number = 0;
  fuelExpendituresReport: any[] = [];
  totalFuelExpenditure: number = 0;
  currentDate: string = new Date().toISOString().split('T')[0];
  fuelExpenditureReport: any[] = [];
  totalFuelCost: number = 0;

  private charts: { [key: string]: Chart } = {};
  private scrollAmount: number = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
    Chart.register(...registerables);
    this.updateScrollAmount();
    this.updateScrollButtons();
  }

  scrollLeft(): void {
    const container = document.querySelector('.charts-container') as HTMLElement;
    const scrollAmount = container.offsetWidth / 3;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    this.updateScrollButtons();
  }

  scrollRight(): void {
    const container = document.querySelector('.charts-container') as HTMLElement;
    const scrollAmount = container.offsetWidth / 3;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    this.updateScrollButtons();
  }

  private updateScrollButtons() {
    const container = document.querySelector('.charts-container') as HTMLElement;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const isAtStart = this.isAtStart(container);
    const isAtEnd = this.isAtEnd(container, maxScrollLeft);

    document.querySelector('.scroll-button.left')!.setAttribute('disabled', isAtStart ? 'true' : 'false');
    document.querySelector('.scroll-button.right')!.setAttribute('disabled', isAtEnd ? 'true' : 'false');
  }

  private isAtStart(container: HTMLElement): boolean {
    return container.scrollLeft === 0;
  }

  private isAtEnd(container: HTMLElement, maxScrollLeft: number): boolean {
    return container.scrollLeft >= maxScrollLeft;
  }

  loadReports(): void {
    this.reportService.getVehicleStatusReport().subscribe(data => {
      this.vehicleStatusReport = data;
      this.totalVehicleStatus = this.calculateTotal(this.vehicleStatusReport, 'count');
      this.createVehicleStatusChart();
    });

    this.reportService.getVehicleFuelReport().subscribe(data => {
      this.fuelExpenditureReport = data;
      this.totalFuelCost = this.calculateTotal(this.fuelExpenditureReport, 'fuelCost');
      this.createFuelExpenditureChart();
    });
  
    this.reportService.getVehicleMakeReport().subscribe(data => {
      this.vehicleMakeReport = data;
      this.totalVehicleMake = this.calculateTotal(this.vehicleMakeReport, 'count');
      this.createVehicleMakeChart();
    });

    this.reportService.getBookingTypeReport().subscribe(data => {
      this.bookingTypeReport = data;
      this.totalBookingType = this.calculateTotal(this.bookingTypeReport, 'count');
      this.createBookingTypeChart();
    });

    this.reportService.getTripReport().subscribe(data => {
      this.tripReport = data;
      this.totalTrips = this.calculateTotal(this.tripReport, 'count');
      this.createTripChart();
    });

    this.reportService.getBookingStatusReport().subscribe(data => {
      this.bookingStatusReport = data;
      this.totalBookingStatus = this.calculateTotal(this.bookingStatusReport, 'count');
      this.createBookingStatusChart();
    });

    this.reportService.getProjectStatusReport().subscribe(data => {
      this.projectStatusReport = data;
      this.totalProjectStatus = this.calculateTotal(this.projectStatusReport, 'count');
      this.createProjectStatusChart();
    });

    this.reportService.getFuelExpenditureReportAsync().subscribe(data => {
      this.fuelExpenditureReport = data;
      this.totalFuelExpenditure = this.calculateTotal(this.fuelExpenditureReport, 'fuelCost');
    });
  }

  private calculateTotal(data: any[], key: string): number {
    return data.reduce((total, item) => total + (item[key] || 0), 0);
  }

  private createChart(chartId: string, chartData: any, chartOptions: any) {
    if (this.charts[chartId]) {
      this.charts[chartId].destroy();
    }

    const ctx = document.getElementById(chartId) as HTMLCanvasElement;
    this.charts[chartId] = new Chart(ctx, {
      type: chartOptions.type,
      data: chartData,
      options: chartOptions.options
    });
  }

  private createVehicleStatusChart() {
    const data = {
      labels: this.vehicleStatusReport.map(item => item.status),
      datasets: [{
        data: this.vehicleStatusReport.map(item => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };

    const options = {
      type: 'pie',
      options: {}
    };

    this.createChart('vehicleStatusChart', data, options);
  }

  private createVehicleMakeChart() {
    const data = {
      labels: this.vehicleMakeReport.map(item => item.make),
      datasets: [{
        data: this.vehicleMakeReport.map(item => item.count),
        backgroundColor: '#36A2EB'
      }]
    };

    const options = {
      type: 'bar',
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    this.createChart('vehicleMakeChart', data, options);
  }

  private createFuelExpenditureChart() {
    // Group data by vehicle and month-year
    const groupedData: { [key: string]: { [key: string]: number } } = {}; // vehicleName -> monthYear -> fuelCost
  
    this.fuelExpenditureReport.forEach(report => {
      const tripDate = new Date(report.tripDate); // Convert tripDate to Date object
      const monthYear = `${tripDate.getFullYear()}-${('0' + (tripDate.getMonth() + 1)).slice(-2)}`; // Format to YYYY-MM
      const vehicleName = report.vehicleName;
  
      // Initialize the structure for each vehicle
      if (!groupedData[vehicleName]) {
        groupedData[vehicleName] = {};
      }
  
      // Initialize the month-year for each vehicle if not exists
      if (!groupedData[vehicleName][monthYear]) {
        groupedData[vehicleName][monthYear] = 0; // Initialize if not exists
      }
      
      groupedData[vehicleName][monthYear] += report.fuelCost; // Aggregate fuel costs by vehicle and month-year
    });
  
    // Prepare data for the chart
    const labels = Array.from(new Set(Object.values(groupedData).flatMap(vehicle => Object.keys(vehicle)))); // Unique month-year labels
    const datasets = Object.keys(groupedData).map(vehicleName => {
      const data = labels.map(monthYear => groupedData[vehicleName][monthYear] || 0); // Get data for each month-year
      return {
        label: vehicleName,
        data: data,
        backgroundColor: this.getRandomColor(), // You can define a function to generate random colors
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      };
    });
  
    const data = {
      labels: labels,
      datasets: datasets
    };
  
    const options = {
      type: 'bar',
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              // Add a callback to prepend "R" to the tick labels for fuel cost
              callback: (value: number) => {
                return `R${value}`; // Prepend "R" to the value
              }
            }
          }
        }
      }
    };
  
    this.createChart('fuelExpenditureChart', data, options);
  }
  
  // Function to generate random colors for each vehicle
  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  private createBookingTypeChart() {
    const data = {
      labels: this.bookingTypeReport.map(item => item.type),
      datasets: [{
        data: this.bookingTypeReport.map(item => item.count),
        backgroundColor: '#36A2EB'
      }]
    };

    const options = {
      type: 'bar',
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    this.createChart('bookingTypeChart', data, options);
  }

  private createTripChart() {
    const data = {
      labels: this.tripReport.map(item => item.tripType),
      datasets: [{
        data: this.tripReport.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };

    const options = {
      type: 'bar',
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    this.createChart('tripChart', data, options);
  }

  private createBookingStatusChart() {
    const data = {
      labels: this.bookingStatusReport.map(item => item.status),
      datasets: [{
        data: this.bookingStatusReport.map(item => item.count),
        backgroundColor: '#FF6384'
      }]
    };

    const options = {
      type: 'bar',
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    this.createChart('bookingStatusChart', data, options);
  }

  private createProjectStatusChart() {
    const data = {
      labels: this.projectStatusReport.map(item => item.status),
      datasets: [{
        data: this.projectStatusReport.map(item => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };

    const options = {
      type: 'doughnut',
      options: {}
    };

    this.createChart('projectStatusChart', data, options);
  }

  private updateScrollAmount() {
    const container = document.querySelector('.charts-container') as HTMLElement;
    this.scrollAmount = container.scrollWidth - container.clientWidth;
  }
}
