import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/domain/Auth';
import { DailyTrendsDto } from 'src/app/domain/daily-trends/models';
import { DailyTrendsService } from 'src/app/domain/daily-trends/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  public country = 'RO';
  public region = 'covid';
  public keyword = 'sibiu';
  public DailyTrends: DailyTrendsDto;

  public countrySearchTermsByDay = [];
  public countryTrends$ = new Observable();
  public keywordsTrends$ = new Observable();
  public dailyTrendsSubscription: Subscription;


  constructor(
    private authenticationService: AuthenticationService,
    private googleTrendsAPI: DailyTrendsService) { }

  public getAll() {
    // return this.http.get(`${'http://localhost:4000'}/googleTrends/googletrends`)
    // this.countryTrends$ = this.googleTrendsAPI.getDailyTrends(`${this.envUrl}/${this.country}`);
    // this.keywordsTrends$ = this.http.get(`${this.envUrl}/${this.region}/${this.keyword}`);
    this.dailyTrendsSubscription = this.googleTrendsAPI.getDailyTrends(`${this.country}`)
      .subscribe(res => {
        // console.log(res);
        this.DailyTrends = res;
        console.log(this.DailyTrends[1].title.query);
      });
  }

  ngOnInit() {
    this.getAll();
    // console.log('res2: ' + this.DailyTrends);
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   console.log('afterViewInitDash');
    // }, 3000);
  }

  async logout() {
    this.authenticationService.logoutWithConfirmation();
  }

  ngOnDestroy() {
    if (this.dailyTrendsSubscription) {
      this.dailyTrendsSubscription.unsubscribe();
    }
  }
}
