import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DailyTrendsDto } from '../models';

@Injectable()
export class DailyTrendsService {

  private envUrl = environment.googleTrendsAPI;

  private trendsResult: any;
  constructor(private httpService: HttpClient) { }

  public getDailyTrends(country: string): Observable<DailyTrendsDto> {
    return this.httpService.get<DailyTrendsDto>(`${this.envUrl}/${country}`);/*.subscribe(res => {
      console.log(res);
      this.trendsResult = res;
    });
    return this.trendsResult;*/
  }
}
