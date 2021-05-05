import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DailyTrendsDto } from '../models';

@Injectable()
export class DailyTrendsService {

  private envUrl = environment.googleTrendsAPI;

  private dayString1: string;
  private dayString2: string;

  constructor(private httpService: HttpClient) { }

  public getDailyTrends(country: string, day: number): Observable<DailyTrendsDto> {

    const today1 = new Date();
    const today2 = new Date();

    console.log('today1.getDay(): ' + String(today1.getDate() - 0).padStart(2, '0'));
    if (String(today1.getDate() - 0).padStart(2, '0') === '01') {
      today2.setDate(0);

      this.dayString2 =
        today2.getFullYear() + '-' +
        String(today2.getMonth() + 1).padStart(2, '0') + '-' +
        String(today2.getDate() - (day === 0 ? 0 : 0)).padStart(2, '0');
    }

    this.dayString1 =
      today1.getFullYear() + '-' +
      String(today1.getMonth() + 1).padStart(2, '0') + '-' +
      String(today1.getDate() - (day === 0 ? 0 : 1)).padStart(2, '0');

    if (this.dayString2 && day === 1) {
      console.log('day is1: ' + this.dayString2);
      return this.httpService.get<DailyTrendsDto>(`${this.envUrl}/googleTrends/${country}/${this.dayString2}`);
    }
    console.log('day is2: ' + this.dayString1);
    return this.httpService.get<DailyTrendsDto>(`${this.envUrl}/googleTrends/${country}/${this.dayString1}`);
  }
}
