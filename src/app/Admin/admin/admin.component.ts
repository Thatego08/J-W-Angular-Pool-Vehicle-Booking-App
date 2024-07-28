import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent  implements OnInit {
  admins: any[] = [];
  displayedAdmins: any[] = [];
  searchUsername: string = '';
  searchedAdmin: any = null; // Variable to hold the searched admin
  adminToDelete: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  @ViewChild('deleteConfirmationModal') deleteConfirmationModal!: TemplateRef<any>;

  constructor(private adminService: AdminService, private router: Router,private modalService: NgbModal) { }

  ngOnInit() {
    this.fetchAdmins();
  }

  fetchAdmins() {
    this.adminService.getAllAdmins().subscribe(
      (data: any[]) => {
        this.admins = data;
        this.updateDisplayedAdmins(); // Update the displayed admins list
      },
      error => {
        console.error('Error fetching admins', error);
      }
    );
  }

  deleteAdmin() {
    if (this.adminToDelete) {
      this.adminService.deleteAdmin(this.adminToDelete.userName).subscribe(
        () => {
          console.log('Admin deleted:', this.adminToDelete.userName);
          // Remove deleted admin from local list
          this.admins = this.admins.filter(a => a.userName !== this.adminToDelete.userName);
          this.updateDisplayedAdmins(); // Update the displayed admins list
          this.adminToDelete = null;
          this.modalService.dismissAll();
        },
        error => {
          console.error('Error deleting admin', error);
        }
      );
    }
  }
//pagination
calculateTotalPages() {
  this.totalPages = Math.ceil(this.admins.length / this.itemsPerPage);
}
updateDisplayedAdmins() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.displayedAdmins = this.admins.slice(startIndex, endIndex);
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updateDisplayedAdmins();
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updateDisplayedAdmins();
  }
}
//
  editAdmin(userName: string) {
    this.router.navigate([`/edit-admin/${userName}`]);
  }

  openDeleteConfirmation(admin: any) {
    this.adminToDelete = admin;
    this.modalService.open(this.deleteConfirmationModal, { ariaLabelledBy: 'modal-basic-title' });
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
