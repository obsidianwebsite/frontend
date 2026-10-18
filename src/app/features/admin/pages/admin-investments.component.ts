import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AccountService } from '../../../core/services/account.service';
import { UserInvestment, TradingSignal } from '../../../core/models/bank.models';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-admin-investments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in font-sans">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432] tracking-tight">Investments &amp; MT4 Signals Desk</h1>
          <p class="text-xs text-slate-500 mt-1">Monitor client capital allocations into institutional vaults and publish algorithmic market signals.</p>
        </div>

        <button (click)="showSignalModal.set(true)" 
                class="theme_btn apply_btn py-2 px-4 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 self-start sm:self-auto">
          <span>+ Broadcast Trading Signal</span>
        </button>
      </div>

      <!-- Live Trading Signals Table -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-bold text-slate-900 font-nunito">Active Market Signals Broadcast</h2>
            <p class="text-xs text-slate-500">Signals currently live and reflected on customer copy-trading terminals.</p>
          </div>
          <button (click)="loadSignals()" class="p-2 text-slate-400 hover:text-[#003432] transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700">
            <thead class="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th class="px-5 py-3.5">Instrument</th>
                <th class="px-5 py-3.5">Class</th>
                <th class="px-5 py-3.5">Direction</th>
                <th class="px-5 py-3.5">Entry Price</th>
                <th class="px-5 py-3.5">Stop Loss</th>
                <th class="px-5 py-3.5">Take Profit</th>
                <th class="px-5 py-3.5">Timeframe</th>
                <th class="px-5 py-3.5">Status</th>
                <th class="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans text-xs">
              @for (sig of signals(); track sig.id) {
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="px-5 py-4 font-bold text-slate-900">{{ sig.instrument }}</td>
                  <td class="px-5 py-4"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{{ sig.type }}</span></td>
                  <td class="px-5 py-4">
                    @if (sig.direction === 'BUY') {
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">BUY ▲</span>
                    } @else {
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">SELL ▼</span>
                    }
                  </td>
                  <td class="px-5 py-4 font-mono font-bold text-slate-800">{{ sig.entry_price }}</td>
                  <td class="px-5 py-4 font-mono text-rose-600 font-medium">{{ sig.stop_loss }}</td>
                  <td class="px-5 py-4 font-mono text-emerald-600 font-bold">{{ sig.take_profit }}</td>
                  <td class="px-5 py-4 text-slate-500">{{ sig.timeframe }}</td>
                  <td class="px-5 py-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#003432] border border-teal-200">{{ sig.status }}</span>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <button (click)="deleteSignal(sig.id)" class="text-rose-600 hover:text-rose-700 font-bold text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Platform Investor Portfolios Table -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div class="p-5 border-b border-slate-100">
          <h2 class="text-sm font-bold text-slate-900 font-nunito">Platform-Wide Investor Subscriptions</h2>
          <p class="text-xs text-slate-500">Capital actively allocated to institutional fixed-income &amp; arbitrage yield vaults.</p>
        </div>

        @if (investments().length === 0) {
          <div class="p-12 text-center text-xs text-slate-400">No active investments found.</div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th class="px-5 py-3.5">Client &amp; Account</th>
                  <th class="px-5 py-3.5">Plan / Strategy</th>
                  <th class="px-5 py-3.5">Amount Invested</th>
                  <th class="px-5 py-3.5">Projected Yield</th>
                  <th class="px-5 py-3.5">Tenure</th>
                  <th class="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans text-xs">
                @for (inv of investments(); track inv.id) {
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="px-5 py-4">
                      <div class="font-bold text-slate-900">{{ inv.first_name }} {{ inv.last_name }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ inv.account_number }}</div>
                    </td>
                    <td class="px-5 py-4 font-bold text-slate-700">{{ inv.plan_name }}</td>
                    <td class="px-5 py-4 font-tabular font-bold text-slate-900">&#36;{{ inv.amount_invested | number:'1.2-2' }}</td>
                    <td class="px-5 py-4 font-tabular font-bold text-emerald-600">+&#36;{{ inv.expected_roi | number:'1.2-2' }}</td>
                    <td class="px-5 py-4 text-slate-500">{{ inv.duration_days }} Days</td>
                    <td class="px-5 py-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {{ inv.status }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Signal Broadcast Modal -->
      @if (showSignalModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
          <div class="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-base font-bold font-nunito text-[#003432]">Broadcast Trading Signal</h3>
                <p class="text-xs text-slate-500">Publishes live Forex, Index, or Commodity signal to all client terminals.</p>
              </div>
              <button (click)="showSignalModal.set(false)" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
            </div>

            <form (ngSubmit)="submitSignal()" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Instrument</label>
                  <input type="text" [(ngModel)]="newSignal.instrument" name="instrument" required
                         placeholder="e.g. EUR/USD or US30"
                         class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-[#003432] outline-none text-slate-800">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Direction</label>
                  <select [(ngModel)]="newSignal.direction" name="direction" 
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-[#003432] outline-none text-slate-800">
                    <option value="BUY">BUY (Long)</option>
                    <option value="SELL">SELL (Short)</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Entry Price</label>
                  <input type="number" [(ngModel)]="newSignal.entryPrice" name="entryPrice" step="any" required
                         placeholder="1.08500"
                         class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white font-mono text-slate-800">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Stop Loss (SL)</label>
                  <input type="number" [(ngModel)]="newSignal.stopLoss" name="stopLoss" step="any" required
                         placeholder="1.08000"
                         class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white font-mono text-rose-600">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Take Profit (TP)</label>
                  <input type="number" [(ngModel)]="newSignal.takeProfit" name="takeProfit" step="any" required
                         placeholder="1.09500"
                         class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white font-mono text-emerald-600">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Asset Type</label>
                  <select [(ngModel)]="newSignal.type" name="type" 
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800">
                    <option value="FOREX">FOREX</option>
                    <option value="INDICES">INDICES / EQUITIES</option>
                    <option value="COMMODITY">COMMODITY</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Timeframe</label>
                  <select [(ngModel)]="newSignal.timeframe" name="timeframe" 
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800">
                    <option value="15M">15 Minutes</option>
                    <option value="1H">1 Hour</option>
                    <option value="4H">4 Hours</option>
                    <option value="1D">1 Day</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" (click)="showSignalModal.set(false)" 
                        class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" 
                        class="theme_btn apply_btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs">
                  Broadcast Signal
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminInvestmentsComponent implements OnInit {
  private adminService = inject(AdminService);
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  investments = signal<UserInvestment[]>([]);
  signals = signal<TradingSignal[]>([]);
  showSignalModal = signal<boolean>(false);

  newSignal = {
    instrument: '',
    direction: 'BUY' as 'BUY' | 'SELL',
    type: 'FOREX',
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    timeframe: '1H'
  };

  ngOnInit() {
    this.loadInvestments();
    this.loadSignals();
  }

  loadInvestments() {
    this.adminService.listAllInvestments().subscribe({
      next: (res) => {
        if (res.success) this.investments.set(res.data);
      }
    });
  }

  loadSignals() {
    this.accountService.listTradingSignals().subscribe({
      next: (res) => {
        if (res.success) this.signals.set(res.data);
      }
    });
  }

  submitSignal() {
    if (!this.newSignal.instrument || !this.newSignal.entryPrice) {
      this.modalService.alert({ title: 'Missing Fields', message: 'Instrument and Entry Price are required.', type: 'danger' });
      return;
    }

    this.adminService.publishSignal(this.newSignal).subscribe({
      next: () => {
        this.modalService.alert({ title: 'Signal Broadcast', message: 'Signal successfully sent to all client terminals.', type: 'success' });
        this.showSignalModal.set(false);
        this.loadSignals();
      },
      error: (err) => {
        this.modalService.alert({ title: 'Error', message: err.error?.message || 'Failed to publish signal.', type: 'danger' });
      }
    });
  }

  deleteSignal(id: string) {
    this.adminService.deleteSignal(id).subscribe({
      next: () => this.loadSignals()
    });
  }
}
