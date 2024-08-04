import { AfterViewInit, Component, OnInit } from '@angular/core';
import { VehicleReport, BookingTypeReport, TripReport, BookingStatusReport, ProjectReport, ReportService } from '../../services/report.service';
import { Chart,ChartType,ChartData, ChartOptions, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  vehicleStatusReport: any;
  bookingTypeReport: any;
  tripReport: any;
  bookingStatusReport: any;
  projectStatusReport: any;

  private charts: { [key: string]: Chart } = {};

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();


    Chart.register(...registerables);

    this.createVehicleStatusChart();
    this.createTripChart();
    this.createProjectStatusChart();
  }

  loadReports(): void {
    this.reportService.getVehicleStatusReport().subscribe(data => {
      this.vehicleStatusReport = data;
      this.createVehicleStatusChart();
    });
    this.reportService.getBookingTypeReport().subscribe(data => {
      this.bookingTypeReport = data;
      this.createBookingTypeChart();
    });
    this.reportService.getTripReport().subscribe(data => {
      this.tripReport = data;
      this.createTripChart();
    });
    this.reportService.getBookingStatusReport().subscribe(data => {
      this.bookingStatusReport = data;
      this.createBookingStatusChart();
    });
    this.reportService.getProjectStatusReport().subscribe(data => {
      this.projectStatusReport = data;
      this.createProjectStatusChart();
    });
  }

  //Initializing charts
  private createChart(chartId: string, chartData: any, chartOptions: any) {
    // Check if a chart with this ID already exists
    if (this.charts[chartId]) {
      this.charts[chartId].destroy();
    }

    // Create the new chart
    const ctx = document.getElementById(chartId) as HTMLCanvasElement;
    this.charts[chartId] = new Chart(ctx, {
      type: 'bar', // Change this based on your chart type
      data: chartData,
      options: chartOptions
    });
  }


  // createVehicleStatusChart(): void {
  //   const ctx = document.getElementById('vehicleStatusChart') as HTMLCanvasElement;
  //   new Chart(ctx, {
  //     type: 'pie',
  //     data: {
  //       labels: this.vehicleStatusReport.map((item: { Status: any; }) => item.Status),
  //       datasets: [{
  //         data: this.vehicleStatusReport.map((item: { Count: any; }) => item.Count),
  //         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
  //       }]
  //     }
  //   });
  // }

  createBookingTypeChart(): void {
    const ctx = document.getElementById('bookingTypeChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.bookingTypeReport.map((item: { Type: any; }) => item.Type),
        datasets: [{
          data: this.bookingTypeReport.map((item: { Count: any; }) => item.Count),
          backgroundColor: '#36A2EB'
        }]
      }
    });
  }

  // createTripChart(): void {
  //   const ctx = document.getElementById('tripChart') as HTMLCanvasElement;
  //   new Chart(ctx, {
  //     type: 'line',
  //     data: {
  //       labels: this.tripReport.map((item: { TripType: any; }) => item.TripType),
  //       datasets: [{
  //         label: 'Number of Trips',
  //         data: this.tripReport.map((item: { Count: any; }) => item.Count),
  //         backgroundColor: '#FFCE56',
  //         borderColor: '#FFCE56',
  //         fill: false
  //       }]
  //     }
  //   });
  // }

  createBookingStatusChart(): void {
    const ctx = document.getElementById('bookingStatusChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.bookingStatusReport.map((item: { Status: any; }) => item.Status),
        datasets: [{
          data: this.bookingStatusReport.map((item: { Count: any; }) => item.Count),
          backgroundColor: '#FF6384'
        }]
      }
    });
  }

  // createProjectStatusChart(): void {
  //   const ctx = document.getElementById('projectStatusChart') as HTMLCanvasElement;
  //   new Chart(ctx, {
  //     type: 'doughnut',
  //     data: {
  //       labels: this.projectStatusReport.map((item: { Status: any; }) => item.Status),
  //       datasets: [{
  //         data: this.projectStatusReport.map((item: { Count: any; }) => item.Count),
  //         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
  //       }]
  //     }
  //   });
  // }

  createVehicleStatusChart() {
    new Chart('vehicleStatusChart', {
      type: 'pie',
      data: {
        labels: ['Available', 'Booked', 'In Service'],
        datasets: [{
          data: [10, 5, 2],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      }
    });
  }

  createTripChart() {
    new Chart('tripChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{
          label: 'Number of Trips',
          data: [10, 20, 30],
          borderColor: '#FF6384',
          fill: false
        }]
      }
    });
  }

  createProjectStatusChart() {
    new Chart('projectStatusChart', {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Completed', 'Pending'],
        datasets: [{
          data: [20, 15, 5],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      }
    });
  }
}
