import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ModalService } from '../../../core/services/modal.service';
import { Loan, AmortizationEntry } from '../../../core/models/bank.models';

@Component({
  selector: 'app-admin-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 font-sans">
      
      <!-- Top Title & Filter Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432] tracking-tight">Loan &amp; Credit Approvals</h1>
          <p class="text-xs text-slate-500 mt-1">
            Review car loan and mortgage applications. Approving immediately credits funds into the customer's account and sets up their repayment schedule.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Status Filter -->
          <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-bold">
            <button (click)="setStatusFilter('')"
                    [ngClass]="statusFilter() === '' ? 'bg-[#003432] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                    class="px-2.5 py-1.5 rounded-lg transition">
              All
            </button>
            <button (click)="setStatusFilter('PENDING_APPROVAL')"
                    [ngClass]="statusFilter() === 'PENDING_APPROVAL' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                    class="px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" [ngClass]="statusFilter() === 'PENDING_APPROVAL' ? 'bg-white' : 'bg-amber-500 animate-pulse'"></span>
              <span>Pending</span>
            </button>
            <button (click)="setStatusFilter('ACTIVE')"
                    [ngClass]="statusFilter() === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                    class="px-2.5 py-1.5 rounded-lg transition">
              Active / Disbursed
            </button>
            <button (click)="setStatusFilter('REJECTED')"
                    [ngClass]="statusFilter() === 'REJECTED' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                    class="px-2.5 py-1.5 rounded-lg transition">
              Declined
            </button>
          </div>

          <!-- Type Filter -->
          <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-bold">
            <button (click)="setTypeFilter('')"
                    [ngClass]="typeFilter() === '' ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:text-slate-800'"
                    class="px-2.5 py-1.5 rounded-lg transition">
              All Types
            </button>
            <button (click)="setTypeFilter('CAR_LOAN')"
                    [ngClass]="typeFilter() === 'CAR_LOAN' ? 'bg-teal-100 text-[#003432]' : 'text-slate-500 hover:text-slate-800'"
                    class="px-2.5 py-1.5 rounded-lg transition">
              🚗 Auto
            </button>
            <button (click)="setTypeFilter('MORTGAGE')"
                    [ngClass]="typeFilter() === 'MORTGAGE' ? 'bg-teal-100 text-[#003432]' : 'text-slate-500 hover:text-slate-800'"
                    class="px-2.5 py-1.5 rounded-lg transition">
              🏡 Mortgage
            </button>
          </div>
        </div>
      </div>

      <!-- Loans List -->
      @if (loans().length > 0) {
        <div class="space-y-4">
          @for (loan of loans(); track loan.id) {
            <div class="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition space-y-4">
              
              <!-- Card Header -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-xl shrink-0">
                    @if (loan.loan_type === 'CAR_LOAN') { 🚗 }
                    @else if (loan.loan_type === 'MORTGAGE') { 🏡 }
                    @else { 💼 }
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-bold text-base text-slate-900 font-nunito">{{ loan.loan_title }}</h3>
                      <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {{ loan.loan_type.replace('_', ' ') }}
                      </span>
                    </div>
                    <div class="text-xs text-slate-500 mt-0.5">
                      Ref: <strong class="text-[#0BB4D2] font-mono">{{ loan.loan_reference }}</strong> &bull; Customer: <strong class="text-slate-800">{{ loan.first_name }} {{ loan.last_name }}</strong> ({{ loan.account_number }})
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                        [ngClass]="{
                          'bg-amber-50 text-amber-700 border border-amber-200': loan.status === 'PENDING_APPROVAL',
                          'bg-emerald-50 text-emerald-700 border border-emerald-200': loan.status === 'ACTIVE',
                          'bg-red-50 text-red-700 border border-red-200': loan.status === 'REJECTED',
                          'bg-cyan-50 text-cyan-700 border border-cyan-200': loan.status === 'PAID_OFF'
                        }">
                    {{ loan.status.replace('_', ' ') }}
                  </span>
                </div>
              </div>

              <!-- Facility Metrics Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span class="text-slate-400 block font-medium">Principal Facility:</span>
                  <strong class="text-base text-[#003432] font-nunito font-bold"><span>$</span>{{ loan.principal_amount | number:'1.2-2' }}</strong>
                  <span class="text-[10px] text-slate-400 block">{{ loan.currency }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block font-medium">Fixed Interest APR:</span>
                  <strong class="text-base text-teal-700 font-bold">{{ loan.interest_rate_apr }}%</strong>
                  <span class="text-[10px] text-slate-400 block">Annualized Rate</span>
                </div>
                <div>
                  <span class="text-slate-400 block font-medium">Amortization Tenure:</span>
                  <strong class="text-base text-slate-700 font-bold">{{ loan.term_months }} Months</strong>
                  <span class="text-[10px] text-slate-400 block">({{ (loan.term_months / 12) | number:'1.0-1' }} Years)</span>
                </div>
                <div>
                  <span class="text-slate-400 block font-medium">Monthly Installment:</span>
                  <strong class="text-base text-emerald-600 font-bold">
                    <span>$</span>{{ (loan.monthly_installment || calculateEstimatedPayment(loan)) | number:'1.2-2' }}
                  </strong>
                  <span class="text-[10px] text-slate-400 block">Per month</span>
                </div>
              </div>

              <!-- Collateral / Asset Details Inspection -->
              @if (loan.asset_details) {
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div class="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span class="text-teal-600">📋</span>
                    <span>Application Asset / Underwriting Parameters</span>
                  </div>

                  <!-- Car Loan Details -->
                  @if (loan.loan_type === 'CAR_LOAN') {
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span class="text-slate-400 block">Vehicle:</span>
                        <strong class="text-slate-700">{{ loan.asset_details.vehicleYear }} {{ loan.asset_details.vehicleMake }} {{ loan.asset_details.vehicleModel }}</strong>
                      </div>
                      <div>
                        <span class="text-slate-400 block">VIN (Chassis):</span>
                        <strong class="text-slate-800 font-mono">{{ loan.asset_details.vin || 'Pending Delivery' }}</strong>
                      </div>
                      <div>
                        <span class="text-slate-400 block">Purchase Price:</span>
                        <strong class="text-slate-700"><span>$</span>{{ loan.asset_details.purchasePrice | number:'1.2-2' }}</strong>
                      </div>
                      <div>
                        <span class="text-slate-400 block">Down Payment:</span>
                        <strong class="text-emerald-600"><span>$</span>{{ loan.asset_details.downPayment | number:'1.2-2' }}</strong>
                      </div>
                    </div>
                  }

                  <!-- Mortgage Details -->
                  @if (loan.loan_type === 'MORTGAGE') {
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div class="col-span-2">
                        <span class="text-slate-400 block">Property Location:</span>
                        <strong class="text-slate-700">{{ loan.asset_details.propertyAddress }}</strong>
                      </div>
                      <div>
                        <span class="text-slate-400 block">Property Type:</span>
                        <strong class="text-slate-700">{{ loan.asset_details.propertyType }}</strong>
                      </div>
                      <div>
                        <span class="text-slate-400 block">Property Valuation:</span>
                        <strong class="text-teal-700"><span>$</span>{{ loan.asset_details.propertyValuation | number:'1.2-2' }}</strong>
                      </div>
                      <div>
                        <span class="text-slate-400 block">Verified Monthly Income:</span>
                        <strong class="text-emerald-600"><span>$</span>{{ loan.asset_details.monthlyIncome | number:'1.2-2' }}</strong>
                      </div>
                      <div>
                        <span class="text-slate-400 block">Down Payment Provided:</span>
                        <strong class="text-slate-700"><span>$</span>{{ loan.asset_details.downPayment | number:'1.2-2' }}</strong>
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- Admin Decision / Audit Information -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <div class="text-xs text-slate-500">
                  @if (loan.status === 'PENDING_APPROVAL') {
                    <span class="text-amber-600 flex items-center gap-1.5 font-medium">
                      <span>⏳</span> Awaiting Credit Committee adjudication. Disbursement triggers upon approval.
                    </span>
                  } @else if (loan.status === 'ACTIVE') {
                    <span class="text-emerald-600 font-medium">
                      &check; Disbursed on {{ loan.disbursed_at | date:'mediumDate' }}. Next Due: {{ loan.next_due_date | date:'mediumDate' }}.
                    </span>
                  } @else {
                    <span class="text-red-600 font-medium">
                      &times; Declined. Remarks: {{ loan.admin_remarks || 'Criteria not met.' }}
                    </span>
                  }
                </div>

                <div class="flex items-center gap-2">
                  <!-- Active Loan: View Amortization Table -->
                  @if (loan.status === 'ACTIVE' && loan.amortization_schedule) {
                    <button (click)="openScheduleModal(loan)"
                            class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-xs">
                      <span>📊</span>
                      <span>View Amortization Schedule</span>
                    </button>
                  }

                  <!-- Pending Loan: Underwriter Decisions -->
                  @if (loan.status === 'PENDING_APPROVAL') {
                    <button (click)="openDecisionModal(loan, 'REJECT')"
                            [disabled]="actionLoading()"
                            class="px-4 py-2 rounded-xl bg-white hover:bg-red-50 border border-red-200 text-xs font-bold text-red-700 transition shadow-xs">
                      Decline Application
                    </button>
                    <button (click)="openDecisionModal(loan, 'APPROVE')"
                            [disabled]="actionLoading()"
                            class="theme_btn apply_btn py-2 px-5 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2">
                      <span>&check;</span>
                      <span>Approve &amp; Disburse</span>
                    </button>
                  }
                </div>
              </div>

            </div>
          }
        </div>
      } @else {
        <div class="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div class="text-3xl mb-2">📂</div>
          <h3 class="text-base font-bold text-slate-900 font-nunito">No Loan Applications Found</h3>
          <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            There are currently no credit facility applications matching the selected criteria.
          </p>
        </div>
      }

    </div>

    <!-- Amortization Modal -->
    @if (selectedLoanForSchedule()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col font-sans">
          
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
            <div>
              <h2 class="text-lg font-bold font-nunito text-[#003432] flex items-center gap-2">
                <span>📊</span>
                <span>Amortization Schedule: {{ selectedLoanForSchedule()?.loan_title }}</span>
              </h2>
              <p class="text-xs text-slate-500 font-mono mt-0.5">Ref: {{ selectedLoanForSchedule()?.loan_reference }} &bull; Rate: {{ selectedLoanForSchedule()?.interest_rate_apr }}% APR</p>
            </div>
            <button (click)="closeScheduleModal()" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
          </div>

          <div class="overflow-y-auto flex-1 space-y-3 pr-1">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="text-xs font-semibold text-slate-600 bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr>
                  <th class="px-4 py-3">Month</th>
                  <th class="px-4 py-3">Installment</th>
                  <th class="px-4 py-3">Principal Paid</th>
                  <th class="px-4 py-3">Interest Paid</th>
                  <th class="px-4 py-3">Remaining Balance</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans text-xs">
                @for (entry of getParsedSchedule(selectedLoanForSchedule()); track entry.month) {
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="px-4 py-2.5 text-slate-900 font-bold">Month {{ entry.month }}</td>
                    <td class="px-4 py-2.5 text-emerald-600 font-bold font-tabular"><span>$</span>{{ entry.installment | number:'1.2-2' }}</td>
                    <td class="px-4 py-2.5 text-teal-700 font-medium font-tabular"><span>$</span>{{ entry.principal | number:'1.2-2' }}</td>
                    <td class="px-4 py-2.5 text-amber-700 font-medium font-tabular"><span>$</span>{{ entry.interest | number:'1.2-2' }}</td>
                    <td class="px-4 py-2.5 text-slate-600 font-tabular font-medium"><span>$</span>{{ entry.remainingBalance | number:'1.2-2' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="flex justify-end pt-3 border-t border-slate-100 shrink-0">
            <button (click)="closeScheduleModal()"
                    class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition">
              Close Schedule
            </button>
          </div>

        </div>
      </div>
    }

    <!-- Decision Confirmation Modal -->
    @if (activeDecisionModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
        <div class="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
          
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold font-nunito text-[#003432] flex items-center gap-2">
              @if (decisionType() === 'APPROVE') {
                <span class="text-emerald-600">&check;</span>
                <span>Confirm Facility Approval &amp; Auto-Disbursement</span>
              } @else {
                <span class="text-red-600">&times;</span>
                <span>Confirm Application Rejection</span>
              }
            </h3>
            <button (click)="closeDecisionModal()" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
          </div>

          <div class="text-xs text-slate-600 space-y-3">
            @if (decisionType() === 'APPROVE') {
              <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                You are approving <strong>{{ selectedLoan()?.loan_title }}</strong> for customer <strong>{{ selectedLoan()?.first_name }} {{ selectedLoan()?.last_name }}</strong>.
                <div class="mt-2 text-[#003432] font-bold text-sm">
                  <span>Principal to Disburse: $</span>{{ selectedLoan()?.principal_amount | number:'1.2-2' }} {{ selectedLoan()?.currency }}
                </div>
                <div class="text-[11px] text-emerald-700 mt-1">
                  Upon confirmation, the balance will be credited atomically and month-by-month repayment schedule activated.
                </div>
              </div>
            } @else {
              <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
                Are you sure you want to decline this credit application?
              </div>
            }

            <div>
              <label class="block text-slate-700 font-semibold mb-1">Underwriter Remarks / Audit Reason:</label>
              <textarea [(ngModel)]="adminRemarks"
                        rows="3"
                        placeholder="Enter adjudication rationale for audit logs..."
                        class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none"></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button (click)="closeDecisionModal()"
                    [disabled]="actionLoading()"
                    class="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition">
              Cancel
            </button>

            @if (decisionType() === 'APPROVE') {
              <button (click)="confirmApprove()"
                      [disabled]="actionLoading()"
                      class="theme_btn apply_btn py-2 px-5 rounded-xl text-xs font-bold shadow-xs transition">
                {{ actionLoading() ? 'Disbursing...' : 'Confirm &amp; Disburse' }}
              </button>
            } @else {
              <button (click)="confirmReject()"
                      [disabled]="actionLoading()"
                      class="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-xs transition">
                {{ actionLoading() ? 'Declining...' : 'Confirm Rejection' }}
              </button>
            }
          </div>

        </div>
      </div>
    }
  `
})
export class AdminLoansComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(ModalService);

  loans = signal<any[]>([]);
  statusFilter = signal<string>('');
  typeFilter = signal<string>('');
  loading = signal<boolean>(false);
  actionLoading = signal<boolean>(false);

  // Modals
  activeDecisionModal = signal<boolean>(false);
  decisionType = signal<'APPROVE' | 'REJECT'>('APPROVE');
  selectedLoan = signal<any | null>(null);
  selectedLoanForSchedule = signal<any | null>(null);
  adminRemarks: string = '';

  ngOnInit() {
    this.loadLoans();
  }

  loadLoans() {
    this.loading.set(true);
    this.adminService.listLoans(this.statusFilter(), this.typeFilter()).subscribe({
      next: (res) => {
        this.loans.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.modalService.alert({
          title: 'Retrieval Failure',
          message: err.error?.message || 'Unable to load loan records.',
          type: 'danger'
        });
      }
    });
  }

  setStatusFilter(status: string) {
    this.statusFilter.set(status);
    this.loadLoans();
  }

  setTypeFilter(type: string) {
    this.typeFilter.set(type);
    this.loadLoans();
  }

  calculateEstimatedPayment(loan: any): number {
    const p = parseFloat(loan.principal_amount);
    const r = parseFloat(loan.interest_rate_apr) / 100 / 12;
    const n = parseInt(loan.term_months, 10);
    if (!p || !r || !n) return 0;
    return (p * r) / (1 - Math.pow(1 + r, -n));
  }

  getParsedSchedule(loan: any): AmortizationEntry[] {
    if (!loan?.amortization_schedule) return [];
    if (typeof loan.amortization_schedule === 'string') {
      try {
        return JSON.parse(loan.amortization_schedule);
      } catch (e) {
        return [];
      }
    }
    return loan.amortization_schedule;
  }

  openScheduleModal(loan: any) {
    this.selectedLoanForSchedule.set(loan);
  }

  closeScheduleModal() {
    this.selectedLoanForSchedule.set(null);
  }

  openDecisionModal(loan: any, type: 'APPROVE' | 'REJECT') {
    this.selectedLoan.set(loan);
    this.decisionType.set(type);
    this.adminRemarks = type === 'APPROVE' 
      ? 'Underwriting conditions met. Collateral and capacity verified.' 
      : 'Debt-to-income ratio exceeds underwriting threshold.';
    this.activeDecisionModal.set(true);
  }

  closeDecisionModal() {
    this.activeDecisionModal.set(false);
    this.selectedLoan.set(null);
    this.adminRemarks = '';
  }

  confirmApprove() {
    const loan = this.selectedLoan();
    if (!loan) return;

    this.actionLoading.set(true);
    this.adminService.approveLoan(loan.id, this.adminRemarks).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        this.closeDecisionModal();
        this.modalService.alert({
          title: 'Facility Disbursed',
          message: res.message || 'Loan approved and funds credited successfully.',
          type: 'success'
        });
        this.loadLoans();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.modalService.alert({
          title: 'Approval Failed',
          message: err.error?.message || 'Failed to approve facility.',
          type: 'danger'
        });
      }
    });
  }

  confirmReject() {
    const loan = this.selectedLoan();
    if (!loan) return;

    this.actionLoading.set(true);
    this.adminService.rejectLoan(loan.id, this.adminRemarks).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        this.closeDecisionModal();
        this.modalService.alert({
          title: 'Application Declined',
          message: res.message || 'Loan application has been declined.',
          type: 'info'
        });
        this.loadLoans();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.modalService.alert({
          title: 'Rejection Failed',
          message: err.error?.message || 'Failed to decline application.',
          type: 'danger'
        });
      }
    });
  }
}
