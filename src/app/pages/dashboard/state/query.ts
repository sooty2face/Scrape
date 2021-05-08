import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Country, DailyTrendsDto, DailyTrendsItemDto } from '@domain/daily-trends';
import { Observable } from 'rxjs/internal/Observable';


import { DailyTrendsStore, DailyTrendsState } from './store';

/* Query is a class requiring the generic state and in the constructor it needs
 * the Store to send further up in the constructor chain
  */
@Injectable({ providedIn: 'root' })
export class DailyTrendsQry extends Query<DailyTrendsState>{
    /* This dailyTrendsStore is a token, not the same thing as the other class */
    constructor(private dailyTrendsStore: DailyTrendsStore) {
        super(dailyTrendsStore);
    }

    getDailyTrendsToday(): Observable<DailyTrendsDto> {
        return this.select(state => state.DailyTrendsStore);
    }

    getDailyTrendsMore(): Observable<DailyTrendsDto> {
        return this.select(state => state.DailyTrendsYStore);
    }

    getDailyTrendsMoreLoaded(): Observable<boolean> {
        return this.select(state => state.loadMoreButtonPressed);
    }

    getLoaded(): Observable<boolean> {
        return this.select(state => state.isLoaded);
    }

    getCountry$(): Observable<Country> {
        return this.select(state => state.country);
    }

    /* For the isLoading we did not declare any variable in the interface DailyTrendsState in store.ts, but Akita 
     * already does this automatically and it offers the method selectLoading() for that */
    getLoading(): Observable<boolean> {
        return this.selectLoading();
    }
}