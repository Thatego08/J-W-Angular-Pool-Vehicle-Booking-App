import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminListComponent } from './Admin/admin-list/admin-list.component';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { AdminAddComponent } from './Admin/admin-add/admin-add.component';


const routes: Routes = [
 {path:'', pathMatch:'full', redirectTo: 'admin-home'} ,
 {path:'admin-home', component:AdminListComponent} ,
 {path:'add-admin',component:AdminAddComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
