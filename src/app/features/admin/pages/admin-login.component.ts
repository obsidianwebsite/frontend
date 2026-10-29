import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { SystemSettingsService } from '../../../core/services/system-settings.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="relative min-h-screen bg-[#001f1e] text-slate-100 antialiased selection:bg-[#0BB4D2] selection:text-[#003432] flex flex-col justify-between overflow-hidden">
      
      <!-- Top Subtle Cyber/Banking Hex Gradient Background -->
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/40 via-[#001f1e] to-black opacity-90"></div>
      
      <!-- Subtle Decorative Grid Pattern -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div class="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8 justify-between z-10">
        
        <!-- Top Institutional Header -->
        <header class="flex items-center justify-between border-b border-teal-800/30 pb-5">
          <div class="flex items-center gap-3">
            @if (systemSettings.siteLogoUrl()) {
              <img [src]="systemSettings.siteLogoUrl()" [alt]="systemSettings.siteName()" class="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 border border-teal-500/20 shadow-lg" />
            } @else {
              <div class="w-10 h-10 rounded-xl bg-[#0BB4D2] text-[#003432] flex items-center justify-center shadow-lg font-black text-lg">
                {{ systemSettings.siteName().substring(0, 2).toUpperCase() }}
              </div>
            }
            <div>
              <span class="text-sm font-black text-white tracking-wider uppercase block">{{ systemSettings.siteName() }}</span>
              <span class="text-[10px] tracking-widest text-[#0BB4D2] uppercase font-bold block">Internal Treasury Operations</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-2 rounded-full bg-teal-950/80 border border-teal-500/30 px-3 py-1 text-[11px] font-bold text-teal-300">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Tier-4 Clearance Console</span>
            </span>
          </div>
        </header>

        <!-- Main Center Auth Card -->
        <main class="my-auto py-10 flex items-center justify-center">
          <div class="w-full max-w-md">
            
            <div class="rounded-3xl border border-teal-600/30 bg-[#002625]/90 p-8 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
              
              <!-- Top Glow Bar -->
              <div class="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-500 via-[#0BB4D2] to-emerald-400"></div>

              <!-- Header inside card -->
              <div class="mb-8 text-center space-y-2">
                <div class="w-14 h-14 mx-auto rounded-2xl bg-teal-900/60 border border-teal-500/40 flex items-center justify-center text-2xl shadow-inner text-[#0BB4D2]">
                  🛡️
                </div>
                <h1 class="text-2xl font-black text-white tracking-tight font-nunito">
                  Executive Admin Portal
                </h1>
                <p class="text-xs text-slate-400 max-w-xs mx-auto">
                  Enter authorized banking administrative credentials to manage treasury, client ledgers &amp; clearance controls.
                </p>
              </div>

              <!-- Admin Sign In Form -->
              <form (ngSubmit)="submitAdminLogin()" class="space-y-5">
                
                <!-- Email Input -->
                <div>
                  <label class="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Officer Email Address <span class="text-[#0BB4D2]">*</span>
                  </label>
                  <div class="relative">
                    <input type="email" [(ngModel)]="email" name="email" required
                           placeholder="admin@obsidiantrustbancorp.com"
                           class="w-full rounded-xl border border-teal-700/50 bg-[#001c1c] px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#0BB4D2] focus:ring-2 focus:ring-[#0BB4D2]/20 font-mono">
                  </div>
                </div>

                <!-- Password Input -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Administrative Key / Password <span class="text-[#0BB4D2]">*</span>
                    </label>
                  </div>
                  <div class="relative">
                    <input [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" name="password" required
                           placeholder="••••••••••••"
                           class="w-full rounded-xl border border-teal-700/50 bg-[#001c1c] px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#0BB4D2] focus:ring-2 focus:ring-[#0BB4D2]/20 pr-12 font-mono">
                    <button type="button" (click)="showPassword.set(!showPassword())" aria-label="Toggle password visibility"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs font-semibold cursor-pointer">
                      {{ showPassword() ? 'Hide' : 'Show' }}
                    </button>
                  </div>
                </div>

                <!-- Security Statement -->
                <div class="p-3 rounded-xl bg-black/30 border border-teal-800/40 text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
                  <span class="text-xs text-amber-400 shrink-0">⚠️</span>
                  <span>This system is restricted to authorized personnel. All session events, transaction injections, and database writes are cryptographically audited.</span>
                </div>

                <!-- Submit Button -->
                <button type="submit" [disabled]="isLoading"
                        class="w-full rounded-xl bg-[#0BB4D2] hover:bg-[#099cb6] py-3.5 text-xs sm:text-sm font-black text-[#003432] shadow-lg shadow-cyan-900/40 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]">
                  @if (isLoading) {
                    <div class="w-4 h-4 border-2 border-[#003432] border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying Authority...</span>
                  } @else {
                    <span>Authorize &amp; Access Admin Console &rarr;</span>
                  }
                </button>

              </form>

              <!-- Secondary User Link -->
              <div class="mt-6 pt-5 border-t border-teal-800/30 text-center">
                <a routerLink="/login" class="text-xs text-slate-400 hover:text-[#0BB4D2] transition inline-flex items-center gap-1.5">
                  <span>←</span>
                  <span>Switch to Client E-Banking Portal</span>
                </a>
              </div>

            </div>

          </div>
        </main>

        <!-- Footer Notice -->
        <footer class="text-center text-xs text-slate-500 border-t border-teal-800/30 pt-4">
          <p>&copy; 2026 {{ systemSettings.siteName() }}. Internal Commercial Core Infrastructure.</p>
        </footer>

      </div>

    </div>
  `
})
export class AdminLoginComponent {
  systemSettings = inject(SystemSettingsService);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoading = false;
  showPassword = signal<boolean>(false);

  submitAdminLogin(): void {
    if (!this.email || !this.password) {
      this.modalService.alert({
        title: 'Required Credentials',
        message: 'Please provide both your administrative email address and password.',
        type: 'warning'
      });
      return;
    }

    this.isLoading = true;
    this.authService.adminLogin(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.token) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.modalService.alert({
            title: 'Authorization Required',
            message: res.message || 'Unable to authenticate administrative credentials.',
            type: 'danger'
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message || 'Access Denied: Invalid administrative credentials.';
        this.modalService.alert({
          title: 'Administrative Access Denied',
          message: msg,
          type: 'danger'
        });
      }
    });
  }
}
