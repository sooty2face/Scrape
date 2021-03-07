import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/domain/Auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public googleTrendsRes: any;
  public country = 'RO';
  public region = 'Sibiu';
  public keyword = 'Laptop';

  public countrySearchTermsByDay = [];
  public countryTrends$ = new Observable();
  public keywordsTrends$ = new Observable();

  public observer = {
    next: x => {
      console.log('Observer got a next value');
    },
    error: err => console.error('Observer got an error: ' + err),
    complete: () => console.log('Observer got a complete notification'),
  };
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService) { }

  getAll() {
    // return this.http.get(`${'http://localhost:4000'}/googleTrends/googletrends`)
    this.countryTrends$ = this.http.get(`${'http://localhost:4000'}/${this.country}`);
    this.keywordsTrends$ = this.http.get(`${'http://localhost:4000'}/${this.region}/${this.keyword}`)
    // .subscribe({
    //   next: (result: any) => {
    //     this.countrySearchTermsByDay = result;
    //     console.log(result);
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   },
    //   complete: () => {
    //     console.log('complete');
    //   }
    // });
  }

  ngOnInit() {
    this.getAll();
  }

  async logout() {
    this.authenticationService.logoutWithConfirmation();
  }

}
