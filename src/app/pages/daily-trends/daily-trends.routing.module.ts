import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/domain/Auth';
import { DailyTrendsDetailsComponent } from './daily-trends-details/daily-trends-details/daily-trends-details.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: DailyTrendsDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DailyTrendsRoutingModule { }
