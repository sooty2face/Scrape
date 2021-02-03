import { Injectable, NgZone } from '@angular/core';
import { NetworkStatus } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';
import { ConnectionType } from '../connection.type';
import { ConnectivityState } from './connectivity-state.model';

@Injectable()
export class ConnectivityStateService {
    private connectivitySubject: BehaviorSubject<ConnectivityState> = new BehaviorSubject(
        new ConnectivityState('unknown')
    );

    public connectivity$ = this.connectivitySubject.asObservable();

    public constructor(private ngZone: NgZone) {}

    public changeWifiConnectivity(status: NetworkStatus): void {
        const newType = this.getConnectionType(status);
        const newConnectivity = new ConnectivityState(newType);

        if (newConnectivity.connectionType === this.connectivitySubject.value.connectionType) {
            return;
        }

        this.ngZone.run(() => {
            this.connectivitySubject.next(newConnectivity);
            console.log('Network type switched to ', this.connectivitySubject.value, '(' + status.connectionType + ')');
        });
    }

    public getConnectivityStatusValue(): boolean | undefined {
        return this.connectivitySubject.value.isConnected;
    }

    private getConnectionType(status: NetworkStatus): ConnectionType {
        const { connected, connectionType } = status;

        if (connected) {
            if (connectionType === 'wifi') {
                return 'wifi';
            } else {
                // on some devices it does not return 'cellular', but '3g' or '4g'
                // so we assume that if it is not wifi then is 'cellular'
                return 'cellular';
            }
        }

        if (connectionType === 'none') {
            return 'none';
        }

        return 'unknown';
    }
}
