import { Component, OnInit } from '@angular/core';
import { VehicleReport, BookingTypeReport, TripReport, BookingStatusReport, ProjectReport, ReportService, VehicleMakeReport } from '../../services/report.service';
import { TripService } from '../../services/trip.service';
import { BookingService } from '../../services/booking.service'; 
import { Chart, ChartType, ChartData, ChartOptions, ChartConfiguration, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
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
  totalVehicleMake: number = 0; // Added this property

  private charts: { [key: string]: Chart } = {};

  constructor(
    private reportService: ReportService,
    private tripService: TripService,
    private bookingService: BookingService 
  ) {}

  ngOnInit(): void {
    this.loadReports();
    Chart.register(...registerables);
  }

  loadReports(): void {
    this.reportService.getVehicleStatusReport().subscribe(data => {
      this.vehicleStatusReport = data;
      this.totalVehicleStatus = this.calculateTotal(this.vehicleStatusReport, 'count');
      this.createVehicleStatusChart();
    });

    this.reportService.getVehicleMakeReport().subscribe(data => {
      this.vehicleMakeReport = data;
      this.totalVehicleMake = this.calculateTotal(this.vehicleMakeReport, 'count'); // Updated here
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

  exportToPdf() {
    const exportButton = document.getElementById('export-button');
    if (exportButton) exportButton.style.display = 'none';

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageElement = document.getElementById('report-page') as HTMLElement;

    if (pageElement) {
      html2canvas(pageElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let position = 0;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save('report.pdf');

        if (exportButton) exportButton.style.display = 'block';
      });
    }
  }
}