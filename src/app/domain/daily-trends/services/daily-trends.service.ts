import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DailyTrendsDto } from '../models';

@Injectable()
export class DailyTrendsService {

  private envUrl = environment.googleTrendsAPI;

  private keyword1 = 'React';
  private keyword2 = 'Angular';
  private dayString: string;
  constructor(private httpService: HttpClient) { }

  public getDailyTrends(country: string, day: number): Observable<DailyTrendsDto> {
    // this.httpService.get(`${this.envUrl}/${this.keyword1}/${this.keyword2}`).subscribe(res => {
    //   console.log('keywords results: ' + res);

    // });
    const today1 = new Date();

    this.dayString =
      today1.getFullYear() + '-' +
      String(today1.getMonth() + 1).padStart(2, '0') + '-' +
      String(today1.getDate() - (day === 0 ? 0 : 1)).padStart(2, '0');

    console.log('day is: ' + this.dayString);
    return this.httpService.get<DailyTrendsDto>(`${this.envUrl}/${country}/${this.dayString}`);
  }

  public getDailyTrends1(country: string, day: number): Promise<any> {
    console.log('testttt');
    let promise = new Promise((resolve, reject) => {
      let apiURL = `${this.envUrl}/${country}/${day}`;
      this.httpService.get(apiURL)
        .toPromise();
      // .then(
      //   res => { // Success
      //     console.log('any res???: ' + JSON.stringify(res[0].title.query));
      //     resolve('success');
      //   }
      // );
    });
    return promise;
  }
}
