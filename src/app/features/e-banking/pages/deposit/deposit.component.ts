import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { ModalService } from '../../../../core/services/modal.service';
import { Deposit } from '../../../../core/models/bank.models';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6 font-sans">
      
      <!-- Top Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432] tracking-tight">Deposit Funds &amp; Inward Settlement</h1>
          <p class="text-xs text-slate-500 mt-1">Submit wire remittances or check scans for account credit.</p>
        </div>
        <a routerLink="/e-banking/fund-transfer" class="theme_btn apply_btn py-2 px-4 rounded-xl text-xs font-bold self-start flex items-center gap-2 shadow-xs">
          <span>&larr; Return to Transfers</span>
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left: Deposit Simulator Submission Form -->
        <div class="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-6">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold font-nunito text-[#003432]">Initiate Inward Remittance</h2>
            <p class="text-xs text-slate-500 mt-0.5">Provide deposit specifications and clearing parameters</p>
          </div>

          <form (ngSubmit)="submitDeposit()" class="space-y-5">
            
            <!-- Method Selector -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Deposit Channel</label>
              <div class="grid grid-cols-3 gap-2">
                <button type="button" (click)="form.method = 'BANK_TRANSFER'"
                        [ngClass]="form.method === 'BANK_TRANSFER' ? 'bg-[#003432] text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'"
                        class="p-3 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1">
                  <span>🏛️</span>
                  <span>Bank Wire</span>
                </button>
                <button type="button" (click)="form.method = 'CHECK_DEPOSIT'"
                        [ngClass]="form.method === 'CHECK_DEPOSIT' ? 'bg-[#003432] text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'"
                        class="p-3 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1">
                  <span>📸</span>
                  <span>Check Scan</span>
                </button>
                <button type="button" (click)="form.method = 'WIRE_DEPOSIT'"
                        [ngClass]="form.method === 'WIRE_DEPOSIT' ? 'bg-[#003432] text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'"
                        class="p-3 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1">
                  <span>🌐</span>
                  <span>Inward Wire</span>
                </button>
              </div>
            </div>

            <!-- Amount & Currency -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Deposit Amount *</label>
                <div class="relative">
                  <span class="absolute left-3.5 top-2.5 text-slate-400 font-bold text-base">$</span>
                  <input type="number" [(ngModel)]="form.amount" name="amount" required min="1" step="0.01"
                         class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 font-tabular text-lg font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] outline-none" placeholder="5000.00">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Currency</label>
                <select [(ngModel)]="form.currency" name="currency" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-[#003432] outline-none">
                  <option value="USD">🇺🇸 USD ($)</option>
                  <option value="EUR">🇪🇺 EUR (€)</option>
                  <option value="GBP">🇬🇧 GBP (£)</option>
                  <option value="NGN">🇳🇬 NGN (₦)</option>
                </select>
              </div>
            </div>

            <!-- Payer Name & Originating Bank -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Remitter / Payer Name *</label>
                <input type="text" [(ngModel)]="form.payerName" name="payerName" required
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-800 focus:ring-2 focus:ring-[#003432] outline-none" placeholder="e.g. Apex Global Logistics LLC">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Originating Bank *</label>
                <input type="text" [(ngModel)]="form.payerBank" name="payerBank" required
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-800 focus:ring-2 focus:ring-[#003432] outline-none" placeholder="e.g. JPMorgan Chase Commercial">
              </div>
            </div>

            <!-- Check Number (Conditional) -->
            @if (form.method === 'CHECK_DEPOSIT') {
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-slate-700 uppercase">Check Serial Number</label>
                  <span class="text-[10px] text-teal-700 font-bold">MICR Front/Back Scanned</span>
                </div>
                <input type="text" [(ngModel)]="form.checkNumber" name="checkNumber"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs bg-white text-slate-800 focus:ring-2 focus:ring-[#003432] outline-none" placeholder="CHK-881920-A">
              </div>
            }

            <!-- Proof Note / Remittance Memo -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Remittance Purpose / Note</label>
              <textarea rows="2" [(ngModel)]="form.proofNote" name="proofNote"
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-300 resize-none text-xs bg-white text-slate-800 focus:ring-2 focus:ring-[#003432] outline-none" placeholder="e.g. Q3 Invoice settlement or corporate disbursement..."></textarea>
            </div>

            <button type="submit" [disabled]="submitting"
                    class="theme_btn apply_btn w-full py-3 rounded-xl text-center text-xs font-bold shadow-xs flex items-center justify-center gap-2">
              @if (submitting) {
                <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting to Clearance Queue...</span>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Submit to Admin Clearance Queue &rarr;</span>
              }
            </button>

          </form>
        </div>

        <!-- Right: Recent Submitted Deposit Status Queue -->
        <div class="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 class="text-base font-bold font-nunito text-[#003432]">Your Submitted Deposits</h2>
              <p class="text-xs text-slate-500 mt-0.5">Live clearance status tracking</p>
            </div>
            <button (click)="loadDeposits()" class="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition">
              <svg class="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Refresh</span>
            </button>
          </div>

          @if (deposits().length > 0) {
            <div class="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              @for (d of deposits(); track d.id) {
                <div class="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-3 shadow-xs">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <div class="font-bold text-base text-slate-900 font-nunito font-tabular">
                        <span>$</span>{{ d.amount | number:'1.2-2' }} <span class="text-xs text-slate-500 font-normal">({{ d.currency }})</span>
                      </div>
                      <div class="text-[11px] text-[#0BB4D2] font-mono mt-0.5 font-bold">{{ d.reference_number }}</div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0"
                          [ngClass]="{
                            'bg-amber-50 text-amber-700 border border-amber-200': d.status === 'PENDING_APPROVAL',
                            'bg-emerald-50 text-emerald-700 border border-emerald-200': d.status === 'APPROVED',
                            'bg-red-50 text-red-700 border border-red-200': d.status === 'REJECTED'
                          }">
                      {{ d.status.replace('_', ' ') }}
                    </span>
                  </div>

                  <div class="text-xs text-slate-600 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div>Payer: <strong class="text-slate-800">{{ d.payer_name || 'Self' }}</strong></div>
                    <div>Bank: <strong class="text-slate-800 truncate">{{ d.payer_bank || 'Inward Wire' }}</strong></div>
                  </div>

                  @if (d.admin_remarks) {
                    <div class="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-xs text-[#003432]">
                      <strong>Admin Remarks:</strong> {{ d.admin_remarks }}
                    </div>
                  }

                  <div class="text-[10px] text-slate-400 text-right font-medium">
                    Submitted: {{ d.created_at | date:'medium' }}
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="p-12 text-center text-slate-400 text-xs">
              <svg class="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <p>No deposit records found. Complete the form above to submit your inward remittance.</p>
            </div>
          }

        </div>

      </div>

    </div>
  `
})
export class DepositComponent implements OnInit {
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  deposits = signal<Deposit[]>([]);
  submitting = false;

  form = {
    method: 'BANK_TRANSFER' as 'BANK_TRANSFER' | 'CHECK_DEPOSIT' | 'WIRE_DEPOSIT',
    amount: null as number | null,
    currency: 'USD',
    payerName: '',
    payerBank: '',
    checkNumber: '',
    proofNote: ''
  };

  ngOnInit(): void {
    this.loadDeposits();
  }

  loadDeposits(): void {
    this.accountService.listUserDeposits().subscribe({
      next: (res) => {
        if (res.data) {
          this.deposits.set(res.data);
        }
      }
    });
  }

  submitDeposit(): void {
    if (!this.form.amount || this.form.amount <= 0) {
      this.modalService.alert('Invalid Amount', 'Please provide a valid deposit amount greater than zero.', 'warning');
      return;
    }
    if (!this.form.payerName || !this.form.payerBank) {
      this.modalService.alert('Missing Remitter Info', 'Remitter name and originating bank are required for regulatory tracking.', 'warning');
      return;
    }

    this.submitting = true;
    this.accountService.createDeposit({
      ...this.form,
      amount: this.form.amount
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.modalService.alert(
          'Deposit Received',
          `Your deposit of $${this.form.amount} has been received under reference ${res.data.referenceNumber}. Funds will be credited to your available balance upon clearance.`,
          'success'
        );
        this.form.amount = null;
        this.form.payerName = '';
        this.form.payerBank = '';
        this.form.checkNumber = '';
        this.form.proofNote = '';
        this.loadDeposits();
      },
      error: (err) => {
        this.submitting = false;
        this.modalService.alert('Submission Error', err.error?.message || 'Failed to submit deposit request. Please try again.', 'error');
      }
    });
  }
}
