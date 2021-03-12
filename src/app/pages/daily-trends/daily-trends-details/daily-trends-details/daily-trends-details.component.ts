import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ArticleDto, DailyTrendsDto, DailyTrendsItemDto } from 'src/app/domain/daily-trends/models';
import { DailyTrendsService, ImageService } from 'src/app/domain/daily-trends/services';

@Component({
  selector: 'app-daily-trends-details',
  templateUrl: './daily-trends-details.component.html',
  styleUrls: ['./daily-trends-details.component.scss'],
})
export class DailyTrendsDetailsComponent implements OnInit {
  private dailyTrendsSubscription: Subscription;
  private country = 'RO';
  public dailyTrends: DailyTrendsItemDto;
  public dailyTrendsByID = [];
  public id: any;
  public imageUrl: string;
  public newsUrl: string;
  public source: string;
  public base64Image: any;
  public articles: ArticleDto[];
  public imageArray: Array<string> = [];

  constructor(
    private route: ActivatedRoute,
    private googleTrendsAPI: DailyTrendsService,
    private imageService: ImageService) { }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getAll();



    // this.imageService.addImage('test').subscribe(res =>
    //   console.log('Req result --------- ' + res));
  }

  getBase64ImageFromURL(url: string) {
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
    // console.log('dataUrl ---------- ' + dataURL);
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  public getAll() {
    this.dailyTrendsSubscription = this.googleTrendsAPI.getDailyTrends$(`${this.country}`)
      .subscribe(res => {
        this.dailyTrends = res[this.id];
        // console.log('id: ' + this.id);
        this.imageUrl = this.dailyTrends.image.imageUrl;
        this.newsUrl = this.dailyTrends.image.newsUrl;
        this.source = this.dailyTrends.image.source;
        this.articles = this.dailyTrends.articles;
        // console.log('dailyTrend:' + this.imageUrl);
        // console.log('newsUrl:' + this.newsUrl);
        // console.log('articles:' + this.articles[1].snippet);
        this.articles.forEach(element => {
          // console.log(element.snippet);
          this.getBase64ImageFromURL(element.image.imageUrl ? element.image.imageUrl : 'https://t1.gstatic.com/images?q=tbn:ANd9GcTlZXJBZDHlvWTO9Nj0CHKay4RspAml-VR7h7ohmr6d7CWwH-_1t4SIIkCM3TRGXpfDIQyenklK')
            .subscribe(base64data => {
              // console.log('base64data ----- ' + base64data);
              this.base64Image = 'data:image/jpg;base64,' + base64data;

              // console.log('base64Image ----- ' + base64data);
              this.imageArray.push(this.base64Image);

            });
        });
      });
  }

}
