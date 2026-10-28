import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { SystemSettingsService } from '../../../core/services/system-settings.service';

@Component({
  selector: 'app-open-account',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen py-10 sm:py-16 px-4 sm:px-8 bg-gradient-to-b from-[#003432] via-[#002625] to-slate-900">
      
      <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        <!-- Top Heading & Logo -->
        <div class="text-center space-y-3">
          <a routerLink="/" class="inline-flex items-center gap-2.5">
            @if (systemSettings.siteLogoUrl()) {
              <img [src]="systemSettings.siteLogoUrl()" [alt]="systemSettings.siteName()" class="w-10 h-10 rounded-2xl object-contain bg-teal-950 p-1 border border-[#0BB4D2]/40 shadow-lg" />
            } @else {
              <div class="w-10 h-10 rounded-2xl bg-teal-950 border border-[#0BB4D2]/40 flex items-center justify-center text-[#0BB4D2] font-black text-base shadow-lg">
                {{ systemSettings.siteName().substring(0, 2).toUpperCase() }}
              </div>
            }
            <span class="text-xl font-black text-white tracking-tight uppercase">{{ systemSettings.siteName() }}</span>
          </a>
          <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Onboarding &amp; Account Enrollment</h1>
          <p class="text-xs text-slate-300 max-w-lg mx-auto">Complete the verified KYC enrollment form below to provision your corporate or personal commercial banking account.</p>
        </div>

        <!-- Form Card Container -->
        <div class="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-200">
          
          <form (ngSubmit)="submitRegistration()" class="space-y-8">
            
            <!-- KYC Photo Capture / Upload Section -->
            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <label class="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                KYC Identity Verification Photograph *
              </label>
              <p class="text-[11px] text-slate-500 max-w-md mx-auto mb-5">
                Upload a clear frontal facial photograph or passport picture from your device file manager. Images are securely encrypted and hosted on Cloudinary CDN.
              </p>

              <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
                <!-- Preview Avatar with Status Ring -->
                <div class="relative group">
                  <div class="w-28 h-28 rounded-full border-4 overflow-hidden bg-slate-200 flex items-center justify-center shrink-0 shadow-lg transition"
                       [ngClass]="form.kycPhotoUrl ? 'border-emerald-500 ring-4 ring-emerald-500/20' : 'border-[#0BB4D2]'">
                    @if (form.kycPhotoUrl) {
                      <img [src]="form.kycPhotoUrl" alt="KYC Selfie" class="w-full h-full object-cover">
                    } @else {
                      <div class="flex flex-col items-center justify-center text-slate-400">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span class="text-[9px] font-bold mt-1 text-slate-400 uppercase">No Photo</span>
                      </div>
                    }
                  </div>

                  @if (form.kycPhotoUrl && !isUploadingKyc) {
                    <span class="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-md border-2 border-white" title="Verified">
                      ✓
                    </span>
                  }
                </div>

                <!-- Controls & Cloudinary Upload Action -->
                <div class="text-left space-y-3 flex-1 w-full max-w-lg">
                  <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/png,image/jpeg,image/webp,image/jpg" class="hidden">
                  
                  <div class="flex flex-wrap items-center gap-2">
                    <button type="button" (click)="fileInput.click()" [disabled]="isUploadingKyc"
                            class="px-4 py-2.5 rounded-xl bg-[#003432] hover:bg-[#002625] text-white text-xs font-bold transition shadow-xs flex items-center gap-2 disabled:opacity-60 cursor-pointer">
                      @if (isUploadingKyc) {
                        <div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading to Cloudinary...</span>
                      } @else {
                        <svg class="w-4 h-4 text-[#0BB4D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                        <span>{{ form.kycPhotoUrl ? 'Change Photo from Device' : 'Choose Photo from Device' }}</span>
                      }
                    </button>

                    @if (form.kycPhotoUrl && !isUploadingKyc) {
                      <button type="button" (click)="clearPhoto()"
                              class="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1 border border-rose-200 cursor-pointer">
                        <span>✕</span>
                        <span>Remove</span>
                      </button>
                    }
                  </div>

                  <!-- Upload Status Details -->
                  @if (isUploadingKyc) {
                    <div class="flex items-center gap-2 text-xs text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-xl px-3 py-2">
                      <div class="w-3.5 h-3.5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Encrypting and uploading photograph to Cloudinary CDN storage...</span>
                    </div>
                  } @else if (form.kycPhotoUrl) {
                    <div class="flex items-center justify-between text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3 py-2">
                      <div class="flex items-center gap-2 truncate">
                        <span class="text-emerald-600 font-bold">☁️ Cloudinary CDN:</span>
                        <span class="truncate font-mono text-emerald-900">{{ uploadedFileName || form.kycPhotoUrl }}</span>
                      </div>
                      <span class="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider shrink-0 ml-2">Ready</span>
                    </div>
                  } @else {
                    <p class="text-[11px] text-slate-500">
                      Tap the button above to pick a photo from your phone's camera roll or computer files.
                    </p>
                  }

                  <!-- Optional Direct URL accordion -->
                  <div class="pt-1">
                    <button type="button" (click)="showUrlManualInput = !showUrlManualInput"
                            class="text-[10px] text-slate-400 hover:text-slate-600 font-semibold underline cursor-pointer">
                      {{ showUrlManualInput ? '− Hide direct image URL field' : '+ Or paste image URL manually' }}
                    </button>

                    @if (showUrlManualInput) {
                      <div class="mt-1.5">
                        <input type="url" [(ngModel)]="form.kycPhotoUrl" name="kycPhotoUrl"
                               placeholder="https://example.com/photo.jpg"
                               class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#003432]">
                      </div>
                    }
                  </div>

                </div>
              </div>
            </div>

            <!-- SECTION 1: Personal Details -->
            <div>
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span>1. Personal &amp; Contact Information</span>
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                  <input type="text" [(ngModel)]="form.firstName" name="firstName" required minlength="6"
                         class="floating-input text-xs" placeholder="Min. 6 characters (e.g. Alistair)">
                  <span class="text-[10px] text-slate-400 mt-0.5 block">Firstname must specify at least 6 characters.</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                  <input type="text" [(ngModel)]="form.lastName" name="lastName" required minlength="6"
                         class="floating-input text-xs" placeholder="Min. 6 characters (e.g. Sterling)">
                  <span class="text-[10px] text-slate-400 mt-0.5 block">Lastname must specify at least 6 characters.</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Email ID *</label>
                  <input type="email" [(ngModel)]="form.email" name="email" required
                         class="floating-input text-xs" placeholder="user@domain.com">
                  <span class="text-[10px] text-slate-400 mt-0.5 block">Official email for statement delivery.</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input type="text" [(ngModel)]="form.phone" name="phone" required
                         class="floating-input text-xs" placeholder="+44 20 7946 0000">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
                  <input type="date" [(ngModel)]="form.dateOfBirth" name="dateOfBirth" required
                         class="floating-input text-xs">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                  <select [(ngModel)]="form.gender" name="gender" required class="floating-input text-xs font-semibold">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- SECTION 2: Residential Address -->
            <div>
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span>2. Residential / Registered Address</span>
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-3">
                  <label class="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                  <input type="text" [(ngModel)]="form.address" name="address" required minlength="10"
                         class="floating-input text-xs" placeholder="Full street address (min. 10 characters)">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input type="text" [(ngModel)]="form.city" name="city" required class="floating-input text-xs" placeholder="London">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">State / County *</label>
                  <input type="text" [(ngModel)]="form.state" name="state" required class="floating-input text-xs" placeholder="Greater London">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Zip / Postal Code *</label>
                  <input type="text" [(ngModel)]="form.zipCode" name="zipCode" required class="floating-input text-xs font-mono" placeholder="EC2N 1HQ">
                </div>
              </div>
            </div>

            <!-- SECTION 3: Account Configuration & Security Credentials -->
            <div>
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span>3. Account Structure &amp; Security Credentials</span>
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Account Type *</label>
                  <select [(ngModel)]="form.accountType" name="accountType" required class="floating-input text-xs font-semibold">
                    <option value="Savings Account">Savings Account</option>
                    <option value="Current Account">Current Account</option>
                    <option value="Checking Account">Checking Account</option>
                    <option value="Fixed Deposit Account">Fixed Deposit Account</option>
                    <option value="Off Shore Account">Off Shore Account</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Account Currency *</label>
                  <select [(ngModel)]="form.currency" name="currency" required class="floating-input text-xs font-semibold">
                    <option value="USD">$ US DOLLARS (USD)</option>
                    <option value="GBP">&pound; GREAT BRITISH POUNDS (GBP)</option>
                    <option value="EUR">&euro; Euros (EUR)</option>
                    <option value="CNY">&yen; Chinese Yuan (CNY)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">New Password (6–10 chars) *</label>
                  <input type="password" [(ngModel)]="form.password" name="password" required minlength="6" maxlength="10"
                         class="floating-input text-xs" placeholder="••••••••">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                  <input type="password" [(ngModel)]="form.confirmPassword" name="confirmPassword" required minlength="6" maxlength="10"
                         class="floating-input text-xs" placeholder="••••••••">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Security PIN (4–6 Digits) *</label>
                  <input type="password" [(ngModel)]="form.pin" name="pin" required minlength="4" maxlength="6"
                         class="floating-input font-tabular tracking-widest text-xs" placeholder="••••">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Confirm PIN *</label>
                  <input type="password" [(ngModel)]="form.confirmPin" name="confirmPin" required minlength="4" maxlength="6"
                         class="floating-input font-tabular tracking-widest text-xs" placeholder="••••">
                </div>
              </div>
            </div>

            <!-- Terms Agreement -->
            <div class="pt-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label class="flex items-center gap-3 cursor-pointer text-xs text-slate-700">
                <input type="checkbox" [(ngModel)]="form.agreeTerms" name="agreeTerms" required
                       class="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer">
                <span class="font-medium">
                  I agree to the 
                  <a routerLink="/terms" target="_blank" class="text-teal-700 hover:text-teal-900 underline font-semibold">Terms &amp; Conditions</a> 
                  and 
                  <a routerLink="/privacy" target="_blank" class="text-teal-700 hover:text-teal-900 underline font-semibold">Electronic Banking Privacy Protocols</a>.
                </span>
              </label>
            </div>

            <!-- Submit -->
            <button type="submit" [disabled]="isSubmitting"
                    class="btn-gradient-mountain w-full py-4 rounded-2xl text-sm font-bold shadow-xl flex items-center justify-center gap-2">
              @if (isSubmitting) {
                <svg class="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Provisioning Account &amp; Generating Ledger...</span>
              } @else {
                <span>Submit &amp; Open Account Now &rarr;</span>
              }
            </button>

            <!-- Already have an account link -->
            <div class="text-center text-xs text-slate-500">
              Already have an account? <a routerLink="/login" class="text-cyan-600 hover:text-cyan-700 font-bold">Sign In to E-Banking &rarr;</a>
            </div>

          </form>

        </div>

      </div>

    </div>
  `
})
export class OpenAccountComponent {
  systemSettings = inject(SystemSettingsService);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  isSubmitting = false;
  isUploadingKyc = false;
  uploadedFileName = '';
  showUrlManualInput = false;

  form = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pin: '',
    confirmPin: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    accountType: 'Checking Account',
    currency: 'USD',
    kycPhotoUrl: '',
    agreeTerms: false
  };

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.size > 8 * 1024 * 1024) {
      this.modalService.alert('File Too Large', 'Selected image exceeds the 8MB limit. Please choose a smaller file.', 'warning');
      input.value = '';
      return;
    }

    this.uploadedFileName = file.name;
    this.isUploadingKyc = true;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Pre-set preview immediately
      this.form.kycPhotoUrl = dataUrl;

      // Upload to backend / Cloudinary
      this.authService.uploadKycImage(dataUrl).subscribe({
        next: (res) => {
          this.isUploadingKyc = false;
          if (res.url) {
            this.form.kycPhotoUrl = res.url;
          }
          input.value = '';
        },
        error: (err) => {
          this.isUploadingKyc = false;
          console.warn('Cloudinary upload warning:', err);
          // Keep preview dataUrl as fallback so user is not blocked
          input.value = '';
        }
      });
    };
    reader.onerror = () => {
      this.isUploadingKyc = false;
      this.modalService.alert('File Read Error', 'Unable to read the chosen file from your device.', 'error');
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  clearPhoto(): void {
    this.form.kycPhotoUrl = '';
    this.uploadedFileName = '';
  }

  submitRegistration(): void {
    if (!this.form.kycPhotoUrl) {
      this.modalService.alert('KYC Photograph Required', 'Please select and upload your identity verification photograph from your device file manager.', 'warning');
      return;
    }

    if (!this.form.agreeTerms) {
      this.modalService.alert('Agreement Required', 'You must agree with the terms and conditions.', 'warning');
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.modalService.alert('Password Mismatch', "Confirm Password values don't match", 'warning');
      return;
    }

    if (this.form.pin !== this.form.confirmPin) {
      this.modalService.alert('PIN Mismatch', "Confirm Pin values don't match", 'warning');
      return;
    }

    if (this.form.firstName.length < 6 || this.form.lastName.length < 6) {
      this.modalService.alert('Validation Error', 'First Name and Last Name must each specify at least 6 characters.', 'warning');
      return;
    }

    this.isSubmitting = true;
    this.authService.register(this.form).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.modalService.alert(
          'Account Provisioned Successfully',
          `Congratulations! Your ${this.systemSettings.siteName()} account has been created. Assigned Account Number: ${res.accountNumber}. You may now sign in using your credentials and PIN.`,
          'success'
        ).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.modalService.alert(
          'Registration Error',
          err.error?.message || 'Failed to open account. Please verify all inputs.',
          'error'
        );
      }
    });
  }
}
