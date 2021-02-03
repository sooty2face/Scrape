import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";
import { ToDo } from "../models/ToDo";



export interface ToDoState{
    todos:ToDo[];
    toDoD:ToDo[];
    doneD:ToDo[];
    isLoaded:boolean;
}

/* Set the initial state */
export const getInitialState = () => {
    return{
        todos:[],
        toDoD:[],
        doneD:[],
        isLoaded: false
    }
}

/* Create the store */
@Injectable({providedIn: 'root'})
@StoreConfig({name: 'todo'})
export class ToDoStore extends Store<ToDoState>{
    constructor(){
        super(getInitialState());
    }
}