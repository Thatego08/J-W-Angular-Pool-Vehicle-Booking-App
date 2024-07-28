import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

import { BookingComponent } from './booking/booking.component';
import { AddBookingComponent } from './booking/add-booking/add-booking.component';
import { EditBookingComponent } from './booking/edit-booking/edit-booking.component';
import { BookingListComponent } from './booking/booking-list/booking-list.component';
import { BookingHistoryComponent } from './booking/booking-history/booking-history.component';

import { FeedbackListComponent } from './user/feedback-list/feedback-list.component';



import { TripComponent } from './trip/trip.component';
import { CreateTripComponent } from './create-trip/create-trip.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { GetTripComponent } from './get-trip/get-trip.component';
import { RefuelVehicleComponent } from './refuel-vehicle/refuel-vehicle.component';
import { AdminComponent } from './Admin/admin/admin.component';
import { EditAdminComponent } from './Admin/edit-admin/edit-admin.component';
import { ProjectComponent } from './project/project.component';
import { RateComponent } from './Rate/rate/rate.component';




const routes: Routes = [
 {path:'', pathMatch:'full', redirectTo: 'app-login'} ,
 {path: 'driver', component:DriverComponent, canActivate: [AuthGuard]},
 {path: 'admin', component:AdminComponent,canActivate:[AuthGuard]},
 {path: 'register-driver', component:RegisterDriverComponent},
 { path: 'project', component: ProjectComponent ,canActivate:[AuthGuard]},
 { path: 'rate', component: RateComponent , canActivate:[AuthGuard] },
 {path: 'edit-driver/:userName', component:EditDriverComponent},
 { path: 'edit-admin/:userName', component: EditAdminComponent, canActivate: [AuthGuard]},


 //Booking
 {path: 'booking', component:BookingComponent, canActivate: [AuthGuard]},
 {path: 'add-booking', component:AddBookingComponent, canActivate: [AuthGuard]},
 {path: 'edit-booking', component:EditBookingComponent, canActivate: [AuthGuard]},
 {path: 'booking-list', component:BookingListComponent, canActivate: [AuthGuard]},
 {path: 'booking-history', component:BookingHistoryComponent, canActivate: [AuthGuard]},
 // Fallback route


 //Trip Routes
 {path: 'trip', component:TripComponent, canActivate: [AuthGuard]},
 {path: 'create-trip', component:CreateTripComponent, canActivate: [AuthGuard]},
 { path: 'edit-trip/:id', component: EditTripComponent, canActivate: [AuthGuard] },
 {path: 'refuel-vehicle', component:RefuelVehicleComponent, canActivate: [AuthGuard]},
 {path: 'get-trip', component:GetTripComponent, canActivate: [AuthGuard]},

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
