import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { SystemSettingsService } from '../../../core/services/system-settings.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="relative min-h-screen bg-slate-100/80 text-slate-800 antialiased selection:bg-cyan-500 selection:text-white flex flex-col justify-between">
      
      <!-- Top Subtle Background Gradient -->
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-slate-900 via-slate-900/10 to-transparent opacity-[0.06]"></div>

      <div class="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-10 justify-between">
        
        <!-- Top Nav Bar -->
        <div class="flex items-center justify-between">
          <a routerLink="/"
             class="inline-flex items-center gap-2 rounded-full bg-white/90 border border-slate-200 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-slate-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span>Back to Home</span>
          </a>

          <div class="flex items-center gap-3">
            <span class="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Secure online banking</span>
            </span>
            <div class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </div>
          </div>
        </div>

        <!-- Main 2-Column Split (Strict Parity with https://otbplcfin.com/signin) -->
        <div class="grid flex-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16">
          
          <!-- Left Column (Desktop Value Proposition) -->
          <section class="hidden lg:block space-y-8">
            <a routerLink="/" class="inline-flex items-center gap-3">
              @if (systemSettings.siteLogoUrl().startsWith('http') || systemSettings.siteLogoUrl().startsWith('/assets') || systemSettings.siteLogoUrl().startsWith('data:image')) {
                <img [src]="systemSettings.siteLogoUrl()" [alt]="systemSettings.siteName()" class="w-12 h-12 rounded-2xl object-contain bg-white p-1 border border-slate-200 shadow-md" />
              } @else {
                <div class="w-12 h-12 rounded-2xl bg-[#003432] text-[#0BB4D2] flex items-center justify-center shadow-md font-black text-xl">
                  {{ systemSettings.siteName().substring(0, 2).toUpperCase() }}
                </div>
              }
              <div>
                <span class="text-xl font-black text-slate-900 tracking-tight block uppercase">{{ systemSettings.siteName() }}</span>
                <span class="text-xs uppercase tracking-wider text-slate-500 font-bold">{{ systemSettings.siteTagline() }}</span>
              </div>
            </a>

            <h2 class="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Banking built on trust, precision and privacy.
            </h2>

            <p class="text-base text-slate-600 max-w-md leading-relaxed">
              Access balances, move money worldwide and monitor every transaction from one secure place.
            </p>

            <ul class="space-y-4 text-sm font-semibold text-slate-700">
              <li class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Real-time balances across checking, savings and investments</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Global transfers with country-specific requirements</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Continuous fraud monitoring on every session</span>
              </li>
            </ul>
          </section>

          <!-- Right Column (Sign In Form Card) -->
          <div class="mx-auto w-full max-w-md space-y-6">
            
            <div class="w-full rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-xl">
              
              <div class="mb-7">
                <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Welcome back</h1>
                <p class="text-xs sm:text-sm text-slate-500 mt-1">Sign in to continue to your {{ systemSettings.siteName() }} account.</p>
              </div>

              <form (ngSubmit)="submitLogin()" class="space-y-5">
                
                <!-- Email Address -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Email Address <span class="text-cyan-600">*</span>
                  </label>
                  <input type="email" [(ngModel)]="email" name="email" required
                         placeholder="you@example.com"
                         class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20">
                </div>

                <!-- Password with Show/Hide Toggle -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="block text-xs font-bold text-slate-700 uppercase">
                      Password <span class="text-cyan-600">*</span>
                    </label>
                    <a (click)="forgotPassword()" class="text-xs text-cyan-600 hover:text-cyan-700 font-semibold cursor-pointer">
                      Forgot?
                    </a>
                  </div>
                  <div class="relative">
                    <input [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" name="password" required
                           placeholder="Your password"
                           class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20 pr-12">
                    <button type="button" (click)="togglePasswordVisibility()" aria-label="Toggle password"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                      @if (showPassword()) {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                      } @else {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      }
                    </button>
                  </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" [disabled]="isLoading"
                        class="w-full rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-500 hover:to-indigo-600 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-cyan-900/25 transition disabled:opacity-70 flex items-center justify-center gap-2">
                  @if (isLoading) {
                    <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Authenticating...</span>
                  } @else {
                    <span>Sign In</span>
                  }
                </button>

              </form>

              <p class="mt-6 text-center text-xs sm:text-sm text-slate-500">
                New to VaultProvenance? 
                <a routerLink="/open-account" class="font-bold text-cyan-700 hover:underline">Open an account</a>
              </p>

            </div>

            <!-- Trust Badges Underneath -->
            <div class="flex items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <span>FDIC Insured</span>
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span>256-bit SSL Encryption</span>
              </span>
            </div>

          </div>

        </div>

        <!-- Footer Notice -->
        <div class="text-center py-4 text-xs text-slate-400 space-y-1">
          <div>&copy; 2026 {{ systemSettings.siteName() }}. Authorized and Regulated Banking Institution.</div>
          <div class="flex items-center justify-center gap-3 text-slate-500 text-[11px] pt-1">
            <a routerLink="/terms" class="hover:text-cyan-400 transition">Terms &amp; Conditions</a>
            <span>&bull;</span>
            <a routerLink="/privacy" class="hover:text-cyan-400 transition">Privacy Policy</a>
            <span>&bull;</span>
            <a routerLink="/security" class="hover:text-cyan-400 transition">Security</a>
          </div>
        </div>

      </div>

    </div>
  `
})
export class LoginComponent {
  systemSettings = inject(SystemSettingsService);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoading = false;
  showPassword = signal<boolean>(false);

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  forgotPassword(): void {
    this.modalService.alert({
      title: 'Password Reset',
      message: `To protect your account, please email ${this.systemSettings.contactEmail()} or call ${this.systemSettings.phoneNumber()} to reset your password.`,
      type: 'info'
    });
  }

  submitLogin(): void {
    if (!this.email || !this.password) {
      this.modalService.alert({
        title: 'Missing Fields',
        message: 'Please provide both your registered email address and password.',
        type: 'warning'
      });
      return;
    }

    this.isLoading = true;
    this.authService.loginStage1(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'PIN_REQUIRED' || res.nextStep === 'PIN_VERIFICATION') {
          this.router.navigate(['/pin']);
        } else if (res.status === 'INACTIVE' || res.status === 'ACCOUNT_INACTIVE') {
          this.modalService.alert({
            title: 'Account Inactive',
            message: 'The Selected Account Is Inactive; Kindly Contact your home branch to resolve the issue.',
            type: 'danger'
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message || 'Invalid Email or Password. Try Again or contact support to recover your password.';
        const status = err.error?.status;
        
        if (status === 'INACTIVE' || status === 'ACCOUNT_INACTIVE' || err.status === 403) {
          this.modalService.alert({
            title: 'Account Inactive',
            message: 'The Selected Account Is Inactive; Kindly Contact your home branch to resolve the issue.',
            type: 'danger'
          });
        } else {
          this.modalService.alert({
            title: 'Authentication Failed',
            message: msg,
            type: 'danger'
          });
        }
      }
    });
  }
}
