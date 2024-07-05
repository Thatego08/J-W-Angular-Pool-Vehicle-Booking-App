import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AdminEditComponent } from '../Admin/admin-edit/admin-edit.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  open(AdminEditComponent: AdminEditComponent): import("@ng-bootstrap/ng-bootstrap").NgbModalRef {
    throw new Error('Method not implemented.');
  }

  constructor(private http:HttpClient) { }
  endPoint:string ="https://localhost:7041/api/Admin/";
 //R
  GetAllAdmins()
  {
   
    return this.http.get<User[]>(this.endPoint + "GetAllAdmins")
  }

  
  // C
  AddAdmins(UserId:User)
  {
    return this.http.post<string>(this.endPoint + "addConsole",User);
  }

  // U
  EditAdmins(UserId:User)
  {
    return this.http.post<string>(this.endPoint + "updateConsole",User);
  }
  GetAdmin(UserId:number)
  {
    return this.http.get<User>(this.endPoint + `getAllAdmin/${UserId}`);
  }
 
  // D
  DeleteAdmin(UserId:number)
  {
    return this.http.get<string>(this.endPoint + `DeleteAdmin/${UserId}`);
  }
}
