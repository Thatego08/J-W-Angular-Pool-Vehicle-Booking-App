import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DriverComponent } from './driver/driver.component';
import { NavigationComponent } from './navigation/navigation.component';

import { RegisterDriverComponent } from './driver/register-driver/register-driver.component';
import { EditDriverComponent } from './driver/edit-driver/edit-driver.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { SettingsComponent } from './user/settings/settings.component';
import { FeedbackComponent } from './user/feedback/feedback.component';
import { NotificationsComponent } from './user/notifications/notifications.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './Tools/auth.interceptor';
import { AuthService } from './user/auth.service';
import { UserService } from './user/user.service';
import { TripComponent } from './trip/trip.component';
import { CreateTripComponent } from './create-trip/create-trip.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { GetTripComponent } from './get-trip/get-trip.component';
import { RefuelVehicleComponent } from './refuel-vehicle/refuel-vehicle.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { AdminComponent } from './Admin/admin/admin.component';
import { BookingComponent } from './booking/booking.component';
import { AddBookingComponent } from './booking/add-booking/add-booking.component';
import { BookingListComponent } from './booking/booking-list/booking-list.component';
import { EditBookingComponent } from './booking/edit-booking/edit-booking.component';
import { BookingService } from './services/booking.service';
import { ToastrModule } from 'ngx-toastr';
import { BookingHistoryComponent } from './booking/booking-history/booking-history.component';

import { FeedbackListComponent } from './user/feedback-list/feedback-list.component';
import { EditAdminComponent } from './Admin/edit-admin/edit-admin.component';
import { RateComponent } from './Rate/rate/rate.component';
import { RateFormComponent } from './Rate/rate-form/rate-form.component';
import { FaqadminComponent } from './faqadmin/faqadmin.component';
import { ProjectComponent } from './project/project.component';
import { AddVehicleComponent } from './vehicle/add-vehicle/add-vehicle.component';
import { EditVehicleComponent } from './vehicle/edit-vehicle/edit-vehicle.component';
import { VehicleComponent } from './vehicle/vehicle/vehicle.component';
import { VehicleDetailsComponent } from './vehicle/vehicle-details/vehicle-details.component';
import { PoolVehicleComponent } from './vehicle/pool-vehicles/pool-vehicles.component';
import { AddFuelComponent } from './vehicle/add-fuel/add-fuel.component';
import { AddColourComponent } from './vehicle/add-colour/add-colour.component';
import { AddInsuranceComponent } from './vehicle/add-insurance/add-insurance.component';
import { AddMakeComponent } from './vehicle/add-make/add-make.component';
import { AddModelComponent } from './vehicle/add-model/add-model.component';
import { ColourComponent } from './vehicle/colour/colour.component';
import { EditFuelComponent } from './vehicle/edit-fuel/edit-fuel.component';
import { EditInsuranceComponent } from './vehicle/edit-insurance/edit-insurance.component';
import { EditMakeComponent } from './vehicle/edit-make/edit-make.component';
import { EditModelComponent } from './vehicle/edit-model/edit-model.component';
import { EditServiceComponent } from './vehicle/edit-service/edit-service.component';
import { ChecklistComponent } from './vehicle/checklist/checklist.component';
import { PostChecklistComponent } from './vehicle/post-checklist/post-checklist.component';
import { EditColourComponent } from './vehicle/edit-colour/edit-colour.component';
import { ServiceComponent } from './vehicle/service/service.component';
import { FuelTypeComponent } from './vehicle/fuel-type/fuel-type.component';
import { VehicleMakeComponent } from './vehicle/vehicle-make/vehicle-make.component';
import { VehicleModelComponent } from './vehicle/vehicle-model/vehicle-model.component';
import { StatusComponent } from './vehicle/status/status.component';
import { LicenseDisksComponent } from './vehicle/license-disc/license-disc.component';
import { ManageComponent } from './vehicle/manage/manage.component';
import { InsuranceComponent } from './vehicle/insurance/insurance.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportComponent } from './report-central/report/report.component';
import { ReportService } from './services/report.service';
import { ProjectService } from './services/project.service';
import { AuthComponent } from './user/auth/auth.component';
import { MatCardModule } from '@angular/material/card';
import { PreChecklistComponent } from './pre-checklist/pre-checklist.component';
import { CreatePostCheckComponent } from './create-post-check/create-post-check.component';
import { ViewPostCheckComponent } from './view-post-check/view-post-check.component';
import { GetRefuelVehicleComponent } from './get-refuel-vehicle/get-refuel-vehicle.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { HomeComponent } from './home/home.component';

import { HelpDocumentComponent } from './help-document/help-document.component';
import { FaqlistComponent } from './faqlist/faqlist.component';



@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    
    DriverComponent,
    AdminComponent,
    NavigationComponent,
    RegisterDriverComponent,
    EditDriverComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    SettingsComponent,
    FeedbackComponent,
    NotificationsComponent,
    ProjectComponent,
    ProfileComponent,
    TripComponent,
    CreateTripComponent,
    EditTripComponent,
    GetTripComponent,
    RefuelVehicleComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    BookingComponent,
    AddBookingComponent,
    BookingListComponent,
    EditBookingComponent,
    BookingHistoryComponent,
    FeedbackListComponent,
    EditAdminComponent,
    RateComponent,
    RateFormComponent,
    AddVehicleComponent,
    EditVehicleComponent,
    VehicleComponent,
    VehicleDetailsComponent,
    PoolVehicleComponent,
    AddFuelComponent,
    AddColourComponent,
    AddInsuranceComponent,
    AddMakeComponent,
    AddModelComponent,
    ColourComponent,
    EditFuelComponent,
    EditInsuranceComponent,
    EditMakeComponent,
    EditModelComponent,
    EditServiceComponent,
    ChecklistComponent,
    PostChecklistComponent,
    EditColourComponent,
    FaqlistComponent,
    ServiceComponent,
    FuelTypeComponent,
    VehicleMakeComponent,
    VehicleModelComponent,
    StatusComponent,
    LicenseDisksComponent,
    ManageComponent,
    InsuranceComponent,
    NavBarComponent,
    ReportComponent,
    AuthComponent,
    NotificationsComponent,
    PreChecklistComponent,
    CreatePostCheckComponent,
    ViewPostCheckComponent,
    GetRefuelVehicleComponent,
    FaqadminComponent,
    HomeComponent,

    HelpDocumentComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormFieldModule,
    NgxPaginationModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    AuthGuard,
    UserService,
    BookingService,
    ReportService,
    ProjectService,
    HttpClient,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
