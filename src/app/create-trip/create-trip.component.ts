import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit{
 
    tripForm: FormGroup;
    message: string = '';
    trips: any[] = [];
    imagePreview: string | ArrayBuffer | null = null; // To store image preview URL
    
  
    constructor(private formBuilder: FormBuilder, private tripService: TripService) {
      this.tripForm = this.formBuilder.group({
        vehicleId: ['', Validators.required],
        location: ['', Validators.required],
        fuelAmount: ['', Validators.required],
        comment: [''],
        travelStart: [null, Validators.required],
        travelEnd: [null, Validators.required],
        registrationNumber: [''],
        mediaFiles: [''],
        mediaDescription: ['']
      });
    }
  
    ngOnInit(): void {
     
      this.fetchTrips();
    }
  
  
  
    onSubmit(): void {
      if (this.tripForm.valid) {
        const formData = new FormData();
        formData.append('vehicleId', this.tripForm.value.vehicleId);
        formData.append('location', this.tripForm.value.location);
        formData.append('fuelAmount', this.tripForm.value.fuelAmount);
        formData.append('comment', this.tripForm.value.comment);
        formData.append('travelStart', new Date(this.tripForm.value.travelStart).toISOString());
        formData.append('travelEnd', new Date(this.tripForm.value.travelEnd).toISOString());
        formData.append('registrationNumber', this.tripForm.value.registrationNumber);
  
        if (this.tripForm.value.mediaFiles) {
          for (let file of this.tripForm.value.mediaFiles) {
            formData.append('mediaFiles', file);
          }
        }
  
        this.tripService.createTrip(formData).subscribe(
          response => {
            this.message = 'A new trip has been successfully created';
            this.tripForm.reset();
            this.imagePreview = null; // Reset image preview after submission
            this.fetchTrips();
          },
          error => {
            this.message = 'Failed to create trip';
          }
        );
      }
    }
  
    // Function to cancel image selection
    cancelImage() {
      this.tripForm.patchValue({
        mediaFiles: null
      });
      this.imagePreview = null;
    }
  
    fetchTrips() {
      this.tripService.getAllTrips().subscribe(
        (data: any[]) => {
          this.trips = data;
        },
        error => {
          console.error('Error fetching drivers', error);
        }
      );
    }
  
    onFileChange(event: any): void {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result; // Set image preview
        };
        reader.readAsDataURL(file);
      }
    }
  }
  