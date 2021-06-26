import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Country, DailyTrendsDto, DailyTrendsItemDto } from '@domain/daily-trends';



export interface DailyTrendsState {
    DailyTrendsStore: DailyTrendsDto;
    DailyTrendsYStore: DailyTrendsDto;
    loadMoreButtonPressed: boolean;
    isLoaded: boolean;
    country: Country;
    dayLoaded: number;
}

/* Set the initial state */
export const getInitialState = () => {
    return {
        DailyTrendsStore: null,
        DailyTrendsYStore: null,
        loadMoreButtonPressed: false,
        isLoaded: false,
        country: { code: 'RO', value: 'Romania' },
        dayLoaded: 0
    };
};

/* Create the store */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dailyTrends' })
export class DailyTrendsStore extends Store<DailyTrendsState>{
    constructor() {
        super(getInitialState());
    }

    public partialRestoreInitialState(): void {
        this.update({
            DailyTrendsStore: null,
            DailyTrendsYStore: null,
            loadMoreButtonPressed: false,
            isLoaded: false,
            dayLoaded: 0
        });
    }

    public updateCountry(countryInput: Country): void {
        this.update({
            country: countryInput,
        });
    }

    public updateDayLoaded(day: number): void {
        this.update({
            dayLoaded: day
        });
    }
}
