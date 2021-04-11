import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [DashboardRoutingModule, IonicModule, CommonModule, SharedComponentsModule.forRoot()],
})
export class DashboardPageModule { }
