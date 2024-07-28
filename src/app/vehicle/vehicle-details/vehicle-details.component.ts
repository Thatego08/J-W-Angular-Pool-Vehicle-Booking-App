import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from '../../models/vehicle.model';


@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {

  vehicle!: Vehicle;

  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle
  ) { }

  ngOnInit(): void {
    this.vehicle = this.data;
  }

  onClose(): void {
    this.dialogRef.close();
  }


}
