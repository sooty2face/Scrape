import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/domain/Auth';
import { DailyTrendsDto } from 'src/app/domain/daily-trends/models';
import { DailyTrendsService } from 'src/app/domain/daily-trends/services';
import { HttpService } from 'src/app/shared/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  public country = 'RO';
  public day = 0;
  public region = 'covid';
  public keyword = 'sibiu';
  public DailyTrends: DailyTrendsDto;

  public countrySearchTermsByDay = [];
  public countryTrends$ = new Observable<DailyTrendsDto>();
  public keywordsTrends$ = new Observable();
  public dailyTrendsSubscription: Subscription;
  private envUrl = environment.googleTrendsAPI;

  constructor(
    private authenticationService: AuthenticationService,
    private googleTrendsAPI: DailyTrendsService,
    private httpService: HttpService,
    private navController: NavController) { }

  public getAll() {
    // return this.http.get(`${'http://localhost:4000'}/googleTrends/googletrends`)
    // this.countryTrends$ = this.googleTrendsAPI.getDailyTrends(`${this.envUrl}/${this.country}`);
    // this.keywordsTrends$ = this.http.get(`${this.envUrl}/${this.region}/${this.keyword}`);
    // this.countryTrends$ = this.googleTrendsAPI.getDailyTrends$(`${this.country}`);
    // this.countryTrends$.subscribe(res => console.log(res[0].title.query));

    this.dailyTrendsSubscription = this.googleTrendsAPI.getDailyTrends(`${this.country}`, this.day)
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        this.DailyTrends = res;
      });

    // this.dailyTrendsSubscription = this.httpService.makeGet<DailyTrendsDto[]>(`${this.envUrl}/${this.country}`)
    //   .subscribe(res => {
    //     this.DailyTrends = res;
    //   });
  }

  ngOnInit() {
    this.getAll();
    // console.log('res2: ' + this.DailyTrends);
  }

  public renderExtraInfo(id: number) {
    console.log('id: ' + id);
    this.navController.navigateRoot(['/daily-trends-details', { id, day: this.day }]);
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
