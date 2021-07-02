import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DailyTrendsDto } from '../models';

@Injectable()
export class DailyTrendsService {

  private envUrl = environment.googleTrendsAPI;

  private dayString: string;

  constructor(private httpService: HttpClient) { }

  public getTrendByID(objectID: string): Observable<DailyTrendsDto> {
    return this.httpService.get<DailyTrendsDto>(`${this.envUrl}/googleTrends/${objectID}/`);
  }

  public getDailyTrends(country: string, day: any): Observable<DailyTrendsDto> {
    console.log('DAY IN SERVICE NUMBER: ' + day);
    const today = new Date();

    const myPastDate = new Date(today);
    /* Decrement day by the number day received as input */
    myPastDate.setDate(myPastDate.getDate() - day);

    this.dayString =
      myPastDate.getFullYear() + '-' +
      String(myPastDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(myPastDate.getDate() - (day === 0 ? 0 : 0)).padStart(2, '0');


    console.log('Day of the received trends: ' + this.dayString);
    return this.httpService.get<DailyTrendsDto>(`${this.envUrl}/googleTrends/${country}/${this.dayString}`);
  }
}
