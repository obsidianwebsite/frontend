import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { ModalService } from '../../../../core/services/modal.service';
import { Loan, AmortizationEntry } from '../../../../core/models/bank.models';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      
      <!-- Top Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#003432] tracking-tight">Credit Facilities, Auto Financing &amp; Mortgages</h1>
          <p class="text-xs text-slate-500 mt-1">Manage active corporate facilities, submit Car Loan and Mortgage applications, and inspect dynamic amortization schedules.</p>
        </div>
        <div class="flex items-center gap-2.5 self-start">
          <button (click)="openApplyModal('CAR_LOAN')" 
                  class="bg-[#003432] hover:bg-[#002625] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition">
            <span>🚗 Apply Car Loan</span>
          </button>
          <button (click)="openApplyModal('MORTGAGE')" 
                  class="bg-[#0BB4D2] hover:bg-[#089bb5] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition">
            <span>🏡 Apply Mortgage</span>
          </button>
        </div>
      </div>

      <!-- Facilities List Grid -->
      @if (loans().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (l of loans(); track l.id) {
            <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition duration-200">
              
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                        [ngClass]="{
                          'bg-cyan-50 text-cyan-800 border border-cyan-200': l.loanType === 'CAR_LOAN',
                          'bg-indigo-50 text-indigo-800 border border-indigo-200': l.loanType === 'MORTGAGE',
                          'bg-slate-100 text-slate-800 border border-slate-200': l.loanType === 'PERSONAL'
                        }">
                    {{ l.loanType.replace('_', ' ') }}
                  </span>

                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                        [ngClass]="{
                          'bg-emerald-100 text-emerald-800 border border-emerald-200': l.status === 'ACTIVE' || l.status === 'APPROVED',
                          'bg-amber-100 text-amber-800 border border-amber-200': l.status === 'PENDING_APPROVAL',
                          'bg-red-100 text-red-800 border border-red-200': l.status === 'REJECTED'
                        }">
                    {{ l.status.replace('_', ' ') }}
                  </span>
                </div>

                <h3 class="font-bold text-base text-[#003432] leading-snug">{{ l.title }}</h3>
                <div class="text-[11px] font-mono text-[#0BB4D2] mt-0.5 font-bold">{{ l.reference }}</div>
              </div>

              <!-- Financial Parameters Grid -->
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">Principal Facility:</span>
                  <strong class="font-tabular text-[#003432] font-bold"><span>$</span>{{ l.principalAmount | number:'1.2-2' }}</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">Fixed APR Rate:</span>
                  <strong class="font-tabular text-slate-800">{{ l.interestRateApr }}% Fixed</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">Facility Term:</span>
                  <strong class="font-tabular text-slate-800">{{ l.termMonths }} Months</strong>
                </div>
                <div class="flex justify-between border-t border-slate-200 pt-2">
                  <span class="text-slate-700 font-bold">Monthly Installment:</span>
                  <strong class="font-tabular text-[#003432] font-black text-sm"><span>$</span>{{ l.monthlyInstallment | number:'1.2-2' }}</strong>
                </div>
              </div>

              <!-- Asset Summary if available -->
              @if (l.assetDetails) {
                <div class="text-[11px] text-slate-600 bg-teal-50/50 p-3 rounded-xl border border-teal-100 space-y-0.5">
                  @if (l.loanType === 'CAR_LOAN') {
                    <div><strong>Vehicle:</strong> {{ l.assetDetails.year }} {{ l.assetDetails.make }} {{ l.assetDetails.model }}</div>
                    <div><strong>VIN:</strong> <span class="font-mono text-[10px] font-bold">{{ l.assetDetails.vin || 'N/A' }}</span></div>
                  } @else if (l.loanType === 'MORTGAGE') {
                    <div><strong>Property:</strong> {{ l.assetDetails.propertyType }}</div>
                    <div class="truncate"><strong>Address:</strong> {{ l.assetDetails.address }}</div>
                  }
                </div>
              }

              <!-- Admin Remarks if Rejected -->
              @if (l.status === 'REJECTED' && l.adminRemarks) {
                <div class="p-3 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-700">
                  <strong class="text-red-900 block mb-0.5">Underwriting Rejection Notice:</strong>
                  {{ l.adminRemarks }}
                </div>
              }

              <!-- Actions -->
              <div class="pt-1">
                @if (l.amortizationSchedule?.length) {
                  <button (click)="openAmortizationModal(l)"
                          class="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs">
                    <svg class="w-3.5 h-3.5 text-[#003432]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <span>View Amortization Schedule</span>
                  </button>
                } @else {
                  <div class="text-[11px] text-slate-400 text-center py-2 bg-slate-50 rounded-xl font-medium border border-slate-100">
                    Schedule pending underwriting clearance
                  </div>
                }
              </div>

            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-500 text-xs shadow-xs">
          <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="font-bold text-slate-700 text-sm">No Active Credit Facilities Found</p>
          <p class="text-slate-400 mt-1">Apply for Executive Auto Financing or Prime Mortgage to access institutional liquidity.</p>
        </div>
      }

      <!-- Application Modal (Car Loan / Mortgage) -->
      @if (showApplyModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
            
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 class="text-lg font-black text-[#003432]">Institutional Credit Facility Application</h2>
                <p class="text-xs text-slate-500">Underwritten with Admin Human-in-the-Loop approval</p>
              </div>
              <button (click)="showApplyModal.set(false)" class="text-slate-400 hover:text-slate-600 text-2xl font-bold">&times;</button>
            </div>

            <!-- Type Selector Tabs -->
            <div class="grid grid-cols-2 gap-3">
              <button type="button" (click)="switchLoanType('CAR_LOAN')"
                      [ngClass]="applyForm.loanType === 'CAR_LOAN' ? 'bg-[#003432] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                      class="py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2">
                <span>🚗 Executive Auto</span>
              </button>
              <button type="button" (click)="switchLoanType('MORTGAGE')"
                      [ngClass]="applyForm.loanType === 'MORTGAGE' ? 'bg-[#003432] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                      class="py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2">
                <span>🏡 Prime Mortgage</span>
              </button>
            </div>

            <form (ngSubmit)="submitApplication()" class="space-y-4">
              
              <!-- Principal & Tenure -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Requested Principal ($) *</label>
                  <input type="number" [(ngModel)]="applyForm.principalAmount" name="principal" required min="1000"
                         class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                         [placeholder]="applyForm.loanType === 'CAR_LOAN' ? '65000' : '450000'">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tenure (Months) *</label>
                  <select [(ngModel)]="applyForm.termMonths" name="termMonths" 
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                    @if (applyForm.loanType === 'CAR_LOAN') {
                      <option [value]="24">24 Months (2 Years)</option>
                      <option [value]="36">36 Months (3 Years)</option>
                      <option [value]="48">48 Months (4 Years)</option>
                      <option [value]="60">60 Months (5 Years)</option>
                    } @else {
                      <option [value]="120">120 Months (10 Years)</option>
                      <option [value]="180">180 Months (15 Years)</option>
                      <option [value]="240">240 Months (20 Years)</option>
                      <option [value]="360">360 Months (30 Years)</option>
                    }
                  </select>
                </div>
              </div>

              <!-- Monthly Income -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Verified Monthly Income ($) *</label>
                <input type="number" [(ngModel)]="applyForm.monthlyIncome" name="income" required min="500"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                       placeholder="12500.00">
              </div>

              <!-- Conditional Fields: Car Loan -->
              @if (applyForm.loanType === 'CAR_LOAN') {
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div class="text-xs font-bold text-slate-700 uppercase">Vehicle Asset Details</div>
                  <div class="grid grid-cols-2 gap-3">
                    <input type="text" [(ngModel)]="applyForm.carMake" name="carMake" placeholder="Make (e.g. Mercedes-Benz)" 
                           class="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                    <input type="text" [(ngModel)]="applyForm.carModel" name="carModel" placeholder="Model (e.g. E 350 4MATIC)" 
                           class="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <input type="number" [(ngModel)]="applyForm.carYear" name="carYear" placeholder="Year (2024)" 
                           class="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                    <input type="text" [(ngModel)]="applyForm.carVin" name="carVin" placeholder="VIN Number" 
                           class="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                  </div>
                </div>
              }

              <!-- Conditional Fields: Mortgage -->
              @if (applyForm.loanType === 'MORTGAGE') {
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div class="text-xs font-bold text-slate-700 uppercase">Real Estate Property Details</div>
                  <input type="text" [(ngModel)]="applyForm.propertyType" name="propType" placeholder="Property Type (e.g. Luxury Penthouse)" 
                         class="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                  <input type="text" [(ngModel)]="applyForm.propertyAddress" name="propAddr" placeholder="Full Property Address (e.g. Canary Wharf, London)" 
                         class="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                  <div class="grid grid-cols-2 gap-3">
                    <input type="text" [(ngModel)]="applyForm.employer" name="employer" placeholder="Employer / Corporate Role" 
                           class="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                    <input type="number" [(ngModel)]="applyForm.downPayment" name="downPay" placeholder="Down Payment ($)" 
                           class="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                  </div>
                </div>
              }

              <!-- Estimated Monthly Installment Pill -->
              <div class="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs flex items-center justify-between">
                <span class="text-teal-950 font-semibold">Estimated Monthly Installment:</span>
                <strong class="font-tabular text-[#003432] text-sm font-black">
                  <span>$</span>{{ estimatedMonthlyPayment() | number:'1.2-2' }} / mo
                </strong>
              </div>

              <div class="flex items-center justify-end gap-3 pt-3">
                <button type="button" (click)="showApplyModal.set(false)" class="px-4 py-2.5 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-100 transition">
                  Cancel
                </button>
                <button type="submit" [disabled]="submitting" 
                        class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs transition">
                  Submit Facility Application &rarr;
                </button>
              </div>

            </form>

          </div>
        </div>
      }

      <!-- Amortization Schedule Modal -->
      @if (selectedLoanForSchedule()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[85vh] flex flex-col border border-slate-200">
            
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 class="text-base font-bold text-[#003432]">Loan Amortization Breakdown Table</h2>
                <p class="text-xs text-slate-500">{{ selectedLoanForSchedule()?.title }} &bull; Fixed {{ selectedLoanForSchedule()?.interestRateApr }}% APR</p>
              </div>
              <button (click)="selectedLoanForSchedule.set(null)" class="text-slate-400 hover:text-slate-600 text-2xl font-bold">&times;</button>
            </div>

            <!-- Schedule Table -->
            <div class="flex-1 overflow-y-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left text-xs font-tabular">
                <thead class="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 sticky top-0">
                  <tr>
                    <th class="py-3 px-4">Month</th>
                    <th class="py-3 px-4 text-right">Installment</th>
                    <th class="py-3 px-4 text-right">Principal</th>
                    <th class="py-3 px-4 text-right">Interest</th>
                    <th class="py-3 px-4 text-right">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (entry of selectedLoanForSchedule()?.amortizationSchedule; track entry.month) {
                    <tr class="hover:bg-slate-50/80 transition">
                      <td class="py-2.5 px-4 font-bold text-slate-700">Month {{ entry.month }}</td>
                      <td class="py-2.5 px-4 text-right font-black text-[#003432]"><span>$</span>{{ entry.installment | number:'1.2-2' }}</td>
                      <td class="py-2.5 px-4 text-right text-emerald-600 font-bold"><span>$</span>{{ entry.principal | number:'1.2-2' }}</td>
                      <td class="py-2.5 px-4 text-right text-amber-600 font-semibold"><span>$</span>{{ entry.interest | number:'1.2-2' }}</td>
                      <td class="py-2.5 px-4 text-right font-bold text-slate-900"><span>$</span>{{ entry.remainingBalance | number:'1.2-2' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Amortization calculated on exact mathematical annuity formulas.</span>
              <button (click)="selectedLoanForSchedule.set(null)" 
                      class="bg-[#003432] hover:bg-[#002625] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition">
                Close Schedule
              </button>
            </div>

          </div>
        </div>
      }

    </div>
  `
})
export class LoansComponent implements OnInit {
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  loans = signal<Loan[]>([]);
  showApplyModal = signal<boolean>(false);
  selectedLoanForSchedule = signal<Loan | null>(null);
  submitting = false;

  applyForm = {
    loanType: 'CAR_LOAN' as 'CAR_LOAN' | 'MORTGAGE',
    principalAmount: 55000 as number | null,
    termMonths: 48,
    monthlyIncome: 12500 as number | null,
    carMake: 'Mercedes-Benz',
    carModel: 'E-Class Sedan',
    carYear: 2024,
    carVin: 'WDDZF4KB1RA998822',
    propertyType: 'Penthouse Apartment',
    propertyAddress: 'Canary Wharf Tower, London E14 5AB',
    employer: 'Executive Director, Vance Holdings',
    downPayment: 15000
  };

  estimatedMonthlyPayment(): number {
    const P = this.applyForm.principalAmount || 0;
    const n = this.applyForm.termMonths || 12;
    const apr = this.applyForm.loanType === 'CAR_LOAN' ? 0.055 : 0.042;
    const r = apr / 12;
    if (P <= 0 || n <= 0) return 0;
    const factor = Math.pow(1 + r, n);
    return (P * (r * factor)) / (factor - 1);
  }

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.accountService.listLoans().subscribe({
      next: (res) => {
        if (res.data) {
          this.loans.set(res.data);
        }
      }
    });
  }

  switchLoanType(type: 'CAR_LOAN' | 'MORTGAGE'): void {
    this.applyForm.loanType = type;
    this.applyForm.termMonths = type === 'CAR_LOAN' ? 48 : 240;
    this.applyForm.principalAmount = type === 'CAR_LOAN' ? 65000 : 450000;
  }

  openApplyModal(type: 'CAR_LOAN' | 'MORTGAGE'): void {
    this.switchLoanType(type);
    this.showApplyModal.set(true);
  }

  openAmortizationModal(loan: Loan): void {
    this.selectedLoanForSchedule.set(loan);
  }

  submitApplication(): void {
    if (!this.applyForm.principalAmount || this.applyForm.principalAmount <= 0) {
      this.modalService.alert({ title: 'Invalid Amount', message: 'Please provide a valid loan amount.', type: 'warning' });
      return;
    }

    const assetDetails = this.applyForm.loanType === 'CAR_LOAN' ? {
      make: this.applyForm.carMake,
      model: this.applyForm.carModel,
      year: this.applyForm.carYear,
      vin: this.applyForm.carVin
    } : {
      propertyType: this.applyForm.propertyType,
      address: this.applyForm.propertyAddress,
      employer: this.applyForm.employer,
      downPayment: this.applyForm.downPayment
    };

    this.submitting = true;
    this.accountService.applyLoan({
      loanType: this.applyForm.loanType,
      principalAmount: this.applyForm.principalAmount,
      termMonths: this.applyForm.termMonths,
      monthlyIncome: this.applyForm.monthlyIncome || 0,
      assetDetails
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.showApplyModal.set(false);
        this.modalService.alert({ title: 'Application Submitted', message: res.message || 'Credit application submitted for review.', type: 'success' });
        this.loadLoans();
      },
      error: (err) => {
        this.submitting = false;
        this.modalService.alert({ title: 'Application Error', message: err.error?.message || 'Failed to submit application.', type: 'danger' });
      }
    });
  }
}
