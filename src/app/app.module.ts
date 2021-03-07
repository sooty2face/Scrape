import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { ToDoQuery } from './domain/todos/state/query';
import { ToDoStore } from './domain/todos/state/store';
import { ToDoService } from './domain/todos/services/todos.service';
import { ToDosRepository } from './shared/rxdb/repositories/todos.repository';
import { AuthGuard, ErrorInterceptor } from './domain/Auth/_helpers';
import { JwtHelperService, JwtInterceptor, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatabaseModule } from './shared/rxdb/database.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectivityStateService } from './shared/network/services';
import { ToggleComponent } from './domain/Auth/login/toggle/toggle/toggle.component';
import { DeviceID } from './domain/Auth/_services/deviceid.service';
import { DomainAuthModule } from './domain/Auth/domain-auth.module';
import { AlertModule } from './shared/alert';
import { CommonModule } from '@angular/common';
import { DashboardPageModule } from './pages/dashboard/dashboard/dashboard.module';

@NgModule({
  declarations: [AppComponent, ToggleComponent, routingComponents],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    DatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DomainAuthModule.forRoot(),
    AlertModule.forRoot(),
    CommonModule,
    DashboardPageModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ConnectivityStateService,
    ToDoQuery,
    ToDoStore,
    ToDoService,
    ToDosRepository, ],
  bootstrap: [AppComponent],
})
export class AppModule { }
