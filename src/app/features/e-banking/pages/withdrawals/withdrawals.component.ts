import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { Withdrawal } from '../../../../core/models/bank.models';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-withdrawals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="w-full max-w-full overflow-x-hidden space-y-6 lg:space-y-8 font-sans animate-fade-in min-w-0">
      
      <!-- Top Title & Available Funds Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full min-w-0">
        <div class="min-w-0">
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-[#003432] tracking-tight break-words">
            Capital Withdrawal &amp; Liquidity Clearance
          </h1>
          <p class="text-xs text-slate-500 mt-1 leading-normal break-words">
            Initiate audited capital disbursements to domestic FedWire, ACH, and international SWIFT correspondent institutions.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:gap-2.5 self-start sm:self-auto shrink-0 max-w-full">
          <span class="px-3 py-2 rounded-xl bg-white text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs flex items-center gap-2 min-w-0">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span class="truncate">Available: <strong class="font-tabular text-[#003432]">&#36;{{ availableBalance() | number:'1.2-2' }}</strong></span>
          </span>

          <a routerLink="/e-banking/support" 
             class="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5 shadow-2xs shrink-0">
            <span>🛡️</span>
            <span>Compliance Desk</span>
          </a>
        </div>
      </div>

      <!-- Inactive Account Banner -->
      @if (accountStatus() === 'INACTIVE') {
        <div class="rounded-2xl p-4 bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-sm">
          <svg class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div class="text-xs sm:text-sm">
            <p class="font-bold text-amber-900">Account Inactive — Withdrawals Disabled</p>
            <p class="text-amber-800 mt-0.5">This account is currently inactive. Capital disbursements and wire withdrawals are disabled. Please contact customer support to activate your account.</p>
          </div>
        </div>
      }

      <!-- 12-Column Responsive Grid: Fits Mobile Viewports & Expands Elegantly on Laptop -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        
        <!-- ========================================================================= -->
        <!-- MAIN CAPITAL WITHDRAWAL FORM (Left Side: 7-8 Cols on Laptop)               -->
        <!-- ========================================================================= -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-6 w-full min-w-0">
          
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-4 sm:p-7 space-y-5 sm:space-y-6 w-full min-w-0 overflow-hidden">
            
            <!-- Escrow Clearance Protocol Notice -->
            <div class="p-3 sm:p-4 rounded-xl bg-cyan-50/80 border border-cyan-200/80 text-cyan-950 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs w-full min-w-0">
              <div class="flex items-start sm:items-center gap-2.5 min-w-0">
                <div class="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <span class="leading-relaxed break-words min-w-0">
                  Escrow Liquidity Protocol: Disbursed capital is verified against registered clearance tokens before outbound settlement.
                </span>
              </div>
              <span class="text-[11px] font-bold text-cyan-900 bg-white px-2.5 py-1 rounded-lg border border-cyan-200 self-start sm:self-center shrink-0">
                🔒 Segregated Custodial
              </span>
            </div>

            <form (ngSubmit)="submitInPageWithdrawal()" class="space-y-5 w-full min-w-0">
              
              <!-- Outflow Method Selector (3 Clean Cards) -->
              <div class="w-full min-w-0">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Select Disbursement Rail *
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full min-w-0">
                  
                  <!-- Method 1: FedWire Domestic -->
                  <button type="button" (click)="setMethod('BANK_WIRE')"
                          [ngClass]="newWithdrawal.method === 'BANK_WIRE' ? 'border-[#003432] ring-2 ring-[#003432]/10 bg-slate-50/90 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                          class="p-3 sm:p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-2 w-full min-w-0 overflow-hidden">
                    <div class="flex items-center justify-between w-full">
                      <span class="w-8 h-8 rounded-lg bg-teal-50 text-[#003432] flex items-center justify-center font-bold text-xs shrink-0">🏛️</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-tabular shrink-0">$15.00 Fee</span>
                    </div>
                    <div class="min-w-0 w-full">
                      <div class="font-bold text-xs text-[#003432] flex items-center gap-1.5">
                        <span class="truncate">FedWire Domestic</span>
                        @if (newWithdrawal.method === 'BANK_WIRE') { <span class="text-emerald-600 text-[10px] shrink-0">✓</span> }
                      </div>
                      <div class="text-[11px] text-slate-500 mt-0.5 break-words">ABA Commercial Routing (Same Day)</div>
                    </div>
                  </button>

                  <!-- Method 2: International SWIFT -->
                  <button type="button" (click)="setMethod('SWIFT_WIRE')"
                          [ngClass]="newWithdrawal.method === 'SWIFT_WIRE' ? 'border-[#003432] ring-2 ring-[#003432]/10 bg-slate-50/90 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                          class="p-3 sm:p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-2 w-full min-w-0 overflow-hidden">
                    <div class="flex items-center justify-between w-full">
                      <span class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center font-bold text-xs shrink-0">🌐</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 font-tabular shrink-0">$25.00 SWIFT</span>
                    </div>
                    <div class="min-w-0 w-full">
                      <div class="font-bold text-xs text-[#003432] flex items-center gap-1.5">
                        <span class="truncate">International Wire</span>
                        @if (newWithdrawal.method === 'SWIFT_WIRE') { <span class="text-emerald-600 text-[10px] shrink-0">✓</span> }
                      </div>
                      <div class="text-[11px] text-slate-500 mt-0.5 break-words">SWIFT Interbank (24-48 hrs)</div>
                    </div>
                  </button>

                  <!-- Method 3: ACH Direct -->
                  <button type="button" (click)="setMethod('ACH_TRANSFER')"
                          [ngClass]="newWithdrawal.method === 'ACH_TRANSFER' ? 'border-[#003432] ring-2 ring-[#003432]/10 bg-slate-50/90 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                          class="p-3 sm:p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-2 w-full min-w-0 overflow-hidden">
                    <div class="flex items-center justify-between w-full">
                      <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">⚡</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">FREE / $0.00</span>
                    </div>
                    <div class="min-w-0 w-full">
                      <div class="font-bold text-xs text-[#003432] flex items-center gap-1.5">
                        <span class="truncate">Direct ACH</span>
                        @if (newWithdrawal.method === 'ACH_TRANSFER') { <span class="text-emerald-600 text-[10px] shrink-0">✓</span> }
                      </div>
                      <div class="text-[11px] text-slate-500 mt-0.5 break-words">Automated Clearing House (1-2 days)</div>
                    </div>
                  </button>

                </div>
              </div>

              <!-- Amount Input with Max Balance Button -->
              <div class="w-full min-w-0">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Disbursement Amount (USD) *
                </label>
                <div class="relative w-full min-w-0">
                  <span class="absolute left-3.5 top-2.5 text-base font-bold text-slate-400 select-none">$</span>
                  <input type="number" [(ngModel)]="newWithdrawal.amount" name="amount" min="10" step="any" required
                         placeholder="0.00"
                         class="w-full max-w-full box-border pl-8 pr-20 py-2.5 rounded-xl border border-slate-300 text-base font-bold font-tabular text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
                  <button type="button" (click)="setFullBalance()" 
                          class="absolute right-2 top-2 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-[#003432] text-[#003432] hover:text-white font-bold text-xs transition border border-teal-200">
                    Use Max
                  </button>
                </div>
                <div class="text-[11px] text-slate-500 mt-1.5 flex flex-wrap items-center justify-between gap-1 w-full min-w-0">
                  <span class="truncate">Available: <strong class="text-slate-700 font-tabular">&#36;{{ availableBalance() | number:'1.2-2' }}</strong></span>
                  <span class="shrink-0">Min: <strong class="text-slate-700">&#36;10.00</strong></span>
                </div>
              </div>

              <!-- Destination Banking Details -->
              <div class="w-full min-w-0">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Receiving Bank &amp; Account Coordinates *
                </label>
                <textarea [(ngModel)]="newWithdrawal.destinationDetails" name="destinationDetails" rows="3" required
                          placeholder="e.g. JPMorgan Chase Commercial Bank&#10;Account: 882910291029&#10;Routing/SWIFT: 021000021 / CHASUS33&#10;Beneficiary: Apex Holdings LLC"
                          class="w-full max-w-full min-w-0 box-border px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none font-mono text-slate-800 transition resize-none"></textarea>
                <span class="text-[11px] text-slate-400 mt-1 block leading-normal break-words">Specify receiving bank name, account or IBAN, SWIFT/routing code, and beneficiary legal name.</span>
              </div>

              <!-- Human-in-the-Loop Clearance Banner -->
              <div class="p-3 sm:p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs space-y-1 w-full min-w-0">
                <div class="font-bold flex items-center gap-1.5 text-amber-950">
                  <span>🛡️</span> <span>Chief Compliance Verification Protocol</span>
                </div>
                <p class="leading-relaxed text-[11.5px] text-amber-900/90 break-words">
                  Withdrawal disbursements undergo automated liquidity audit and compliance review within 1 to 24 business hours prior to external Fedwire / SWIFT transmission.
                </p>
              </div>

              <!-- Action Bar (Mobile-Friendly Stacking) -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-slate-100 w-full min-w-0">
                <div class="text-xs text-slate-500 min-w-0 break-words">
                  Total Disbursed: <strong class="text-slate-900 font-tabular font-bold text-sm">&#36;{{ totalDebit() | number:'1.2-2' }}</strong>
                  <span class="text-slate-400 text-[11px] block sm:inline ml-0 sm:ml-1">(includes &#36;{{ currentFee() | number:'1.2-2' }} processing fee)</span>
                </div>
                <button type="submit" [disabled]="submitting() || !newWithdrawal.amount || !newWithdrawal.destinationDetails"
                        class="w-full sm:w-auto bg-[#003432] hover:bg-[#002625] text-white px-5 sm:px-7 py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 text-center shrink-0">
                  <span class="truncate">{{ submitting() ? 'Submitting Disbursement...' : 'Submit Capital Withdrawal Request →' }}</span>
                </button>
              </div>

            </form>

          </div>

        </div>

        <!-- ========================================================================= -->
        <!-- SUMMARY, CLEARANCE CODES & COMPLIANCE SIDEBAR (Right: 4-5 Cols on Laptop) -->
        <!-- ========================================================================= -->
        <div class="lg:col-span-5 xl:col-span-4 space-y-5 sm:space-y-6 w-full min-w-0">

          <!-- Card 1: Live Outflow Breakdown -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-4 w-full min-w-0 overflow-hidden">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3 w-full min-w-0">
              <h3 class="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5 min-w-0">
                <span>🧾</span> <span class="truncate">Disbursement Breakdown</span>
              </h3>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#003432] border border-teal-200 shrink-0">
                {{ newWithdrawal.method === 'BANK_WIRE' ? 'FedWire' : (newWithdrawal.method === 'SWIFT_WIRE' ? 'SWIFT' : 'ACH') }}
              </span>
            </div>

            <div class="space-y-2.5 text-xs w-full min-w-0">
              <div class="flex items-center justify-between text-slate-600 gap-2">
                <span class="truncate">Principal Outflow:</span>
                <span class="font-bold font-tabular text-slate-900 shrink-0">&#36;{{ (parsedAmount() || 0) | number:'1.2-2' }}</span>
              </div>

              <div class="flex items-center justify-between text-slate-600 gap-2">
                <span class="truncate">Wire Clearinghouse Fee:</span>
                <span class="font-bold font-tabular shrink-0" [ngClass]="currentFee() > 0 ? 'text-slate-900' : 'text-emerald-700'">
                  {{ currentFee() === 0 ? 'FREE / $0.00' : '$' + (currentFee() | number:'1.2-2') }}
                </span>
              </div>

              <div class="h-px bg-slate-100 my-1"></div>

              <div class="flex items-center justify-between text-sm font-bold gap-2">
                <span class="text-slate-800 truncate">Total Deduction:</span>
                <span class="text-[#003432] font-tabular text-base shrink-0">&#36;{{ totalDebit() | number:'1.2-2' }}</span>
              </div>

              <div class="flex items-center justify-between text-xs pt-1 gap-2">
                <span class="text-slate-500 truncate">Post-Disbursement Balance:</span>
                <span class="font-bold font-tabular shrink-0" [ngClass]="remainingBalance() < 0 ? 'text-rose-600 font-bold' : 'text-slate-700'">
                  &#36;{{ remainingBalance() | number:'1.2-2' }}
                </span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500 w-full min-w-0">
              <span>Estimated Settlement:</span>
              <strong class="text-slate-800 text-right">
                {{ newWithdrawal.method === 'BANK_WIRE' ? 'Same-Day (by 5 PM EST)' : (newWithdrawal.method === 'SWIFT_WIRE' ? '24 to 48 business hours' : '1 to 2 business days') }}
              </strong>
            </div>
          </div>

          <!-- Card 2: Regulatory Clearance Tokens (COT & IMF Compliance) -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-4 w-full min-w-0 overflow-hidden">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3 w-full min-w-0">
              <h3 class="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5 min-w-0">
                <span>🔐</span> <span class="truncate">Clearance Safeguards</span>
              </h3>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                Active
              </span>
            </div>

            <p class="text-[11px] text-slate-500 leading-relaxed break-words">
              Outward capital distributions authenticate under international anti-capital flight and statutory clearinghouse mandates:
            </p>

            <div class="space-y-2 w-full min-w-0">
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs w-full min-w-0">
                <div class="min-w-0">
                  <div class="text-[10px] font-bold text-slate-500 uppercase truncate">Cost of Transfer (COT)</div>
                  <div class="font-mono font-bold text-[#003432] truncate">{{ cotCode() }}</div>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">Verified ✓</span>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs w-full min-w-0">
                <div class="min-w-0">
                  <div class="text-[10px] font-bold text-slate-500 uppercase truncate">IMF Protocol</div>
                  <div class="font-mono font-bold text-[#003432] truncate">{{ imfCode() }}</div>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">Authorized ✓</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Daily Limits & Treasury Contact -->
          <div class="bg-gradient-to-br from-[#003432] to-[#002625] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-3.5 w-full min-w-0 overflow-hidden">
            <div class="flex items-center gap-2 text-xs font-bold text-[#0BB4D2] uppercase tracking-wider">
              <span>🏛️</span> <span>Institutional Outflow Limits</span>
            </div>
            
            <div class="space-y-2 text-xs text-slate-200 w-full min-w-0">
              <div class="flex justify-between border-b border-white/10 pb-1.5 gap-2">
                <span class="text-slate-300 truncate">SWIFT Interbank Limit:</span>
                <span class="font-bold text-white font-tabular shrink-0">$1,000,000 / day</span>
              </div>
              <div class="flex justify-between border-b border-white/10 pb-1.5 gap-2">
                <span class="text-slate-300 truncate">FedWire Commercial:</span>
                <span class="font-bold text-white font-tabular shrink-0">$250,000 / day</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-slate-300 truncate">ACH Direct:</span>
                <span class="font-bold text-emerald-300 font-tabular shrink-0">$100,000 / day</span>
              </div>
            </div>

            <div class="pt-2 text-[11px] text-teal-200/80 flex flex-wrap items-center justify-between gap-1 w-full min-w-0">
              <span class="truncate">Need higher liquidity volume?</span>
              <a routerLink="/e-banking/support" class="font-bold text-[#0BB4D2] hover:text-white transition underline shrink-0">Contact Treasury</a>
            </div>
          </div>

        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- DISBURSEMENT HISTORY & STATUS QUEUE (Full Width Below)                    -->
      <!-- ========================================================================= -->
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden font-sans w-full min-w-0">
        
        <div class="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 w-full min-w-0">
          <div class="min-w-0">
            <h2 class="text-base sm:text-lg font-bold font-nunito text-[#003432]">Disbursement History &amp; Status Queue</h2>
            <p class="text-xs text-slate-500 leading-normal break-words">Track all pending, cleared, and completed capital disbursements in real time.</p>
          </div>
          <button (click)="loadWithdrawals()" 
                  class="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs shrink-0" 
                  title="Refresh">
            <svg class="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>Refresh Queue</span>
          </button>
        </div>

        @if (loading()) {
          <div class="p-12 text-center text-xs text-slate-400">Loading withdrawal records...</div>
        } @else if (withdrawals().length === 0) {
          <div class="p-8 sm:p-10 text-center space-y-3 w-full min-w-0">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
              📤
            </div>
            <div class="text-sm font-bold text-slate-700">No withdrawal records found</div>
            <p class="text-xs text-slate-400 max-w-sm mx-auto leading-normal break-words">
              You have not submitted any withdrawal requests yet. Complete the form above to disburse funds to your verified external account.
            </p>
          </div>
        } @else {
          
          <!-- Desktop Table View (lg+ screens) -->
          <div class="hidden lg:block w-full max-w-full overflow-x-auto">
            <table class="w-full text-left text-xs min-w-[700px]">
              <thead class="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th class="px-5 py-3.5">Reference</th>
                  <th class="px-5 py-3.5">Disbursement Rail</th>
                  <th class="px-5 py-3.5">Amount &amp; Fee</th>
                  <th class="px-5 py-3.5">Destination Banking Details</th>
                  <th class="px-5 py-3.5">Clearance Status</th>
                  <th class="px-5 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                @for (item of withdrawals(); track item.id) {
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="px-5 py-4 font-mono font-bold text-slate-900">{{ item.reference_number }}</td>
                    <td class="px-5 py-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {{ item.method.replace('_', ' ') }}
                      </span>
                    </td>
                    <td class="px-5 py-4 font-tabular font-bold text-slate-900">
                      &#36;{{ item.amount | number:'1.2-2' }}
                      <span class="text-[10px] text-slate-400 block font-normal">+ &#36;{{ item.fee | number:'1.2-2' }} fee</span>
                    </td>
                    <td class="px-5 py-4 max-w-xs truncate font-mono text-[11px] text-slate-600">
                      {{ item.destination_details }}
                    </td>
                    <td class="px-5 py-4">
                      @if (item.status === 'APPROVED') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Disbursed
                        </span>
                      } @else if (item.status === 'PENDING_APPROVAL') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-max">
                          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Escrow Review
                        </span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1 w-max">
                          <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Declined
                        </span>
                      }
                    </td>
                    <td class="px-5 py-4 text-slate-500 whitespace-nowrap">{{ item.created_at | date:'mediumDate' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Mobile Native Card Feed (Zero Horizontal Overflow on Phones & Tablets) -->
          <div class="lg:hidden divide-y divide-slate-100 w-full min-w-0">
            @for (item of withdrawals(); track item.id) {
              <div class="p-3.5 sm:p-4 space-y-2.5 hover:bg-slate-50 transition w-full min-w-0">
                <div class="flex items-start justify-between gap-2 min-w-0">
                  <div class="min-w-0 flex-1">
                    <div class="font-mono font-bold text-xs text-slate-900 truncate">{{ item.reference_number }}</div>
                    <div class="text-[11px] text-slate-400 truncate">{{ item.method.replace('_', ' ') }}</div>
                  </div>
                  
                  <div class="shrink-0">
                    @if (item.status === 'APPROVED') {
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Disbursed
                      </span>
                    } @else if (item.status === 'PENDING_APPROVAL') {
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> In Review
                      </span>
                    } @else {
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Declined
                      </span>
                    }
                  </div>
                </div>

                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-tabular w-full min-w-0">
                  <div class="min-w-0">
                    <span class="text-[10px] text-slate-400 block uppercase font-bold">Disbursed</span>
                    <strong class="text-slate-900 text-sm truncate block">&#36;{{ item.amount | number:'1.2-2' }}</strong>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="text-[10px] text-slate-400 block uppercase font-bold">Fee</span>
                    <span class="text-slate-600 text-xs">&#36;{{ item.fee | number:'1.2-2' }}</span>
                  </div>
                </div>

                <div class="text-[11px] font-mono text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 break-words whitespace-pre-line w-full min-w-0 max-w-full">
                  {{ item.destination_details }}
                </div>

                <div class="text-[10px] text-slate-400 text-right">
                  Requested on {{ item.created_at | date:'mediumDate' }}
                </div>
              </div>
            }
          </div>

        }
      </div>

    </div>
  `
})
export class WithdrawalsComponent implements OnInit {
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  withdrawals = signal<Withdrawal[]>([]);
  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  availableBalance = signal<number>(0);
  accountStatus = signal<string>('ACTIVE');

  cotCode = signal<string>('COT-7749');
  imfCode = signal<string>('IMF-9904');

  newWithdrawal = {
    method: 'BANK_WIRE' as 'BANK_WIRE' | 'ACH_TRANSFER' | 'SWIFT_WIRE',
    amount: '',
    destinationDetails: ''
  };

  ngOnInit() {
    this.loadBalances();
    this.loadWithdrawals();
  }

  loadBalances() {
    this.accountService.getSummary().subscribe({
      next: (res) => {
        if (res.success && res.data?.account) {
          this.availableBalance.set(parseFloat(res.data.account.availableBalance || '0'));
          this.cotCode.set(res.data.account.cotCode || 'COT-7749');
          this.imfCode.set(res.data.account.imfCode || 'IMF-9904');
          this.accountStatus.set(res.data.account.status || 'ACTIVE');
        }
      }
    });
  }

  loadWithdrawals() {
    this.loading.set(true);
    this.accountService.listUserWithdrawals().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) this.withdrawals.set(res.data);
      },
      error: () => this.loading.set(false)
    });
  }

  setMethod(method: 'BANK_WIRE' | 'ACH_TRANSFER' | 'SWIFT_WIRE') {
    this.newWithdrawal.method = method;
  }

  setFullBalance() {
    const fee = this.currentFee();
    const maxSpend = Math.max(0, this.availableBalance() - fee);
    this.newWithdrawal.amount = maxSpend.toFixed(2);
  }

  parsedAmount(): number {
    return parseFloat(this.newWithdrawal.amount) || 0;
  }

  currentFee(): number {
    if (this.newWithdrawal.method === 'BANK_WIRE') return 15.00;
    if (this.newWithdrawal.method === 'SWIFT_WIRE') return 25.00;
    return 0.00;
  }

  totalDebit(): number {
    return this.parsedAmount() + this.currentFee();
  }

  remainingBalance(): number {
    return this.availableBalance() - this.totalDebit();
  }

  submitInPageWithdrawal() {
    if (this.accountStatus() === 'INACTIVE') {
      this.modalService.alert({ title: 'Account Inactive', message: 'This account is currently inactive. Withdrawals are disabled. Kindly contact customer support.', type: 'danger' });
      return;
    }

    const amt = this.parsedAmount();
    if (isNaN(amt) || amt <= 0) {
      this.modalService.alert({ title: 'Invalid Amount', message: 'Please enter a valid disbursement amount.', type: 'danger' });
      return;
    }

    if (this.totalDebit() > this.availableBalance()) {
      this.modalService.alert({
        title: 'Insufficient Balance',
        message: `Your available balance of $${this.availableBalance().toFixed(2)} cannot cover the withdrawal of $${amt.toFixed(2)} plus $${this.currentFee().toFixed(2)} fee.`,
        type: 'danger'
      });
      return;
    }

    if (!this.newWithdrawal.destinationDetails || !this.newWithdrawal.destinationDetails.trim()) {
      this.modalService.alert({ title: 'Missing Coordinates', message: 'Please enter the receiving beneficiary and bank details.', type: 'danger' });
      return;
    }

    this.submitting.set(true);
    this.accountService.createWithdrawal({
      amount: amt,
      method: this.newWithdrawal.method,
      destinationDetails: this.newWithdrawal.destinationDetails.trim()
    }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.modalService.alert({
          title: 'Withdrawal Placed in Escrow',
          message: `Disbursement request of $${amt.toFixed(2)} submitted successfully! Reference: ${res.data?.reference_number || 'Pending'}. Our Chief Compliance Desk is auditing clearance.`,
          type: 'success'
        });
        this.newWithdrawal.amount = '';
        this.newWithdrawal.destinationDetails = '';
        this.loadBalances();
        this.loadWithdrawals();
      },
      error: (err) => {
        this.submitting.set(false);
        this.modalService.alert({
          title: 'Submission Failed',
          message: err.error?.message || 'Could not place withdrawal request.',
          type: 'danger'
        });
      }
    });
  }
}
