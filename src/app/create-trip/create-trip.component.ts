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
    fileError: string | null = null; // To store file upload errors
    
  
    constructor(private formBuilder: FormBuilder, private tripService: TripService) {
      this.tripForm = this.formBuilder.group({
        name: ['', Validators.required],
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
        formData.append('name', this.tripForm.value.name);
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
      const file = event.target.files[0];
      if (file) {
        const fileType = file.type;
  
        // Validate file type
        if (fileType.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview = reader.result; // Set image preview
          };
          reader.readAsDataURL(file);
          this.fileError = null; // Clear file error message
          this.tripForm.patchValue({
            mediaFiles: event.target.files // Update form control with file
          });
        } else {
          this.fileError = 'Please upload a valid image file (e.g., JPG, PNG).';
          this.imagePreview = null; // Clear image preview
          this.tripForm.patchValue({
            mediaFiles: null // Clear form control
          });
        }
      }
    }
  }