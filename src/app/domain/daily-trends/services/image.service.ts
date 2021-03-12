import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/* In case we want to inject a service into this service - required only for a service */
@Injectable()
export class ImageService {

  private _url = 'https://localhost:44348/api/Images/';


  constructor(private http: HttpClient) {
  }

  addImage(image: any) {
    const requestBody = { ImageEncript: image };

    console.log('image in post ---- ' + JSON.stringify(requestBody));
    // console.log(requestBody);
    return this.http.post<any>(this._url, '').pipe((catchError(this.errorHandler)));
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error.message || 'Server error');
    return throwError(error.message || 'Server error');
  }

}
