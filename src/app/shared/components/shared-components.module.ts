import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RefresherComponent } from './refresher';

@NgModule({
    declarations: [
        RefresherComponent,
    ],
    imports: [CommonModule, IonicModule, RouterModule],
    exports: [
        RefresherComponent,
    ],
})
export class SharedComponentsModule {
    public static forRoot(): ModuleWithProviders<SharedComponentsModule> {
        return {
            ngModule: SharedComponentsModule,
        };
    }
}
