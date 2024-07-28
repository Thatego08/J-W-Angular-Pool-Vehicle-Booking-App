import { Component, OnInit } from '@angular/core';
import { Admin } from '../../models/admin';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.css'
})
export class EditAdminComponent implements OnInit {
  updatedAdmin: Admin = {
    userName: '',
    name: '',
    surname: '',
    email: '',
    phoneNumber: ''
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userName = params.get('userName');
      if (userName) {
        this.adminService.getAdmin(userName).subscribe({
          next: (response) => {
            this.updatedAdmin = response;
          },
          error: (error) => {
            this.errorMessage = 'Error fetching admin details';
            console.error(error);
          }
        });
      }
    });
  }

  updateAdmin(form: NgForm) {
    if (form.valid) {
      this.adminService.updateAdmin(this.updatedAdmin.userName, this.updatedAdmin).subscribe({
        next: (response) => {
          this.successMessage = 'Admin updated successfully';
          setTimeout(() => {
            this.router.navigate(['manage-admins']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = `Error updating admin: ${error.error}`;
          console.error('Error updating admin', error);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(["manage-admins"]);
  }
}
