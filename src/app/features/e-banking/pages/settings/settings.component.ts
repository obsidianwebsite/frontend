import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-fade-in">
      
      <!-- Top Title & Security Status -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#003432] tracking-tight">Security Credentials &amp; Key Settings</h1>
          <p class="text-xs text-slate-500 mt-1">Manage secondary transaction authentication keys and primary account credentials.</p>
        </div>
        <div class="flex items-center gap-2 self-start">
          <span class="px-3 py-1.5 rounded-xl bg-white text-slate-700 text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>2-Tier Security Vault Active</span>
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        <!-- MODULE 1: Change Password -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 flex flex-col justify-between">
          
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
              <div>
                <h2 class="font-bold text-base text-[#003432]">Change Login Password</h2>
                <p class="text-[11px] text-slate-500 mt-0.5">Update your primary dashboard login secret</p>
              </div>
              <div class="w-9 h-9 rounded-xl bg-teal-50 text-[#003432] flex items-center justify-center border border-teal-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
            </div>

            <form (ngSubmit)="submitChangePassword()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Old Password *</label>
                <div class="relative">
                  <input [type]="showPwdOld() ? 'text' : 'password'" [(ngModel)]="pwdForm.oldPassword" name="oldPassword" required
                         class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none pr-14" 
                         placeholder="Enter current password">
                  <button type="button" (click)="showPwdOld.set(!showPwdOld())" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-semibold">
                    {{ showPwdOld() ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">New Password *</label>
                <div class="relative">
                  <input [type]="showPwdNew() ? 'text' : 'password'" [(ngModel)]="pwdForm.newPassword" name="newPassword" required minlength="6"
                         class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none pr-14" 
                         placeholder="Min. 6 characters">
                  <button type="button" (click)="showPwdNew.set(!showPwdNew())" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-semibold">
                    {{ showPwdNew() ? 'Hide' : 'Show' }}
                  </button>
                </div>
                <span class="text-[10px] text-slate-400 mt-1 block">Password must specify at least 6 characters.</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm New Password *</label>
                <input type="password" [(ngModel)]="pwdForm.confirmPassword" name="confirmPassword" required minlength="6"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                       placeholder="Repeat new password">
              </div>

              <div class="pt-2">
                <button type="submit" [disabled]="isSubmittingPwd"
                        class="bg-[#003432] hover:bg-[#002625] text-white w-full py-2.5 rounded-xl text-xs font-bold shadow-xs transition">
                  {{ isSubmittingPwd ? 'Updating Password...' : 'Update Login Password' }}
                </button>
              </div>
            </form>
          </div>

        </div>

        <!-- MODULE 2: Change PIN -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 flex flex-col justify-between">
          
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
              <div>
                <h2 class="font-bold text-base text-[#003432]">Change Transaction PIN</h2>
                <p class="text-[11px] text-slate-500 mt-0.5">Secondary clearance key for wire dispatches</p>
              </div>
              <div class="w-9 h-9 rounded-xl bg-teal-50 text-[#003432] flex items-center justify-center border border-teal-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
              </div>
            </div>

            <form (ngSubmit)="submitChangePin()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Old Security PIN *</label>
                <input type="password" [(ngModel)]="pinForm.oldPin" name="oldPin" required maxlength="6"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-tabular tracking-widest text-sm text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                       placeholder="••••">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">New Security PIN (4–6 Digits) *</label>
                <input type="password" [(ngModel)]="pinForm.newPin" name="newPin" required minlength="4" maxlength="6"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-tabular tracking-widest text-sm text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                       placeholder="••••">
                <span class="text-[10px] text-slate-400 mt-1 block">Account PIN must be 4 to 6 numeric digits.</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm New PIN *</label>
                <input type="password" [(ngModel)]="pinForm.confirmPin" name="confirmPin" required minlength="4" maxlength="6"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-tabular tracking-widest text-sm text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                       placeholder="••••">
              </div>

              <div class="pt-2">
                <button type="submit" [disabled]="isSubmittingPin"
                        class="bg-[#003432] hover:bg-[#002625] text-white w-full py-2.5 rounded-xl text-xs font-bold shadow-xs transition">
                  {{ isSubmittingPin ? 'Updating PIN...' : 'Update Transaction PIN' }}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  `
})
export class SettingsComponent {
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  isSubmittingPwd = false;
  isSubmittingPin = false;

  showPwdOld = signal(false);
  showPwdNew = signal(false);

  pwdForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  pinForm = {
    oldPin: '',
    newPin: '',
    confirmPin: ''
  };

  submitChangePassword(): void {
    if (!this.pwdForm.oldPassword || !this.pwdForm.newPassword) {
      this.modalService.alert({ title: 'Required Field', message: 'All password fields are required.', type: 'warning' });
      return;
    }
    if (this.pwdForm.newPassword !== this.pwdForm.confirmPassword) {
      this.modalService.alert({ title: 'Password Mismatch', message: 'New Password values do not match.', type: 'warning' });
      return;
    }
    if (this.pwdForm.newPassword.length < 6) {
      this.modalService.alert({ title: 'Too Short', message: 'Password must be at least 6 characters.', type: 'warning' });
      return;
    }

    this.isSubmittingPwd = true;
    this.accountService.changePassword(this.pwdForm).subscribe({
      next: () => {
        this.isSubmittingPwd = false;
        this.modalService.alert({ title: 'Password Updated', message: 'Your login password has been successfully updated.', type: 'success' });
        this.pwdForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: (err) => {
        this.isSubmittingPwd = false;
        this.modalService.alert({ title: 'Update Failed', message: err.error?.message || 'Could not update password.', type: 'danger' });
      }
    });
  }

  submitChangePin(): void {
    if (!this.pinForm.oldPin || !this.pinForm.newPin) {
      this.modalService.alert({ title: 'Required Field', message: 'All PIN fields are required.', type: 'warning' });
      return;
    }
    if (this.pinForm.newPin !== this.pinForm.confirmPin) {
      this.modalService.alert({ title: 'PIN Mismatch', message: 'PIN confirmation values do not match.', type: 'warning' });
      return;
    }

    this.isSubmittingPin = true;
    this.accountService.changePin(this.pinForm).subscribe({
      next: () => {
        this.isSubmittingPin = false;
        this.modalService.alert({ title: 'PIN Updated', message: 'Your 4-6 digit security PIN has been successfully updated.', type: 'success' });
        this.pinForm = { oldPin: '', newPin: '', confirmPin: '' };
      },
      error: (err) => {
        this.isSubmittingPin = false;
        this.modalService.alert({ title: 'Update Failed', message: err.error?.message || 'Could not update PIN.', type: 'danger' });
      }
    });
  }
}
