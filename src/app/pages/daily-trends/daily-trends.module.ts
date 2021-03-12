import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { DailyTrendsDetailsComponent } from './daily-trends-details/daily-trends-details/daily-trends-details.component';
import { DailyTrendsRoutingModule } from './daily-trends.routing.module';

@NgModule({
    declarations: [DailyTrendsDetailsComponent],
    imports: [DailyTrendsRoutingModule, IonicModule, CommonModule, BrowserModule],
})
export class DailyTrendsPageModule { }
