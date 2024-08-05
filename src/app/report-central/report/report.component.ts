import { AfterViewInit, Component, OnInit } from '@angular/core';
import { VehicleReport, BookingTypeReport, TripReport, BookingStatusReport, ProjectReport, ReportService } from '../../services/report.service';
import { TripService } from '../../services/trip.service'; // Import TripService
import { Chart, ChartType, ChartData, ChartOptions, ChartConfiguration, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'] // Corrected property name to styleUrls
})
export class ReportComponent implements OnInit {
  vehicleStatusReport: any;
  bookingTypeReport: any;
  tripReport: any;
  bookingStatusReport: any;
  projectStatusReport: any;

  private charts: { [key: string]: Chart } = {};

  constructor(private reportService: ReportService, private tripService: TripService) {}

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
    this.fetchTrips(); // Fetch trips using the tripService
    this.reportService.getBookingStatusReport().subscribe(data => {
      this.bookingStatusReport = data;
      this.createBookingStatusChart();
    });
    this.reportService.getProjectStatusReport().subscribe(data => {
      this.projectStatusReport = data;
      this.createProjectStatusChart();
    });
  }

  fetchTrips(): void {
    this.tripService.getAllTrips().subscribe(
      (data: any[]) => {
        this.tripReport = data;
        this.createTripChart(); // Call createTripChart after fetching trips
      },
      error => {
        console.error('Error fetching trips', error);
      }
    );
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

  createTripChart() {
    if (this.tripReport) {
      const tripDates = this.tripReport.map((trip: any) => new Date(trip.travelStart).toLocaleDateString());
      const tripCountByDate = tripDates.reduce((acc: any, date: string) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartData = {
        labels: Object.keys(tripCountByDate),
        datasets: [{
          label: 'Trips',
          data: Object.values(tripCountByDate),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };

      new Chart('tripChart', {
        type: 'line', // Change the chart type if needed
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

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

  exportToPdf() {
    // Temporarily hide the export button
    const exportButton = document.getElementById('export-button');
    if (exportButton) exportButton.style.display = 'none';
  
    // Create a new jsPDF instance
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
        
        // Add the first page
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
  
        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
  
        pdf.save('report.pdf');
  
        // Show the export button again
        if (exportButton) exportButton.style.display = 'block';
      });
    } else {
      console.error('The page element with id "report-page" was not found.');
      if (exportButton) exportButton.style.display = 'block';
    }
  }
}  