import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable, Observer, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ArticleDto, DailyTrendsDto, DailyTrendsItemDto } from 'src/app/domain/daily-trends/models';
import { DailyTrendsService, ImageService } from 'src/app/domain/daily-trends/services';

@Component({
  selector: 'app-daily-trends-details',
  templateUrl: './daily-trends-details.component.html',
  styleUrls: ['./daily-trends-details.component.scss'],
})
export class DailyTrendsDetailsComponent implements OnInit, OnDestroy {
  private dailyTrendsSubscription: Subscription;
  private country = 'RO';
  private day: number;
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

  constructor(
    private route: ActivatedRoute,
    private googleTrendsAPI: DailyTrendsService,
    private imageService: ImageService,
    private loadingController: LoadingController) { }

  ngOnInit() {
    // tslint:disable-next-line: radix
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    // tslint:disable-next-line: radix
    this.day = parseInt(this.route.snapshot.paramMap.get('day'));
    this.getAll();
  }

  getBase64ImageFromURL(url: string) {
    // tslint:disable-next-line: deprecation
    return Observable.create((observer: Observer<string>) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      // console.log('image src ----- ' + img.src);
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  public async getAll() {
    const loader = await this.loadingController.create();
    await loader.present();
    this.dailyTrendsSubscription = this.googleTrendsAPI.getDailyTrends(`${this.country}`, this.day)
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        this.dailyTrends = res[this.id];
        loader.dismiss();
        this.imageUrl = this.dailyTrends.image.imageUrl;
        this.newsUrl = this.dailyTrends.image.newsUrl;
        this.source = this.dailyTrends.image.source;
        this.articles = this.dailyTrends.articles;

        this.articles.forEach(element => {
          this.getBase64ImageFromURL(element.image.imageUrl ? element.image.imageUrl : 'https://upload.wikimedia.org/wikipedia/commons/0/0a/No-image-available.png')
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
      console.log('killed extra info subscription');
    }
  }

}
