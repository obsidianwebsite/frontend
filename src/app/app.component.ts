import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ModalAlertComponent } from './shared/components/modal-alert.component';
import { SystemSettingsService } from './core/services/system-settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ModalAlertComponent],
  template: `
    <!-- Top Route Navigation Progress Bar -->
    @if (isNavigating()) {
      <div class="fixed top-0 inset-x-0 h-0.5 z-[999999] bg-[#0BB4D2] shadow-xs"></div>
    }

    <router-outlet></router-outlet>
    <app-modal-alert></app-modal-alert>
  `
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  systemSettings = inject(SystemSettingsService);

  isNavigating = signal<boolean>(false);

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => this.isNavigating.set(false), 150);
      }
    });
  }
}
