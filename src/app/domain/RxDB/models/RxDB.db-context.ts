import { RxCollection } from 'rxdb';
import { DailyTrends } from './daily-trends.model';

export interface RxDBContext {
    dailyTrends: RxCollection<DailyTrends>;
}
