import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AlertService } from '@shared/alert';
import { DatabaseProvider } from 'src/app/shared/rxdb/DatabaseProvider';

import { AuthenticationService } from '..//_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private databaseProvider: DatabaseProvider,
        private alertService: AlertService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        const isNotTokenExpired = this.authenticationService.isAuthenticated();

        if (currentUser && isNotTokenExpired) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.showSessionExpiredAlert();
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        await this.databaseProvider.clearDatabase();
        // location.reload();
        return false;
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
