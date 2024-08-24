import { Component, OnInit } from '@angular/core';
import { VehicleReport, BookingTypeReport, TripReport, BookingStatusReport, ProjectReport, ReportService, VehicleMakeReport } from '../../services/report.service';
import { TripService } from '../../services/trip.service';
import { BookingService } from '../../services/booking.service'; 
import { Chart, ChartType, ChartData, ChartOptions, ChartConfiguration, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format, formatDate } from 'date-fns';
import { AuthService } from '../../user/auth.service';

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
  fuelExpenditureReport: any[] = [];
  totalFuelExpenditure: number = 0;
  currentDate: string = format(new Date(), 'yyyy-MM-dd');

  visibleReports: string[] = [];


  //USer mapping
  user: any = {};
  companyLogoUrl = 'assets/logo.png';

  private charts: { [key: string]: Chart } = {};

  constructor(
    private reportService: ReportService,
    private tripService: TripService,
    private bookingService: BookingService,
    private Service: BookingService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.loadReports();

    this.loadUserProfile()
    Chart.register(...registerables);
  }


  
  loadUserProfile(): void {
    this.authService.getProfile().subscribe(
      (data: any) => {
        this.user = data;
      },
      (error) => {
        console.log('Error fetching profile', error);
      }
    );
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

   // Load the Project Status Report data
this.reportService.getProjectStatusReport().subscribe(data => {
  this.projectStatusReport = data;
  this.totalProjectStatus = this.calculateTotal(this.projectStatusReport, 'count');
  this.createProjectStatusChart();
});

    this.reportService.getFuelExpenditureReportAsync().subscribe(data => {
      console.log(data); 
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

  

  toggleReport(reportId: string): void {
  const index = this.visibleReports.indexOf(reportId);
  if (index === -1) {
    this.visibleReports.push(reportId); // Show the report
  } else {
    this.visibleReports.splice(index, 1); // Hide the report
  }
}

exportToPdf(): void {
  // Hide all buttons
  const buttons = document.querySelectorAll('.button-container button');
  buttons.forEach(button => (button as HTMLElement).style.display = 'none');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageElement = document.getElementById('report-page') as HTMLElement;

  if (pageElement) {
    // Capture page content
    html2canvas(pageElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let position = 0;
      let heightLeft = imgHeight;

      // Add logo
      const logo = new Image();
      logo.src = this.companyLogoUrl;
      logo.onload = () => {
        pdf.addImage(logo, 'PNG', 10, 10, 50, 20); // Adjust the size and position

        // Add user details
        pdf.setFontSize(12);
        pdf.text(`Generated by: ${this.user.name}`, 10, 40); // Adjust position as needed

        // Add report title
        pdf.setFontSize(16);
        pdf.text('J&W System Reports', 10, 50); // Adjust position as needed

        // Add report content
        pdf.addImage(imgData, 'PNG', 0, 60, pdfWidth, imgHeight); // Adjust position and size

        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        // Save PDF
        pdf.save('J&W Reports.pdf');

        // Show all buttons again
        buttons.forEach(button => (button as HTMLElement).style.display = 'block');
      };
    });
  }
}
}