import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { SystemSettingsService } from '../../../core/services/system-settings.service';

@Component({
  selector: 'app-pin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="relative min-h-screen bg-slate-100/80 text-slate-800 antialiased selection:bg-cyan-500 selection:text-white flex flex-col justify-between">
      
      <!-- Top Subtle Background Gradient -->
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-slate-900 via-slate-900/10 to-transparent opacity-[0.06]"></div>

      <div class="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-8 sm:px-6 justify-between">
        
        <!-- Top Nav Bar -->
        <div class="flex items-center justify-between">
          <a routerLink="/login"
             class="inline-flex items-center gap-2 rounded-full bg-white/90 border border-slate-200 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-slate-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span>Back to Sign In</span>
          </a>

          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>Two-Tier Auth Security</span>
          </div>
        </div>

        <!-- PIN Card -->
        <div class="my-auto py-8">
          
          <div class="w-full rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-xl space-y-6">
            
            <div class="text-center space-y-2">
              <div class="w-14 h-14 rounded-2xl bg-slate-900 text-cyan-400 flex items-center justify-center mx-auto shadow-md">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <h1 class="text-2xl font-black text-slate-900 tracking-tight">Enter Your PIN</h1>
              <p class="text-xs text-slate-500">
                Step 2 of 2: Enter your 4-6 digit transaction PIN to access your account.
              </p>
              
              @if (userEmail) {
                <div class="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
                  {{ userEmail }}
                </div>
              }
            </div>

            <form (ngSubmit)="submitPin()" class="space-y-6">
              
              <div>
                <div class="relative">
                  <input type="password" [(ngModel)]="pin" name="pin" maxlength="6" autofocus required
                         class="w-full text-center tracking-[0.6em] text-3xl font-black font-mono py-4 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/15 focus:outline-none transition"
                         placeholder="••••">
                </div>
                <p class="text-[11px] text-slate-400 text-center mt-2">
                  256-bit encrypted &bull; Never share your PIN with anyone
                </p>
              </div>

              <button type="submit" [disabled]="isLoading || !pin"
                      class="w-full rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-500 hover:to-indigo-600 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-cyan-900/25 transition disabled:opacity-50 flex items-center justify-center gap-2">
                @if (isLoading) {
                  <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Verifying PIN...</span>
                } @else {
                  <span>Unlock Account &rarr;</span>
                }
              </button>

            </form>

          </div>

          <!-- Bottom Security Badges -->
          <div class="mt-6 flex items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span>FDIC Protected</span>
            </span>
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <span>Encrypted Session</span>
            </span>
          </div>

        </div>

        <!-- Footer Notice -->
        <div class="text-center py-4 text-xs text-slate-400">
          &copy; 2026 {{ systemSettings.siteName() }}. All rights reserved.
        </div>

      </div>

    </div>
  `
})
export class PinComponent {
  systemSettings = inject(SystemSettingsService);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  pin = '';
  isLoading = false;

  get userEmail(): string {
    return this.authService.preAuthData()?.user.email || '';
  }

  submitPin(): void {
    if (!this.pin || this.pin.length < 4) {
      this.modalService.alert({
        title: 'Invalid PIN',
        message: 'Please enter your 4 to 6 digit transaction PIN.',
        type: 'warning'
      });
      return;
    }

    this.isLoading = true;
    this.authService.verifyPinStage2(this.pin).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'SUCCESS') {
          if (res.user?.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/e-banking/overview']);
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.modalService.alert({
          title: 'PIN Verification Failed',
          message: err.error?.message || 'Invalid Transaction PIN entered. Please try again.',
          type: 'danger'
        });
      }
    });
  }
}
