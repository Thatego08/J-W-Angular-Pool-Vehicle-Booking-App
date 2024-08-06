import { Component, OnInit } from '@angular/core';
import { VehicleReport, BookingTypeReport, TripReport, BookingStatusReport, ProjectReport, ReportService } from '../../services/report.service';
import { TripService } from '../../services/trip.service';
import { BookingService } from '../../services/booking.service'; // Import BookingService
import { Chart, ChartType, ChartData, ChartOptions, ChartConfiguration, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  vehicleStatusReport: any;
  bookingTypeReport: any;
  tripReport: any;
  bookingStatusReport: any;
  projectStatusReport: any;
  eventBookingsCount: number = 0;
  projectBookingsCount: number = 0;
  bookings: any[] = []; // Array to hold bookings

  private charts: { [key: string]: Chart } = {};

  constructor(
    private reportService: ReportService,
    private tripService: TripService,
    private bookingService: BookingService // Inject BookingService
  ) {}

  ngOnInit(): void {
    this.loadReports();
    this.loadBookings(); // Fetch and count bookings
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
      console.log('Booking Type Report:', data); // Log the received data
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

  loadBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (data: any[]) => {
        console.log('Bookings data:', data); // Check the data received
        this.bookings = data;
        this.updateBookingReport(); // Update the booking report after loading bookings
        this.eventBookingsCount = data.filter(b => typeof b.event === 'string' && b.event.trim() !== '').length;
        this.projectBookingsCount = data.filter(b => typeof b.projectNumber === 'number' && b.projectNumber !== 0).length;
        console.log('Event Bookings Count:', this.eventBookingsCount); // Log the count
        console.log('Project Bookings Count:', this.projectBookingsCount); // Log the count
        this.updateBookingReport(); // Update the booking type report after counting bookings
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }

  updateBookingReport(): void {
    // Method to update the booking report for table and chart
    this.bookingTypeReport = [
      { Type: 'Event', Count: this.eventBookingsCount },
      { Type: 'Project', Count: this.projectBookingsCount }
    ];

    // Update chart
    this.createBookingTypeChart(); // Refresh the chart with updated data
  }

  createBookingTypeChart(): void {
    if (this.bookingTypeReport && this.bookingTypeReport.length > 0) {
      const ctx = document.getElementById('bookingTypeChart') as HTMLCanvasElement;
  
      // Destroy the previous chart instance if it exists
      if (this.charts['bookingTypeChart']) {
        this.charts['bookingTypeChart'].destroy();
      }
  
      // Create gradient backgrounds for each bar
      const gradientColors = this.bookingTypeReport.map((_: any, index: number) => {
        const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, index % 2 === 0 ? '#36A2EB' : '#FF6384');
        gradient.addColorStop(1, index % 2 === 0 ? '#00A3E0' : '#FF9F40');
        return gradient;
      });
  
      // Create a new chart instance
      this.charts['bookingTypeChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.bookingTypeReport.map((item: { Type: string }) => item.Type),
          datasets: [{
            label: 'Booking Type Count',
            data: this.bookingTypeReport.map((item: { Count: number }) => item.Count),
            backgroundColor: gradientColors // Use the gradient colors
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      console.error('Booking Type Report data is not available or empty.');
    }
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
        type: 'line',
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