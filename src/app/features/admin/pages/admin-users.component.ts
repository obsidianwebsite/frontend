import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in font-sans">
      
      <!-- Top Title & Search / Filter Controls -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432] tracking-tight">Customer Accounts &amp; Clearance Control</h1>
          <p class="text-xs text-slate-500 mt-1">
            Manage multi-balances (Vault, Savings, Bonus, ROI), KYC compliance, clearance codes, and 1-click customer login.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Search Input -->
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">🔍</span>
            <input [(ngModel)]="searchQuery"
                   (input)="applyFilters()"
                   type="text"
                   placeholder="Search name, email, account..."
                   class="bg-white border border-slate-300 rounded-xl pl-8 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003432] focus:border-transparent w-56 sm:w-64 shadow-xs">
          </div>

          <!-- Status Filter -->
          <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-bold">
            <button (click)="setStatusFilter('')"
                    [ngClass]="statusFilter() === '' ? 'bg-[#003432] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                    class="px-2.5 py-1.5 rounded-lg transition">All</button>
            <button (click)="setStatusFilter('ACTIVE')"
                    [ngClass]="statusFilter() === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                    class="px-2.5 py-1.5 rounded-lg transition">Active</button>
            <button (click)="setStatusFilter('INACTIVE')"
                    [ngClass]="statusFilter() === 'INACTIVE' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                    class="px-2.5 py-1.5 rounded-lg transition">Inactive</button>
          </div>

          <!-- Compose Custom Email Button -->
          <button (click)="openCustomEmailModal(null)"
                  class="bg-[#003432] hover:bg-[#002625] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 border border-teal-600/30 shrink-0">
            <span>✉️</span>
            <span>Compose Client Email</span>
          </button>
        </div>
      </div>

      <!-- Users Grid / Table -->
      @if (filteredUsers().length > 0) {
        <div class="space-y-4">
          @for (u of filteredUsers(); track u.id) {
            <div class="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition space-y-4">
              
              <!-- Customer Header & Impersonation Button -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#003432] to-[#0BB4D2] flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
                    {{ u.first_name?.charAt(0) }}{{ u.last_name?.charAt(0) }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-bold text-base text-slate-900 font-nunito">{{ u.first_name }} {{ u.last_name }}</h3>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                            [ngClass]="u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-700 border border-slate-200'">
                        {{ u.role }}
                      </span>
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            [ngClass]="{
                              'bg-emerald-50 text-emerald-700 border border-emerald-200': u.status === 'ACTIVE',
                              'bg-amber-50 text-amber-700 border border-amber-200': u.status === 'INACTIVE',
                              'bg-red-50 text-red-700 border border-red-200': u.status === 'SUSPENDED'
                            }">
                        {{ u.status }}
                      </span>
                      <!-- KYC Status Badge -->
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                            [ngClass]="{
                              'bg-emerald-50 text-emerald-700 border border-emerald-200': u.kyc_status === 'VERIFIED',
                              'bg-amber-50 text-amber-700 border border-amber-200': u.kyc_status === 'PENDING',
                              'bg-rose-50 text-rose-700 border border-rose-200': u.kyc_status === 'REJECTED',
                              'bg-slate-100 text-slate-600 border border-slate-200': !u.kyc_status || u.kyc_status === 'UNVERIFIED'
                            }">
                        KYC: {{ u.kyc_status || 'VERIFIED' }}
                      </span>
                    </div>
                    <div class="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-3">
                      <span>✉️ {{ u.email }}</span>
                      <span>📞 {{ u.phone || 'N/A' }}</span>
                      @if (u.city || u.state) {
                        <span>📍 {{ u.city }}, {{ u.state }}</span>
                      }
                    </div>
                  </div>
                </div>

                <!-- Impersonation Action Pill -->
                <div class="flex items-center gap-2 self-start sm:self-auto">
                  <button (click)="impersonateUser(u)"
                          [disabled]="actionLoading()"
                          class="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#003432] text-xs font-bold transition flex items-center gap-2 shadow-xs">
                    <span>⚡</span>
                    <span>Log in as Customer</span>
                  </button>
                </div>
              </div>

              <!-- Multi-Balance Financial Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-tabular">
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold uppercase">Main Vault Balance:</span>
                  <strong class="text-base text-[#003432] font-nunito font-bold block mt-0.5">
                    &#36;{{ (u.available_balance || 0) | number:'1.2-2' }}
                  </strong>
                  <span class="text-[10px] text-slate-400 font-sans">Book: &#36;{{ (u.ledger_balance || 0) | number:'1.2-2' }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold uppercase">Savings Balance:</span>
                  <strong class="text-base text-teal-700 font-bold block mt-0.5">
                    &#36;{{ (u.savings_balance || 0) | number:'1.2-2' }}
                  </strong>
                  <span class="text-[10px] text-slate-400 font-sans">Compounding 4.5%</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold uppercase">Investment ROI:</span>
                  <strong class="text-base text-indigo-700 font-bold block mt-0.5">
                    &#36;{{ (u.investment_earnings || 0) | number:'1.2-2' }}
                  </strong>
                  <span class="text-[10px] text-slate-400 font-sans">Accrued Yield</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold uppercase">Bonus Balance:</span>
                  <strong class="text-base text-amber-700 font-bold block mt-0.5">
                    &#36;{{ (u.bonus_balance || 0) | number:'1.2-2' }}
                  </strong>
                  <span class="text-[10px] text-slate-400 font-sans">Promo Credit</span>
                </div>
              </div>

              <!-- Clearance Codes & Account Details Strip -->
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex flex-wrap items-center gap-3">
                  <span class="text-slate-500">Account: <strong class="font-mono text-slate-800">{{ u.account_number || 'N/A' }}</strong></span>
                  <span class="text-slate-300">&bull;</span>
                  <span class="text-slate-500">COT: <strong class="font-mono text-[#003432]">{{ u.cot_code || 'COT-7749' }}</strong></span>
                  <span class="text-slate-300">&bull;</span>
                  <span class="text-slate-500">Tax: <strong class="font-mono text-[#003432]">{{ u.tax_code || 'TAX-8821' }}</strong></span>
                  <span class="text-slate-300">&bull;</span>
                  <span class="text-slate-500">IMF: <strong class="font-mono text-[#003432]">{{ u.imf_code || 'IMF-9904' }}</strong></span>
                </div>

                <button (click)="openClearanceModal(u)" 
                        class="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 transition shadow-xs">
                  Edit Codes ⚙️
                </button>
              </div>

              <!-- Quick Control Actions -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div class="text-[11px] text-slate-400 font-mono">
                  User ID: <span class="text-slate-600">{{ u.id }}</span>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <!-- Send Custom Email -->
                  <button (click)="openCustomEmailModal(u)"
                          class="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-xs font-bold text-[#003432] transition flex items-center gap-1.5 shadow-xs">
                    <span>✉️</span>
                    <span>Send Email</span>
                  </button>

                  <!-- Adjust Balance (Credit / Debit) -->
                  <button (click)="openBalanceModal(u)"
                          class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-xs">
                    <span>💳</span>
                    <span>Adjust Balance</span>
                  </button>

                  <!-- KYC Status Modal -->
                  <button (click)="openKycModal(u)"
                          class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-emerald-700 transition flex items-center gap-1.5 shadow-xs">
                    <span>🛡️</span>
                    <span>KYC Review</span>
                  </button>

                  <!-- Reset PIN -->
                  <button (click)="openResetPinModal(u)"
                          class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-teal-700 transition flex items-center gap-1.5 shadow-xs">
                    <span>🔑</span>
                    <span>Reset PIN</span>
                  </button>

                  <!-- Toggle Status (Active / Inactive) -->
                  @if (u.status === 'ACTIVE') {
                    <button (click)="toggleStatus(u, 'INACTIVE')"
                            class="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 transition flex items-center gap-1.5 shadow-xs">
                      <span>⏸️</span>
                      <span>Deactivate (Lock)</span>
                    </button>
                  } @else {
                    <button (click)="toggleStatus(u, 'ACTIVE')"
                            class="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-700 transition flex items-center gap-1.5 shadow-xs">
                      <span>▶️</span>
                      <span>Activate Account</span>
                    </button>
                  }
                </div>
              </div>

            </div>
          }
        </div>
      } @else {
        <div class="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div class="text-3xl mb-2">👥</div>
          <h3 class="text-base font-bold text-slate-900 font-nunito">No Customers Found</h3>
          <p class="text-xs text-slate-400 mt-1">Try adjusting your search query or status filter.</p>
        </div>
      }

    </div>

    <!-- Balance Adjustment Modal -->
    @if (activeBalanceModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
        <div class="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
          
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold font-nunito text-[#003432] flex items-center gap-2">
              <span>💳</span>
              <span>Manual Financial Adjustment</span>
            </h3>
            <button (click)="closeBalanceModal()" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block font-medium">Customer:</span>
              <strong class="text-slate-800 text-sm">{{ selectedUser()?.first_name }} {{ selectedUser()?.last_name }}</strong>
            </div>

            <!-- Target Balance Type Selector -->
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Target Balance Ledger:</label>
              <select [(ngModel)]="balanceType" 
                      class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:ring-2 focus:ring-[#003432] outline-none">
                <option value="MAIN">Primary Checking Vault Balance</option>
                <option value="SAVINGS">Savings Account Balance</option>
                <option value="EARNINGS">Investment ROI Earnings</option>
                <option value="BONUS">Bonus Promotion Balance</option>
              </select>
            </div>

            <!-- Credit vs Debit Segment -->
            <div class="grid grid-cols-2 gap-2">
              <button (click)="adjustmentType = 'CREDIT'"
                      [ngClass]="adjustmentType === 'CREDIT' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600'"
                      class="py-2.5 rounded-xl text-center text-xs transition">
                &plus; CREDIT (Deposit)
              </button>
              <button (click)="adjustmentType = 'DEBIT'"
                      [ngClass]="adjustmentType === 'DEBIT' ? 'bg-red-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600'"
                      class="py-2.5 rounded-xl text-center text-xs transition">
                &minus; DEBIT (Withdraw)
              </button>
            </div>

            <!-- Amount Input -->
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Adjustment Amount ($ USD):</label>
              <input [(ngModel)]="adjustAmount"
                     type="number"
                     step="0.01"
                     min="1"
                     placeholder="e.g. 5000.00"
                     class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono text-sm font-bold focus:ring-2 focus:ring-[#003432] outline-none">
            </div>

            <!-- Narration Input -->
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Audit Narration / Memo:</label>
              <input [(ngModel)]="adjustNarration"
                     type="text"
                     placeholder="e.g. Administrative Credit / Balance Correction"
                     class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs focus:ring-2 focus:ring-[#003432] outline-none">
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button (click)="closeBalanceModal()"
                    [disabled]="actionLoading()"
                    class="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition">
              Cancel
            </button>
            <button (click)="submitBalanceAdjustment()"
                    [disabled]="actionLoading() || !adjustAmount || adjustAmount <= 0"
                    class="theme_btn apply_btn py-2 px-5 rounded-xl text-xs font-bold shadow-xs transition">
              {{ actionLoading() ? 'Updating...' : 'Post Adjustment' }}
            </button>
          </div>

        </div>
      </div>
    }

    <!-- KYC Review Modal -->
    @if (activeKycModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
        <div class="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold font-nunito text-[#003432] flex items-center gap-2">
              <span>🛡️</span> <span>KYC Compliance Review</span>
            </h3>
            <button (click)="activeKycModal.set(false)" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
          </div>

          <div class="space-y-4 text-xs">
            <p class="text-slate-600">
              Update identity verification status for <strong>{{ selectedUser()?.first_name }} {{ selectedUser()?.last_name }}</strong>.
            </p>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">Verification Status:</label>
              <select [(ngModel)]="newKycStatus" 
                      class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:ring-2 focus:ring-[#003432] outline-none">
                <option value="VERIFIED">VERIFIED (Full Clearance)</option>
                <option value="PENDING">PENDING (Documents Under Review)</option>
                <option value="UNVERIFIED">UNVERIFIED</option>
                <option value="REJECTED">REJECTED (Restricted)</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button (click)="activeKycModal.set(false)" class="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold">Cancel</button>
            <button (click)="submitKycUpdate()" class="theme_btn apply_btn py-2 px-5 rounded-xl text-xs font-bold text-white shadow-xs">Update KYC</button>
          </div>
        </div>
      </div>
    }

    <!-- Clearance Codes Modal -->
    @if (activeClearanceModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
        <div class="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold font-nunito text-[#003432] flex items-center gap-2">
              <span>⚙️</span> <span>Transfer Clearance Codes</span>
            </h3>
            <button (click)="activeClearanceModal.set(false)" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Cost of Transfer (COT) Code:</label>
              <input type="text" [(ngModel)]="codesForm.cotCode" 
                     class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 font-mono font-bold focus:ring-2 focus:ring-[#003432] outline-none">
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Tax Clearance Code:</label>
              <input type="text" [(ngModel)]="codesForm.taxCode" 
                     class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 font-mono font-bold focus:ring-2 focus:ring-[#003432] outline-none">
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">IMF / AML Clearance Code:</label>
              <input type="text" [(ngModel)]="codesForm.imfCode" 
                     class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 font-mono font-bold focus:ring-2 focus:ring-[#003432] outline-none">
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button (click)="activeClearanceModal.set(false)" class="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold">Cancel</button>
            <button (click)="submitClearanceCodes()" class="theme_btn apply_btn py-2 px-5 rounded-xl text-xs font-bold text-white shadow-xs">Save Codes</button>
          </div>
        </div>
      </div>
    }

    <!-- Reset PIN Modal -->
    @if (activePinModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
        <div class="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl space-y-5">
          
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold font-nunito text-[#003432] flex items-center gap-2">
              <span>🔑</span>
              <span>Reset Transaction PIN</span>
            </h3>
            <button (click)="closePinModal()" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
          </div>

          <div class="space-y-4 text-xs">
            <p class="text-slate-600">
              Set a new 4-digit transaction PIN for customer <strong>{{ selectedUser()?.first_name }} {{ selectedUser()?.last_name }}</strong>.
            </p>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">New 4-Digit PIN:</label>
              <input [(ngModel)]="newPin"
                     type="password"
                     maxlength="6"
                     placeholder="e.g. 1234"
                     class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono text-center tracking-widest text-lg font-bold focus:ring-2 focus:ring-[#003432] outline-none">
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button (click)="closePinModal()"
                    [disabled]="actionLoading()"
                    class="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition">
              Cancel
            </button>
            <button (click)="submitPinReset()"
                    [disabled]="actionLoading() || !newPin || newPin.length < 4"
                    class="theme_btn apply_btn py-2 px-5 rounded-xl text-xs font-bold text-white shadow-xs transition">
              {{ actionLoading() ? 'Updating...' : 'Set New PIN' }}
            </button>
          </div>

        </div>
      </div>
    }

    <!-- Customizable Client Email Modal -->
    @if (activeEmailModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
        <div class="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
          
          <!-- Modal Top Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-teal-100 text-[#003432] text-[10px] font-black uppercase tracking-wider">
                  Resend Direct API
                </span>
                <span class="text-xs font-bold text-slate-500">Executive Correspondence Composer</span>
              </div>
              <h3 class="text-lg font-bold font-nunito text-[#003432] mt-0.5">
                Send Branded Banking Email to Client
              </h3>
            </div>
            <button (click)="closeEmailModal()" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
          </div>

          <!-- Modal Body Grid: Left Controls (7 cols) + Right Preview (5 cols) -->
          <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- Left Form Controls (7 cols) -->
            <div class="lg:col-span-7 space-y-4 text-xs">
              
              <!-- Quick Preset Buttons -->
              <div>
                <label class="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  Institutional Letter Presets:
                </label>
                <div class="flex flex-wrap gap-1.5">
                  <button type="button" (click)="applyPreset('KYC')"
                          class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition">
                    🛡️ KYC Verification
                  </button>
                  <button type="button" (click)="applyPreset('WIRE')"
                          class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition">
                    ⚡ Wire Clearance
                  </button>
                  <button type="button" (click)="applyPreset('TAX')"
                          class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition">
                    📋 Tax Certification
                  </button>
                  <button type="button" (click)="applyPreset('SECURITY')"
                          class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition">
                    🔒 Security Advisory
                  </button>
                  <button type="button" (click)="applyPreset('BLANK')"
                          class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition">
                    ✏️ Blank
                  </button>
                </div>
              </div>

              <!-- Customer Selector Dropdown -->
              <div>
                <label class="block text-slate-700 font-bold mb-1">Select Customer Recipient:</label>
                <select (change)="onSelectCustomer($event)"
                        class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-[#003432] outline-none">
                  <option value="">-- Choose Loaded Customer or Enter Below --</option>
                  @for (cust of allUsers(); track cust.id) {
                    <option [value]="cust.id" [selected]="selectedUser()?.id === cust.id">
                      {{ cust.first_name }} {{ cust.last_name }} ({{ cust.email }})
                    </option>
                  }
                </select>
              </div>

              <!-- Recipient & Name Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-700 font-bold mb-1">Recipient Email *:</label>
                  <input [(ngModel)]="emailForm.recipientEmail"
                         type="email" required
                         placeholder="client@example.com"
                         class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-[#003432] outline-none">
                </div>
                <div>
                  <label class="block text-slate-700 font-bold mb-1">Client Full Name:</label>
                  <input [(ngModel)]="emailForm.customerName"
                         type="text"
                         placeholder="e.g. Alexander Vance"
                         class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-[#003432] outline-none">
                </div>
              </div>

              <!-- Badge Tag & Officer Sign-off -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-700 font-bold mb-1">Email Category Badge:</label>
                  <input [(ngModel)]="emailForm.badgeText"
                         type="text"
                         placeholder="OFFICIAL ADVISORY"
                         class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold uppercase focus:ring-2 focus:ring-[#003432] outline-none">
                </div>
                <div>
                  <label class="block text-slate-700 font-bold mb-1">Dispatching Officer / Desk:</label>
                  <input [(ngModel)]="emailForm.senderOfficerName"
                         type="text"
                         placeholder="Executive Compliance Directorate"
                         class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-[#003432] outline-none">
                </div>
              </div>

              <!-- Subject & Headline -->
              <div>
                <label class="block text-slate-700 font-bold mb-1">Email Subject *:</label>
                <input [(ngModel)]="emailForm.subject"
                       type="text" required
                       placeholder="e.g. Important Regulatory Compliance Update"
                       class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold focus:ring-2 focus:ring-[#003432] outline-none">
              </div>

              <div>
                <label class="block text-slate-700 font-bold mb-1">Email Headline / Header:</label>
                <input [(ngModel)]="emailForm.headline"
                       type="text"
                       placeholder="e.g. Action Required: Proof of Address Verification"
                       class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold focus:ring-2 focus:ring-[#003432] outline-none">
              </div>

              <!-- Message Body -->
              <div>
                <label class="block text-slate-700 font-bold mb-1">Message Content *:</label>
                <textarea [(ngModel)]="emailForm.bodyText" rows="5" required
                          placeholder="Compose official letter body here..."
                          class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-[#003432] outline-none resize-none leading-relaxed">
                </textarea>
              </div>

              <!-- Action Button Configuration (Optional) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-700 font-bold mb-1">Call-to-Action Label:</label>
                  <input [(ngModel)]="emailForm.callToActionLabel"
                         type="text"
                         placeholder="Access Client Portal &rarr;"
                         class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-[#003432] outline-none">
                </div>
                <div>
                  <label class="block text-slate-700 font-bold mb-1">Call-to-Action URL:</label>
                  <input [(ngModel)]="emailForm.callToActionUrl"
                         type="text"
                         placeholder="http://localhost:4200/e-banking/overview"
                         class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-[#003432] outline-none">
                </div>
              </div>

            </div>

            <!-- Right Live Preview (5 cols) -->
            <div class="lg:col-span-5 bg-slate-100/90 rounded-2xl p-4 border border-slate-200 space-y-3 shrink-0">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Live Email Preview</span>
                <span class="px-2 py-0.5 rounded-full bg-white text-slate-600 font-bold text-[10px] border border-slate-200">
                  Resend HTML Canvas
                </span>
              </div>

              <!-- Branded Box Mockup -->
              <div class="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden text-xs">
                <!-- Mock Header -->
                <div class="bg-[#003432] p-4 text-center border-b-2 border-[#0BB4D2]">
                  <div class="inline-block bg-[#0BB4D2] text-[#003432] font-black text-[10px] px-2 py-0.5 rounded mb-1">VA</div>
                  <h4 class="text-white font-extrabold text-sm m-0">VaultProvenance Bank Plc</h4>
                  <div class="text-[#5eead4] text-[9px] uppercase tracking-wider mt-0.5">Commercial Banking &amp; Institutional Treasury</div>
                </div>

                <!-- Mock Body -->
                <div class="p-4 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full bg-[#003432] text-[#5eead4] text-[9px] font-black uppercase">
                      {{ emailForm.badgeText || 'OFFICIAL NOTICE' }}
                    </span>
                    <span class="text-[9px] text-slate-400">Live Preview</span>
                  </div>

                  <h5 class="text-sm font-extrabold text-[#003432] leading-snug">
                    {{ emailForm.headline || emailForm.subject || 'Letter Headline' }}
                  </h5>

                  <p class="text-slate-600 text-xs">
                    Dear <strong>{{ emailForm.customerName || 'Valued Client' }}</strong>,
                  </p>

                  <div class="text-slate-700 text-xs leading-relaxed whitespace-pre-line bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {{ emailForm.bodyText || 'Your message body will be rendered here with official VaultProvenance styling.' }}
                  </div>

                  <!-- Officer Signoff -->
                  <div class="p-2.5 rounded-xl bg-teal-50/60 border-l-3 border-[#0BB4D2] text-[10px]">
                    <span class="text-teal-800 font-bold uppercase block text-[8px]">Institutional Sign-off</span>
                    <strong class="text-[#003432] block">{{ emailForm.senderOfficerName || 'VaultProvenance Directorate' }}</strong>
                  </div>

                  <!-- CTA Button -->
                  <div class="text-center pt-1">
                    <span class="inline-block bg-[#003432] text-white text-[11px] font-bold px-4 py-2 rounded-xl">
                      {{ emailForm.callToActionLabel || 'Access Client Portal &rarr;' }}
                    </span>
                  </div>
                </div>

                <!-- Mock Footer -->
                <div class="bg-slate-50 p-3 text-center text-[9px] text-slate-400 border-t border-slate-100">
                  🔒 256-Bit SSL Encrypted Banking Communication &bull; VaultProvenance Bank Plc
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Action Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
            <span class="text-[11px] text-slate-500">
              Dispatched via configured Resend API Gateway.
            </span>
            <div class="flex items-center gap-3">
              <button (click)="closeEmailModal()"
                      [disabled]="isDispatchingEmail()"
                      class="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition">
                Cancel
              </button>
              <button (click)="submitCustomEmail()"
                      [disabled]="isDispatchingEmail() || !emailForm.recipientEmail || !emailForm.subject || !emailForm.bodyText"
                      class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 disabled:opacity-40">
                @if (isDispatchingEmail()) {
                  <div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Dispatching via Resend...</span>
                } @else {
                  <span>✉️ Dispatch Official Email</span>
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);

  allUsers = signal<any[]>([]);
  filteredUsers = signal<any[]>([]);
  searchQuery: string = '';
  statusFilter = signal<string>('');
  loading = signal<boolean>(false);
  actionLoading = signal<boolean>(false);

  // Modals state
  activeBalanceModal = signal<boolean>(false);
  activePinModal = signal<boolean>(false);
  activeKycModal = signal<boolean>(false);
  activeClearanceModal = signal<boolean>(false);
  activeEmailModal = signal<boolean>(false);
  isDispatchingEmail = signal<boolean>(false);
  selectedUser = signal<any | null>(null);

  emailForm = {
    recipientEmail: '',
    customerName: '',
    subject: '',
    headline: '',
    badgeText: 'OFFICIAL NOTICE',
    senderOfficerName: 'Executive Compliance Directorate',
    bodyText: '',
    callToActionLabel: 'Access Client Portal →',
    callToActionUrl: 'http://localhost:4200/e-banking/overview'
  };

  balanceType: 'MAIN' | 'SAVINGS' | 'BONUS' | 'EARNINGS' = 'MAIN';
  adjustmentType: 'CREDIT' | 'DEBIT' = 'CREDIT';
  adjustAmount: number | null = null;
  adjustNarration: string = 'Administrative Balance Adjustment';
  newPin: string = '';
  newKycStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED' | 'REJECTED' = 'VERIFIED';

  codesForm = {
    cotCode: 'COT-7749',
    taxCode: 'TAX-8821',
    imfCode: 'IMF-9904'
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.adminService.listUsers().subscribe({
      next: (res) => {
        this.allUsers.set(res.data);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.modalService.alert({
          title: 'Load Failed',
          message: err.error?.message || 'Failed to retrieve customer roster.',
          type: 'danger'
        });
      }
    });
  }

  setStatusFilter(status: string) {
    this.statusFilter.set(status);
    this.applyFilters();
  }

  applyFilters() {
    let result = this.allUsers();
    const query = this.searchQuery.trim().toLowerCase();
    const status = this.statusFilter();

    if (status) {
      result = result.filter(u => u.status === status);
    }

    if (query) {
      result = result.filter(u => 
        (u.first_name && u.first_name.toLowerCase().includes(query)) ||
        (u.last_name && u.last_name.toLowerCase().includes(query)) ||
        (u.email && u.email.toLowerCase().includes(query)) ||
        (u.account_number && u.account_number.toLowerCase().includes(query))
      );
    }

    this.filteredUsers.set(result);
  }

  impersonateUser(u: any) {
    this.actionLoading.set(true);
    this.adminService.impersonateUser(u.id).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        this.authService.impersonate(res.token, res.user, res.account);
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.modalService.alert({
          title: 'Impersonation Failed',
          message: err.error?.message || 'Unable to establish customer impersonation session.',
          type: 'danger'
        });
      }
    });
  }

  toggleStatus(u: any, newStatus: 'ACTIVE' | 'INACTIVE') {
    this.actionLoading.set(true);
    this.adminService.toggleUserStatus(u.id, newStatus).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.modalService.alert({
          title: 'Status Updated',
          message: `Customer ${u.first_name} ${u.last_name} account set to ${newStatus}.`,
          type: 'success'
        });
        this.loadUsers();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.modalService.alert({
          title: 'Update Error',
          message: err.error?.message || 'Failed to update user status.',
          type: 'danger'
        });
      }
    });
  }

  openBalanceModal(u: any) {
    this.selectedUser.set(u);
    this.balanceType = 'MAIN';
    this.adjustmentType = 'CREDIT';
    this.adjustAmount = null;
    this.adjustNarration = 'Administrative Balance Adjustment';
    this.activeBalanceModal.set(true);
  }

  closeBalanceModal() {
    this.activeBalanceModal.set(false);
    this.selectedUser.set(null);
  }

  submitBalanceAdjustment() {
    const u = this.selectedUser();
    if (!u || !this.adjustAmount || this.adjustAmount <= 0) return;

    this.actionLoading.set(true);
    this.adminService.adjustBalance(u.id, {
      accountId: u.account_id,
      type: this.adjustmentType,
      amount: this.adjustAmount,
      balanceType: this.balanceType,
      narration: this.adjustNarration
    }).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        this.closeBalanceModal();
        this.modalService.alert({
          title: 'Balance Adjusted',
          message: res.message || 'Account balance updated successfully.',
          type: 'success'
        });
        this.loadUsers();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.modalService.alert({
          title: 'Adjustment Failed',
          message: err.error?.message || 'Failed to adjust balance.',
          type: 'danger'
        });
      }
    });
  }

  openKycModal(u: any) {
    this.selectedUser.set(u);
    this.newKycStatus = u.kyc_status || 'VERIFIED';
    this.activeKycModal.set(true);
  }

  submitKycUpdate() {
    const u = this.selectedUser();
    if (!u) return;

    this.adminService.updateUserKyc(u.id, this.newKycStatus).subscribe({
      next: (res) => {
        this.activeKycModal.set(false);
        this.modalService.alert({ title: 'KYC Updated', message: res.message, type: 'success' });
        this.loadUsers();
      },
      error: (err) => {
        this.modalService.alert({ title: 'Error', message: err.error?.message || 'Failed to update KYC.', type: 'danger' });
      }
    });
  }

  openClearanceModal(u: any) {
    this.selectedUser.set(u);
    this.codesForm.cotCode = u.cot_code || 'COT-7749';
    this.codesForm.taxCode = u.tax_code || 'TAX-8821';
    this.codesForm.imfCode = u.imf_code || 'IMF-9904';
    this.activeClearanceModal.set(true);
  }

  submitClearanceCodes() {
    const u = this.selectedUser();
    if (!u) return;

    this.adminService.updateClearanceCodes(u.id, this.codesForm).subscribe({
      next: (res) => {
        this.activeClearanceModal.set(false);
        this.modalService.alert({ title: 'Codes Saved', message: res.message, type: 'success' });
        this.loadUsers();
      },
      error: (err) => {
        this.modalService.alert({ title: 'Error', message: err.error?.message || 'Failed to update codes.', type: 'danger' });
      }
    });
  }

  openResetPinModal(u: any) {
    this.selectedUser.set(u);
    this.newPin = '';
    this.activePinModal.set(true);
  }

  closePinModal() {
    this.activePinModal.set(false);
    this.selectedUser.set(null);
  }

  submitPinReset() {
    const u = this.selectedUser();
    if (!u || !this.newPin || this.newPin.length < 4) return;

    this.actionLoading.set(true);
    this.adminService.resetUserPin(u.id, this.newPin).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        this.closePinModal();
        this.modalService.alert({
          title: 'PIN Reset Success',
          message: res.message || 'Transaction PIN has been updated.',
          type: 'success'
        });
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.modalService.alert({
          title: 'Reset Failed',
          message: err.error?.message || 'Failed to reset PIN.',
          type: 'danger'
        });
      }
    });
  }

  openCustomEmailModal(u: any | null) {
    if (u) {
      this.selectedUser.set(u);
      this.emailForm.recipientEmail = u.email || '';
      this.emailForm.customerName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Client';
    } else {
      this.selectedUser.set(null);
      this.emailForm.recipientEmail = '';
      this.emailForm.customerName = '';
    }
    this.applyPreset('KYC');
    this.activeEmailModal.set(true);
  }

  closeEmailModal() {
    this.activeEmailModal.set(false);
  }

  onSelectCustomer(event: any) {
    const userId = event.target.value;
    if (!userId) return;
    const found = this.allUsers().find(u => u.id === userId);
    if (found) {
      this.selectedUser.set(found);
      this.emailForm.recipientEmail = found.email || '';
      this.emailForm.customerName = `${found.first_name || ''} ${found.last_name || ''}`.trim() || 'Client';
    }
  }

  applyPreset(type: 'KYC' | 'WIRE' | 'TAX' | 'SECURITY' | 'BLANK') {
    switch (type) {
      case 'KYC':
        this.emailForm.badgeText = 'KYC COMPLIANCE';
        this.emailForm.subject = 'URGENT: Required KYC Identity & Regulatory Compliance Update';
        this.emailForm.headline = 'Enhanced Due Diligence & Proof of Identity Required';
        this.emailForm.bodyText = `In accordance with Prudential Regulation Authority (PRA) standards and international commercial banking compliance mandates, your VaultProvenance institutional checking account requires periodic identity verification.\n\nPlease log into your client portal and ensure your regulatory documentation, proof of address, and signatory disclosures are current.\n\nFailure to complete this verification within 7 banking business days may result in temporary transaction holds on outward international wire disbursements.`;
        this.emailForm.callToActionLabel = 'Verify Documents in Client Portal →';
        this.emailForm.callToActionUrl = 'http://localhost:4200/e-banking/overview';
        break;
      case 'WIRE':
        this.emailForm.badgeText = 'WIRE CLEARANCE';
        this.emailForm.subject = 'Notice of Cleared Inward International SWIFT Wire Transfer';
        this.emailForm.headline = 'Inward Wire Transfer Cleared & Available on Ledger';
        this.emailForm.bodyText = `We are pleased to inform you that your inward correspondent wire transfer has completed institutional anti-money laundering (AML) screening and has been fully credited to your available balance.\n\nAll funds are immediately accessible for outward disbursements, debit card utilization, or transfer to your high-yield compounding vault.\n\nYou may view and export the authenticated transaction receipt and official bank statement directly from your client workspace.`;
        this.emailForm.callToActionLabel = 'View Official Statement →';
        this.emailForm.callToActionUrl = 'http://localhost:4200/e-banking/statement';
        break;
      case 'TAX':
        this.emailForm.badgeText = 'TAX CLEARANCE';
        this.emailForm.subject = 'IRS Form 1042-S & Foreign Tax Clearance Certification';
        this.emailForm.headline = 'Official Certificate of International Tax Clearance';
        this.emailForm.bodyText = `The VaultProvenance Institutional Tax Clearance Desk has completed verification of your cross-border withholding tax certificates and IRS adjustment dockets.\n\nYour capital has been classified as fully compliant under FATCA & CRS reporting protocols, with no statutory withholding liabilities remaining.\n\nYour certified Tax Compliance Certificate is archived in your portal.`;
        this.emailForm.callToActionLabel = 'Inspect Tax Refund Desk →';
        this.emailForm.callToActionUrl = 'http://localhost:4200/e-banking/tax-refund';
        break;
      case 'SECURITY':
        this.emailForm.badgeText = 'SECURITY NOTICE';
        this.emailForm.subject = 'VaultProvenance Security Advisory: Two-Tier Transaction PIN';
        this.emailForm.headline = 'Institutional Security Advisory & Authentication Check';
        this.emailForm.bodyText = `Our 24/7 automated risk intelligence monitors continuous security health across all private wealth accounts.\n\nAs part of our commitment to safeguarding your treasury assets, we recommend reviewing your authorized devices, confirming your transaction PIN, and rotating passwords periodically.\n\nVaultProvenance officers will never ask for your private PIN over telephone or unverified email.`;
        this.emailForm.callToActionLabel = 'Inspect Security Settings →';
        this.emailForm.callToActionUrl = 'http://localhost:4200/e-banking/settings';
        break;
      case 'BLANK':
        this.emailForm.badgeText = 'OFFICIAL NOTICE';
        this.emailForm.subject = '';
        this.emailForm.headline = '';
        this.emailForm.bodyText = '';
        this.emailForm.callToActionLabel = 'Access Client Portal →';
        this.emailForm.callToActionUrl = 'http://localhost:4200/e-banking/overview';
        break;
    }
  }

  submitCustomEmail() {
    if (!this.emailForm.recipientEmail || !this.emailForm.subject || !this.emailForm.bodyText) {
      this.modalService.alert({
        title: 'Missing Fields',
        message: 'Please provide recipient email, subject line, and message body.',
        type: 'warning'
      });
      return;
    }

    this.isDispatchingEmail.set(true);
    this.adminService.sendCustomEmail(this.emailForm).subscribe({
      next: (res) => {
        this.isDispatchingEmail.set(false);
        this.closeEmailModal();
        this.modalService.alert({
          title: 'Custom Email Dispatched',
          message: res.message || 'Custom email successfully sent to customer via Resend.',
          type: 'success'
        });
      },
      error: (err) => {
        this.isDispatchingEmail.set(false);
        this.modalService.alert({
          title: 'Dispatch Failed',
          message: err.error?.message || 'Failed to dispatch email via Resend.',
          type: 'danger'
        });
      }
    });
  }
}
