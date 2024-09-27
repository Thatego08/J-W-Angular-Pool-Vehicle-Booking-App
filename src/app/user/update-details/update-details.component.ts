import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-update-details',
  templateUrl: './update-details.component.html',
  styleUrl: './update-details.component.css'
})
export class UpdateDetailsComponent {



  selectedFile: File | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('Name', this.data.name);
    formData.append('Surname', this.data.surname);
    formData.append('Email', this.data.email);
    if (this.selectedFile) {
      formData.append('ProfilePhoto', this.selectedFile); // Add the selected file
    }
   

    this.authService.updateDetails(this.data.userName, formData).subscribe(
      response => {
        // Handle success
        console.log(response);
      },
      error => {
        // Handle error
        console.error('Error updating profile', error);
      }
    );
  }

}
