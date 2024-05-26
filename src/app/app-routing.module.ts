import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminListComponent } from './Admin/admin-list/admin-list.component';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { AdminAddComponent } from './Admin/admin-add/admin-add.component';
import { DriverComponent } from './driver/driver.component';
import { RegisterDriverComponent } from './register-driver/register-driver.component';
import { EditDriverComponent } from './edit-driver/edit-driver.component';




const routes: Routes = [
 {path:'', pathMatch:'full', redirectTo: 'admin-home'} ,
 {path:'admin-home', component:AdminListComponent} ,
 {path:'add-admin',component:AdminAddComponent},
 {path: 'driver', component:DriverComponent},
 {path: 'register-driver', component:RegisterDriverComponent},
 {path: 'edit-driver', component:EditDriverComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
