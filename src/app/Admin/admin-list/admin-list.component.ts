import { Component } from '@angular/core';
import { AdminService } from '../../admin-services/admin.service';
import { User } from '../../models/user';
import { AdminEditComponent } from '../admin-edit/admin-edit.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent {

  constructor(private adminService:AdminService, private modalService: NgbModal) { }
  users:User[]=[];
  searchText:string = '';
  selectedAdmin: User | null = null;
  newAdmin: User = new User();  // Define a new admin object


  ngOnInit()
  {
    this.adminService.GetAllAdmins().subscribe(res => {
    this.users = res;
    
     
    });
  }

  getAllAdmins()
  {
    this.adminService.GetAllAdmins().subscribe(res => {
      this.users = res;
      console.log(res);
    });
  }

  // openAddModal(): void {
  //   const modalRef: NgbModalRef = this.adminService.open(AdminEditComponent);
  //   modalRef.res.then((res) => {
  //     if (res === 'success') {
  //       this.getAllAdmins();
  //     }
  //   }).catch((error: any) => {
  //     console.log('Modal dismissed with error:', error);
  //   });
  // }

  // openEditModal(admin: User): void {
  //   const modalRef: NgbModalRef = this.adminService.open(AdminEditComponent);
  //   modalRef.componentInstance.admin = { ...admin };
  //   modalRef.result.then((result) => {
  //     if (result === 'success') {
  //       this.getAllAdmins();
  //     }
  //   }).catch((error) => {
  //     console.log('Modal dismissed with error:', error);
  //   });
  // }

  deleteAdmin(UserId:number)
  {
    this.adminService.DeleteAdmin(UserId).subscribe(res => {
      this.getAllAdmins();
    });
  }

}
