import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AdminListComponent } from './Admin/admin-list/admin-list.component';
import { AdminAddComponent } from './Admin/admin-add/admin-add.component';
import { AdminEditComponent } from './Admin/admin-edit/admin-edit.component';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DriverComponent } from './driver/driver.component';
import { NavigationComponent } from './navigation/navigation.component';

import { ReactiveFormsModule } from '@angular/forms';
import { RegisterDriverComponent } from './driver/register-driver/register-driver.component';
import { EditDriverComponent } from './driver/edit-driver/edit-driver.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { BookingComponent } from './booking/booking.component';
import { AddBookingComponent } from './booking/add-booking/add-booking.component';
import { BookingListComponent } from './booking/booking-list/booking-list.component';
import { EditBookingComponent } from './booking/edit-booking/edit-booking.component';
import { BookingService } from './services/booking.service';
import { ToastrModule } from 'ngx-toastr';
import { BookingHistoryComponent } from './booking/booking-history/booking-history.component';

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
    ForgotPasswordComponent,
    ResetPasswordComponent,
    BookingComponent,
    AddBookingComponent,
    BookingListComponent,
    EditBookingComponent,
    BookingHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    AuthGuard,
    UserService,
    BookingService,
    HttpClient,
    provideAnimationsAsync()

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
