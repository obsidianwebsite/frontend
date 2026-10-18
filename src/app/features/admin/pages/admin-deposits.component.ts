import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ModalService } from '../../../core/services/modal.service';
import { Deposit } from '../../../core/models/bank.models';

@Component({
  selector: 'app-admin-deposits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 font-sans">
      
      <!-- Top Title & Filter Tabs -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432] tracking-tight">Deposit Approvals</h1>
          <p class="text-xs text-slate-500 mt-1">Review bank transfers and check deposits. Approving updates customer balances immediately.</p>
        </div>

        <!-- Filter Status Tabs -->
        <div class="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-bold">
          <button (click)="setStatusFilter('')"
                  [ngClass]="currentFilter() === '' ? 'bg-[#003432] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">
            All
          </button>
          <button (click)="setStatusFilter('PENDING_APPROVAL')"
                  [ngClass]="currentFilter() === 'PENDING_APPROVAL' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" [ngClass]="currentFilter() === 'PENDING_APPROVAL' ? 'bg-white' : 'bg-amber-500 animate-pulse'"></span>
            <span>Pending Review</span>
          </button>
          <button (click)="setStatusFilter('APPROVED')"
                  [ngClass]="currentFilter() === 'APPROVED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">
            Approved
          </button>
          <button (click)="setStatusFilter('REJECTED')"
                  [ngClass]="currentFilter() === 'REJECTED' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  class="px-3 py-1.5 rounded-lg transition">
            Rejected
          </button>
        </div>
      </div>

      <!-- Deposit Queue Table / Cards -->
      @if (deposits().length > 0) {
        <div class="space-y-4">
          @for (d of deposits(); track d.id) {
            <div class="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition space-y-4">
              
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#003432] font-bold text-lg shrink-0">
                    {{ d.method === 'CHECK_DEPOSIT' ? '📄' : '🏛️' }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-extrabold text-base text-[#003432] font-nunito"><span>$</span>{{ d.amount | number:'1.2-2' }}</span>
                      <span class="text-xs text-slate-500 font-medium">({{ d.currency }})</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {{ d.method.replace('_', ' ') }}
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500 font-sans mt-0.5">
                      Ref: <strong class="text-[#0BB4D2] font-mono">{{ d.reference_number }}</strong> &bull; Customer: <strong class="text-slate-800">{{ d.first_name }} {{ d.last_name }}</strong> ({{ d.account_number }})
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3 self-end sm:self-auto">
                  <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                        [ngClass]="{
                          'bg-amber-50 text-amber-700 border border-amber-200': d.status === 'PENDING_APPROVAL',
                          'bg-emerald-50 text-emerald-700 border border-emerald-200': d.status === 'APPROVED',
                          'bg-red-50 text-red-700 border border-red-200': d.status === 'REJECTED'
                        }">
                    {{ d.status.replace('_', ' ') }}
                  </span>
                </div>
              </div>

              <!-- Payment Details -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span class="text-slate-400 block font-medium">Sender Name:</span>
                  <strong class="text-slate-700">{{ d.payer_name || 'Customer Transfer' }}</strong>
                </div>
                <div>
                  <span class="text-slate-400 block font-medium">Sending Bank:</span>
                  <strong class="text-slate-700">{{ d.payer_bank || 'External Bank' }}</strong>
                </div>
                <div>
                  <span class="text-slate-400 block font-medium">Check Number:</span>
                  <strong class="text-[#003432] font-mono">{{ d.check_number || 'N/A (Bank Wire)' }}</strong>
                </div>
              </div>

              @if (d.proof_note) {
                <div class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <span class="text-slate-500 font-bold">Proof / Memo:</span> {{ d.proof_note }}
                </div>
              }

              @if (d.admin_remarks) {
                <div class="text-xs p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-[#003432]">
                  <span class="font-bold">Admin Clearance Note:</span> {{ d.admin_remarks }}
                </div>
              }

              <!-- Action Buttons (Only for PENDING_APPROVAL) -->
              @if (d.status === 'PENDING_APPROVAL') {
                <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <button (click)="reject(d.id)" [disabled]="processingId === d.id"
                          class="px-4 py-2 rounded-xl bg-white hover:bg-red-50 border border-red-200 text-red-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    <span>Reject Deposit</span>
                  </button>

                  <button (click)="approve(d.id)" [disabled]="processingId === d.id"
                          class="theme_btn apply_btn py-2 px-5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    <span>Approve &amp; Credit Account</span>
                  </button>
                </div>
              }

            </div>
          }
        </div>
      } @else {
        <div class="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-400 text-xs shadow-xs">
          No deposit requests found matching the selected filter.
        </div>
      }

    </div>
  `
})
export class AdminDepositsComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(ModalService);

  deposits = signal<Deposit[]>([]);
  currentFilter = signal<string>('PENDING_APPROVAL');
  processingId: string | null = null;

  ngOnInit(): void {
    this.loadDeposits();
  }

  setStatusFilter(status: string): void {
    this.currentFilter.set(status);
    this.loadDeposits();
  }

  loadDeposits(): void {
    this.adminService.listDeposits(this.currentFilter()).subscribe({
      next: (res) => {
        if (res.data) {
          this.deposits.set(res.data);
        }
      }
    });
  }

  approve(id: string): void {
    this.processingId = id;
    this.adminService.approveDeposit(id, 'Approved via Admin Command Center').subscribe({
      next: (res) => {
        this.processingId = null;
        this.modalService.alert('Deposit Approved', res.message || 'Deposit approved and credited to customer account.', 'success');
        this.loadDeposits();
      },
      error: (err) => {
        this.processingId = null;
        this.modalService.alert('Approval Failed', err.error?.message || 'Failed to approve deposit.', 'error');
      }
    });
  }

  reject(id: string): void {
    const reason = prompt('Enter rejection reason / compliance notice for client:', 'Remittance instrument failed compliance verification.');
    if (reason === null) return; // user cancelled prompt

    this.processingId = id;
    this.adminService.rejectDeposit(id, reason).subscribe({
      next: (res) => {
        this.processingId = null;
        this.modalService.alert('Deposit Rejected', res.message || 'Deposit has been marked as rejected.', 'warning');
        this.loadDeposits();
      },
      error: (err) => {
        this.processingId = null;
        this.modalService.alert('Rejection Error', err.error?.message || 'Failed to reject deposit.', 'error');
      }
    });
  }
}
