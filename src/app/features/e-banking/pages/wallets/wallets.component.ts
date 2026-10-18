import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { ModalService } from '../../../../core/services/modal.service';
import { Wallet, ExchangeRate } from '../../../../core/models/bank.models';

@Component({
  selector: 'app-wallets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      
      <!-- Top Title & Global Treasury Summary -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#003432] tracking-tight">Multi-Currency Global Wallets</h1>
          <p class="text-xs text-slate-500 mt-1">Hold, view, and exchange liquid balances in USD, EUR, GBP, and NGN with institutional conversion rates.</p>
        </div>
        <div class="flex items-center gap-2 self-start">
          <span class="px-3 py-1.5 rounded-xl bg-white text-slate-700 text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Interbank FX Liquidity Active</span>
          </span>
        </div>
      </div>

      <!-- 4 Currency Wallet Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <!-- USD Wallet -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 relative overflow-hidden border-t-4 border-t-[#003432] flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🇺🇸</span>
              <div>
                <span class="text-xs font-bold text-slate-700 uppercase">US Dollar</span>
                <span class="block text-[10px] text-[#003432] font-extrabold">PRIMARY VAULT</span>
              </div>
            </div>
            <span class="text-xs font-mono font-bold text-slate-400">USD ($)</span>
          </div>
          <div>
            <div class="text-3xl font-black text-[#003432] font-tabular tracking-tight">
              <span>$</span>{{ getBalance('USD') | number:'1.2-2' }}
            </div>
            <div class="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Core Commercial Ledger</span>
              <span class="text-emerald-600 font-bold">100% Liquid</span>
            </div>
          </div>
          <button type="button" (click)="quickSelectFrom('USD')"
                  class="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200/60">
            Convert from USD &rarr;
          </button>
        </div>

        <!-- EUR Wallet -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 relative overflow-hidden border-t-4 border-t-blue-500 flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🇪🇺</span>
              <div>
                <span class="text-xs font-bold text-slate-700 uppercase">Euro</span>
                <span class="block text-[10px] text-blue-600 font-extrabold">SEPA NETWORK</span>
              </div>
            </div>
            <span class="text-xs font-mono font-bold text-slate-400">EUR (€)</span>
          </div>
          <div>
            <div class="text-3xl font-black text-[#003432] font-tabular tracking-tight">
              <span>€</span>{{ getBalance('EUR') | number:'1.2-2' }}
            </div>
            <div class="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>European Clearing Vault</span>
              <span class="text-blue-600 font-bold">SEPA Ready</span>
            </div>
          </div>
          <button type="button" (click)="quickSelectFrom('EUR')"
                  class="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200/60">
            Convert from EUR &rarr;
          </button>
        </div>

        <!-- GBP Wallet -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 relative overflow-hidden border-t-4 border-t-emerald-600 flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🇬🇧</span>
              <div>
                <span class="text-xs font-bold text-slate-700 uppercase">British Pound</span>
                <span class="block text-[10px] text-emerald-700 font-extrabold">CHAPS / FPS</span>
              </div>
            </div>
            <span class="text-xs font-mono font-bold text-slate-400">GBP (£)</span>
          </div>
          <div>
            <div class="text-3xl font-black text-[#003432] font-tabular tracking-tight">
              <span>£</span>{{ getBalance('GBP') | number:'1.2-2' }}
            </div>
            <div class="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>London Clearing Node</span>
              <span class="text-emerald-600 font-bold">Faster Payments</span>
            </div>
          </div>
          <button type="button" (click)="quickSelectFrom('GBP')"
                  class="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200/60">
            Convert from GBP &rarr;
          </button>
        </div>

        <!-- NGN Wallet -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 relative overflow-hidden border-t-4 border-t-amber-500 flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🇳🇬</span>
              <div>
                <span class="text-xs font-bold text-slate-700 uppercase">Nigerian Naira</span>
                <span class="block text-[10px] text-amber-600 font-extrabold">NIBSS / RTGS</span>
              </div>
            </div>
            <span class="text-xs font-mono font-bold text-slate-400">NGN (₦)</span>
          </div>
          <div>
            <div class="text-3xl font-black text-[#003432] font-tabular tracking-tight">
              <span>₦</span>{{ getBalance('NGN') | number:'1.2-2' }}
            </div>
            <div class="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>West Africa Hub</span>
              <span class="text-amber-600 font-bold">Instant Remittance</span>
            </div>
          </div>
          <button type="button" (click)="quickSelectFrom('NGN')"
                  class="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200/60">
            Convert from NGN &rarr;
          </button>
        </div>

      </div>

      <!-- Currency Conversion & Live Rates Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        <!-- Left: Instant FX Currency Converter -->
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 class="text-base sm:text-lg font-bold text-[#003432]">Instant Currency Conversion</h2>
              <p class="text-xs text-slate-500 mt-0.5">Exchange balances seamlessly between your multi-currency accounts</p>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-[#003432] border border-teal-200">
              0.00% FX Spread
            </span>
          </div>

          <form (ngSubmit)="executeConversion()" class="space-y-6">
            
            <!-- "You Pay" Container -->
            <div class="p-5 rounded-xl bg-slate-50/90 border border-slate-200 space-y-3">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-600 uppercase">You Transfer (Debit)</span>
                <span class="text-slate-500 font-medium">
                  Available: <strong class="font-tabular text-[#003432]">{{ getCurrencySymbol(convertForm.from) }}{{ getBalance(convertForm.from) | number:'1.2-2' }}</strong>
                </span>
              </div>

              <div class="flex items-center gap-3">
                <div class="relative flex-1">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-lg text-slate-400">
                    {{ getCurrencySymbol(convertForm.from) }}
                  </span>
                  <input type="number" [(ngModel)]="convertForm.amount" name="amount" (input)="updateRatePreview()"
                         min="1" step="0.01" required
                         class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 font-tabular text-2xl font-black text-[#003432] bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                         placeholder="500.00">
                </div>

                <!-- Currency Selector -->
                <select [(ngModel)]="convertForm.from" name="fromCurrency" (change)="updateRatePreview()"
                        class="px-3.5 py-3 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none w-36">
                  <option value="USD">🇺🇸 USD</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="GBP">🇬🇧 GBP</option>
                  <option value="NGN">🇳🇬 NGN</option>
                </select>
              </div>

              <!-- Quick Percent Buttons -->
              <div class="flex items-center gap-2 pt-1">
                <button type="button" (click)="setPercentage(0.25)" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-[#003432] transition">25%</button>
                <button type="button" (click)="setPercentage(0.50)" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-[#003432] transition">50%</button>
                <button type="button" (click)="setPercentage(0.75)" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-[#003432] transition">75%</button>
                <button type="button" (click)="setPercentage(1.0)" class="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[11px] font-bold text-[#003432] hover:bg-teal-100 transition">100% (Max)</button>
              </div>
            </div>

            <!-- Swap / Flip Button in Center -->
            <div class="flex items-center justify-center -my-3 relative z-10">
              <button type="button" (click)="swapCurrencies()"
                      class="w-10 h-10 rounded-full bg-[#003432] hover:bg-[#002625] text-white shadow-md border-2 border-white flex items-center justify-center transition transform hover:rotate-180">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
              </button>
            </div>

            <!-- "You Receive" Container -->
            <div class="p-5 rounded-xl bg-slate-50/90 border border-slate-200 space-y-3">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-600 uppercase">You Receive (Credit)</span>
                <span class="text-slate-500 font-medium">
                  Current Balance: <strong class="font-tabular text-[#003432]">{{ getCurrencySymbol(convertForm.to) }}{{ getBalance(convertForm.to) | number:'1.2-2' }}</strong>
                </span>
              </div>

              <div class="flex items-center gap-3">
                <div class="relative flex-1">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-lg text-slate-400">
                    {{ getCurrencySymbol(convertForm.to) }}
                  </span>
                  <div class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 font-tabular text-2xl font-black text-[#003432] bg-white">
                    {{ calculatedOutput() | number:'1.2-2' }}
                  </div>
                </div>

                <!-- Currency Selector -->
                <select [(ngModel)]="convertForm.to" name="toCurrency" (change)="updateRatePreview()"
                        class="px-3.5 py-3 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none w-36">
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="USD">🇺🇸 USD</option>
                  <option value="GBP">🇬🇧 GBP</option>
                  <option value="NGN">🇳🇬 NGN</option>
                </select>
              </div>
            </div>

            <!-- Dynamic Live Conversion Calculation Box -->
            <div class="p-4 rounded-xl bg-teal-50 border border-teal-200/80 space-y-2 text-xs">
              <div class="flex justify-between text-[#003432]">
                <span>Guaranteed Exchange Rate:</span>
                <strong class="font-mono font-bold">1 {{ convertForm.from }} = {{ currentRatePreview() | number:'1.4-6' }} {{ convertForm.to }}</strong>
              </div>
              <div class="flex justify-between text-teal-900 border-t border-teal-200/60 pt-2 font-medium">
                <span>Network Execution Fee:</span>
                <strong class="text-emerald-700 font-bold">$0.00 (Zero Hidden Markups)</strong>
              </div>
            </div>

            <button type="submit" [disabled]="converting"
                    class="bg-[#003432] hover:bg-[#002625] text-white w-full py-3.5 rounded-xl text-center text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition">
              @if (converting) {
                <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authorizing Instant FX Conversion...</span>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                <span>Execute Instant Wallet Conversion &rarr;</span>
              }
            </button>

          </form>
        </div>

        <!-- Right: Admin Managed Live Exchange Rates Table -->
        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-[#003432]">Institutional Rates Matrix</h2>
              <p class="text-xs text-slate-500 mt-0.5">Administered real-time benchmarks</p>
            </div>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="py-3 px-3">Currency Pair</th>
                  <th class="py-3 px-3 text-right">Fixed Rate</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-tabular">
                @for (r of exchangeRates(); track r.from_currency + r.to_currency) {
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3 px-3 font-bold text-[#003432] flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#0BB4D2]"></span>
                      <span>{{ r.from_currency }} / {{ r.to_currency }}</span>
                    </td>
                    <td class="py-3 px-3 text-right font-mono text-[#003432] font-bold">
                      {{ r.rate | number:'1.4-6' }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <strong class="font-bold text-[#003432] block">Chief Treasury Administrative Policy:</strong>
            <p>Exchange rates are synchronized in real time via the Master Admin Control Center. All intra-wallet conversions settle atomically with zero clearing delays.</p>
          </div>
        </div>

      </div>

    </div>
  `
})
export class WalletsComponent implements OnInit {
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  wallets = signal<Wallet[]>([]);
  exchangeRates = signal<ExchangeRate[]>([]);
  currentRatePreview = signal<number>(0.92);
  calculatedOutput = signal<number>(0);
  converting = false;

  convertForm = {
    from: 'USD',
    to: 'EUR',
    amount: 500 as number | null
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.accountService.listWallets().subscribe({
      next: (res) => {
        if (res.data) {
          this.wallets.set(res.data.wallets);
          this.exchangeRates.set(res.data.exchangeRates);
          this.updateRatePreview();
        }
      }
    });
  }

  getBalance(currency: string): number {
    const w = this.wallets().find(item => item.currency === currency);
    return w ? parseFloat(w.balance) : 0.00;
  }

  getCurrencySymbol(currency: string): string {
    if (currency === 'EUR') return '€';
    if (currency === 'GBP') return '£';
    if (currency === 'NGN') return '₦';
    return '$';
  }

  quickSelectFrom(curr: string): void {
    this.convertForm.from = curr;
    if (this.convertForm.to === curr) {
      this.convertForm.to = curr === 'USD' ? 'EUR' : 'USD';
    }
    this.updateRatePreview();
  }

  swapCurrencies(): void {
    const oldFrom = this.convertForm.from;
    this.convertForm.from = this.convertForm.to;
    this.convertForm.to = oldFrom;
    this.updateRatePreview();
  }

  setPercentage(percent: number): void {
    const available = this.getBalance(this.convertForm.from);
    this.convertForm.amount = parseFloat((available * percent).toFixed(2));
    this.updateRatePreview();
  }

  updateRatePreview(): void {
    if (this.convertForm.from === this.convertForm.to) {
      this.currentRatePreview.set(1.0);
      this.calculatedOutput.set(this.convertForm.amount || 0);
      return;
    }

    const pair = this.exchangeRates().find(
      r => r.from_currency === this.convertForm.from && r.to_currency === this.convertForm.to
    );

    let rate = 1.0;
    if (pair) {
      rate = typeof pair.rate === 'string' ? parseFloat(pair.rate) : pair.rate;
    } else {
      const revPair = this.exchangeRates().find(
        r => r.from_currency === this.convertForm.to && r.to_currency === this.convertForm.from
      );
      if (revPair) {
        const revRate = typeof revPair.rate === 'string' ? parseFloat(revPair.rate) : revPair.rate;
        rate = revRate > 0 ? (1 / revRate) : 1.0;
      }
    }

    this.currentRatePreview.set(rate);
    const amt = this.convertForm.amount || 0;
    this.calculatedOutput.set(amt * rate);
  }

  executeConversion(): void {
    if (!this.convertForm.amount || this.convertForm.amount <= 0) {
      this.modalService.alert({ title: 'Invalid Amount', message: 'Please provide a valid conversion amount.', type: 'warning' });
      return;
    }
    if (this.convertForm.from === this.convertForm.to) {
      this.modalService.alert({ title: 'Identical Currencies', message: 'Source and destination wallets must be different currencies.', type: 'warning' });
      return;
    }

    const available = this.getBalance(this.convertForm.from);
    if (available < this.convertForm.amount) {
      this.modalService.alert({
        title: 'Insufficient Balance',
        message: `Your ${this.convertForm.from} balance (${available.toFixed(2)}) is insufficient for this conversion.`,
        type: 'danger'
      });
      return;
    }

    this.converting = true;
    this.accountService.convertCurrency({
      fromCurrency: this.convertForm.from,
      toCurrency: this.convertForm.to,
      amount: this.convertForm.amount
    }).subscribe({
      next: (res) => {
        this.converting = false;
        this.modalService.alert({
          title: 'Conversion Complete',
          message: res.message || 'Currency conversion executed successfully!',
          type: 'success'
        });
        this.loadData();
      },
      error: (err) => {
        this.converting = false;
        this.modalService.alert({ title: 'Conversion Failed', message: err.error?.message || 'Failed to convert currency.', type: 'danger' });
      }
    });
  }
}
