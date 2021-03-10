import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DailyTrendsService {

  private envUrl = environment.googleTrendsAPI;

  constructor(private httpService: HttpClient) { }

  public getDailyTrends(country: string) {
    this.httpService.get(`${this.envUrl}/${country}`);
  }
}
