import { Component , OnInit} from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleModel } from '../../models/vehicle-model.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-model',
  templateUrl: './vehicle-model.component.html',
  styleUrls:['./vehicle-model.component.css'] 
})
export class VehicleModelComponent implements OnInit {
vehicleModels: VehicleModel[] = [];

constructor(private vs: VehicleService,
  private router: Router
) {}
ngOnInit(): void {
  this.loadVehicleModels()
}

loadVehicleModels(): void {
  this.vs.getAllVehicleModels().subscribe(
    (data: VehicleModel[]) => {
      this.vehicleModels = data;
    },
    (error) => {
      console.error('Error fetching Vehicle models:', error);
    }
  );
}

deleteModel(modelId: number): void {
  if (confirm('Are you sure you want to delete this vehicle model?')) {
    this.vs.deleteVehicleModel(modelId).subscribe(
      () => {
        alert('Vehicle Model deleted added successfully');
        // Optionally, refresh the list or handle the UI update here
      },
      error => {
        alert('Failed to delete the vehicle model.');
        console.error('Delete failed', error);
      }
    );
  }
}


navigateToEditModel(modelId: number): void {
  this.router.navigate(['/edit-model', modelId]);
}

}
