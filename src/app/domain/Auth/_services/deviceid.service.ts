import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
// import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';

@Injectable({ providedIn: 'root' })
export class DeviceID {

  constructor() { }

  public getDeviceId(): Observable<any> {
    // const subject = new Subject<string>();
    // this.UniqueDeviceID
    //     .get()
    //     .then((deviceId) => subject.next(deviceId))
    //     .catch((_) => subject.next('MAC-CODE-OR-SIMILAR-THAT-IS-UNIQUE-PER-DEVICE'));

    // return subject.asObservable();

    const deviceIdPromise = new Promise((resolve, reject) => {
      const deviceID = 'testDevice';
      if (deviceID) {
        resolve({
          device: deviceID
        });
      } else {
        reject('Device ID error');
      }
    });

    //   deviceIdPromise.then(function (value) {
    //     console.log("Set device ID ", JSON.stringify(value));
    //   });

    return from(deviceIdPromise)/*.pipe(map(res => console.log(res)))*/;
    // return of('DeViCeId');
  }
}
