import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DashboardRoutingModule } from './dashboard.-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    declarations: [DashboardComponent],
    imports: [DashboardRoutingModule, IonicModule, CommonModule],
})
export class DashboardPageModule { }
