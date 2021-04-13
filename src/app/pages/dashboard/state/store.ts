import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { DailyTrendsDto, DailyTrendsItemDto } from '@domain/daily-trends';



export interface DailyTrendsState {
    DailyTrendsStore: DailyTrendsDto;
    DailyTrendsYStore: DailyTrendsDto;
    loadMoreButtonPressed: boolean;
    isLoaded: boolean;
}

/* Set the initial state */
export const getInitialState = () => {
    return {
        DailyTrendsStore: null,
        DailyTrendsYStore: null,
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
