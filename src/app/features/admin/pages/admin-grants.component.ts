import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Grant } from '../../../core/models/bank.models';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-admin-grants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in font-sans">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432] tracking-tight">Grant Applications &amp; Endowments</h1>
          <p class="text-xs text-slate-500 mt-1">Review grant proposals, underwrite eligibility, and disburse non-repayable capital.</p>
        </div>

        <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-bold">
          <button (click)="filterStatus.set(''); loadGrants()" 
                  [ngClass]="filterStatus() === '' ? 'bg-[#003432] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">All</button>
          <button (click)="filterStatus.set('PROCESSING'); loadGrants()" 
                  [ngClass]="filterStatus() === 'PROCESSING' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" [ngClass]="filterStatus() === 'PROCESSING' ? 'bg-white' : 'bg-amber-500 animate-pulse'"></span>
            <span>In Review</span>
          </button>
          <button (click)="filterStatus.set('APPROVED'); loadGrants()" 
                  [ngClass]="filterStatus() === 'APPROVED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">Approved</button>
          <button (click)="filterStatus.set('DISBURSED'); loadGrants()" 
                  [ngClass]="filterStatus() === 'DISBURSED' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">Disbursed</button>
        </div>
      </div>

      <!-- Grants Table -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        @if (loading()) {
          <div class="p-12 text-center text-xs text-slate-400">Loading grant applications...</div>
        } @else if (grants().length === 0) {
          <div class="p-12 text-center text-xs text-slate-400">No grant applications matching current filter.</div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th class="px-5 py-3.5">Reference</th>
                  <th class="px-5 py-3.5">Applicant &amp; Account</th>
                  <th class="px-5 py-3.5">Programme &amp; Purpose</th>
                  <th class="px-5 py-3.5">Amount</th>
                  <th class="px-5 py-3.5">Status</th>
                  <th class="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans text-xs">
                @for (g of grants(); track g.id) {
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="px-5 py-4 font-mono font-bold text-[#0BB4D2]">{{ g.reference_number }}</td>
                    <td class="px-5 py-4">
                      <div class="font-bold text-slate-900">{{ g.first_name }} {{ g.last_name }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ g.account_number }}</div>
                    </td>
                    <td class="px-5 py-4 max-w-sm">
                      <div class="font-bold text-slate-900">{{ g.programme_name }}</div>
                      <div class="text-[11px] text-slate-500 truncate">{{ g.business_purpose }}</div>
                    </td>
                    <td class="px-5 py-4 font-tabular font-bold text-emerald-600 text-sm">
                      &#36;{{ g.amount_requested | number:'1.2-2' }}
                    </td>
                    <td class="px-5 py-4">
                      @if (g.status === 'DISBURSED') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-[#003432] border border-teal-200">Disbursed ✓</span>
                      } @else if (g.status === 'APPROVED') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>
                      } @else if (g.status === 'PROCESSING') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">In Review</span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Declined</span>
                      }
                    </td>
                    <td class="px-5 py-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        @if (g.status === 'PROCESSING') {
                          <button (click)="review(g, 'APPROVE')" 
                                  class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs">
                            Approve
                          </button>
                          <button (click)="review(g, 'DISBURSE')" 
                                  class="theme_btn apply_btn py-1.5 px-3 rounded-lg text-white font-bold text-xs transition shadow-xs">
                            ⚡ Disburse Funds
                          </button>
                          <button (click)="review(g, 'REJECT')" 
                                  class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-red-50 text-red-700 border border-red-200 font-bold text-xs transition shadow-xs">
                            Reject
                          </button>
                        } @else if (g.status === 'APPROVED') {
                          <button (click)="review(g, 'DISBURSE')" 
                                  class="theme_btn apply_btn py-1.5 px-3 rounded-lg text-white font-bold text-xs transition shadow-xs">
                            ⚡ Disburse Funds (&#36;{{ g.amount_requested | number:'1.0-0' }})
                          </button>
                        } @else {
                          <span class="text-[11px] text-slate-400 font-mono">Finalized</span>
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
export class AdminGrantsComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(ModalService);

  grants = signal<Grant[]>([]);
  loading = signal<boolean>(true);
  filterStatus = signal<string>('');

  ngOnInit() {
    this.loadGrants();
  }

  loadGrants() {
    this.loading.set(true);
    this.adminService.listGrants(this.filterStatus() || undefined).subscribe({
      next: (res) => {
        if (res.success) this.grants.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  review(grant: Grant, action: 'APPROVE' | 'REJECT' | 'DISBURSE') {
    const actionText = action === 'DISBURSE' 
      ? `Disburse $${Number(grant.amount_requested).toFixed(2)} directly into customer's account balance` 
      : `${action} this grant application`;

    this.modalService.confirm({
      title: `${action} Grant Application`,
      message: `Are you sure you want to ${actionText}?`,
      confirmText: action === 'DISBURSE' ? 'Confirm Disbursement' : action,
      type: action === 'REJECT' ? 'danger' : 'warning'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.adminService.reviewGrant(grant.id, action, `Admin ${action} operation executed.`).subscribe({
          next: () => {
            this.modalService.alert({
              title: 'Grant Status Updated',
              message: action === 'DISBURSE' ? `Successfully credited $${Number(grant.amount_requested).toFixed(2)} to customer!` : `Grant marked as ${action}.`,
              type: 'success'
            });
            this.loadGrants();
          },
          error: (err) => {
            this.modalService.alert({ title: 'Error', message: err.error?.message || 'Failed to update grant.', type: 'danger' });
          }
        });
      }
    });
  }
}
