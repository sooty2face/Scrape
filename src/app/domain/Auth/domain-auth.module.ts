import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LoginComponent } from './login';
import { LoginRoutingModule } from './login/login-routing.module';
import { ToggleComponent } from './login/toggle/toggle/toggle.component';
import { AuthGuard, ErrorInterceptor, JwtInterceptor } from './_helpers';
import { AuthenticationService } from './_services';
import { DeviceID } from './_services/deviceid.service';

@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [HttpClientModule],
})
export class DomainAuthModule {
    public static forRoot(): ModuleWithProviders<DomainAuthModule> {
        return {
            ngModule: DomainAuthModule,
            providers: [
                AuthenticationService,
                DeviceID,
                AuthGuard,
                { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
                JwtHelperService,
                { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
                // { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
        };
    }
}
