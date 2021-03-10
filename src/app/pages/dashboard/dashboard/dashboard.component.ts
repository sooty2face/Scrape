import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/domain/Auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public googleTrendsRes: any;
  public country = 'RO';
  public region = 'covid';
  public keyword = 'sibiu';

  public countrySearchTermsByDay = [];
  public countryTrends$ = new Observable();
  public keywordsTrends$ = new Observable();

  private envUrl = environment.googleTrendsAPI;

  constructor(
    private authenticationService: AuthenticationService) { }

  getAll() {
    // return this.http.get(`${'http://localhost:4000'}/googleTrends/googletrends`)
    // this.countryTrends$ = this.http.get(`${this.envUrl}/${this.country}`);
    // this.keywordsTrends$ = this.http.get(`${this.envUrl}/${this.region}/${this.keyword}`);
  }

  ngOnInit() {
    this.getAll();
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   console.log('afterViewInitDash');
    // }, 3000);
  }

  async logout() {
    this.authenticationService.logoutWithConfirmation();
  }

}
