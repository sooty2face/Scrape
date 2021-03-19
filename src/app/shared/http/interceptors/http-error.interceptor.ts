import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ErrorModelBuilder } from '../builders/error-model.builder';
import { ErrorModel, ApiErrorCodes } from '../models';
import { ToastController } from '@ionic/angular';
import { ApiExceptionHandlerService } from '../services';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private toastCtrl: ToastController,
        private apiExceptionHandlerService: ApiExceptionHandlerService
    ) {}

    private async presentAlert(errorMessage: string) {
        const toast = await this.toastCtrl.create({
            message: errorMessage,
            duration: 10000,
            position: 'top',
            animated: true,
        });

        toast.present();
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            // todo: retry failing API calls
            // retry(1),
            catchError((error: any) => {
                if (error instanceof HttpErrorResponse && error.error.errorCode) {
                    let errorMessage = 'HTTP ERROR MESSAGE GSB';

                    if (error.error.errorCode === ApiErrorCodes.VALIDATION_ERROR) {
                        errorMessage = error.error.errorMessage;
                    }

                    const errorModel = new ErrorModelBuilder()
                        .setErrorCode(error.error.errorCode)
                        .setMessage(errorMessage)
                        .setStatus(error.error.statusCode)
                        .build();

                    // check if we should skip showing toaster by errorCode
                    this.apiExceptionHandlerService.handle(error.error);

                    this.presentAlert(errorMessage);

                    throw errorModel;
                }
                return throwError(error);
            })
        );
    }
}
