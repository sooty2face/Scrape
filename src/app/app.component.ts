import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './domain/Auth/_services';
import { ConnectivityStateService } from './shared/network/services';
import { DatabaseProvider } from './shared/rxdb/DatabaseProvider';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public isOffline: boolean;
  private isOfflineSubscription: Subscription;

  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
    { title: 'ToDos', url: '/folder/ToDos', icon: 'paper-plane' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private router: Router,
    private connectivityStateService: ConnectivityStateService,
    @Inject(DOCUMENT) private document: Document,
    private authenticationService: AuthenticationService,
    private databaseProvider: DatabaseProvider
  ) {
    this.subscribeToNetworkStatus()
  }

  private subscribeToNetworkStatus() {
    this.isOfflineSubscription = this.connectivityStateService.connectivity$
      .pipe(map((status) => status.isConnected !== true))
      .subscribe((isOffline) => {
        this.isOffline = isOffline;
        if (isOffline) {
          this.document.body.classList.add('offline-device');
        } else {
          this.document.body.classList.remove('offline-device');
        }
      });
  }

  async logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    await this.databaseProvider.clearDatabase();
  }
}
