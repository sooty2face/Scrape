import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '..//_services';
import { AlertService } from '@shared/alert';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401) {
                    // auto logout if 401 response returned from api
                    this.showSessionExpiredAlert();
                    this.authenticationService.logout();
                    // location.reload();
                }
                console.log('error intercept: ' + JSON.stringify(err));
                const error = err.error.message || err.code;
                console.log('error intercept: ' + error);

                return throwError(error);
            }));
    }

    private showSessionExpiredAlert(): void {
        const okButton = {
            text: 'Ok',
            handler: () => { },
        };
        this.alertService.presentAlert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [okButton],
            true
        );
    }
}
