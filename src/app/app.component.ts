import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalAlertComponent } from './shared/components/modal-alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalAlertComponent],
  template: `
    <router-outlet></router-outlet>
    <app-modal-alert></app-modal-alert>
  `
})
export class AppComponent {}
