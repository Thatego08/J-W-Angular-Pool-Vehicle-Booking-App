import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminListComponent } from './Admin/admin-list/admin-list.component';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { AdminAddComponent } from './Admin/admin-add/admin-add.component';
import { DriverComponent } from './driver/driver.component';
import { RegisterDriverComponent } from './driver/register-driver/register-driver.component';
import { EditDriverComponent } from './driver/edit-driver/edit-driver.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { FeedbackComponent } from './user/feedback/feedback.component';
import { LoginComponent } from './user/login/login.component';
import { NotificationsComponent } from './user/notifications/notifications.component';
import { ProfileComponent } from './user/profile/profile.component';
import { RegisterComponent } from './user/register/register.component';
import { SettingsComponent } from './user/settings/settings.component';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { FeedbackListComponent } from './user/feedback-list/feedback-list.component';



const routes: Routes = [
 {path:'', pathMatch:'full', redirectTo: 'app-login'} ,
 {path:'admin-home', component:AdminListComponent} ,
 {path:'add-admin',component:AdminAddComponent},
 {path: 'driver', component:DriverComponent, canActivate: [AuthGuard]},
 {path: 'register-driver', component:RegisterDriverComponent},
 {path: 'edit-driver/:userName', component:EditDriverComponent},

 //User routes
 { path: 'app-login', component: LoginComponent },
  { path: 'app-register', component: RegisterComponent },
  { path: 'app-forgot-password', component: ForgotPasswordComponent },
  { path: 'app-reset-password', component: ResetPasswordComponent },
 
  {path: 'app-dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'app-profile', component: ProfileComponent, canActivate: [AuthGuard]},
  
  { path: 'app-notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
  { path: 'app-settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'app-feedback', component: FeedbackComponent, canActivate: [AuthGuard] }, 
  { path: 'app-feedback-list', component: FeedbackListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
