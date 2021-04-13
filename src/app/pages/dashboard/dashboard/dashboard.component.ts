import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/domain/Auth';
import { DailyTrendsDto, DailyTrendsItemDto } from 'src/app/domain/daily-trends/models';
import { DailyTrendsService } from 'src/app/domain/daily-trends/services';
import { DailyTrendsQry, DailyTrendsStore } from '../state';

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

  public DailyTrendsStore: DailyTrendsDto;
  public DailyTrendsYStore: DailyTrendsDto;
  public storeUpdate: boolean;

  public loadYesterday = false;
  public yesterdayLoaded = false;

  public countrySearchTermsByDay = [];
  public countryTrends$ = new Observable<DailyTrendsDto>();
  public keywordsTrends$ = new Observable();
  public dailyTrendsSubscription: Subscription;
  public dailyTrendsSubscriptionY: Subscription;
  public dailyTrendsSubscriptionYStore: Subscription;


  constructor(
    private authenticationService: AuthenticationService,
    private googleTrendsAPI: DailyTrendsService,
    private navController: NavController,
    private loadingController: LoadingController,
    private menu: MenuController,
    private dailyTrendsQuery: DailyTrendsQry,
    private dailyTrendsStore: DailyTrendsStore) { }

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
    // console.log('query loaded? ' + this.dailyTrendsQuery.getDailyTrendsMoreLoaded());
    // tslint:disable-next-line: deprecation
    this.dailyTrendsQuery.getDailyTrendsMoreLoaded().subscribe(res => {
      if (res) {
        this.updateDailyTrendsStore();
      }
    });
  }

  public renderExtraInfo(id: number, day: number) {
    console.log('id: ' + id);
    this.navController.navigateRoot(['/daily-trends-details', { id, day }]);
  }

  public async loadYesterdayInfo() {
    this.loadYesterday = true;
    const loader = await this.loadingController.create();
    await loader.present();

    this.updateDailyTrendsStore();

    this.dailyTrendsSubscriptionY = this.googleTrendsAPI.getDailyTrends(`${this.country}`, this.day + 1)
      // tslint:disable-next-line: deprecation
      .subscribe(
        res => {
          this.DailyTrendsY = res;
          this.yesterdayLoaded = true;

          if (this.dailyTrendsSubscription) {
            this.dailyTrendsSubscription.unsubscribe();
            console.log('killed today subscription');
          }

          loader.dismiss();
        },
        error => {
          loader.dismiss();
        },
        async () => {
          loader.dismiss();
        });
  }

  private updateDailyTrendsStore() {
    // tslint:disable-next-line: deprecation
    this.dailyTrendsQuery.getLoading().subscribe(res => this.storeUpdate = res);
    this.dailyTrendsSubscriptionYStore = this.dailyTrendsQuery.getDailyTrendsMore()
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        this.yesterdayLoaded = true;
        this.DailyTrendsYStore = res;
      });

    this.dailyTrendsQuery.getLoaded().pipe(
      take(1),
      filter(res => !res),
      switchMap(() => {
        this.dailyTrendsStore.setLoading(true);
        return this.googleTrendsAPI.getDailyTrends(`${this.country}`, this.day + 1);
      })
      // tslint:disable-next-line: deprecation
    ).subscribe(res => {
      // console.log('res : ' + JSON.stringify(res));
      this.dailyTrendsStore.update(dailyTrendsState => {
        return {
          DailyTrendsStore: res,
          DailyTrendsYStore: res,
          loadMoreButtonPressed: true,
          isLoaded: true
        };
      });
      // console.log('store res' + JSON.stringify(this.DailyTrendsYStore));
      this.dailyTrendsStore.setLoading(false);
    });
  }

  async logout() {
    this.authenticationService.logoutWithConfirmation();
    await this.dailyTrendsStore.update(logoutState => {
      return {
        DailyTrendsStore: null,
        DailyTrendsYStore: null,
        loadMoreButtonPressed: false,
        isLoaded: false
      };
    });
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

    if (this.dailyTrendsSubscriptionYStore) {
      this.dailyTrendsSubscriptionYStore.unsubscribe();
      console.log('killed yesterday store subscription');
    }
  }
}
