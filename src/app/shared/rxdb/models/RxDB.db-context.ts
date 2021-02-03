import { RxCollection } from "rxdb";
import { ToDo } from "./ToDo.model";

export interface RxDBContext{
    todos:RxCollection<ToDo>;
}