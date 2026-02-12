import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  user = { name: '', surname: '', phoneNumber: '', email: '', password: '', confirmPassword: '' };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  //errorMessage: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.successMessage = 'Registration successful! Redirecting to login...';
       // this.router.navigate(['/app-login']);
        setTimeout(() => {
          this.router.navigate(['/app-login']);
        }, 2000);
      },
      (error) => {
        console.error('Registration error:', error);

        this.errorMessage = error.error.message || 'Registration failed. Please try again.';
      }
    );
  }
}
