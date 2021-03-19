import { RxCollection } from 'rxdb';
import { DailyTrends } from './daily-trends.model';
import { ToDo } from './ToDo.model';

export interface RxDBContext {
    todos: RxCollection<ToDo>;
    dailyTrends: RxCollection<DailyTrends>;
}
