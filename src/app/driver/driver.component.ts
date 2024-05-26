import { Component, OnInit } from '@angular/core';
import { DriverService } from '../driver.service';
import { DriverModel } from '../driver.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  drivers: DriverModel[] = [];
  searchQuery: string = '';
//
  constructor(private driverService: DriverService, private router: Router) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driverService.getAllDrivers().subscribe((drivers) => {
      this.drivers = drivers;
    });
  }

  searchDriver(): void {
    if (this.searchQuery.trim()) {
      this.driverService.searchDriver(this.searchQuery).subscribe(searchResult => {
        if (searchResult !== null) {
          this.drivers = [searchResult];
        } else {
          this.drivers = [];
        }
      }, error => {
        console.error('Failed to search driver:', error);
        alert('Failed to search driver. Please try again.');
      });
    } else {
      this.loadDrivers();
    }
  }
  
  

  editDriver(driver: DriverModel): void {
    this.router.navigate(['/edit-driver', driver.username]);
  }

  deleteDriver(username: string): void {
    this.driverService.removeDriver(username).subscribe(() => {
      this.loadDrivers();
    });
  }
}
