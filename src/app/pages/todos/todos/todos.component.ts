import { AfterViewInit, Component, DoCheck, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit, AfterViewInit, OnChanges {
  
  constructor() { }

  ngOnInit() { }

  // ngDoCheck() {
  //   console.log('ngDoCheck in todos');
  // }
  ngAfterViewInit() {
    // setTimeout(() => {
    //   console.log('afterViewInitTodos');
    // }, 3000);
  }

  ngOnChanges() {
    // setTimeout(() => {
    //   console.log('afterViewInitTodos');
    // }, 3000);
  }
}
