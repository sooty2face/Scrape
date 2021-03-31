import { Injectable } from "@angular/core";
import { Observable, of, partition } from "rxjs";
import { ToDo } from "../models/ToDo.model";
import { DatabaseProvider } from "../DatabaseProvider";
import { flatten } from "@angular/compiler";
import { RxDocument } from "rxdb";
import { distinct } from "rxjs/operators";

@Injectable()
export class ToDosRepository {
    constructor(private dbProvider: DatabaseProvider) { }

    public getAllToDos$(): Observable<ToDo[]> {
        const dbColl = this.dbProvider.getToDoCollection().find().where('status').in(['open']).$;
        // this.dbProvider.get().collections.$.subscribe(changeEvent => console.dir(changeEvent));


        dbColl.subscribe(res => console.log('getAllToDos$ res: ' + res));
        return dbColl;
        // return this.dbProvider.get().collections.todos.find().$;
    }

    public getAllToDos() {
        const dbColl = this.dbProvider.getToDoCollection().find();
        // this.dbProvider.get().collections.$.subscribe(changeEvent => console.dir(changeEvent));


        console.log(dbColl);
        // return dbColl.exec;
        // return this.dbProvider.get().collections.todos.find().$;
    }

    public async updateToDo(ToDo: ToDo) {
        const query = this.dbProvider.getToDoCollection().find().where('toDoID').eq(ToDo.toDoID);
        await query.update({
            $set: {
                status: ToDo.status
            }
        });
    }

    public async insertToDos(rxToDo: ToDo[]) {
        // const todo = this.dbProvider.get().collections;
        // let todoID = new Date().getTime().toString();


        // const ToDoItem: ToDo[] = [{
        //     id: todoID,
        //     employeeID: 439,
        //     title: 'Inserted title',
        //     description: 'Inserted description',
        //     status: 'open'
        // },
        // {
        //     id: todoID,
        //     employeeID: 439,
        //     title: 'Inserted title2',
        //     description: 'Inserted description2',
        //     status: 'open'
        // }
        // ]

        // this.dbProvider.createDB();

        const todoColl = this.dbProvider.getToDoCollection();
        console.log("Inserting stuff in rxdb");
        const todoDoc = await todoColl.bulkInsert(rxToDo)
        return todoColl;
    }

    public async bulkUpsert(todos: ToDo[]) {
        const hasAny = (await this.dbProvider.getToDoCollection().find().limit(1).exec()).length > 0;
        console.log('RxDB has any? ' + hasAny);
        console.log('API has any? ' + todos.length);
        if (!hasAny) {
            console.log('Initial import RxDB')
            await this.initialImport(todos);
        } else {
            console.log('Refreshing RxDB')
            await this.updateBatch(todos);
        }
    }

    private async updateBatch(upsertedToDos: ToDo[]) {
        const toDosIds = upsertedToDos.map((r) => r.toDoID);

        const removedResult = await this.dbProvider.getToDoCollection().find().where('toDoID').in(toDosIds).remove();

        const insertedResult = await this.dbProvider.getToDoCollection().bulkInsert(upsertedToDos);

        console.log(
            'ToDos (modified, inserted): ',
            removedResult.length,
            upsertedToDos.length - removedResult.length
        );
        if (insertedResult.error.length) {
            console.error('Some items failed to sync. Might be because of conflicts');
        }
        /* requestIdlePromise --- Returns a promise which resolves when the database is in idle */
        // await this.dbProvider.getToDoCollection().requestIdlePromise();

        return this.getAllToDos$();
    }

    private async initialImport(todos: ToDo[]) {
        const allToDos = await this.dbProvider.getToDoCollection().find().exec();
        const allToDosIds = allToDos.map((j) => j.todos.map((x: ToDo) => x.toDoID));
        const uniqIds = of([...allToDosIds]).pipe(distinct());

        // const [insertNow, insertLater] = partition(todos, (t) => uniqIds.indexOf(t.toDoID) >= 0);
        // await this.dbProvider.getToDoCollection().bulkInsert(insertNow);
        // await this.dbProvider.get().requestIdlePromise();
        await this.insertToDos(todos);
        // setTimeout(async () => {
        //     // tslint:disable-next-line: no-console
        //     console.time('Delayed product import');
        //     await this.dbProvider.get().products.bulkInsert(insertLater);
        //     await this.dbProvider.get().requestIdlePromise();
        //     // tslint:disable-next-line: no-console
        //     console.timeEnd('Delayed product import');
        // }, 5000);
    }

    public getByIds$(todosIds: string[]): Observable<RxDocument<ToDo>[]> {
        return this.dbProvider.getToDoCollection().find().where('toDoID').in(todosIds).$;
    }

    public getByToDoIds$(productIds: number[]): Observable<RxDocument<ToDo>[]> {
        return this.dbProvider.getToDoCollection().find({
            selector: {
                productId: { $in: productIds }
            },
        }).$;
    }
}