import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Country, DailyTrendsDto, DailyTrendsItemDto } from '@domain/daily-trends';



export interface DailyTrendsState {
    DailyTrendsStore: DailyTrendsDto;
    DailyTrendsYStore: DailyTrendsDto;
    loadMoreButtonPressed: boolean;
    isLoaded: boolean;
    country: Country;
}

/* Set the initial state */
export const getInitialState = () => {
    return {
        DailyTrendsStore: null,
        DailyTrendsYStore: null,
        loadMoreButtonPressed: false,
        isLoaded: false,
        country: { code: 'RO', value: 'Romania' }
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
        // we want to reset almost all fields except dateType because we want to keep last selected tab
        this.update({
            DailyTrendsStore: null,
            DailyTrendsYStore: null,
            loadMoreButtonPressed: false,
            isLoaded: false
        });
    }

    public updateCountry(countryInput: Country): void {
        this.update({
            country: countryInput,
        });
    }
}
