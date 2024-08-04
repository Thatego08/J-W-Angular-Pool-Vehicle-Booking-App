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

import { VehicleComponent } from './vehicle/vehicle/vehicle.component';
import { AddVehicleComponent } from './vehicle/add-vehicle/add-vehicle.component';
import { EditVehicleComponent } from './vehicle/edit-vehicle/edit-vehicle.component';
import { AddColourComponent } from './vehicle/add-colour/add-colour.component';
import { AddFuelComponent } from './vehicle/add-fuel/add-fuel.component';
import { AddInsuranceComponent } from './vehicle/add-insurance/add-insurance.component';
import { AddMakeComponent } from './vehicle/add-make/add-make.component';
import { AddModelComponent } from './vehicle/add-model/add-model.component';
import { ChecklistComponent } from './vehicle/checklist/checklist.component';
import { ColourComponent } from './vehicle/colour/colour.component';
import { EditColourComponent } from './vehicle/edit-colour/edit-colour.component';
import { EditFuelComponent } from './vehicle/edit-fuel/edit-fuel.component';
import { EditInsuranceComponent } from './vehicle/edit-insurance/edit-insurance.component';
import { EditMakeComponent } from './vehicle/edit-make/edit-make.component';
import { EditModelComponent } from './vehicle/edit-model/edit-model.component';
import { FuelTypeComponent } from './vehicle/fuel-type/fuel-type.component';
import { InsuranceComponent } from './vehicle/insurance/insurance.component';
import { ManageComponent } from './vehicle/manage/manage.component';
import { PostChecklistComponent } from './vehicle/post-checklist/post-checklist.component';
import { ServiceComponent } from './vehicle/service/service.component';
import { StatusComponent } from './vehicle/status/status.component';
import { VehicleDetailsComponent } from './vehicle/vehicle-details/vehicle-details.component';
import { VehicleMakeComponent } from './vehicle/vehicle-make/vehicle-make.component';
import { VehicleModelComponent } from './vehicle/vehicle-model/vehicle-model.component';
import { PoolVehicleComponent } from './vehicle/pool-vehicles/pool-vehicles.component';
import { LicenseDisksComponent } from './vehicle/license-disc/license-disc.component';
import { ReportComponent } from './report-central/report/report.component';




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
 
 //Vehicle Routes
 
 //Vehicle routes
 {path: 'vehicles', component: VehicleComponent,canActivate: [AuthGuard]},
 {path: 'add-vehicle', component: AddVehicleComponent,canActivate: [AuthGuard]},
 {path: 'edit-vehicle/:id', component: EditVehicleComponent,canActivate: [AuthGuard]},
 {path: 'manage-vehicle', component: ManageComponent,canActivate: [AuthGuard]},
 {path: 'pool-vehicle', component: PoolVehicleComponent,canActivate: [AuthGuard]},
 {path: 'vehicle-details', component: VehicleDetailsComponent,canActivate: [AuthGuard]},

 //Colours
 {path: 'colour', component: ColourComponent },
 {path: 'add-colour', component: AddColourComponent },
 {path: 'edit-colour/:id', component: EditColourComponent},

 //Fuel Types
 {path: 'fuel-type', component: FuelTypeComponent },
 {path: 'add-fuel', component: AddFuelComponent },
 {path: 'edit-fuel/:id', component: EditFuelComponent},

 //Insurance Cover
 {path: 'insurance', component: InsuranceComponent },
 {path: 'add-insurance', component: AddInsuranceComponent },
 {path: 'edit-insurance/:insuranceCoverId', component: EditInsuranceComponent},

 //License Disks
 
 {path: 'license-disks', component: LicenseDisksComponent},

 //Vehicle Makes
  {path: 'add-make', component: AddMakeComponent},
 {path: 'vehicle-make', component: VehicleMakeComponent },
 {path: 'edit-make/:vehicleMakeID', component: EditMakeComponent},

 //Vehicle Models
 {path: 'add-model', component: AddModelComponent },
 {path: 'vehicle-model', component: VehicleModelComponent },
 {path: 'edit-model/:vehicleModelID', component: EditModelComponent},

 //Vehicle Extras
 {path: 'checklist', component: ChecklistComponent},
 {path: 'post-checklist', component: PostChecklistComponent},
 {path: 'service', component: ServiceComponent},
 {path: 'status', component: StatusComponent },

 



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
  { path: 'app-feedback-list', component: FeedbackListComponent, canActivate: [AuthGuard] },

  {path: 'app-report', component:ReportComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
