import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { TaxRefund } from '../../../core/models/bank.models';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-admin-tax',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in font-sans">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432] tracking-tight">Tax Refund Processing &amp; Disbursal</h1>
          <p class="text-xs text-slate-500 mt-1">Advance refund progression stages and execute Treasury direct deposits into user checking accounts.</p>
        </div>

        <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-bold">
          <button (click)="filterStage.set(''); loadClaims()" 
                  [ngClass]="filterStage() === '' ? 'bg-[#003432] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">All</button>
          <button (click)="filterStage.set('RECEIVED'); loadClaims()" 
                  [ngClass]="filterStage() === 'RECEIVED' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">Received</button>
          <button (click)="filterStage.set('UNDER_REVIEW'); loadClaims()" 
                  [ngClass]="filterStage() === 'UNDER_REVIEW' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">Under Review</button>
          <button (click)="filterStage.set('APPROVED'); loadClaims()" 
                  [ngClass]="filterStage() === 'APPROVED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">Approved</button>
          <button (click)="filterStage.set('DISBURSED'); loadClaims()" 
                  [ngClass]="filterStage() === 'DISBURSED' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">Disbursed</button>
        </div>
      </div>

      <!-- Tax Claims Table -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        @if (loading()) {
          <div class="p-12 text-center text-xs text-slate-400">Loading tax claims...</div>
        } @else if (claims().length === 0) {
          <div class="p-12 text-center text-xs text-slate-400">No tax claims found.</div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th class="px-5 py-3.5">Filing ID</th>
                  <th class="px-5 py-3.5">Taxpayer &amp; Account</th>
                  <th class="px-5 py-3.5">Tax Year / SSN</th>
                  <th class="px-5 py-3.5">Expected Refund</th>
                  <th class="px-5 py-3.5">Current Stage</th>
                  <th class="px-5 py-3.5 text-right">Advance Stage</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans text-xs">
                @for (c of claims(); track c.id) {
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="px-5 py-4 font-mono font-bold text-[#0BB4D2]">{{ c.filing_id }}</td>
                    <td class="px-5 py-4">
                      <div class="font-bold text-slate-900">{{ c.first_name }} {{ c.last_name }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ c.account_number }}</div>
                    </td>
                    <td class="px-5 py-4">
                      <div class="font-bold text-slate-800">Year {{ c.tax_year }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ c.ssn_tin_masked }}</div>
                    </td>
                    <td class="px-5 py-4 font-tabular font-bold text-emerald-600 text-sm">
                      &#36;{{ c.expected_amount | number:'1.2-2' }}
                    </td>
                    <td class="px-5 py-4">
                      @if (c.refund_stage === 'DISBURSED') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-[#003432] border border-teal-200">
                          Disbursed to Account ✓
                        </span>
                      } @else if (c.refund_stage === 'APPROVED') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      } @else if (c.refund_stage === 'UNDER_REVIEW') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Under Review
                        </span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Received
                        </span>
                      }
                    </td>
                    <td class="px-5 py-4 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        @if (c.refund_stage === 'RECEIVED') {
                          <button (click)="advance(c, 'UNDER_REVIEW')" 
                                  class="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs transition">
                            → Review
                          </button>
                        } @else if (c.refund_stage === 'UNDER_REVIEW') {
                          <button (click)="advance(c, 'APPROVED')" 
                                  class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs">
                            ✓ Approve
                          </button>
                        } @else if (c.refund_stage === 'APPROVED') {
                          <button (click)="advance(c, 'DISBURSED')" 
                                  class="theme_btn apply_btn py-1.5 px-3 rounded-lg text-white font-bold text-xs transition shadow-xs">
                            ⚡ Disburse Deposit (&#36;{{ c.expected_amount | number:'1.0-0' }})
                          </button>
                        } @else {
                          <span class="text-[11px] text-slate-400 font-mono">Disbursed</span>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

    </div>
  `
})
export class AdminTaxComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(ModalService);

  claims = signal<TaxRefund[]>([]);
  loading = signal<boolean>(true);
  filterStage = signal<string>('');

  ngOnInit() {
    this.loadClaims();
  }

  loadClaims() {
    this.loading.set(true);
    this.adminService.listTaxClaims(this.filterStage() || undefined).subscribe({
      next: (res) => {
        if (res.success) this.claims.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  advance(c: TaxRefund, nextStage: string) {
    const isDisburse = nextStage === 'DISBURSED';
    const message = isDisburse 
      ? `This will atomically disburse $${Number(c.expected_amount).toFixed(2)} directly into customer's checking account balance!`
      : `Advance refund stage to ${nextStage}?`;

    this.modalService.confirm({
      title: isDisburse ? 'Disburse Tax Refund' : 'Advance Tax Stage',
      message,
      confirmText: isDisburse ? 'Disburse Direct Deposit' : 'Confirm',
      type: isDisburse ? 'warning' : 'info'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.adminService.updateTaxStage(c.id, nextStage, `Stage updated to ${nextStage} by Admin.`).subscribe({
          next: () => {
            this.modalService.alert({
              title: 'Stage Updated',
              message: isDisburse ? `Direct deposit of $${Number(c.expected_amount).toFixed(2)} completed!` : `Tax refund stage set to ${nextStage}.`,
              type: 'success'
            });
            this.loadClaims();
          },
          error: (err) => {
            this.modalService.alert({ title: 'Error', message: err.error?.message || 'Failed to update stage.', type: 'danger' });
          }
        });
      }
    });
  }
}
