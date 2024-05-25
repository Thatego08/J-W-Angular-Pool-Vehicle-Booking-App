import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AdminListComponent } from './Admin/admin-list/admin-list.component';
import { AdminAddComponent } from './Admin/admin-add/admin-add.component';
import { AdminEditComponent } from './Admin/admin-edit/admin-edit.component';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';  

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    AdminListComponent,
    AdminAddComponent,
    AdminEditComponent,
    AdminHomeComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
