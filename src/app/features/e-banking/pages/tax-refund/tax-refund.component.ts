import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { TaxRefund } from '../../../../core/models/bank.models';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-tax-refund',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 lg:space-y-8 animate-fade-in">
      
      <!-- Top Hero Banner -->
      <div class="rounded-2xl p-6 sm:p-8 bg-[#003432] text-white relative overflow-hidden shadow-xs">
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div class="space-y-1.5 max-w-xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/30">
              <span>Federal Tax Clearance Gateway</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">IRS Tax Refund &amp; Rebate Tracker</h1>
            <p class="text-xs sm:text-sm text-slate-300">
              Direct Treasury automated disbursement pipeline. Connect your federal electronic filing identifier to track refund stages in real-time.
            </p>
          </div>

          <button (click)="openClaimModal()" 
                  class="bg-white hover:bg-slate-100 text-[#003432] px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition">
            <span>+ File / Track Refund</span>
          </button>
        </div>
      </div>

      <!-- Live Stepper for Latest Active Refund -->
      @if (activeClaim(); as claim) {
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span class="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Active Refund Claim</span>
              <h2 class="text-lg font-black text-[#003432] font-mono">{{ claim.filing_id }}</h2>
              <div class="text-xs text-slate-500">Tax Year: {{ claim.tax_year }} &bull; SSN/TIN: {{ claim.ssn_tin_masked }}</div>
            </div>
            <div class="text-right">
              <span class="text-[10px] uppercase font-bold text-slate-400">Expected Disbursement</span>
              <div class="text-2xl font-black text-emerald-600 font-tabular">&#36;{{ claim.expected_amount | number:'1.2-2' }}</div>
            </div>
          </div>

          <!-- 4-Stage Visual Progress Bar -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            
            <!-- Step 1: Received -->
            <div class="p-4 rounded-xl border transition"
                 [ngClass]="getStepClass(claim.refund_stage, 1)">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                      [ngClass]="isStepCompleted(claim.refund_stage, 1) ? 'bg-[#003432] text-white' : 'bg-slate-200 text-slate-600'">1</span>
                <span class="font-extrabold text-xs">Return Received</span>
              </div>
              <p class="text-[11px] text-slate-500">Form 1040 processed by automated intake gateway.</p>
            </div>

            <!-- Step 2: Under Review -->
            <div class="p-4 rounded-xl border transition"
                 [ngClass]="getStepClass(claim.refund_stage, 2)">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                      [ngClass]="isStepCompleted(claim.refund_stage, 2) ? 'bg-[#003432] text-white' : 'bg-slate-200 text-slate-600'">2</span>
                <span class="font-extrabold text-xs">Under Review</span>
              </div>
              <p class="text-[11px] text-slate-500">Withholding calculation and anti-fraud verification.</p>
            </div>

            <!-- Step 3: Approved -->
            <div class="p-4 rounded-xl border transition"
                 [ngClass]="getStepClass(claim.refund_stage, 3)">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                      [ngClass]="isStepCompleted(claim.refund_stage, 3) ? 'bg-[#003432] text-white' : 'bg-slate-200 text-slate-600'">3</span>
                <span class="font-extrabold text-xs">Refund Approved</span>
              </div>
              <p class="text-[11px] text-slate-500">Authorized for direct electronic bank deposit.</p>
            </div>

            <!-- Step 4: Disbursed -->
            <div class="p-4 rounded-xl border transition"
                 [ngClass]="getStepClass(claim.refund_stage, 4)">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                      [ngClass]="isStepCompleted(claim.refund_stage, 4) ? 'bg-[#003432] text-white' : 'bg-slate-200 text-slate-600'">4</span>
                <span class="font-extrabold text-xs">Funds Disbursed</span>
              </div>
              <p class="text-[11px] text-slate-500">Credited to your VaultProvenance checking account.</p>
            </div>

          </div>

          <!-- Notes Callout -->
          @if (claim.notes) {
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
              <span class="text-base">ℹ️</span>
              <div>
                <strong class="font-bold text-slate-900 block mb-0.5">IRS Clearing Desk Status Update:</strong>
                {{ claim.notes }}
              </div>
            </div>
          }
        </div>
      }

      <!-- Filed Tax Claims History -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-base font-extrabold text-[#003432]">Tax Returns &amp; Refund History</h2>
            <p class="text-xs text-slate-500">Official filing identifiers linked to your VaultProvenance profile.</p>
          </div>
          <button (click)="loadClaims()" class="p-2 text-slate-400 hover:text-[#003432] transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
        </div>

        @if (claims().length === 0) {
          <div class="p-12 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
              🏛️
            </div>
            <div class="text-sm font-bold text-slate-800">No tax claims on record</div>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">Click "File / Track Refund" to simulate or connect your annual tax return direct deposit.</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th class="px-5 py-3.5">Filing ID</th>
                  <th class="px-5 py-3.5">Tax Year</th>
                  <th class="px-5 py-3.5">Expected Refund</th>
                  <th class="px-5 py-3.5">Stage</th>
                  <th class="px-5 py-3.5">Filing Status</th>
                  <th class="px-5 py-3.5">Submission Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                @for (c of claims(); track c.id) {
                  <tr class="hover:bg-slate-50/60 transition cursor-pointer" (click)="activeClaim.set(c)">
                    <td class="px-5 py-4 font-mono font-bold text-[#003432]">{{ c.filing_id }}</td>
                    <td class="px-5 py-4 font-bold text-slate-800">{{ c.tax_year }}</td>
                    <td class="px-5 py-4 font-tabular font-bold text-emerald-600">&#36;{{ c.expected_amount | number:'1.2-2' }}</td>
                    <td class="px-5 py-4">
                      @if (c.refund_stage === 'DISBURSED') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Disbursed to Account ✓
                        </span>
                      } @else if (c.refund_stage === 'APPROVED') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      } @else if (c.refund_stage === 'UNDER_REVIEW') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                          Under Review
                        </span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Received
                        </span>
                      }
                    </td>
                    <td class="px-5 py-4 text-slate-500">{{ c.filing_status }}</td>
                    <td class="px-5 py-4 text-slate-500 whitespace-nowrap">{{ c.created_at | date:'mediumDate' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- New Tax Refund Modal -->
      @if (showClaimModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-lg font-black text-[#003432]">File Tax Refund Direct Deposit</h3>
                <p class="text-xs text-slate-500">Route your federal or state refund directly into your vault.</p>
              </div>
              <button (click)="showClaimModal.set(false)" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
            </div>

            <form (ngSubmit)="submitTaxClaim()" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tax Year</label>
                  <select [(ngModel)]="claimForm.taxYear" name="taxYear" 
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                    <option value="2025">2025 (Current Filing)</option>
                    <option value="2024">2024 (Prior Year)</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Filing Status</label>
                  <select [(ngModel)]="claimForm.filingStatus" name="filingStatus" 
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED_JOINT">Married Filing Jointly</option>
                    <option value="HEAD_OF_HOUSEHOLD">Head of Household</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Expected Refund Amount (USD)</label>
                <div class="relative">
                  <span class="absolute left-4 top-2.5 text-sm font-bold text-slate-400">$</span>
                  <input type="number" [(ngModel)]="claimForm.expectedAmount" name="amount" min="100" step="any" required
                         placeholder="3450.00"
                         class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none font-tabular">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">SSN / TIN (Masked for Security)</label>
                <input type="text" [(ngModel)]="claimForm.ssnTinMasked" name="ssn"
                       placeholder="***-**-5192"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" (click)="showClaimModal.set(false)" 
                        class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" [disabled]="submitting()"
                        class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition">
                  <span>{{ submitting() ? 'Filing...' : 'Submit Refund Claim' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class TaxRefundComponent implements OnInit {
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  claims = signal<TaxRefund[]>([]);
  activeClaim = signal<TaxRefund | null>(null);
  showClaimModal = signal<boolean>(false);
  submitting = signal<boolean>(false);

  claimForm = {
    taxYear: '2025',
    filingStatus: 'SINGLE' as 'SINGLE' | 'MARRIED_JOINT' | 'HEAD_OF_HOUSEHOLD',
    expectedAmount: '4250',
    ssnTinMasked: '***-**-4892'
  };

  ngOnInit() {
    this.loadClaims();
  }

  loadClaims() {
    this.accountService.listUserTaxRefunds().subscribe({
      next: (res) => {
        if (res.success) {
          this.claims.set(res.data);
          if (res.data.length > 0 && !this.activeClaim()) {
            this.activeClaim.set(res.data[0]);
          }
        }
      }
    });
  }

  getStepIndex(stage: string): number {
    switch (stage) {
      case 'RECEIVED': return 1;
      case 'UNDER_REVIEW': return 2;
      case 'APPROVED': return 3;
      case 'DISBURSED': return 4;
      default: return 1;
    }
  }

  isStepCompleted(stage: string, step: number): boolean {
    return this.getStepIndex(stage) >= step;
  }

  getStepClass(stage: string, step: number): string {
    const cur = this.getStepIndex(stage);
    if (cur > step) {
      return 'bg-teal-50 border-teal-200 text-slate-800';
    } else if (cur === step) {
      return 'bg-white border-[#003432] shadow-xs ring-2 ring-[#003432]/10 text-slate-900';
    } else {
      return 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
    }
  }

  openClaimModal() {
    this.showClaimModal.set(true);
  }

  submitTaxClaim() {
    const amt = parseFloat(this.claimForm.expectedAmount);
    if (isNaN(amt) || amt <= 0) {
      this.modalService.alert({ title: 'Invalid Amount', message: 'Please enter a valid refund amount.', type: 'danger' });
      return;
    }

    this.submitting.set(true);
    this.accountService.claimTaxRefund({
      taxYear: this.claimForm.taxYear,
      expectedAmount: amt,
      filingStatus: this.claimForm.filingStatus,
      ssnTinMasked: this.claimForm.ssnTinMasked
    }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.showClaimModal.set(false);
        this.modalService.alert({
          title: 'Tax Claim Registered',
          message: `Your ${this.claimForm.taxYear} tax refund claim has been queued. Tracking ID: ${res.data.filingId}`,
          type: 'success'
        });
        this.loadClaims();
      },
      error: (err) => {
        this.submitting.set(false);
        this.modalService.alert({
          title: 'Filing Failed',
          message: err.error?.message || 'Could not submit tax claim.',
          type: 'danger'
        });
      }
    });
  }
}
