import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  
  service: Service = {
    vehicleId: 0,
    adminName: '',
    adminEmail: '',
    serviceDate: new Date(),
    description: ''
  };
  vehicles: Vehicle[] = [];
  message: string = '';

  constructor(
    private serviceService: ServiceService,
    private vehicleService: VehicleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.vehicleService.getAllVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
    });
  }

  submitService(): void {
    this.serviceService.createService(this.service).subscribe(
      () => {
        this.message = 'Service booked successfully!';
        this.router.navigate(['/manage-vehicle']); // Redirect after successful submission
      },
      error => {
        this.message = 'Error booking service.';
        console.error('Error:', error);
      }
    );
  }


  // vehicles: Vehicle[] = [];
  // message: string = '';

  // constructor(private serviceService: ServiceService) {}

  // ngOnInit(): void {
  //   this.loadVehicles();
  // }

  // loadVehicles(): void {
  //   this.serviceService.getAllVehicles().subscribe(
  //     (vehicles: Vehicle[]) => {
  //       this.vehicles = vehicles;
  //     },
  //     error => {
  //       this.message = 'An error occurred while fetching vehicles.';
  //     }
  //   );
  // }




  // submitService(): void {
  //   this.serviceService.createService(this.service).subscribe(
  //     response => {
  //       this.message = 'Service submitted successfully.';
  //       this.service = {
  //         serviceId: 0,
  //         vehicleId: 0,
  //         adminName: '',
  //         adminEmail: '',
  //         description: '',
  //         serviceDate: new Date()
  //       };
  //     },
  //     error => {
  //       this.message = 'An error occurred while submitting the service.';
  //     }
  //   );
  // }
}





// import { Component } from '@angular/core';
// import { ServiceService } from '../../services/service.service';
// import { Service } from '../../models/service.model';
// import { Vehicle } from '../../models/vehicle.model';

// @Component({
//   selector: 'app-service',
//   templateUrl: './service.component.html',
//   styleUrl: './service.component.css'
// })
// export class ServiceComponent {
//   service: Service = {
//     vehicleId: 0,
//     adminName: '',
//     adminEmail: '',
//     description: '',
//     serviceDate: new Date()
//   };

//   message: string = '';
  
  

//   constructor(private serviceService: ServiceService) {}

//   submitService() {
//     this.serviceService.submitService(this.service).subscribe(
//       response => {
//         this.message = 'Service submitted successfully.';
//         this.service = {
//           vehicleId: 0,
//           adminName: '',
//           adminEmail: '',
//           description: '',
//           serviceDate: new Date()
//         };
//       },
//       error => {
//         this.message = 'An error occurred while submitting feedback.';
//       }
//     );
//   }
// }