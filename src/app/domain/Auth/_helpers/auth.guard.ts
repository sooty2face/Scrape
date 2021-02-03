import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DatabaseProvider } from 'src/app/shared/rxdb/DatabaseProvider';

import { AuthenticationService } from '..//_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private databaseProvider: DatabaseProvider
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        const isTokenExpired = this.authenticationService.isAuthenticated();

        if (currentUser && isTokenExpired) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        await this.databaseProvider.clearDatabase();
        return false;
    }
}