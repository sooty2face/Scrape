import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { merge, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/domain/Auth';
import { Country, DailyTrendsDto, DailyTrendsItemDto } from 'src/app/domain/daily-trends/models';
import { DailyTrendsService } from 'src/app/domain/daily-trends/services';
import { DailyTrendsQry, DailyTrendsStore } from '../state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  public country: string;
  public displayCountry: Country = { code: '', value: '' };

  public initialDarkTheme = true;

  public countryCode$: Observable<string>;
  public countryValue$: Observable<string>;

  public countries: Country[] = [
    { code: 'RO', value: 'Romania' },
    { code: 'US', value: 'United States' }
  ];

  public day = 0;
  public region = 'covid';
  public keyword = 'sibiu';

  public DailyTrends: DailyTrendsDto; /* Today initial - still used */
  public DailyTrendsY: DailyTrendsDto; /* Yestarday initial - not used */

  public DailyTrendsStore: DailyTrendsDto; /* Today store - not used */
  public DailyTrendsYStore: DailyTrendsDto; /* Yestarday store - highly used */

  public storeUpdate: boolean;

  public yesterdayLoaded = false;

  public countryIndex = {};

  public countryTrends$ = new Observable<DailyTrendsDto>();
  public keywordsTrends$ = new Observable();

  private dailyTrendsSubscription: Subscription;
  private dailyTrendsSubscriptionY: Subscription;
  private dailyTrendsSubscriptionYStore: Subscription;
  private dailyTrendsQueryCountry: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private googleTrendsAPI: DailyTrendsService,
    private navController: NavController,
    private loadingController: LoadingController,
    private menu: MenuController,
    private dailyTrendsQuery: DailyTrendsQry,
    private dailyTrendsStore: DailyTrendsStore,
    private renderer: Renderer2) {
    // this.dailyTrendsStore.partialRestoreInitialState();
  }

  ngOnInit() {
    this.renderer.setAttribute(document.body, 'color-theme', 'dark');
    // tslint:disable-next-line: deprecation
    this.dailyTrendsQueryCountry = this.dailyTrendsQuery.getCountry$().subscribe(res => {
      console.log('INITIAL COUNTRY: ' + JSON.stringify(res));
      this.country = res.code;
    });


    this.countryCode$ = this.dailyTrendsQuery.getCountry$().pipe(map(res => res.code));
    this.countryValue$ = this.dailyTrendsQuery.getCountry$().pipe(map(res => res.value));

    // tslint:disable-next-line: deprecation
    this.countryCode$.subscribe(res => {
      console.log('RES 1: ' + res);
      this.displayCountry = this.countries.find(({ code }) => code === res);
    });

    this.getAll(this.country);

    // tslint:disable-next-line: deprecation
    this.dailyTrendsQuery.getDailyTrendsMoreLoaded().subscribe(res => {
      if (res) {
        this.updateDailyTrendsStore();
      }
    });
  }

  public triggerMe(event: Event) {
    this.countryIndex = event['detail'];
    // console.log('Country index: ' + JSON.stringify(this.countryIndex));
    this.country = this.countryIndex['value'].code.valueOf();
    // console.log('after Country index: ' + this.countryIndex['value'].value.valueOf());
    const countryValue = this.countryIndex['value'].value.valueOf();
    // console.log('COUNTRY swapped: ' + this.country);

    const countrySwapped: Country = { code: this.country, value: countryValue };
    // console.log('COUNTRY swapped: ' + JSON.stringify(countrySwapped));
    this.dailyTrendsStore.partialRestoreInitialState();
    this.dailyTrendsStore.updateCountry(countrySwapped);
    this.yesterdayLoaded = false;
    this.getAll(this.country);
  }

  public async getAll(country: string) {
    const loader = await this.loadingController.create();
    await loader.present();
    this.dailyTrendsSubscription = this.googleTrendsAPI.getDailyTrends(`${country}`, this.day)
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
  }

  public renderExtraInfo(id: number, day: number) {
    this.navController.navigateRoot(['/daily-trends-details', { id, day, country: this.country }]);
  }

  public async loadYesterdayInfo() {
    // const loader = await this.loadingController.create();
    // await loader.present();

    await this.updateDailyTrendsStore();

    // tslint:disable-next-line: deprecation
    // this.dailyTrendsQuery.getDailyTrendsMore().subscribe(
    //   res => {
    //     // this.DailyTrendsY = res;
    //     // this.yesterdayLoaded = true;

    //     if (this.dailyTrendsSubscription) {
    //       this.dailyTrendsSubscription.unsubscribe();
    //     }

    //     loader.dismiss();
    //   },
    //   error => {
    //     loader.dismiss();
    //   },
    //   async () => {
    //     loader.dismiss();
    //   });
  }

  private async updateDailyTrendsStore() {
    const loader = await this.loadingController.create();
    // await loader.present();
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
        loader.present();
        return this.googleTrendsAPI.getDailyTrends(`${this.country}`, this.day + 1);
      })
      // tslint:disable-next-line: deprecation
    ).subscribe(
      async res => {
        await loader.dismiss();
        this.dailyTrendsStore.update(dailyTrendsState => {
          return {
            DailyTrendsStore: res,
            DailyTrendsYStore: res,
            loadMoreButtonPressed: true,
            isLoaded: true
          };
        });

        this.dailyTrendsStore.setLoading(false);
      },
      async () => {
        await loader.dismiss();
      },
      async () => {
        await loader.dismiss();
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

  public toggleTheme(event: any) {
    if (event.detail.checked) {
      // document.body.setAttribute('color-theme', 'dark');
      this.renderer.setAttribute(document.body, 'color-theme', 'dark');
    }
    else {
      // document.body.setAttribute('color-theme', 'light');
      this.renderer.setAttribute(document.body, 'color-theme', 'light');
    }
  }

  ngOnDestroy() {
    if (this.dailyTrendsSubscription) {
      this.dailyTrendsSubscription.unsubscribe();
    }

    if (this.dailyTrendsSubscriptionY) {
      this.dailyTrendsSubscriptionY.unsubscribe();
    }

    if (this.dailyTrendsSubscriptionYStore) {
      this.dailyTrendsSubscriptionYStore.unsubscribe();
    }

    if (this.dailyTrendsQueryCountry) {
      this.dailyTrendsQueryCountry.unsubscribe();
    }
  }
}
