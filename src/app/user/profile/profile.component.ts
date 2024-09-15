import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../models/user';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profileData: any = {};
  user:any;
  errorMessage: string | null = null;
  
  notificationMessage: string | null = null;
  isSuccess: boolean = true;
  constructor(private authService: AuthService, private router: Router, 
    private dialog: MatDialog) { }

  ngOnInit(): void {
   this.loadUserProfile();
  }

  loadUserProfile(): void{
    this.authService.getProfile().subscribe(
      (data:any) => {
        console.log('User data:', data); // Log user data
        this.user = data;
      },
      (error) => {
        console.log('Error fetching profile', error);
        this.errorMessage = error.error.message;
        if (error.status === 401 || error.status === 404) {
          // Handle unauthorized errors
          this.router.navigate(['/auth']);
        }}
    );
  }

  openEditModal(): void {
    const dialogRef = this.dialog.open(ProfileEditComponent, {
      width: '400px',
      data: { ...this.user }  // Pass user data to the modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Call the API to update the user's profile
        this.authService.updateUserProfile(this.user.userName, result).subscribe(
          () => {
            
          this.notificationMessage = 'Your password has been updated successfully';
          this.isSuccess= true;
             // Reload profile data after successful update
            //Delay for notification purposes
            setTimeout(() => {
              //this.router.navigate(['/auth']);
              this.loadUserProfile(); 
            }, 3000); // 3 seconds delay
          },
          (error) => {
            this.notificationMessage =  'Your password was not updated, please try again';
            this.isSuccess = false;
            
            console.error('Error updating profile', error);
          }
        ),3000;
      }
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/auth']);
    }, error => {
      console.error('Logout error:', error);
    });
  }
}
