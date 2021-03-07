import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './services';

@NgModule({
    declarations: [],
    imports: [CommonModule],
})
export class AlertModule {
    public static forRoot(): ModuleWithProviders<AlertModule> {
        return {
            ngModule: AlertModule,
            providers: [AlertService],
        };
    }
}
