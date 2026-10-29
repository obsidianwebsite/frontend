import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ModalService } from '../../../../core/services/modal.service';
import { SystemSettingsService } from '../../../../core/services/system-settings.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6 sm:space-y-8 max-w-5xl mx-auto animate-fade-in font-sans pb-12">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#003432] tracking-tight font-nunito">
            Client Profile &amp; Account Identity
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Manage your personal profile information, residential address, contact details, and institutional credentials.
          </p>
        </div>

        <div class="flex items-center gap-2 self-start">
          <a routerLink="/e-banking/settings" 
             class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs flex items-center gap-1.5 transition">
            <span>🔒</span>
            <span>Security &amp; PIN Settings</span>
          </a>
        </div>
      </div>

      <!-- Hero Identity Card -->
      <div class="bg-gradient-to-r from-[#003432] via-[#004240] to-[#002625] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        
        <!-- Subtle Glow & Pattern -->
        <div class="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0BB4D2]/10 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          
          <!-- Avatar with Upload Button -->
          <div class="relative group shrink-0">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 border-2 border-white/20 overflow-hidden shadow-2xl flex items-center justify-center">
              @if (form.kycPhotoUrl) {
                <img [src]="form.kycPhotoUrl" alt="Profile Photo" class="w-full h-full object-cover">
              } @else {
                <span class="text-3xl font-black text-[#0BB4D2]">
                  {{ user()?.firstName?.charAt(0) || 'U' }}{{ user()?.lastName?.charAt(0) || 'C' }}
                </span>
              }
            </div>

            <!-- Upload Floating Badge -->
            <label class="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#0BB4D2] hover:bg-cyan-400 text-[#003432] flex items-center justify-center cursor-pointer shadow-lg transition active:scale-95"
                   title="Upload new profile picture">
              <input type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
              @if (isUploadingImage()) {
                <div class="w-4 h-4 border-2 border-[#003432] border-t-transparent rounded-full animate-spin"></div>
              } @else {
                <span class="text-sm font-bold">📷</span>
              }
            </label>
          </div>

          <!-- Identity Details -->
          <div class="space-y-3 text-center md:text-left flex-1 min-w-0">
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                {{ user()?.fullName || (user()?.firstName + ' ' + user()?.lastName) }}
              </h2>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {{ user()?.status || 'ACTIVE' }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/30">
                Verified Client
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300 font-mono">
              <div class="bg-black/20 rounded-2xl p-3 border border-white/10">
                <span class="text-[10px] text-slate-400 block font-sans">Primary Account Number</span>
                <strong class="text-white text-sm">{{ account()?.accountNumber || '026009593' }}</strong>
              </div>

              <div class="bg-black/20 rounded-2xl p-3 border border-white/10">
                <span class="text-[10px] text-slate-400 block font-sans">Account Classification</span>
                <strong class="text-white text-sm">{{ account()?.accountType || 'Savings Account' }}</strong>
              </div>

              <div class="bg-black/20 rounded-2xl p-3 border border-white/10">
                <span class="text-[10px] text-slate-400 block font-sans">Account Currency</span>
                <strong class="text-[#0BB4D2] text-sm">{{ account()?.currency || 'USD' }} ($)</strong>
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- Main Form Grid -->
      <form (ngSubmit)="saveProfile()" class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        <!-- Column 1 & 2: Editable Personal & Contact Details -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Personal Details Card -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-[#003432]">Personal Information</h3>
                <p class="text-xs text-slate-400 mt-0.5">Government-verified legal identification details</p>
              </div>
              <span class="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg font-mono">AML Protected</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block text-slate-500 font-bold uppercase text-[10px] mb-1">First Name (Legal)</label>
                <input type="text" [value]="user()?.firstName" disabled
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 font-bold cursor-not-allowed">
              </div>

              <div>
                <label class="block text-slate-500 font-bold uppercase text-[10px] mb-1">Last Name (Legal)</label>
                <input type="text" [value]="user()?.lastName" disabled
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 font-bold cursor-not-allowed">
              </div>

              <div>
                <label class="block text-slate-500 font-bold uppercase text-[10px] mb-1">Email Address</label>
                <input type="email" [value]="user()?.email" disabled
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 font-mono font-bold cursor-not-allowed">
              </div>

              <div>
                <label class="block text-slate-700 font-bold uppercase text-[10px] mb-1">Phone Number *</label>
                <input type="text" [(ngModel)]="form.phone" name="phone" required
                       class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
              </div>

              <div>
                <label class="block text-slate-500 font-bold uppercase text-[10px] mb-1">Date of Birth</label>
                <input type="text" [value]="user()?.dateOfBirth ? (user()?.dateOfBirth | date:'longDate') : 'Verified on File'" disabled
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 font-semibold cursor-not-allowed">
              </div>

              <div>
                <label class="block text-slate-500 font-bold uppercase text-[10px] mb-1">Gender</label>
                <input type="text" [value]="user()?.gender || 'Specified on Application'" disabled
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 font-semibold cursor-not-allowed">
              </div>
            </div>

          </div>

          <!-- Residential Address Card -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-base font-bold text-[#003432]">Residential &amp; Billing Address</h3>
              <p class="text-xs text-slate-400 mt-0.5">Primary domicile address registered for statements and wire clearing</p>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <label class="block text-slate-700 font-bold uppercase text-[10px] mb-1">Street Address *</label>
                <input type="text" [(ngModel)]="form.address" name="address" required
                       class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-slate-700 font-bold uppercase text-[10px] mb-1">City *</label>
                  <input type="text" [(ngModel)]="form.city" name="city" required
                         class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                </div>

                <div>
                  <label class="block text-slate-700 font-bold uppercase text-[10px] mb-1">State / Province *</label>
                  <input type="text" [(ngModel)]="form.state" name="state" required
                         class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                </div>

                <div>
                  <label class="block text-slate-700 font-bold uppercase text-[10px] mb-1">Zip / Postal Code *</label>
                  <input type="text" [(ngModel)]="form.zipCode" name="zipCode" required
                         class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                </div>
              </div>

              <div>
                <label class="block text-slate-700 font-bold uppercase text-[10px] mb-1">Country *</label>
                <input type="text" [(ngModel)]="form.country" name="country" required
                       class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button type="submit" [disabled]="isSaving()"
                      class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50">
                @if (isSaving()) {
                  <div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Updates...</span>
                } @else {
                  <span>💾 Save Profile Information</span>
                }
              </button>
            </div>

          </div>

        </div>

        <!-- Column 3: Institutional Clearing & Regulatory Attributes -->
        <div class="space-y-6">
          
          <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5 text-xs">
            
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-base font-bold text-[#003432]">Institutional Routing</h3>
              <p class="text-xs text-slate-400 mt-0.5">Clearing network identifiers</p>
            </div>

            <div class="space-y-3.5">
              <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] text-slate-400 block uppercase font-bold">SWIFT / BIC Code</span>
                <strong class="text-slate-800 font-mono text-sm">{{ systemSettings.swiftCode() || 'OTBCGB2L' }}</strong>
              </div>

              <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] text-slate-400 block uppercase font-bold">ABA / Fedwire Routing Number</span>
                <strong class="text-slate-800 font-mono text-sm">{{ systemSettings.routingNumber() || '026009593' }}</strong>
              </div>

              <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] text-slate-400 block uppercase font-bold">Home Branch</span>
                <strong class="text-slate-800 text-xs block">{{ systemSettings.siteName() }} Central Treasury Desk</strong>
                <span class="text-[11px] text-slate-500 block mt-0.5">{{ systemSettings.address() }}</span>
              </div>
            </div>

            <!-- KYC Compliance Status -->
            <div class="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span class="font-bold text-[#003432] text-xs">Identity Verification Tier: Active</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-relaxed">
                Your institutional KYC file is fully verified under British-Atlantic prudential financial guidelines.
              </p>
            </div>

          </div>

        </div>

      </form>

    </div>
  `
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  modalService = inject(ModalService);
  systemSettings = inject(SystemSettingsService);

  user = this.authService.currentUser;
  account = this.authService.currentAccount;

  isSaving = signal<boolean>(false);
  isUploadingImage = signal<boolean>(false);

  form = {
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    kycPhotoUrl: ''
  };

  ngOnInit(): void {
    this.authService.loadProfile().subscribe({
      next: (res) => {
        if (res.user) {
          this.form.phone = res.user.phone || '';
          this.form.address = res.user.address || '';
          this.form.city = res.user.city || '';
          this.form.state = res.user.state || '';
          this.form.zipCode = res.user.zipCode || '';
          this.form.country = res.user.country || 'United States';
          this.form.kycPhotoUrl = res.user.kycPhotoUrl || '';
        }
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.modalService.alert({ title: 'Invalid File', message: 'Please select a valid image file (JPG, PNG, WEBP).', type: 'warning' });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      this.modalService.alert({ title: 'File Too Large', message: 'Image must be under 8MB in size.', type: 'warning' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      this.isUploadingImage.set(true);

      this.authService.uploadKycImage(base64Data, 'profiles').subscribe({
        next: (res) => {
          this.isUploadingImage.set(false);
          if (res.url) {
            this.form.kycPhotoUrl = res.url;
            // Automatically save updated avatar to profile
            this.authService.updateProfile({ kycPhotoUrl: res.url }).subscribe({
              next: () => {
                this.modalService.alert({ title: 'Avatar Updated', message: 'Profile photo uploaded and saved successfully.', type: 'success' });
              }
            });
          }
        },
        error: (err) => {
          this.isUploadingImage.set(false);
          this.modalService.alert({ title: 'Upload Failed', message: err.error?.message || 'Could not upload profile photo.', type: 'danger' });
        }
      });
    };
    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    if (!this.form.phone || !this.form.address || !this.form.city || !this.form.state || !this.form.zipCode) {
      this.modalService.alert({ title: 'Missing Information', message: 'Please complete all required fields marked with *.', type: 'warning' });
      return;
    }

    this.isSaving.set(true);
    this.authService.updateProfile(this.form).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.modalService.alert({ title: 'Profile Saved', message: res.message || 'Your profile details have been successfully updated.', type: 'success' });
      },
      error: (err) => {
        this.isSaving.set(false);
        this.modalService.alert({ title: 'Update Failed', message: err.error?.message || 'Failed to update profile details.', type: 'danger' });
      }
    });
  }
}
