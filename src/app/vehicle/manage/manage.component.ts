import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Colour } from '../../models/colour.model';
import { InsuranceCover } from '../../models/insurance.model';
import { LicenseDisk } from '../../models/licensedisc.model';
import { VehicleFuelType } from '../../models/fuel.model';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleModel } from '../../models/vehicle-model.model';
import { Status } from '../../models/status.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  colours: Colour[] = [];
  insuranceCovers: InsuranceCover[] = [];
  licenseDisks: LicenseDisk[] = [];
  fuelTypes: VehicleFuelType[] = [];
  vehicleMakes: VehicleMake[] = [];
  vehicleModels: VehicleModel[] = [];

  constructor(private vs: VehicleService) { }

  ngOnInit(): void {
    this.loadColours();
    this.loadDisks();
    this.loadInsuranceCovers();
    this.loadFuelTypes();
    this.loadVehicleMakes();
    this.loadVehicleModels();
  }

  loadColours(): void {
    this.vs.getAllColours().subscribe(
      (data: Colour[]) => {
        this.colours = data;
      },
      (error) => {
        console.error('Error fetching colours:', error);
      }
    );
  }

  

  loadDisks(): void {
    this.vs.getAllDisks().subscribe(
      (data: LicenseDisk[]) => {
        this.licenseDisks = data;
      },
      (error) => {
        console.error('Error fetching license disks:', error);
      }
    );
  }

  loadInsuranceCovers(): void {
    this.vs.getAllInsuranceCovers().subscribe(
      (data: InsuranceCover[]) => {
        this.insuranceCovers = data;
      },
      (error) => {
        console.error('Error fetching insurance covers:', error);
      }
    );
  }

  loadFuelTypes(): void {
    this.vs.getAllFuelTypes().subscribe(
      (data:VehicleFuelType[]) => {
        this.fuelTypes = data;
      },
      (error) => {
        console.error('Error fetching fuel types:', error);
      }
    );
  }

  loadVehicleMakes(): void {
    this.vs.getAllVehicleMakes().subscribe(
      (data: VehicleMake[]) => {
        this.vehicleMakes = data;
      },
      (error) => {
        console.error('Error fetching vehicle makes:', error);
      }
    );
  }

  loadVehicleModels(): void {
    this.vs.getAllVehicleModels().subscribe(
      (data: VehicleModel[]) => {
        this.vehicleModels = data;
      },
      (error) => {
        console.error('Error fetching vehicle models:', error);
      }
    );
  }

  

  
}
