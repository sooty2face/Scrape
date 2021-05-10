import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

export let AppInjector: Injector;

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private envUrl = environment.googleTrendsAPI;

    constructor(
        private authenticationService: AuthenticationService,
        private injector: Injector) {
        AppInjector = this.injector;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        /* If the req does not require any auth, then skip it */
        if (request.headers.get('No-Auth') === 'True') {
            /*Original request are immutable - can't be changed, so what we can do is to clone them,
             * in order to manipulate them */
            console.log('Intercepting no auth needed');
            return next.handle(request.clone());
        }

        // const loaderService = AppInjector.get(ToDoService)

        // console.log(loaderService.getToDos());

        // add auth header with jwt if user is logged in and request is to the api url
        const currentUser = this.authenticationService.currentUserValue;
        // console.log("jwt intercept token");
        const isLoggedIn = currentUser && currentUser.token;

        const isApiUrl = request.url.startsWith(`${this.envUrl}`);
        if (isLoggedIn /*&& isApiUrl*/) {
            // console.log('Intercepting adding auth: ' + isLoggedIn);
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }
        else {
            //this.router.navigate(['/login']);
        }

        /* The next.handle stuff means that we are passing control to the next interceptor in the chain, if there is any */
        return next.handle(request).pipe(
            catchError(async (e: any) => {
                // if (
                //     e.errorCode === ApiErrorCodes.INVALID_REFRESH_TOKEN ||
                //     e.errorCode === ApiErrorCodes.EXPIRED_REFRESH_TOKEN ||
                //     e.errorCode === ApiErrorCodes.INVALID_TOKEN
                // ) {
                await this.authenticationService.logout();
                // }
                console.log(JSON.stringify(e));
                throw e;
            })
        );
    }
}
