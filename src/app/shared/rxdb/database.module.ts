import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ToDo } from './models/ToDo.model';
import { ToDosRepository } from './repositories/todos.repository';
import { DatabaseProvider } from './DatabaseProvider';

export function AppInitializer(dbProvider: DatabaseProvider) {
    return () => {
        dbProvider.createDB();
        // dbProvider.addDBCollection();
    }
}

@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [],
    providers: [
        ToDosRepository,
        {
            provide: APP_INITIALIZER,
            useFactory: AppInitializer,
            deps: [DatabaseProvider],
            multi: true,
        },
        DatabaseProvider,
    ],
    bootstrap: [],
})
export class DatabaseModule { }
