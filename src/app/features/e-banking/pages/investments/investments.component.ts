import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { InvestmentPlan, UserInvestment } from '../../../../core/models/bank.models';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full max-w-full overflow-x-hidden space-y-6 lg:space-y-8 font-sans animate-fade-in min-w-0">
      
      <!-- Top Hero Banner (Responsive Stacking for Mobile & Full Width for Laptop) -->
      <div class="rounded-3xl p-5 sm:p-7 lg:p-8 bg-gradient-to-r from-[#003432] via-[#004240] to-[#002625] text-white shadow-md relative overflow-hidden">
        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/40">
              <span class="w-2 h-2 rounded-full bg-[#0BB4D2] animate-pulse"></span>
              <span>VaultAtlantic Prime Yield Desk</span>
            </div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-black font-nunito tracking-tight text-white">
              Fixed-Yield Investment Portfolios
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Access curated high-yield fixed income vaults, sovereign debt notes, and quantitative algorithmic strategies with daily compounding returns.
            </p>
          </div>

          <!-- Live Balance & Earnings Stat Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
            <div class="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center justify-between sm:block space-y-1">
              <div>
                <div class="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Accrued Yield Earnings</div>
                <div class="text-lg sm:text-2xl font-black font-nunito text-emerald-400 font-tabular">
                  &#36;{{ investmentEarnings() | number:'1.2-2' }}
                </div>
              </div>
              <span class="text-emerald-400 text-xs font-bold sm:hidden">Daily ROI</span>
            </div>

            <div class="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center justify-between sm:block space-y-1">
              <div>
                <div class="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Available Vault Balance</div>
                <div class="text-lg sm:text-2xl font-black font-nunito text-[#0BB4D2] font-tabular">
                  &#36;{{ availableBalance() | number:'1.2-2' }}
                </div>
              </div>
              <span class="text-[#0BB4D2] text-xs font-bold sm:hidden">Liquid</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Plans Section: Balanced 2 to 4 Columns for Mobile, Laptop & Ultrawide -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div>
            <h2 class="text-base sm:text-lg font-bold font-nunito text-[#003432]">Institutional Treasury Vaults</h2>
            <p class="text-xs text-slate-500">Select an allocation tier tailored to your tenure and return preferences.</p>
          </div>
          <span class="text-xs font-bold text-[#0BB4D2] self-start sm:self-auto bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
            100% Principal Guaranteed
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          @for (plan of plans(); track plan.id) {
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition relative group overflow-hidden">
              
              <div class="space-y-3.5">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        [ngClass]="{
                          'bg-emerald-50 text-emerald-700 border border-emerald-200': plan.risk_level === 'LOW',
                          'bg-blue-50 text-blue-700 border border-blue-200': plan.risk_level === 'MEDIUM',
                          'bg-purple-50 text-purple-700 border border-purple-200': plan.risk_level === 'HIGH'
                        }">
                    {{ plan.risk_level }} Risk
                  </span>
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{{ plan.duration_days }} Days</span>
                </div>

                <div>
                  <h3 class="text-base font-bold text-slate-900 font-nunito group-hover:text-[#003432] transition">{{ plan.name }}</h3>
                  <div class="text-[11px] text-[#0BB4D2] font-semibold mt-0.5">{{ plan.category }}</div>
                </div>

                <!-- ROI Highlight Box -->
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/90 space-y-1">
                  <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fixed Net Return (ROI)</div>
                  <div class="text-2xl font-black font-nunito text-emerald-600 font-tabular flex items-baseline gap-1">
                    <span>+{{ plan.roi_percent }}%</span>
                    <span class="text-[11px] font-normal text-slate-500">total yield</span>
                  </div>
                </div>

                <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">{{ plan.description }}</p>

                <div class="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100 font-tabular">
                  <div class="flex justify-between">
                    <span>Min Allocation:</span>
                    <strong class="text-slate-800">&#36;{{ plan.min_amount | number:'1.0-0' }}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span>Max Allocation:</span>
                    <strong class="text-slate-800">&#36;{{ plan.max_amount | number:'1.0-0' }}</strong>
                  </div>
                </div>
              </div>

              <button (click)="openInvestModal(plan)" 
                      class="mt-5 w-full bg-[#003432] hover:bg-[#002625] text-white py-3 rounded-xl text-xs font-bold shadow-xs text-center transition flex items-center justify-center gap-1.5 active:scale-95">
                <span>Allocate Capital &rarr;</span>
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Lower Section: Active Investments (Left) + Interactive Yield Simulator (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        
        <!-- Left: Active Investments (8 Cols on Laptop) -->
        <div class="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden w-full min-w-0">
          <div class="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold font-nunito text-[#003432]">Your Active Portfolios</h2>
              <p class="text-xs text-slate-500">Live compounding performance and maturity schedule.</p>
            </div>
            <button (click)="loadInvestments()" class="p-2 rounded-xl text-slate-400 hover:text-[#003432] hover:bg-slate-100 transition" title="Refresh">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>

          @if (userInvestments().length === 0) {
            <div class="p-8 sm:p-10 text-center space-y-3 w-full min-w-0">
              <div class="w-12 h-12 rounded-2xl bg-teal-50 text-[#003432] flex items-center justify-center mx-auto text-xl font-bold">
                📈
              </div>
              <div class="text-sm font-bold text-slate-800 font-nunito">No active investment allocations</div>
              <p class="text-xs text-slate-500 max-w-sm mx-auto">Choose one of the institutional packages above to begin earning daily compounded yield.</p>
            </div>
          } @else {
            
            <!-- Desktop Table View (lg+ screens) -->
            <div class="hidden lg:block w-full max-w-full overflow-x-auto">
              <table class="w-full text-left text-xs min-w-[650px]">
                <thead class="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="px-5 py-3.5">Plan / Strategy</th>
                    <th class="px-5 py-3.5">Capital Invested</th>
                    <th class="px-5 py-3.5">Projected ROI</th>
                    <th class="px-5 py-3.5">Tenure</th>
                    <th class="px-5 py-3.5">Maturity Date</th>
                    <th class="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                  @for (sub of userInvestments(); track sub.id) {
                    <tr class="hover:bg-slate-50/80 transition">
                      <td class="px-5 py-4">
                        <div class="font-bold text-slate-900">{{ sub.plan_name }}</div>
                        <div class="text-[10px] text-slate-400">{{ sub.category }} &bull; {{ sub.roi_percent }}% ROI</div>
                      </td>
                      <td class="px-5 py-4 font-tabular font-bold text-slate-900">
                        &#36;{{ sub.amount_invested | number:'1.2-2' }}
                      </td>
                      <td class="px-5 py-4 font-tabular font-bold text-emerald-600">
                        +&#36;{{ sub.expected_roi | number:'1.2-2' }}
                      </td>
                      <td class="px-5 py-4 text-slate-500">{{ sub.duration_days }} Days</td>
                      <td class="px-5 py-4 text-slate-500">{{ sub.end_date | date:'mediumDate' }}</td>
                      <td class="px-5 py-4">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Yield
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Mobile Native Card Feed (Zero Horizontal Overflow on Phones & Tablets) -->
            <div class="lg:hidden divide-y divide-slate-100 w-full min-w-0">
              @for (sub of userInvestments(); track sub.id) {
                <div class="p-3.5 sm:p-4 space-y-2.5 hover:bg-slate-50 transition w-full min-w-0">
                  <div class="flex items-start justify-between gap-2 min-w-0">
                    <div class="min-w-0 flex-1">
                      <div class="font-bold text-sm text-slate-900 truncate">{{ sub.plan_name }}</div>
                      <div class="text-[11px] text-slate-400 truncate">{{ sub.category }} &bull; {{ sub.duration_days }} Days</div>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Compounding
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-tabular w-full min-w-0">
                    <div class="min-w-0">
                      <span class="text-[10px] text-slate-400 block uppercase font-bold">Invested</span>
                      <strong class="text-slate-900 text-sm truncate block">&#36;{{ sub.amount_invested | number:'1.2-2' }}</strong>
                    </div>
                    <div class="min-w-0">
                      <span class="text-[10px] text-slate-400 block uppercase font-bold">Net Yield</span>
                      <strong class="text-emerald-600 text-sm truncate block">+&#36;{{ sub.expected_roi | number:'1.2-2' }}</strong>
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 w-full min-w-0 gap-2">
                    <span class="truncate">Matures: <strong class="text-slate-700">{{ sub.end_date | date:'mediumDate' }}</strong></span>
                    <span class="font-bold text-teal-700 shrink-0">+{{ sub.roi_percent }}% Return</span>
                  </div>
                </div>
              }
            </div>

          }
        </div>

        <!-- Right: Institutional Fiduciary Terms & Yield Guidance (4 Cols on Laptop) -->
        <div class="lg:col-span-4 space-y-5 w-full min-w-0">
          
          <!-- Fiduciary Guarantee Card -->
          <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-3.5">
            <div class="flex items-center gap-2 text-xs font-bold text-[#003432] uppercase tracking-wider">
              <span>🛡️</span> <span>Fiduciary Guarantee</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              All investment packages are held under statutory segregated custodial accounts. Yields accrue daily and sweep directly into your investment earnings ledger.
            </p>
            <div class="space-y-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Automated Daily Compounding</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Principal &amp; Interest Sweep at Maturity</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Audited Institutional Counterparties</span>
              </div>
            </div>
          </div>

          <!-- Need Assistance Card -->
          <div class="bg-gradient-to-br from-[#003432] to-[#002625] text-white rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
            <div class="flex items-center gap-2 text-xs font-bold text-[#0BB4D2] uppercase tracking-wider">
              <span>💼</span> <span>Treasury Advisory</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Seeking customized institutional private wealth allocations exceeding $250,000? Our portfolio directors provide dedicated wealth advisory.
            </p>
            <div class="pt-2">
              <a routerLink="/e-banking/support" 
                 class="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition border border-white/20">
                <span>Contact Portfolio Desk &rarr;</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      <!-- Investment Participation Modal (Mobile-Safe Height & Touch Friendly) -->
      @if (selectedPlan()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
          <div class="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-base font-bold font-nunito text-[#003432]">Allocate into {{ selectedPlan()?.name }}</h3>
                <p class="text-xs text-slate-500">{{ selectedPlan()?.duration_days }} Days Tenure &bull; +{{ selectedPlan()?.roi_percent }}% Net Yield</p>
              </div>
              <button (click)="selectedPlan.set(null)" class="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none">&times;</button>
            </div>

            <form (ngSubmit)="confirmInvestment()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Investment Amount (USD)</label>
                <div class="relative">
                  <span class="absolute left-4 top-2.5 text-base font-bold text-slate-400">$</span>
                  <input type="number" [(ngModel)]="investAmount" name="amount" required
                         [min]="selectedPlan()?.min_amount ?? null" [max]="selectedPlan()?.max_amount ?? null"
                         placeholder="Enter amount"
                         class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-base font-bold bg-white focus:ring-2 focus:ring-[#003432] outline-none font-tabular text-slate-800 transition">
                </div>
                <div class="text-[11px] text-slate-500 mt-1.5 flex justify-between">
                  <span>Available Balance: <strong class="text-slate-700">&#36;{{ availableBalance() | number:'1.2-2' }}</strong></span>
                  <span>Min: <strong class="text-slate-700">&#36;{{ selectedPlan()?.min_amount | number:'1.0-0' }}</strong></span>
                </div>
              </div>

              <!-- Real-time Projected Returns Breakdown -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-2 text-xs">
                <div class="flex justify-between text-slate-500">
                  <span>Gross Capital Invested:</span>
                  <span class="text-slate-900 font-tabular font-bold">&#36;{{ (investAmount || 0) | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-slate-500">
                  <span>Target Yield (+{{ selectedPlan()?.roi_percent }}%):</span>
                  <span class="text-emerald-600 font-tabular font-bold">+&#36;{{ calculatedRoi() | number:'1.2-2' }}</span>
                </div>
                <div class="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
                  <span class="text-[#003432]">Estimated Total Return:</span>
                  <span class="text-emerald-700 font-tabular font-bold text-base">
                    &#36;{{ ((investAmount || 0) + calculatedRoi()) | number:'1.2-2' }}
                  </span>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" (click)="selectedPlan.set(null)" 
                        class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition text-center">
                  Cancel
                </button>
                <button type="submit" [disabled]="submitting()"
                        class="w-full sm:w-auto bg-[#003432] hover:bg-[#002625] text-white px-7 py-3 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-95">
                  <span>{{ submitting() ? 'Allocating...' : 'Confirm Capital Allocation &rarr;' }}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      }

    </div>
  `
})
export class InvestmentsComponent implements OnInit {
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  plans = signal<InvestmentPlan[]>([]);
  userInvestments = signal<UserInvestment[]>([]);
  availableBalance = signal<number>(0);
  investmentEarnings = signal<number>(0);
  selectedPlan = signal<InvestmentPlan | null>(null);
  investAmount: number = 0;
  submitting = signal<boolean>(false);

  ngOnInit() {
    this.loadPlans();
    this.loadInvestments();
    this.loadBalances();
  }

  loadBalances() {
    this.accountService.getSummary().subscribe({
      next: (res) => {
        if (res.success && res.data?.account) {
          this.availableBalance.set(parseFloat(res.data.account.availableBalance || '0'));
          this.investmentEarnings.set(parseFloat(res.data.account.investmentEarnings || '0'));
        }
      }
    });
  }

  loadPlans() {
    this.accountService.listInvestmentPlans().subscribe({
      next: (res) => {
        if (res.success) this.plans.set(res.data);
      }
    });
  }

  loadInvestments() {
    this.accountService.listUserInvestments().subscribe({
      next: (res) => {
        if (res.success) this.userInvestments.set(res.data);
      }
    });
  }

  openInvestModal(plan: InvestmentPlan) {
    this.selectedPlan.set(plan);
    this.investAmount = Number(plan.min_amount);
  }

  calculatedRoi(): number {
    const p = this.selectedPlan();
    if (!p || !this.investAmount) return 0;
    return this.investAmount * (Number(p.roi_percent) / 100);
  }

  confirmInvestment() {
    const plan = this.selectedPlan();
    if (!plan) return;

    if (this.investAmount < Number(plan.min_amount) || this.investAmount > Number(plan.max_amount)) {
      this.modalService.alert({
        title: 'Amount Out of Range',
        message: `Allocation must be between $${Number(plan.min_amount).toLocaleString()} and $${Number(plan.max_amount).toLocaleString()}.`,
        type: 'danger'
      });
      return;
    }

    if (this.investAmount > this.availableBalance()) {
      this.modalService.alert({
        title: 'Insufficient Balance',
        message: `Your available balance of $${this.availableBalance().toFixed(2)} is less than the requested allocation.`,
        type: 'danger'
      });
      return;
    }

    this.submitting.set(true);
    this.accountService.subscribeInvestmentPlan(plan.id, this.investAmount).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.selectedPlan.set(null);
        this.modalService.alert({
          title: 'Investment Active',
          message: `Successfully allocated $${this.investAmount.toFixed(2)} into ${plan.name}. Returns will accrue over ${plan.duration_days} days.`,
          type: 'success'
        });
        this.loadInvestments();
        this.loadBalances();
      },
      error: (err) => {
        this.submitting.set(false);
        this.modalService.alert({
          title: 'Allocation Failed',
          message: err.error?.message || 'Failed to subscribe to investment plan.',
          type: 'danger'
        });
      }
    });
  }
}
