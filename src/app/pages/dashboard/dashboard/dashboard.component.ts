import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
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
  public DailyTrendsY: DailyTrendsDto;

  public loadYesterday = false;
  public yesterdayLoaded = false;

  public countrySearchTermsByDay = [];
  public countryTrends$ = new Observable<DailyTrendsDto>();
  public keywordsTrends$ = new Observable();
  public dailyTrendsSubscription: Subscription;
  public dailyTrendsSubscriptionY: Subscription;
  private envUrl = environment.googleTrendsAPI;


  constructor(
    private authenticationService: AuthenticationService,
    private googleTrendsAPI: DailyTrendsService,
    private httpService: HttpService,
    private navController: NavController,
    private loadingController: LoadingController,
    private menu: MenuController) { }

  public async getAll() {
    const loader = await this.loadingController.create();
    await loader.present();
    this.dailyTrendsSubscription = this.googleTrendsAPI.getDailyTrends(`${this.country}`, this.day)
      // tslint:disable-next-line: deprecation
      .subscribe(
        res => {
          this.DailyTrends = res;
          loader.dismiss();
        },
        error => {
          loader.dismiss();
        },
        async () => {
          loader.dismiss();
        });

    // PROMISE CALL
    // this.googleTrendsAPI.getDailyTrends1(`${this.country}`, this.day).then(res => {
    //   console.log(res);
    //   this.DailyTrends = res;
    // });

    // this.dailyTrendsSubscription = this.httpService.makeGet<DailyTrendsDto[]>(`${this.envUrl}/${this.country}`)
    //   .subscribe(res => {
    //     this.DailyTrends = res;
    //   });
  }

  ngOnInit() {
    this.getAll();
  }

  public renderExtraInfo(id: number, day: number) {
    console.log('id: ' + id);
    this.navController.navigateRoot(['/daily-trends-details', { id, day }]);
  }

  public async loadYesterdayInfo() {
    this.loadYesterday = true;
    const loader = await this.loadingController.create();
    await loader.present();
    this.dailyTrendsSubscriptionY = this.googleTrendsAPI.getDailyTrends(`${this.country}`, this.day + 1)
      // tslint:disable-next-line: deprecation
      .subscribe(
        res => {
          this.DailyTrendsY = res;
          this.yesterdayLoaded = true;
          loader.dismiss();
        },
        error => {
          loader.dismiss();
        },
        async () => {
          loader.dismiss();
        });
  }
  async logout() {
    this.authenticationService.logoutWithConfirmation();
  }

  openFirst() {
    console.log('open First');
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    console.log('open End');
    this.menu.open('end');
  }

  openCustom() {
    console.log('open Custom')
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  ngOnDestroy() {
    if (this.dailyTrendsSubscription) {
      this.dailyTrendsSubscription.unsubscribe();
      console.log('killed today subscription');
    }

    if (this.dailyTrendsSubscriptionY) {
      this.dailyTrendsSubscriptionY.unsubscribe();
      console.log('killed yesterday subscription');
    }
  }
}
