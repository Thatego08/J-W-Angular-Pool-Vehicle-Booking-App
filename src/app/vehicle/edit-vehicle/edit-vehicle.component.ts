import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Colour } from '../../models/colour.model';
import { Status } from '../../models/status.model';
import { InsuranceCover } from '../../models/insurance.model';
import { VehicleMake } from '../../models/vehicle-make.model';
import { VehicleModel } from '../../models/vehicle-model.model';
import { VehicleFuelType } from '../../models/fuel.model';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.css']
})
export class EditVehicleComponent implements OnInit {

  vehicle: Vehicle | undefined;
  vehicleId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.vehicleId = Number(params.get('id'));
      if (this.vehicleId) {
        this.loadVehicleDetails(this.vehicleId);
      }
    });
  }

  loadVehicleDetails(id: number): void {
    this.vehicleService.getVehicle(id).subscribe(
      (vehicle: Vehicle) => {
        this.vehicle = vehicle;
      },
      error => {
        console.error('Error loading vehicle details:', error);
      }
    );
  }

  submitEdit(): void {
    if (this.vehicle) {
      this.vehicleService.updateVehicle(this.vehicle.vehicleID, this.vehicle).subscribe(
        () => {
          console.log('Vehicle updated successfully');
        },
        error => {
          console.error('Error updating vehicle:', error);
        }
      );
    }
  }

  // colours: Colour[] = [];
  // fuels: VehicleFuelType[] = [];
  // insurances: InsuranceCover[] = [];
  // makes: VehicleMake[] = [];
  // models: VehicleModel[] = [];
  // status: Status[] = [];

  // vehicle: Vehicle = {
  //   vehicleID: 0,
  //   name: '',
  //   registrationNumber: '',
  //   dateAcquired: new Date(),
  //   licenseExpiryDate: new Date(),
  //   vin: '',
  //   engineNo: '',
  //   colourID: 0,
  //   fuelTypeID: 0,
  //   insuranceCoverID: 0,
  //   statusID: 0,
  //   vehicleMakeID: 0,
  //   vehicleModelID: 0,
  //   description: '',
  //   insuranceCover: { insuranceCoverId: 0, insuranceCoverName: '' },
  //   colour: { id: 0, name: '' },
  //   fuelType: { id: 0, fuelName: '' },
  //   vehicleMake: { vehicleMakeID: 0, name: '' },
  //   vehicleModel: { vehicleModelId: 0, vehicleModelName: '', vehicleMakeID: 0 },
  //   status: { id: 0, name: '' }
  // };

  // constructor(private route: ActivatedRoute, private vs: VehicleService, private router: Router) { }

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(params => {
  //     const vehicleID = params.get('vehicleID');
  //     if (vehicleID) {
  //       this.vs.getVehicleId(vehicleID).subscribe(response => {
  //         this.vehicle = response;
  //         console.log('Vehicle data:', this.vehicle);
  //       });
  //     }
  //   });

  //   this.vs.getAllColours().subscribe(data => {
  //     this.colours = data;
  //     console.log('Colours:', this.colours);
  //   });

  //   this.vs.getAllFuelTypes().subscribe(data => {
  //     this.fuels = data;
  //     console.log('Fuels:', this.fuels);
  //   });

  //   this.vs.getAllInsuranceCovers().subscribe(data => {
  //     this.insurances = data;
  //     console.log('Insurances:', this.insurances);
  //   });

  //   this.vs.getAllVehicleMakes().subscribe(data => {
  //     this.makes = data;
  //     console.log('Makes:', this.makes);
  //   });

  //   this.vs.getAllVehicleModels().subscribe(data => {
  //     this.models = data;
  //     console.log('Models:', this.models);
  //   });

  //   this.vs.getAllStatus().subscribe(data => {
  //     this.status = data;
  //     console.log('Status:', this.status);
  //   });
  // }

  // updateVehicle(): void {
  //   this.vs.updateVehicle(this.vehicle.vehicleID, this.vehicle).subscribe(() => {
  //     this.router.navigate(['vehicles']);
  //   });
  // }

  // cancel(): void {
  //   this.router.navigate(['vehicles']);
  // }
}
