import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../models/user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profileData: any = {};
  user:any;
  errorMessage: string | null = null;
  constructor(private authService: AuthService, private router: Router) { }

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
          this.router.navigate(['/app-login']);
        }}
    );
  }

  logout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/app-login']);
    }, error => {
      console.error('Logout error:', error);
    });
  }
}
