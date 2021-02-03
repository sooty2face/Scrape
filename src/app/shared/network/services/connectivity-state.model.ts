import { ConnectionType } from "../connection.type";


export class ConnectivityState {
    public get isConnected(): boolean | undefined {
        switch (this.connectionType) {
            case 'unknown':
                return undefined;
            case 'none':
                return false;
            default:
                return true;
        }
    }

    public constructor(public connectionType: ConnectionType) {}
}
