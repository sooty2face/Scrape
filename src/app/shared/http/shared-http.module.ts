import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpService, ApiExceptionHandlerService } from './services';
import { HttpErrorInterceptor } from './interceptors';

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule],
})
export class SharedHttpModule {
    public static forRoot(): ModuleWithProviders<SharedHttpModule> {
        return {
            ngModule: SharedHttpModule,
            providers: [
                HttpService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpErrorInterceptor,
                    multi: true,
                },
                ApiExceptionHandlerService,
            ],
        };
    }
}
