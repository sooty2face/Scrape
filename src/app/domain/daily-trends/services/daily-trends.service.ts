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

  constructor(private httpService: HttpClient) { }

  public getDailyTrends(country: string, day: number): Observable<DailyTrendsDto> {
    // this.httpService.get(`${this.envUrl}/${this.keyword1}/${this.keyword2}`).subscribe(res => {
    //   console.log('keywords results: ' + res);

    // });
    return this.httpService.get<DailyTrendsDto>(`${this.envUrl}/${country}/${day}`);
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
