import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent  implements OnInit {
  admins: any[] = [];
  searchUsername: string = '';
  searchedAdmin: any = null; // Variable to hold the searched admin

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit() {
    this.fetchAdmins();
  }

  fetchAdmins() {
    this.adminService.getAllAdmins().subscribe(
      (data: any[]) => {
        this.admins = data;
      },
      error => {
        console.error('Error fetching admins', error);
      }
    );
  }

  deleteAdmin(userName: string) {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.adminService.deleteAdmin(userName).subscribe(
        () => {
          // Remove deleted admin from local list
          this.admins = this.admins.filter(a => a.userName !== userName);
          // Clear searched admin when deleted
          if (this.searchedAdmin && this.searchedAdmin.userName === userName) {
            this.searchedAdmin = null;
          }
        },
        error => {
          console.error('Error deleting admin', error);
        }
      );
    }
  }
  updateAdmin(userName: string): void {
    this.router.navigate([`/edit-admin/${userName}`]); // Navigate to edit admin component
  }
  searchAdmin() {
    if (this.searchUsername.trim() === '') {
      // If search input is empty, fetch all admins
      this.fetchAdmins();
    } else {
      // Filter admins based on username
      this.admins = this.admins.filter(admin =>
        admin.userName.toLowerCase().includes(this.searchUsername.toLowerCase())
      );
    }
  }

  addAdmin() {
    // Navigate to the add admin (or register user) page
    this.router.navigate(['/app-register']);
  }

  clearSearch() {
    this.searchUsername = ''; // Clear the search input
    this.fetchAdmins(); // Fetch all admins to reset the list
  }
}
