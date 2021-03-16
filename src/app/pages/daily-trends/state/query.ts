import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Observable } from "rxjs/internal/Observable";
import { ToDo } from "../models/ToDo";

import { ToDoState, ToDoStore } from "./store";

/* Query is a class requiring the generic state and in the constructor it needs
 * the Store to send further up in the constructor chain
  */
 @Injectable()
export class ToDoQuery extends Query<ToDoState>{
    /* This ToDoStore is a token, not the same thing as the other class */
    constructor(private toDoStore: ToDoStore) {
        super(toDoStore);
    }

    getToDos():Observable<ToDo[]>{
        return this.select(state => state.todos);
    }

    getLoaded():Observable<boolean>{
        return this.select(state => state.isLoaded);
    }

    /* For the isLoading we did not declare any variable in the interface ToDoState in store.ts, but Akita 
     * already does this automatically and it offers the method selectLoading() for that */
    getLoading():Observable<boolean>{
        return this.selectLoading();
    }
}