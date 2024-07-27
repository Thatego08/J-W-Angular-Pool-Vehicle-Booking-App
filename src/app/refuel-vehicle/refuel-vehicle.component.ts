import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-refuel-vehicle',
  templateUrl: './refuel-vehicle.component.html',
  styleUrls: ['./refuel-vehicle.component.css']
})
export class RefuelVehicleComponent implements OnInit {
  refuelVehicleForm: FormGroup;

  fields = [
    { label: 'Radiator Water Level', name: 'radiatorWaterLevel', comment: 'radiatorWaterLevelComment' },
    { label: 'Battery', name: 'battery', comment: 'batteryComment' },
    { label: 'Oil Level', name: 'oilLevel', comment: 'oilLevelComment' },
    { label: 'Brake Fluid Level', name: 'brakeFluidLevel', comment: 'brakeFluidLevelComment' },
    { label: 'Clutch Fluid Level', name: 'clutchFluidLevel', comment: 'clutchFluidLevelComment' },
    { label: 'Window Washer Fluid Level', name: 'windowWasherFluidLevel', comment: 'windowWasherFluidLevelComment' },
    { label: 'V-Belt Condition', name: 'vBeltCondition', comment: 'vBeltConditionComment' },
    { label: 'Tyre Pressure', name: 'tyrePressure', comment: 'tyrePressureComment' },
    { label: 'Tyre Condition', name: 'tyreCondition', comment: 'tyreConditionComment' },
    { label: 'Spare Wheel Condition', name: 'spareWheelCondition', comment: 'spareWheelConditionComment' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.refuelVehicleForm = this.formBuilder.group({
      tripId: ['', Validators.required],
      FuelQuantity: [''],
      FuelCost: [''],
      radiatorWaterLevel: [false],
      radiatorWaterLevelComment: [''],
      battery: [false],
      batteryComment: [''],
      oilLevel: [false],
      oilLevelComment: [''],
      brakeFluidLevel: [false],
      brakeFluidLevelComment: [''],
      clutchFluidLevel: [false],
      clutchFluidLevelComment: [''],
      windowWasherFluidLevel: [false],
      windowWasherFluidLevelComment: [''],
      vBeltCondition: [false],
      vBeltConditionComment: [''],
      tyrePressure: [false],
      tyrePressureComment: [''],
      tyreCondition: [false],
      tyreConditionComment: [''],
      spareWheelCondition: [false],
      spareWheelConditionComment: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.refuelVehicleForm.valid) {
      // Handle form submission
      console.log(this.refuelVehicleForm.value);
    }
  }
}
