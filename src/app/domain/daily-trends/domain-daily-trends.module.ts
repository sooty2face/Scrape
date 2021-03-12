import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyTrendsService, ImageService } from './services';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class DomainDailyTrendsModule {
  public static forRoot(): ModuleWithProviders<DomainDailyTrendsModule> {
    return {
      ngModule: DomainDailyTrendsModule,
      providers: [
        DailyTrendsService,
        ImageService
      ],
    };
  }
}
