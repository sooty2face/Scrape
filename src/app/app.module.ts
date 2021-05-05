import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ToDoQuery } from './domain/todos/state/query';
import { ToDoStore } from './domain/todos/state/store';
import { ToDoService } from './domain/todos/services/todos.service';
import { ToDosRepository } from './shared/rxdb/repositories/todos.repository';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatabaseModule } from './shared/rxdb/database.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectivityStateService } from './shared/network/services';
import { DomainAuthModule } from './domain/Auth/domain-auth.module';
import { AlertModule } from './shared/alert';
import { CommonModule } from '@angular/common';
import { DomainDailyTrendsModule } from './domain/daily-trends/domain-daily-trends.module';
import { PagesModule } from './pages/pages.module';
import { SharedHttpModule } from './shared/http';
import { SharedUtilsModule } from './shared/utils/shared-utils.module';

@NgModule({
  declarations: [AppComponent],
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
    DomainDailyTrendsModule.forRoot(),
    PagesModule,
    SharedHttpModule.forRoot(),
    SharedUtilsModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ConnectivityStateService,
    ToDoQuery,
    ToDoStore,
    ToDoService,
    ToDosRepository,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
