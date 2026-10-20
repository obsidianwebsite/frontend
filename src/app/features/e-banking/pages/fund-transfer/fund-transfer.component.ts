import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { BeneficiaryService } from '../../../../core/services/domain.services';
import { ModalService } from '../../../../core/services/modal.service';
import { Beneficiary } from '../../../../core/models/bank.models';

@Component({
  selector: 'app-fund-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="w-full space-y-6 font-sans animate-fade-in">
      
      <!-- Top Title & Navigation -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-[#003432] tracking-tight">Funds Transfer &amp; Wire Dispatch</h1>
          <p class="text-xs text-slate-500 mt-1">Initiate Domestic ACH, Local, International SWIFT, or Internal Peer-to-Peer settlements.</p>
        </div>
        
        <div class="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <span class="px-3.5 py-2 rounded-xl bg-white text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Available: <strong class="font-tabular text-[#003432]">&#36;{{ availableBalance | number:'1.2-2' }}</strong></span>
          </span>

          <a routerLink="/e-banking/beneficiaries" 
             class="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5 shadow-2xs">
            <span>👥</span>
            <span>Beneficiaries</span>
          </a>
        </div>
      </div>

      <!-- Mode Selector Tabs: External Wire vs Internal Transfer (Fully Responsive, Zero Mobile Overflow) -->
      <div class="w-full sm:w-auto p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs grid grid-cols-2 sm:inline-flex gap-1.5">
        <button (click)="transferMode = 'EXTERNAL'" 
                [ngClass]="transferMode === 'EXTERNAL' ? 'bg-[#003432] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
                class="px-3 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-center">
          <span class="text-sm">🏛️</span>
          <span class="truncate">Wire Transfer (SWIFT / ACH)</span>
        </button>
        <button (click)="transferMode = 'INTERNAL'" 
                [ngClass]="transferMode === 'INTERNAL' ? 'bg-[#003432] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
                class="px-3 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-center">
          <span class="text-sm">⚡</span>
          <span class="truncate">Internal P2P (User-to-User)</span>
        </button>
      </div>

      <!-- Responsive 12-Column Grid Layout: Fits Mobile & Expands Elegantly on Laptop -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- ========================================================================= -->
        <!-- MAIN TRANSFER FORM CANVAS (Left Side: 7-8 Cols on Laptop)                  -->
        <!-- ========================================================================= -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-6">

          <!-- MODE 1: EXTERNAL WIRE TRANSFER FORM -->
          @if (transferMode === 'EXTERNAL') {
            <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7 space-y-6">
              
              <!-- Security & Multi-Stage Clearance Notice -->
              <div class="p-3.5 sm:p-4 rounded-xl bg-cyan-50/80 border border-cyan-200/80 text-cyan-950 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div class="flex items-center gap-2.5">
                  <div class="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <span class="leading-relaxed">Multi-Stage Clearance Active: Cost of Transfer (COT), IMF, and Tax Codes enforced on cross-border wires.</span>
                </div>
                <span class="text-[11px] font-bold text-cyan-900 bg-white px-2.5 py-1 rounded-lg border border-cyan-200 self-start sm:self-center shrink-0">
                  🔒 SSL 256-Bit Encrypted
                </span>
              </div>

              <!-- Channel Selector (3 Clean Cards) -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Select Settlement Channel *
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  <!-- Option 1: Domestic -->
                  <button type="button" (click)="setTransferType('DT')"
                          [ngClass]="form.type === 'DT' ? 'border-[#003432] ring-2 ring-[#003432]/10 bg-slate-50/90 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                          class="p-3.5 sm:p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-2">
                    <div class="flex items-center justify-between w-full">
                      <span class="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">🏛️</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-tabular">$5.00 Fee</span>
                    </div>
                    <div>
                      <div class="font-bold text-xs text-[#003432] flex items-center gap-1.5">
                        <span>Domestic Transfer</span>
                        @if (form.type === 'DT') { <span class="text-emerald-600 text-[10px]">✓</span> }
                      </div>
                      <div class="text-[11px] text-slate-500 mt-0.5">ACH &amp; Fedwire clearance (1-2 days)</div>
                    </div>
                  </button>

                  <!-- Option 2: Local / Intrabank -->
                  <button type="button" (click)="setTransferType('LT')"
                          [ngClass]="form.type === 'LT' ? 'border-[#003432] ring-2 ring-[#003432]/10 bg-slate-50/90 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                          class="p-3.5 sm:p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-2">
                    <div class="flex items-center justify-between w-full">
                      <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">⚡</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">FREE / $0.00</span>
                    </div>
                    <div>
                      <div class="font-bold text-xs text-[#003432] flex items-center gap-1.5">
                        <span>Local / Intrabank</span>
                        @if (form.type === 'LT') { <span class="text-emerald-600 text-[10px]">✓</span> }
                      </div>
                      <div class="text-[11px] text-slate-500 mt-0.5">Instant atomic settlement</div>
                    </div>
                  </button>

                  <!-- Option 3: International SWIFT -->
                  <button type="button" (click)="setTransferType('IT')"
                          [ngClass]="form.type === 'IT' ? 'border-[#003432] ring-2 ring-[#003432]/10 bg-slate-50/90 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                          class="p-3.5 sm:p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-2">
                    <div class="flex items-center justify-between w-full">
                      <span class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center font-bold text-xs shrink-0">🌐</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 font-tabular">$25.00 SWIFT</span>
                    </div>
                    <div>
                      <div class="font-bold text-xs text-[#003432] flex items-center gap-1.5">
                        <span>International Wire</span>
                        @if (form.type === 'IT') { <span class="text-emerald-600 text-[10px]">✓</span> }
                      </div>
                      <div class="text-[11px] text-slate-500 mt-0.5">Cross-border SWIFT (24-48 hrs)</div>
                    </div>
                  </button>

                </div>
              </div>

              <!-- Quick Beneficiary Selection Tray (If User Has Saved Payees) -->
              @if (savedBeneficiaries().length > 0) {
                <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <span>👥</span> <span>Quick Select Saved Beneficiary</span>
                    </span>
                    <a routerLink="/e-banking/beneficiaries" class="text-[#0BB4D2] hover:underline text-[11px] font-semibold">Manage &rarr;</a>
                  </div>
                  <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    @for (ben of savedBeneficiaries(); track ben.id) {
                      <button type="button" (click)="selectBeneficiary(ben)"
                              class="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 text-xs font-semibold text-slate-800 transition flex items-center gap-2 shadow-2xs active:scale-95">
                        <span class="w-5 h-5 rounded-full bg-slate-100 text-[#003432] font-black text-[10px] flex items-center justify-center">
                          {{ ben.name.charAt(0) }}
                        </span>
                        <span>{{ ben.name }}</span>
                        <span class="text-[10px] text-slate-400 font-mono">••{{ ben.account_number.slice(-4) }}</span>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Beneficiary Details -->
              <div class="space-y-4 pt-1">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Beneficiary Banking Information</h3>
                  <span class="text-[11px] text-slate-400 font-medium">* Required fields</span>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">Receiver's Full Name *</label>
                    <input type="text" [(ngModel)]="form.rname" name="rname" required placeholder="e.g. Johnathan Sterling"
                           class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">Receiver's Bank Name *</label>
                    <input type="text" [(ngModel)]="form.rbank" name="rbank" required placeholder="e.g. Barclays Bank PLC"
                           class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">Account Number / IBAN *</label>
                    <input type="text" [(ngModel)]="form.accno" name="accno" required placeholder="e.g. GB29NWBK60161331926819"
                           class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">
                      {{ form.type === 'IT' ? 'SWIFT / BIC Code *' : 'ABA / Routing Code' }}
                    </label>
                    <input type="text" [(ngModel)]="form.swift" name="swift" placeholder="e.g. BARCGB22 or 021000021"
                           class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Transfer Amount (USD) *</label>
                  <div class="relative">
                    <span class="absolute left-4 top-2.5 text-base font-bold text-slate-400">$</span>
                    <input type="number" [(ngModel)]="form.amt" name="amt" min="1" step="any" required placeholder="0.00"
                           class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-base font-bold font-tabular text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Narration / Memo (Optional)</label>
                  <input type="text" [(ngModel)]="form.comment" name="comment" placeholder="e.g. Commercial invoice settlement or wealth transfer"
                         class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
                </div>

                <!-- Save Beneficiary Checkbox -->
                <div class="pt-1">
                  <label class="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                    <input type="checkbox" [(ngModel)]="form.saveBeneficiary" name="saveBeneficiary"
                           class="w-4 h-4 rounded text-[#003432] focus:ring-[#003432] border-slate-300">
                    <span class="font-medium">Save this recipient to Beneficiary Directory for future 1-click transfers</span>
                  </label>
                </div>
              </div>

              <!-- Action Bar (Mobile-Friendly Flex-Col or Row) -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div class="text-xs text-slate-500">
                  Total Deduction: <strong class="text-slate-900 font-tabular font-bold text-sm">&#36;{{ totalDebit() | number:'1.2-2' }}</strong> 
                  <span class="text-slate-400 text-[11px] ml-1">(includes &#36;{{ currentFee | number:'1.2-2' }} wire fee)</span>
                </div>
                <button (click)="confirmAndSubmit()" [disabled]="isSubmitting"
                        class="w-full sm:w-auto bg-[#003432] hover:bg-[#002625] text-white px-7 py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95">
                  <span>{{ isSubmitting ? 'Dispatching...' : 'Dispatch Wire Transfer &rarr;' }}</span>
                </button>
              </div>

            </div>
          }

          <!-- MODE 2: INTERNAL USER-TO-USER TRANSFER -->
          @if (transferMode === 'INTERNAL') {
            <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7 space-y-6">
              
              <div class="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div class="flex items-center gap-2.5">
                  <span class="text-lg">⚡</span>
                  <span class="leading-relaxed">Instant Internal Peer-to-Peer Transfer: Zero Network Fees, Atomic Settlement within VaultProvenance Network.</span>
                </div>
                <span class="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-center shrink-0">
                  0% Fee • Instant
                </span>
              </div>

              <form (ngSubmit)="submitInternalTransfer()" class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Recipient Email or Account Number *</label>
                  <input type="text" [(ngModel)]="internalForm.recipient" name="recipient" required
                         placeholder="e.g. client@example.com or VA-1029384756"
                         class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
                  <span class="text-[11px] text-slate-400 mt-1 block">You can send funds to any registered client using their email or VaultProvenance account number.</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Amount (USD) *</label>
                  <div class="relative">
                    <span class="absolute left-4 top-2.5 text-base font-bold text-slate-400">$</span>
                    <input type="number" [(ngModel)]="internalForm.amount" name="amount" min="1" step="any" required
                           placeholder="0.00"
                           class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-base font-bold font-tabular text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Transaction Memo / Narration</label>
                  <input type="text" [(ngModel)]="internalForm.narration" name="narration"
                         placeholder="e.g. Personal peer-to-peer payment"
                         class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none transition">
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div class="text-xs text-slate-500">
                    Network Fee: <strong class="text-emerald-700 font-bold">$0.00 (Free)</strong>
                  </div>
                  <button type="submit" [disabled]="isSubmitting || !internalForm.recipient || !internalForm.amount"
                          class="w-full sm:w-auto bg-[#003432] hover:bg-[#002625] text-white px-7 py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95">
                    <span>{{ isSubmitting ? 'Transferring...' : 'Send Internal Transfer &rarr;' }}</span>
                  </button>
                </div>
              </form>

            </div>
          }

        </div>

        <!-- ========================================================================= -->
        <!-- SUMMARY, CLEARANCE CODES & COMPLIANCE SIDEBAR (Right: 4-5 Cols on Laptop) -->
        <!-- ========================================================================= -->
        <div class="lg:col-span-5 xl:col-span-4 space-y-6">

          <!-- Card 1: Live Settlement Breakdown -->
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>🧾</span> <span>Live Settlement Summary</span>
              </h3>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#003432] border border-teal-200">
                {{ transferMode === 'EXTERNAL' ? (form.type === 'DT' ? 'Domestic' : form.type === 'IT' ? 'SWIFT Wire' : 'Local') : 'Internal' }}
              </span>
            </div>

            <div class="space-y-2.5 text-xs">
              <div class="flex items-center justify-between text-slate-600">
                <span>Transfer Principal:</span>
                <span class="font-bold font-tabular text-slate-900">&#36;{{ (transferMode === 'EXTERNAL' ? form.amt || 0 : internalForm.amount || 0) | number:'1.2-2' }}</span>
              </div>

              <div class="flex items-center justify-between text-slate-600">
                <span>Network &amp; Wire Fee:</span>
                <span class="font-bold font-tabular" [ngClass]="currentFee > 0 && transferMode === 'EXTERNAL' ? 'text-slate-900' : 'text-emerald-700'">
                  {{ transferMode === 'EXTERNAL' ? (currentFee === 0 ? 'FREE / $0.00' : '$' + (currentFee | number:'1.2-2')) : 'FREE / $0.00' }}
                </span>
              </div>

              <div class="h-px bg-slate-100 my-1"></div>

              <div class="flex items-center justify-between text-sm font-bold">
                <span class="text-slate-800">Total Deduction:</span>
                <span class="text-[#003432] font-tabular text-base">&#36;{{ (transferMode === 'EXTERNAL' ? totalDebit() : internalForm.amount || 0) | number:'1.2-2' }}</span>
              </div>

              <div class="flex items-center justify-between text-xs pt-1">
                <span class="text-slate-500">Remaining Balance:</span>
                <span class="font-bold font-tabular" [ngClass]="remainingBalance() < 0 ? 'text-rose-600' : 'text-slate-700'">
                  &#36;{{ remainingBalance() | number:'1.2-2' }}
                </span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Estimated Delivery:</span>
              <strong class="text-slate-800">
                {{ transferMode === 'EXTERNAL' ? (form.type === 'DT' ? '1 to 2 business days' : form.type === 'IT' ? '24 to 48 business hours' : 'Instant (Atomic)') : 'Instant (Atomic)' }}
              </strong>
            </div>
          </div>

          <!-- Card 2: Assigned Regulatory Clearance Protocols (COT, Tax, IMF) -->
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>🔐</span> <span>Clearance Protocols</span>
              </h3>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active
              </span>
            </div>

            <p class="text-[11px] text-slate-500 leading-relaxed">
              Your account is authenticated under sovereign banking compliance. Cross-border disbursements validate against your registered clearance tokens:
            </p>

            <div class="space-y-2">
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div class="text-[10px] font-bold text-slate-500 uppercase">COT Code (Cost of Transfer)</div>
                  <div class="font-mono font-bold text-[#003432]">{{ cotCode }}</div>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Verified ✓</span>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div class="text-[10px] font-bold text-slate-500 uppercase">Federal Tax Clearance</div>
                  <div class="font-mono font-bold text-[#003432]">{{ taxCode }}</div>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Verified ✓</span>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div class="text-[10px] font-bold text-slate-500 uppercase">IMF Anti-Money Laundering</div>
                  <div class="font-mono font-bold text-[#003432]">{{ imfCode }}</div>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Verified ✓</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Daily Wire Limits & Support -->
          <div class="bg-gradient-to-br from-[#003432] to-[#002625] text-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5">
            <div class="flex items-center gap-2 text-xs font-bold text-[#0BB4D2] uppercase tracking-wider">
              <span>🛡️</span> <span>Institutional Limits &amp; SLA</span>
            </div>
            
            <div class="space-y-2 text-xs text-slate-200">
              <div class="flex justify-between border-b border-white/10 pb-1.5">
                <span class="text-slate-300">SWIFT Wire Limit:</span>
                <span class="font-bold text-white font-tabular">$1,000,000 / day</span>
              </div>
              <div class="flex justify-between border-b border-white/10 pb-1.5">
                <span class="text-slate-300">Domestic Fedwire:</span>
                <span class="font-bold text-white font-tabular">$250,000 / day</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-300">Internal Transfers:</span>
                <span class="font-bold text-emerald-300 font-tabular">Unlimited (0% Fee)</span>
              </div>
            </div>

            <div class="pt-2 text-[11px] text-teal-200/80 flex items-center justify-between">
              <span>Need higher liquidity limits?</span>
              <a routerLink="/e-banking/support" class="font-bold text-[#0BB4D2] hover:text-white transition underline">Contact Treasury</a>
            </div>
          </div>

        </div>

      </div>

      <!-- Multi-Stage Clearance Authorization Modal (Mobile-Safe Height & Padding) -->
      @if (showClearanceModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#0BB4D2] bg-teal-50 px-2 py-0.5 rounded border border-teal-200/80">
                  Clearance Stage {{ clearanceStep() }} of 3
                </span>
                <h3 class="text-base font-black text-slate-900 mt-1">
                  @if (clearanceStep() === 1) { Cost of Transfer (COT) Clearance }
                  @else if (clearanceStep() === 2) { Federal Tax Compliance Code }
                  @else { IMF / Anti-Money Laundering Protocol }
                </h3>
              </div>
              <button (click)="showClearanceModal.set(false)" class="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none">&times;</button>
            </div>

            <div class="space-y-4 text-xs">
              <p class="text-slate-600 leading-relaxed">
                @if (clearanceStep() === 1) {
                  This wire transfer requires validation with your assigned Cost of Transfer (COT) clearing token before ledger finality.
                } @else if (clearanceStep() === 2) {
                  Enter your assigned Federal Tax Clearance code to release outward capital reserves.
                } @else {
                  Enter the final International Monetary Fund (IMF) clearing code to complete dispatch.
                }
              </p>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  @if (clearanceStep() === 1) { Cost of Transfer (COT) Authorization Code * }
                  @else if (clearanceStep() === 2) { Statutory Tax Clearance Code * }
                  @else { IMF Cross-Border Protocol Code * }
                </label>
                <input type="text" [(ngModel)]="inputCode" 
                       placeholder="Enter statutory authorization code..."
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none uppercase">
                <span class="text-[11px] text-slate-400 mt-1.5 block">
                  Enter the mandatory clearance code provided by the Compliance &amp; Settlement Desk.
                </span>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button (click)="showClearanceModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200 transition">
                Cancel
              </button>
              <button (click)="submitClearanceStep()" class="bg-[#003432] hover:bg-[#002625] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition">
                Verify &amp; Continue &rarr;
              </button>
            </div>

          </div>
        </div>
      }

    </div>
  `
})
export class FundTransferComponent implements OnInit {
  private accountService = inject(AccountService);
  private beneficiaryService = inject(BeneficiaryService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  transferMode: 'EXTERNAL' | 'INTERNAL' = 'EXTERNAL';
  availableBalance: number = 0;
  isSubmitting: boolean = false;
  currentFee: number = 5.00;

  // Saved beneficiaries
  savedBeneficiaries = signal<Beneficiary[]>([]);

  // Multi-stage clearance simulation
  showClearanceModal = signal<boolean>(false);
  clearanceStep = signal<number>(1);
  inputCode: string = '';
  cotCode: string = 'COT-7749';
  taxCode: string = 'TAX-8821';
  imfCode: string = 'IMF-9904';

  form = {
    type: 'DT',
    rname: '',
    rbank: '',
    accno: '',
    swift: '',
    iban: '',
    amt: null as number | null,
    comment: '',
    saveBeneficiary: false
  };

  internalForm = {
    recipient: '',
    amount: null as number | null,
    narration: ''
  };

  ngOnInit() {
    this.loadAccountInfo();
    this.loadBeneficiaries();
  }

  loadAccountInfo() {
    this.accountService.getSummary().subscribe({
      next: (res) => {
        if (res.data?.account) {
          this.availableBalance = parseFloat(res.data.account.availableBalance || '0');
          this.cotCode = res.data.account.cotCode || 'COT-7749';
          this.taxCode = res.data.account.taxCode || 'TAX-8821';
          this.imfCode = res.data.account.imfCode || 'IMF-9904';
        }
      }
    });
  }

  loadBeneficiaries() {
    this.beneficiaryService.listBeneficiaries().subscribe({
      next: (res) => {
        if (res.data) {
          this.savedBeneficiaries.set(res.data);
        }
      },
      error: () => {}
    });
  }

  selectBeneficiary(ben: Beneficiary) {
    this.form.rname = ben.name;
    this.form.rbank = ben.bank_name;
    this.form.accno = ben.account_number;
    this.form.swift = ben.swift_routing || '';
  }

  setTransferType(type: 'DT' | 'LT' | 'IT') {
    this.form.type = type;
    if (type === 'DT') this.currentFee = 5.00;
    else if (type === 'IT') this.currentFee = 25.00;
    else this.currentFee = 0.00;
  }

  totalDebit(): number {
    return (this.form.amt || 0) + this.currentFee;
  }

  remainingBalance(): number {
    const deduction = this.transferMode === 'EXTERNAL' ? this.totalDebit() : (this.internalForm.amount || 0);
    return this.availableBalance - deduction;
  }

  confirmAndSubmit() {
    if (!this.form.rname || !this.form.rbank || !this.form.accno || !this.form.amt) {
      this.modalService.alert({ title: 'Incomplete Details', message: 'Please complete all required receiver fields.', type: 'danger' });
      return;
    }

    if (this.totalDebit() > this.availableBalance) {
      this.modalService.alert({ title: 'Insufficient Balance', message: 'Your available balance is insufficient for this transfer.', type: 'danger' });
      return;
    }

    // Trigger multi-stage clearance code challenge
    this.clearanceStep.set(1);
    this.inputCode = '';
    this.showClearanceModal.set(true);
  }

  submitClearanceStep() {
    const step = this.clearanceStep();
    const entered = (this.inputCode || '').trim();

    if (!entered) {
      this.modalService.alert({ title: 'Code Required', message: 'Please enter your statutory clearance authorization code.', type: 'warning' });
      return;
    }

    if (step === 1) {
      if (entered.toUpperCase() !== (this.cotCode || '').toUpperCase()) {
        this.modalService.alert({ title: 'Invalid COT Code', message: 'The Cost of Transfer (COT) authorization code is invalid. Please contact the compliance desk.', type: 'danger' });
        return;
      }
      this.clearanceStep.set(2);
      this.inputCode = '';
    } else if (step === 2) {
      if (entered.toUpperCase() !== (this.taxCode || '').toUpperCase()) {
        this.modalService.alert({ title: 'Invalid Tax Clearance Code', message: 'The Tax Clearance authorization code is invalid. Please contact the compliance desk.', type: 'danger' });
        return;
      }
      this.clearanceStep.set(3);
      this.inputCode = '';
    } else {
      if (entered.toUpperCase() !== (this.imfCode || '').toUpperCase()) {
        this.modalService.alert({ title: 'Invalid IMF Code', message: 'The International Monetary Fund (IMF) cross-border protocol code is invalid. Please contact the compliance desk.', type: 'danger' });
        return;
      }
      this.showClearanceModal.set(false);
      this.executeWireTransfer();
    }
  }

  executeWireTransfer() {
    this.isSubmitting = true;
    this.accountService.createTransfer({
      rname: this.form.rname,
      rbank: this.form.rbank,
      iban: this.form.iban,
      accno: this.form.accno,
      swift: this.form.swift,
      type: this.form.type as any,
      amt: this.form.amt!,
      comment: this.form.comment,
      saveBeneficiary: this.form.saveBeneficiary
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.modalService.alert({
          title: 'Wire Transfer Executed',
          message: `Wire cleared successfully through multi-stage protocol! Reference: ${res.data.referenceNumber}. Remaining balance: $${res.data.remainingBalance}`,
          type: 'success'
        });
        this.router.navigate(['/e-banking/statement']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.modalService.alert({ title: 'Transfer Failed', message: err.error?.message || 'Transaction failed.', type: 'danger' });
      }
    });
  }

  submitInternalTransfer() {
    const amt = parseFloat(String(this.internalForm.amount));
    if (isNaN(amt) || amt <= 0) {
      this.modalService.alert({ title: 'Invalid Amount', message: 'Please enter a valid amount.', type: 'danger' });
      return;
    }

    if (amt > this.availableBalance) {
      this.modalService.alert({ title: 'Insufficient Balance', message: 'Your available balance is insufficient.', type: 'danger' });
      return;
    }

    this.isSubmitting = true;
    this.accountService.createInternalTransfer({
      recipientIdentifier: this.internalForm.recipient,
      amount: amt,
      narration: this.internalForm.narration
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.modalService.alert({
          title: 'Internal Transfer Complete',
          message: `Successfully sent $${amt.toFixed(2)} to ${res.data.recipient} (${res.data.recipientAccount}). Reference: ${res.data.referenceNumber}`,
          type: 'success'
        });
        this.internalForm.recipient = '';
        this.internalForm.amount = null;
        this.loadAccountInfo();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.modalService.alert({
          title: 'Transfer Failed',
          message: err.error?.message || 'Internal transfer could not be completed.',
          type: 'danger'
        });
      }
    });
  }
}
