import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { CopyMaster, CopySubscription, TradingSignal } from '../../../../core/models/bank.models';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-copy-trading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 lg:space-y-8 animate-fade-in">
      
      <!-- Top Hero Banner -->
      <div class="rounded-2xl p-6 sm:p-8 bg-[#003432] text-white relative overflow-hidden shadow-xs">
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div class="space-y-1.5 max-w-xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0BB4D2]/20 text-[#0BB4D2] border border-[#0BB4D2]/30">
              <span>MT4 &bull; Multi-Account Copier</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">Institutional Copy Trading &amp; Signals</h1>
            <p class="text-xs sm:text-sm text-slate-300">
              Mirror verified master traders directly through our high-speed bridge and track real-time Forex, Treasury and Commodity signals.
            </p>
          </div>

          <div class="bg-white/10 border border-white/20 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-xs">
            <div>
              <div class="text-[10px] uppercase font-bold text-slate-300">Available to Allocate</div>
              <div class="text-xl sm:text-2xl font-black text-white font-tabular">&#36;{{ availableBalance() | number:'1.2-2' }}</div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> MT4 Connected
            </span>
          </div>
        </div>
      </div>

      <!-- Tab Buttons: Master Traders vs Live Signals -->
      <div class="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200/90 w-max shadow-xs">
        <button (click)="activeTab.set('masters')" 
                [ngClass]="activeTab() === 'masters' ? 'bg-[#003432] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                class="px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2">
          <span>👥</span> <span>Master Traders ({{ masters().length }})</span>
        </button>
        <button (click)="activeTab.set('signals')" 
                [ngClass]="activeTab() === 'signals' ? 'bg-[#003432] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                class="px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2">
          <span>📡</span> <span>Live Signals Desk ({{ signals().length }})</span>
        </button>
      </div>

      <!-- Section 1: Master Traders Grid -->
      @if (activeTab() === 'masters') {
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            @for (master of masters(); track master.id) {
              <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition">
                <div class="space-y-4">
                  
                  <div class="flex items-center gap-3">
                    <img [src]="master.avatar_url" [alt]="master.trader_name" 
                         class="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs">
                    <div>
                      <h3 class="text-sm font-extrabold text-[#003432]">{{ master.trader_name }}</h3>
                      <div class="text-[11px] text-[#0BB4D2] font-bold">{{ master.strategy_name }}</div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 font-tabular text-xs">
                    <div>
                      <div class="text-[10px] text-slate-400 font-bold uppercase">Win Rate</div>
                      <div class="text-base font-black text-emerald-600">{{ master.win_rate }}%</div>
                    </div>
                    <div>
                      <div class="text-[10px] text-slate-400 font-bold uppercase">30D Return</div>
                      <div class="text-base font-black text-slate-900">+{{ master.monthly_return }}%</div>
                    </div>
                  </div>

                  <div class="text-[11px] text-slate-500 space-y-1.5">
                    <div class="flex justify-between">
                      <span>Active Copiers:</span>
                      <strong class="text-slate-800 font-tabular">{{ master.copiers_count | number }}</strong>
                    </div>
                    <div class="flex justify-between">
                      <span>Profit Share:</span>
                      <strong class="text-slate-800 font-tabular">{{ master.profit_share_percent }}%</strong>
                    </div>
                    <div class="flex justify-between">
                      <span>Risk Rating:</span>
                      <span class="text-amber-500 font-bold">★ {{ master.risk_score }}/5</span>
                    </div>
                  </div>

                </div>

                <button (click)="openCopyModal(master)" 
                        class="mt-6 w-full bg-[#003432] hover:bg-[#002625] text-white py-2.5 rounded-xl text-xs font-bold shadow-xs text-center transition">
                  Mirror Strategy
                </button>
              </div>
            }
          </div>

          <!-- Active Mirror Subscriptions Table -->
          @if (subscriptions().length > 0) {
            <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div class="p-5 border-b border-slate-100">
                <h3 class="text-sm font-extrabold text-[#003432]">Your Active Strategy Copies</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th class="px-5 py-3">Trader</th>
                      <th class="px-5 py-3">Strategy</th>
                      <th class="px-5 py-3">Allocated Amount</th>
                      <th class="px-5 py-3">Win Rate</th>
                      <th class="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-medium">
                    @for (sub of subscriptions(); track sub.id) {
                      <tr>
                        <td class="px-5 py-3.5 font-bold text-[#003432]">{{ sub.trader_name }}</td>
                        <td class="px-5 py-3.5 text-slate-600">{{ sub.strategy_name }}</td>
                        <td class="px-5 py-3.5 font-bold font-tabular text-slate-900">&#36;{{ sub.allocated_amount | number:'1.2-2' }}</td>
                        <td class="px-5 py-3.5 font-bold text-emerald-600 font-tabular">{{ sub.win_rate }}%</td>
                        <td class="px-5 py-3.5">
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active Sync
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      }

      <!-- Section 2: Live Trading Signals Table -->
      @if (activeTab() === 'signals') {
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 class="text-base font-extrabold text-[#003432]">Live Forex &amp; Commodity Signals</h2>
              <p class="text-xs text-slate-500">Real-time buy/sell alerts with Take-Profit and Stop-Loss levels.</p>
            </div>
            <button (click)="loadSignals()" class="p-2 text-slate-400 hover:text-[#003432] transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th class="px-5 py-3.5">Pair / Instrument</th>
                  <th class="px-5 py-3.5">Asset Class</th>
                  <th class="px-5 py-3.5">Direction</th>
                  <th class="px-5 py-3.5">Entry Price</th>
                  <th class="px-5 py-3.5">Stop Loss (SL)</th>
                  <th class="px-5 py-3.5">Take Profit (TP)</th>
                  <th class="px-5 py-3.5">Timeframe</th>
                  <th class="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                @for (sig of signals(); track sig.id) {
                  <tr class="hover:bg-slate-50/60 transition">
                    <td class="px-5 py-4 font-black text-[#003432]">{{ sig.instrument }}</td>
                    <td class="px-5 py-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {{ sig.type }}
                      </span>
                    </td>
                    <td class="px-5 py-4">
                      @if (sig.direction === 'BUY') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ▲ BUY
                        </span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                          ▼ SELL
                        </span>
                      }
                    </td>
                    <td class="px-5 py-4 font-mono font-bold text-slate-900">{{ sig.entry_price }}</td>
                    <td class="px-5 py-4 font-mono text-rose-600">{{ sig.stop_loss }}</td>
                    <td class="px-5 py-4 font-mono text-emerald-600 font-bold">{{ sig.take_profit }}</td>
                    <td class="px-5 py-4 text-slate-500">{{ sig.timeframe }}</td>
                    <td class="px-5 py-4">
                      @if (sig.status === 'TARGET_HIT') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Target Hit 🎯</span>
                      } @else if (sig.status === 'ACTIVE') {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-[#003432] border border-teal-200 animate-pulse">Active</span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">Closed</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Copy Subscription Modal -->
      @if (selectedMaster()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-lg font-black text-[#003432]">Mirror {{ selectedMaster()?.trader_name }}</h3>
                <p class="text-xs text-slate-500">{{ selectedMaster()?.strategy_name }} &bull; {{ selectedMaster()?.win_rate }}% Win Rate</p>
              </div>
              <button (click)="selectedMaster.set(null)" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
            </div>

            <form (ngSubmit)="confirmCopy()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mirror Capital (USD)</label>
                <div class="relative">
                  <span class="absolute left-4 top-2.5 text-sm font-bold text-slate-400">$</span>
                  <input type="number" [(ngModel)]="copyAmount" name="amount" min="100" step="any" required
                         placeholder="1000.00"
                         class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none font-tabular">
                </div>
                <div class="text-[11px] text-slate-400 mt-1">
                  Available Vault Balance: &#36;{{ availableBalance() | number:'1.2-2' }}
                </div>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div class="flex justify-between">
                  <span>Strategy Fee:</span>
                  <strong class="text-slate-900">{{ selectedMaster()?.profit_share_percent }}% of net profits</strong>
                </div>
                <div class="flex justify-between">
                  <span>Execution Latency:</span>
                  <strong class="text-emerald-600">&lt; 15ms VPS Bridge</strong>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" (click)="selectedMaster.set(null)" 
                        class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" [disabled]="submitting() || copyAmount <= 0"
                        class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition">
                  <span>{{ submitting() ? 'Connecting MT4...' : 'Confirm Mirror' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class CopyTradingComponent implements OnInit {
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  activeTab = signal<'masters' | 'signals'>('masters');
  masters = signal<CopyMaster[]>([]);
  signals = signal<TradingSignal[]>([]);
  subscriptions = signal<CopySubscription[]>([]);
  availableBalance = signal<number>(0);
  selectedMaster = signal<CopyMaster | null>(null);
  copyAmount: number = 1000;
  submitting = signal<boolean>(false);

  ngOnInit() {
    this.loadMasters();
    this.loadSignals();
    this.loadSubscriptions();
    this.loadBalance();
  }

  loadBalance() {
    this.accountService.getSummary().subscribe({
      next: (res) => {
        if (res.success && res.data?.account) {
          this.availableBalance.set(parseFloat(res.data.account.availableBalance || '0'));
        }
      }
    });
  }

  loadMasters() {
    this.accountService.listCopyMasters().subscribe({
      next: (res) => {
        if (res.success) this.masters.set(res.data);
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

  loadSubscriptions() {
    this.accountService.listUserCopySubscriptions().subscribe({
      next: (res) => {
        if (res.success) this.subscriptions.set(res.data);
      }
    });
  }

  openCopyModal(m: CopyMaster) {
    this.selectedMaster.set(m);
  }

  confirmCopy() {
    const master = this.selectedMaster();
    if (!master || this.copyAmount <= 0) return;

    this.submitting.set(true);
    this.accountService.subscribeCopyMaster(master.id, this.copyAmount).subscribe({
      next: () => {
        this.submitting.set(false);
        this.selectedMaster.set(null);
        this.modalService.alert({
          title: 'Copy Strategy Active',
          message: `Your account is now mirroring trades from ${master.trader_name} (${master.strategy_name}) with $${this.copyAmount.toFixed(2)} allocation.`,
          type: 'success'
        });
        this.loadSubscriptions();
      },
      error: (err) => {
        this.submitting.set(false);
        this.modalService.alert({
          title: 'Mirror Failed',
          message: err.error?.message || 'Failed to connect copy strategy.',
          type: 'danger'
        });
      }
    });
  }
}
