import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Withdrawal } from '../../../core/models/bank.models';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-admin-withdrawals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in font-sans">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432] tracking-tight">Withdrawal Approvals</h1>
          <p class="text-xs text-slate-500 mt-1">Review and authorize commercial wire disbursements and correspondent banking payouts.</p>
        </div>

        <!-- Filter Buttons -->
        <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-bold">
          <button (click)="filterStatus.set(''); loadWithdrawals()" 
                  [ngClass]="filterStatus() === '' ? 'bg-[#003432] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">All</button>
          <button (click)="filterStatus.set('PENDING_APPROVAL'); loadWithdrawals()" 
                  [ngClass]="filterStatus() === 'PENDING_APPROVAL' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" [ngClass]="filterStatus() === 'PENDING_APPROVAL' ? 'bg-white' : 'bg-amber-500 animate-pulse'"></span>
            <span>Pending Review</span>
          </button>
          <button (click)="filterStatus.set('APPROVED'); loadWithdrawals()" 
                  [ngClass]="filterStatus() === 'APPROVED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">Approved</button>
          <button (click)="filterStatus.set('REJECTED'); loadWithdrawals()" 
                  [ngClass]="filterStatus() === 'REJECTED' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">Rejected</button>
        </div>
      </div>

      <!-- Withdrawals Table -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        @if (loading()) {
          <div class="p-12 text-center text-xs text-slate-400">Loading withdrawal queue...</div>
        } @else if (withdrawals().length === 0) {
          <div class="p-12 text-center text-xs text-slate-400">No withdrawal records matching current filter.</div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th class="px-5 py-3.5">Reference</th>
                  <th class="px-5 py-3.5">Client &amp; Account</th>
                  <th class="px-5 py-3.5">Method</th>
                  <th class="px-5 py-3.5">Amount &amp; Fee</th>
                  <th class="px-5 py-3.5">Destination Details</th>
                  <th class="px-5 py-3.5">Status</th>
                  <th class="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans text-xs">
                @for (w of withdrawals(); track w.id) {
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="px-5 py-4 font-mono font-bold text-[#0BB4D2]">{{ w.reference_number }}</td>
                    <td class="px-5 py-4">
                      <div class="font-bold text-slate-900">{{ w.first_name }} {{ w.last_name }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ w.account_number }}</div>
                    </td>
                    <td class="px-5 py-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {{ w.method.replace('_', ' ') }}
                      </span>
                    </td>
                    <td class="px-5 py-4 font-tabular">
                      <div class="text-sm font-bold text-[#003432] font-nunito">&#36;{{ w.amount | number:'1.2-2' }}</div>
                      <div class="text-[10px] text-slate-400">+ &#36;{{ w.fee | number:'1.2-2' }} fee</div>
                    </td>
                    <td class="px-5 py-4 max-w-xs truncate font-mono text-[11px] text-slate-600">
                      {{ w.destination_details }}
                    </td>
                    <td class="px-5 py-4">
                      @if (w.status === 'APPROVED') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>
                      } @else if (w.status === 'PENDING_APPROVAL') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Pending Review</span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Declined</span>
                      }
                    </td>
                    <td class="px-5 py-4 text-right">
                      @if (w.status === 'PENDING_APPROVAL') {
                        <div class="flex items-center justify-end gap-2">
                          <button (click)="approve(w)" 
                                  class="theme_btn apply_btn py-1.5 px-3 rounded-lg text-white font-bold text-xs transition shadow-xs">
                            ✓ Approve
                          </button>
                          <button (click)="reject(w)" 
                                  class="px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 text-red-700 border border-red-200 font-bold text-xs transition shadow-xs">
                            ✕ Reject
                          </button>
                        </div>
                      } @else {
                        <span class="text-[11px] text-slate-400 font-mono">{{ w.reviewed_at ? (w.reviewed_at | date:'shortDate') : 'Settled' }}</span>
                      }
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
export class AdminWithdrawalsComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(ModalService);

  withdrawals = signal<Withdrawal[]>([]);
  loading = signal<boolean>(true);
  filterStatus = signal<string>('');

  ngOnInit() {
    this.loadWithdrawals();
  }

  loadWithdrawals() {
    this.loading.set(true);
    this.adminService.listWithdrawals(this.filterStatus() || undefined).subscribe({
      next: (res) => {
        if (res.success) this.withdrawals.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  approve(w: Withdrawal) {
    this.modalService.confirm({
      title: 'Approve Withdrawal',
      message: `Authorize disbursement of $${Number(w.amount).toFixed(2)} to ${w.destination_details}? This will finalize debit on the general ledger.`,
      confirmText: 'Approve & Disburse',
      type: 'warning'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.adminService.approveWithdrawal(w.id, 'Approved via Admin Control Center').subscribe({
          next: () => {
            this.modalService.alert({ title: 'Disbursement Approved', message: 'Funds disbursed and ledger updated.', type: 'success' });
            this.loadWithdrawals();
          },
          error: (err) => {
            this.modalService.alert({ title: 'Approval Failed', message: err.error?.message || 'Error approving withdrawal.', type: 'danger' });
          }
        });
      }
    });
  }

  reject(w: Withdrawal) {
    this.modalService.confirm({
      title: 'Reject Withdrawal',
      message: `Decline withdrawal of $${Number(w.amount).toFixed(2)}? Held funds will be restored immediately to customer balance.`,
      confirmText: 'Reject & Refund',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.adminService.rejectWithdrawal(w.id, 'Declined by Admin compliance review. Funds refunded.').subscribe({
          next: () => {
            this.modalService.alert({ title: 'Withdrawal Rejected', message: 'Request rejected and held funds restored to client account.', type: 'info' });
            this.loadWithdrawals();
          },
          error: (err) => {
            this.modalService.alert({ title: 'Rejection Failed', message: err.error?.message || 'Error rejecting withdrawal.', type: 'danger' });
          }
        });
      }
    });
  }
}
