import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { DailyTrendsDto } from '@domain/daily-trends';



export interface DailyTrendsState {
    dailyTrendsToday: DailyTrendsDto[];
    dailyTrendsMore: DailyTrendsDto[];
    loadMoreButtonPressed: boolean;
    isLoaded: boolean;
}

/* Set the initial state */
export const getInitialState = () => {
    return {
        dailyTrendsToday: [],
        dailyTrendsMore: [],
        loadMoreButtonPressed: false,
        isLoaded: false
    };
};

/* Create the store */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dailyTrends' })
export class DailyTrendsStore extends Store<DailyTrendsState>{
    constructor() {
        super(getInitialState());
    }
}