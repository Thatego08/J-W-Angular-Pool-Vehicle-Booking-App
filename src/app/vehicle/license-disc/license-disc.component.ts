import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { LicenseDisk } from '../../models/licensedisc.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-license-disc',
  templateUrl: './license-disc.component.html',
  styleUrls: ['./license-disc.component.css']
})
export class LicenseDisksComponent implements OnInit {
  disks: LicenseDisk[] = [];

  disk!: LicenseDisk;
  page: number = 1; // Default page number

  constructor(private vehicleService: VehicleService, private router: Router) { }

  ngOnInit(): void {
    this.loadDisks();
  }

  loadDisks(): void {
    this.vehicleService.getAllDisks().subscribe(
      (data: LicenseDisk[]) => {
        this.disks= data;
      },
      (error) => {
        console.error('Error fetching license disks:', error);
      }
    );
  }
}
