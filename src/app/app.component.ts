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
      <div class="fixed top-0 inset-x-0 h-1 z-[999999] bg-gradient-to-r from-[#003432] via-[#0BB4D2] to-emerald-400 animate-pulse shadow-md"></div>
    }

    <!-- App Initial Loader (Sovereign Vault Splash) -->
    @if (isAppInitializing()) {
      <div class="fixed inset-0 z-[999990] flex flex-col items-center justify-center bg-radial from-[#003432] to-[#001918] bg-[#001918] text-white select-none transition-opacity duration-300">
        <div class="relative w-20 h-20 mb-5 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full border-2 border-[#0BB4D2]/25 animate-ping"></div>
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004d49] to-[#002221] border-2 border-[#0BB4D2] flex items-center justify-center shadow-xl p-2 overflow-hidden">
            @if (systemSettings.siteLogoUrl()) {
              <img [src]="systemSettings.siteLogoUrl()" alt="Logo" class="max-h-full max-w-full object-contain" />
            } @else {
              <svg class="w-8 h-8 text-[#0BB4D2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M12 8v4"/>
                <path d="M12 16h.01"/>
              </svg>
            }
          </div>
        </div>
        <div class="text-base sm:text-lg font-black tracking-widest uppercase text-white mb-1.5 text-center px-4">
          {{ systemSettings.siteName() }}
        </div>
        <div class="text-[10px] font-bold tracking-widest text-[#0BB4D2] uppercase mb-4 opacity-90">
          Securing Session &bull; 256-Bit SSL
        </div>
        <div class="w-36 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div class="absolute inset-y-0 w-1/2 bg-gradient-to-r from-teal-400 via-[#0BB4D2] to-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    }

    <router-outlet></router-outlet>
    <app-modal-alert></app-modal-alert>
  `
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  systemSettings = inject(SystemSettingsService);

  isNavigating = signal<boolean>(false);
  isAppInitializing = signal<boolean>(true);

  ngOnInit(): void {
    // Smooth transition once client resources stabilize
    setTimeout(() => {
      this.isAppInitializing.set(false);
    }, 550);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => this.isNavigating.set(false), 200);
      }
    });
  }
}
