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
    HttpClientModule    
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ConnectivityStateService,
    ToDoQuery,
    ToDoStore,
    ToDoService,
    ToDosRepository,
    AuthGuard,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },],
  bootstrap: [AppComponent],
})
export class AppModule { }
