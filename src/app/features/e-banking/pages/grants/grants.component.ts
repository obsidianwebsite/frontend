import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { Grant } from '../../../../core/models/bank.models';
import { ModalService } from '../../../../core/services/modal.service';

interface GrantProgramme {
  title: string;
  category: string;
  maxFunding: number;
  deadline: string;
  description: string;
  badge: string;
}

@Component({
  selector: 'app-grants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 lg:space-y-8 animate-fade-in">
      
      <!-- Top Hero Banner -->
      <div class="rounded-2xl p-6 sm:p-8 bg-[#003432] text-white relative overflow-hidden shadow-xs">
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div class="space-y-1.5 max-w-xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/30">
              <span>Federal &amp; Foundation Endowments</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">Institutional Grant Facilities</h1>
            <p class="text-xs sm:text-sm text-slate-300">
              Non-repayable endowment funds provided in partnership with federal commerce departments and corporate philanthropic trusts.
            </p>
          </div>

          <button (click)="openApplyModal()" 
                  class="bg-white hover:bg-slate-100 text-[#003432] px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition">
            <span>+ Apply for Grant</span>
          </button>
        </div>
      </div>

      <!-- Featured Grant Programmes -->
      <div class="space-y-3">
        <h2 class="text-lg font-black text-[#003432]">Open Funding Programmes</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          @for (prog of availableProgrammes; track prog.title) {
            <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition">
              <div class="space-y-3">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 text-[#003432] border border-teal-100">
                  {{ prog.category }}
                </span>
                <h3 class="text-sm font-extrabold text-slate-900 leading-snug">{{ prog.title }}</h3>
                <p class="text-xs text-slate-500">{{ prog.description }}</p>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span class="text-slate-400 text-[10px] uppercase font-bold block">Funding Cap:</span>
                  <span class="text-base font-black text-[#003432] font-tabular">&#36;{{ prog.maxFunding | number }}</span>
                </div>
              </div>

              <button (click)="openApplyModal(prog)" 
                      class="mt-5 w-full py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs">
                Submit Proposal
              </button>
            </div>
          }
        </div>
      </div>

      <!-- User Applications Table -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-base font-extrabold text-[#003432]">Your Submitted Grant Applications</h2>
            <p class="text-xs text-slate-500">Track underwriting status and fund disbursements.</p>
          </div>
          <button (click)="loadGrants()" class="p-2 text-slate-400 hover:text-[#003432] transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
        </div>

        @if (grants().length === 0) {
          <div class="p-12 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
              📜
            </div>
            <div class="text-sm font-bold text-slate-800">No grant applications submitted yet</div>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">Click "Submit Proposal" on any programme above to apply for institutional funding.</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th class="px-5 py-3.5">Reference</th>
                  <th class="px-5 py-3.5">Programme</th>
                  <th class="px-5 py-3.5">Amount Requested</th>
                  <th class="px-5 py-3.5">Status</th>
                  <th class="px-5 py-3.5">Review Remarks</th>
                  <th class="px-5 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                @for (grant of grants(); track grant.id) {
                  <tr class="hover:bg-slate-50/60 transition">
                    <td class="px-5 py-4 font-mono font-bold text-[#003432]">{{ grant.reference_number }}</td>
                    <td class="px-5 py-4 font-bold text-slate-800">{{ grant.programme_name }}</td>
                    <td class="px-5 py-4 font-tabular font-bold text-slate-900">&#36;{{ grant.amount_requested | number:'1.2-2' }}</td>
                    <td class="px-5 py-4">
                      @if (grant.status === 'DISBURSED') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Disbursed to Account ✓
                        </span>
                      } @else if (grant.status === 'APPROVED') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      } @else if (grant.status === 'PROCESSING') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                          Underwriting Review
                        </span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Declined
                        </span>
                      }
                    </td>
                    <td class="px-5 py-4 text-slate-500 max-w-xs truncate">{{ grant.admin_remarks || 'Pending review' }}</td>
                    <td class="px-5 py-4 text-slate-500 whitespace-nowrap">{{ grant.created_at | date:'mediumDate' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Grant Application Modal -->
      @if (showApplyModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-lg font-black text-[#003432]">Grant Funding Application</h3>
                <p class="text-xs text-slate-500">Provide an executive summary and financial justification.</p>
              </div>
              <button (click)="showApplyModal.set(false)" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
            </div>

            <form (ngSubmit)="submitGrantApplication()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Grant Programme</label>
                <input type="text" [(ngModel)]="applicationForm.programmeName" name="programmeName" required
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Funding Amount Requested (USD)</label>
                <div class="relative">
                  <span class="absolute left-4 top-2.5 text-sm font-bold text-slate-400">$</span>
                  <input type="number" [(ngModel)]="applicationForm.amountRequested" name="amount" min="1000" step="any" required
                         placeholder="25000.00"
                         class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none font-tabular">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Executive Purpose &amp; Impact Summary</label>
                <textarea [(ngModel)]="applicationForm.businessPurpose" name="purpose" rows="4" required
                          placeholder="Outline the operational project, planned expenditures, expected milestones, and civic or market impact..."
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none"></textarea>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" (click)="showApplyModal.set(false)" 
                        class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" [disabled]="submitting()"
                        class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition">
                  <span>{{ submitting() ? 'Submitting...' : 'Submit Application' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class GrantsComponent implements OnInit {
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  grants = signal<Grant[]>([]);
  showApplyModal = signal<boolean>(false);
  submitting = signal<boolean>(false);

  availableProgrammes: GrantProgramme[] = [
    {
      title: 'Clean Energy & Microgrid Technology Grant',
      category: 'Energy & Tech',
      maxFunding: 50000,
      deadline: 'Rolling',
      description: 'Capital deployment for renewable energy infrastructure, grid battery storage, and emissions mitigation.',
      badge: 'Open'
    },
    {
      title: 'Small Business Working Capital Relief',
      category: 'Commerce',
      maxFunding: 25000,
      deadline: 'Quarterly',
      description: 'Emergency liquidity injections to support payroll stabilization, supply chain expansion, and tooling.',
      badge: 'Open'
    },
    {
      title: 'STEM Advanced Educational Fellowship',
      category: 'Education',
      maxFunding: 15000,
      deadline: 'Annual',
      description: 'Endowment scholarships for doctoral researchers in cybersecurity architecture, biotechnology, and AI.',
      badge: 'Open'
    },
    {
      title: 'AgriTech Sustainable Yield Initiative',
      category: 'Agriculture',
      maxFunding: 40000,
      deadline: 'Rolling',
      description: 'Precision irrigation, drone analytics, and low-waste organic distribution logistics.',
      badge: 'Open'
    }
  ];

  applicationForm = {
    programmeName: '',
    category: 'Business Development',
    amountRequested: '',
    businessPurpose: ''
  };

  ngOnInit() {
    this.loadGrants();
  }

  loadGrants() {
    this.accountService.listUserGrants().subscribe({
      next: (res) => {
        if (res.success) this.grants.set(res.data);
      }
    });
  }

  openApplyModal(prog?: GrantProgramme) {
    if (prog) {
      this.applicationForm.programmeName = prog.title;
      this.applicationForm.category = prog.category;
      this.applicationForm.amountRequested = String(prog.maxFunding);
    } else {
      this.applicationForm.programmeName = 'Federal Enterprise Innovation Grant';
      this.applicationForm.amountRequested = '20000';
    }
    this.showApplyModal.set(true);
  }

  submitGrantApplication() {
    const amt = parseFloat(this.applicationForm.amountRequested);
    if (isNaN(amt) || amt <= 0) {
      this.modalService.alert({ title: 'Invalid Amount', message: 'Please enter a valid requested grant amount.', type: 'danger' });
      return;
    }

    if (!this.applicationForm.businessPurpose.trim()) {
      this.modalService.alert({ title: 'Missing Proposal', message: 'Please provide a business purpose for the application.', type: 'danger' });
      return;
    }

    this.submitting.set(true);
    this.accountService.applyGrant({
      programmeName: this.applicationForm.programmeName,
      category: this.applicationForm.category,
      amountRequested: amt,
      businessPurpose: this.applicationForm.businessPurpose
    }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.showApplyModal.set(false);
        this.modalService.alert({
          title: 'Proposal Submitted',
          message: `Your grant proposal has been received. Reference: ${res.data.referenceNumber}. Underwriters will review your application.`,
          type: 'success'
        });
        this.loadGrants();
      },
      error: (err) => {
        this.submitting.set(false);
        this.modalService.alert({
          title: 'Submission Failed',
          message: err.error?.message || 'Failed to submit grant application.',
          type: 'danger'
        });
      }
    });
  }
}
