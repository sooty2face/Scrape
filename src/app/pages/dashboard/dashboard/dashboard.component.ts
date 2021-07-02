import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, NavController, IonContent } from '@ionic/angular';
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
  @ViewChild(IonContent) content: IonContent;

  public scrollPosition = 0;

  public country: string;
  public displayCountry: Country = { code: '', value: '' };

  public initialDarkTheme = true;

  public countryCode$: Observable<string>;
  public countryValue$: Observable<string>;

  public countries: Country[] = [
    { code: 'RO', value: 'Romania' },
    { code: 'US', value: 'United States' },
    { code: 'NL', value: 'Netherlands' }
  ];

  public day = 0;
  public storeDay: number;

  public region = 'covid';
  public keyword = 'sibiu';

  public DailyTrends: DailyTrendsDto; /* Today initial - still used */
  public DailyTrendsY: DailyTrendsDto; /* Yestarday initial - not used */

  public DailyTrendsStore: DailyTrendsDto; /* Today store - not used */
  public DailyTrendsYStore: DailyTrendsDto; /* Yestarday store - highly used */

  public DailyTrendsMore = [];

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
      // console.log('INITIAL COUNTRY: ' + JSON.stringify(res));
      this.country = res.code;
    });

    // this.dailyTrendsQuery.getDayLoaded().subscribe(dayLoaded => this.day = dayLoaded);

    this.countryCode$ = this.dailyTrendsQuery.getCountry$().pipe(map(res => res.code));
    this.countryValue$ = this.dailyTrendsQuery.getCountry$().pipe(map(res => res.value));

    // tslint:disable-next-line: deprecation
    this.countryCode$.subscribe(res => {
      // console.log('RES 1: ' + res);
      this.displayCountry = this.countries.find(({ code }) => code === res);
    });

    this.getAll();

    // tslint:disable-next-line: deprecation
    this.dailyTrendsQuery.getDailyTrendsMoreLoaded().subscribe(res => {
      if (res) {
        this.updateDailyTrendsStore(this.day);
      }
    });
  }

  public async triggerMe(event: Event) {
    // tslint:disable-next-line: no-string-literal
    this.countryIndex = event['detail'];
    // tslint:disable-next-line: no-string-literal
    this.country = this.countryIndex['value'].code.valueOf();
    // tslint:disable-next-line: no-string-literal
    const countryValue = this.countryIndex['value'].value.valueOf();

    const countrySwapped: Country = { code: this.country, value: countryValue };

    this.dailyTrendsStore.partialRestoreInitialState();
    this.dailyTrendsStore.updateCountry(countrySwapped);
    this.dailyTrendsStore.updateDayLoaded(0);
    this.day = 0;

    this.yesterdayLoaded = false;

    await this.getAll();
  }

  public async getAll(event?: any) {
    const loader = await this.loadingController.create();
    await loader.present();

    this.dailyTrendsSubscription = this.googleTrendsAPI.getDailyTrends(`${this.country}`, this.day)
      // tslint:disable-next-line: deprecation
      .subscribe(
        res => {
          this.DailyTrends = res;

          if (event) {
            event.target.complete();
          }
          loader.dismiss();
        },
        error => {
          loader.dismiss();
        },
        async () => {
          loader.dismiss();
        });

    // this.DailyTrends.items.forEach(item => item.day = 0);
  }

  public renderExtraInfo(objectID: string, day: any) {
    this.navController.navigateRoot(['/daily-trends-details', { objectID }]);
  }

  public async loadMore(event: any) {
    this.day++;
    await this.updateDailyTrendsStore(this.day, event);

    if (this.day === 10) {
      event.target.disabled = true;
    }
  }

  private async updateDailyTrendsStore(day: number, event?: any) {
    const loader = await this.loadingController.create();
    // this.dailyTrendsQuery.getDayLoaded().subscribe(dayLoaded => console.log('day loaded: ' + dayLoaded));
    // tslint:disable-next-line: deprecation
    this.dailyTrendsQuery.getLoading().subscribe(res => this.storeUpdate = res);
    this.dailyTrendsSubscriptionYStore = this.dailyTrendsQuery.getDailyTrendsMore()
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        this.yesterdayLoaded = true;
        this.DailyTrendsYStore = res;
        // this.DailyTrendsMore = this.DailyTrendsMore.concat(res);
      });

    this.dailyTrendsQuery.getLoaded().pipe(
      take(1),
      filter(res => !res),
      switchMap(() => {
        this.dailyTrendsStore.setLoading(true);
        loader.present();
        return this.googleTrendsAPI.getDailyTrends(`${this.country}`, day).pipe(take(1));
      })
      // tslint:disable-next-line: deprecation
    ).subscribe(
      async res => {
        this.DailyTrendsMore = this.DailyTrendsMore.concat(res);

        await loader.dismiss();
        this.dailyTrendsStore.update(() => {
          return {
            // DailyTrendsStore: res,
            DailyTrendsYStore: this.DailyTrendsMore,
            // loadMoreButtonPressed: true,
            // isLoaded: true
          };
        });

        this.dailyTrendsStore.updateDayLoaded(day);

        // this.dailyTrendsStore.setLoading(false);
        if (event) {
          event.target.complete();
        }
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

  ionViewWillEnter() {
    // Restore scroll position
    this.content.scrollToPoint(50, this.scrollPosition);
  }

  ionViewDidLeave() {
    // Save scroll position
    this.content.getScrollElement().then(data => {
      console.log(data.scrollTop);
      this.scrollPosition = 50;
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
