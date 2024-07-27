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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AdminListComponent } from './Admin/admin-list/admin-list.component';
import { AdminAddComponent } from './Admin/admin-add/admin-add.component';
import { AdminEditComponent } from './Admin/admin-edit/admin-edit.component';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
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

import { BookingComponent } from './booking/booking.component';
import { AddBookingComponent } from './booking/add-booking/add-booking.component';
import { BookingListComponent } from './booking/booking-list/booking-list.component';
import { EditBookingComponent } from './booking/edit-booking/edit-booking.component';
import { BookingService } from './services/booking.service';
import { ToastrModule } from 'ngx-toastr';
import { BookingHistoryComponent } from './booking/booking-history/booking-history.component';

import { FeedbackListComponent } from './user/feedback-list/feedback-list.component';


@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    AdminListComponent,
    AdminAddComponent,
    AdminEditComponent,
    AdminHomeComponent,
    DriverComponent,
    NavigationComponent,
    RegisterDriverComponent,
    EditDriverComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    SettingsComponent,
    FeedbackComponent,
    NotificationsComponent,
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

    FeedbackListComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,

    ToastrModule.forRoot(),

    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    AuthGuard,
    UserService,

    BookingService,
    HttpClient,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
