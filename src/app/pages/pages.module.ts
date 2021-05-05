import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyTrendsPageModule } from './daily-trends/daily-trends.module';
import { ImageService } from '../shared/utils';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DailyTrendsPageModule,
  ],
  providers: [ImageService]
})
export class PagesModule { }
