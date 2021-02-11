import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
})
export class ToggleComponent {
  public showPassword = false;
  public toggleEye = 'eye';

  constructor() { }

  // @Input() public showPassword: boolean; // variable defined with alias;
  @Input() public InputPassword: string;

  @Output() public togglePassEvent = new EventEmitter();

  public togglePassword() {
    console.log(this.InputPassword);

    this.showPassword = !this.showPassword;
    this.toggleEye = this.showPassword ? 'eye-off' : 'eye';
    this.togglePassEvent.emit(this.showPassword);
  }
}
