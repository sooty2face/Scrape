import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ImageService } from './services';

@NgModule({
    declarations: [],
    imports: [CommonModule],
})
export class SharedUtilsModule {
    public static forRoot(): ModuleWithProviders<SharedUtilsModule> {
        return {
            ngModule: SharedUtilsModule,
            providers: [ImageService],
        };
    }
}
