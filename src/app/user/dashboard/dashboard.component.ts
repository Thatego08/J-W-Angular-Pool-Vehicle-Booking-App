import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  chartData: any[] = [];
  view: [number, number] = [700, 400]; // Adjust the chart size

  // chart options
  showLegend = true;
  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.vehicleService.getAvailableVehicles().subscribe(data => {
      this.chartData = this.processChartData(data);
    });
  }

  private processChartData(data: any[]): any[] {
    // Transform the data into the format required by ngx-charts
    // Example: { name: 'Type A', value: 50 }, { name: 'Type B', value: 30 }
    return data.map(vehicle => ({
      name: vehicle.registrationNumber, // Adjust based on your data structure
      value: vehicle.count // Adjust based on your data structure
    }));
  }
}
