import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Status } from '../../models/status.model';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  status: Status[] = [];

  constructor(private vs: VehicleService) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {
    this.vs.getAllStatus().subscribe(
      (data: Status[]) => {
        this.status = data;
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

}
