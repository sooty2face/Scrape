export interface ToDoInterface {
    title: string;
    description: string;
    header?: string;
}

export class ToDo implements ToDoInterface {
    toDoID?: number
    employeeID: number;
    title: string;
    description: string;
    status: string;
    seq: number;

    constructor(employeeID: number, title: string, description: string, status: string, seq: number) {
        this.employeeID = employeeID;
        this.title = title;
        this.description = description;
        this.status = status;
        this.seq = seq;
    }
}

export enum ToDoStatus {
    OPEN = 'open',
    PROGRESS = 'progress',
    COMPLETED = 'completed'
}