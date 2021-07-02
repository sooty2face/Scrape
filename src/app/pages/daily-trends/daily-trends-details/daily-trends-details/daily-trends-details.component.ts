import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ImageService } from '@shared/utils';
import { Observable, Observer, Subscription } from 'rxjs';
import { ArticleDto, DailyTrendsDto, DailyTrendsItemDto } from 'src/app/domain/daily-trends/models';
import { DailyTrendsService } from 'src/app/domain/daily-trends/services';


@Component({
  selector: 'app-daily-trends-details',
  templateUrl: './daily-trends-details.component.html',
  styleUrls: ['./daily-trends-details.component.scss'],
})
export class DailyTrendsDetailsComponent implements OnInit, OnDestroy {
  private dailyTrendsSubscription: Subscription;
  private country: string;
  private day: any;
  public dailyTrends: DailyTrendsItemDto;
  public dailyTrendsByID = [];
  public id: any;
  public imageUrl: string;
  public newsUrl: string;
  public source: string;
  public base64Image: any;
  public articles: ArticleDto[];
  public imageArray: Array<string> = [];
  public newsUrlArray: Array<string> = [];

  private ImageSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private googleTrendsAPI: DailyTrendsService,
    private loadingController: LoadingController,
    private imageService: ImageService) { }

  async ngOnInit() {
    // tslint:disable-next-line: radix
    this.id = this.route.snapshot.paramMap.get('objectID');

    // tslint:disable-next-line: radix
    this.day = this.route.snapshot.paramMap.get('day');

    this.country = this.route.snapshot.paramMap.get('country');

    await this.getAll();
  }

  public async getAll() {
    const loader = await this.loadingController.create();
    await loader.present();
    this.dailyTrendsSubscription = this.googleTrendsAPI.getTrendByID(`${this.id}`)
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        this.dailyTrends = res[0];
        // loader.dismiss();
        // this.imageUrl = this.dailyTrends.image.imageUrl;
        // this.newsUrl = this.dailyTrends.image.newsUrl;
        // this.source = this.dailyTrends.image.source;
        this.articles = this.dailyTrends.articles;

        this.articles.forEach(element => {
          this.ImageSubscription =
            this.imageService.getBase64ImageFromURL$(element.image && element.image.imageUrl ?
              element.image.imageUrl : 'https://upload.wikimedia.org/wikipedia/commons/0/0a/No-image-available.png')
              .subscribe(base64data => {
                this.base64Image = 'data:image/jpg;base64,' + base64data;
                this.imageArray.push(this.base64Image);
              });

          this.newsUrlArray.push(element.url);
        });

      },
        error => {
          loader.dismiss();
        },
        async () => {
          loader.dismiss();
        });
  }

  ngOnDestroy() {
    if (this.dailyTrendsSubscription) {
      this.dailyTrendsSubscription.unsubscribe();
    }

    if (this.ImageSubscription) {
      this.ImageSubscription.unsubscribe();
    }
  }
}
