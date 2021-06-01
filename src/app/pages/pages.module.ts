import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyTrendsPageModule } from './daily-trends/daily-trends.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DailyTrendsPageModule,
    FormsModule
  ],
  providers: []
})
export class PagesModule { }
