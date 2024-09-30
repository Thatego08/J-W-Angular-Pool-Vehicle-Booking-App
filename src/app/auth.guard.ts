import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';
import { AuthService } from './user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService ,private userService:UserService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getUserRole();

    if (role === 'Admin') {
      // Admin has access
      return true;
    } else {
      // Redirect or deny access for non-admin users
      this.router.navigate(['/access-denied']);
      return false;
    }
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   const token = localStorage.getItem('token');
  //   if (token || this.authService.isAuthenticated()) {
  //     return true;
  //   } 
    
  //   else {

  //   console.log('User is not authenticated');
  //     this.router.navigate(['/auth']);
  //     return false;
  //   }



  // }
}
