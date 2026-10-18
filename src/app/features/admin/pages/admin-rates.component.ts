import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ModalService } from '../../../core/services/modal.service';
import { ExchangeRate } from '../../../core/models/bank.models';

@Component({
  selector: 'app-admin-rates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 font-sans">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-nunito text-[#003432] tracking-tight">Exchange Rates &amp; Corridors</h1>
          <p class="text-xs text-slate-500 mt-1">
            Set and manage live conversion rates between USD, EUR, GBP, and NGN. These rates apply directly to customer wallet conversions.
          </p>
        </div>

        <button (click)="openEditModal()"
                class="theme_btn apply_btn py-2 px-4 rounded-xl text-xs font-bold text-white shadow-xs transition flex items-center gap-2 self-start sm:self-auto">
          <span>&plus;</span>
          <span>Set / Add Currency Pair</span>
        </button>
      </div>

      <!-- Quick Corridor Overview Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        @for (r of rates(); track r.id) {
          @if (r.from_currency === 'USD') {
            <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-sm font-bold text-[#003432]">
                  <span>{{ getCurrencyFlag(r.from_currency) }}</span>
                  <span>{{ r.from_currency }}</span>
                  <span class="text-[#0BB4D2]">&rarr;</span>
                  <span>{{ getCurrencyFlag(r.to_currency) }}</span>
                  <span>{{ r.to_currency }}</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#003432] border border-teal-200">
                  Spot
                </span>
              </div>

              <div class="flex items-baseline justify-between pt-1">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-semibold">1 {{ r.from_currency }} =</span>
                  <div class="text-2xl font-black text-slate-900 font-mono">
                    {{ r.rate | number:'1.2-4' }} <span class="text-xs text-[#0BB4D2] font-sans">{{ r.to_currency }}</span>
                  </div>
                </div>
                <button (click)="openEditModal(r)"
                        class="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition">
                  Edit
                </button>
              </div>

              <div class="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
                <span>Updated: {{ r.updated_at | date:'short' }}</span>
                <span class="font-mono text-slate-500">Inv: {{ getInverseRate(r.rate) | number:'1.4-6' }}</span>
              </div>
            </div>
          }
        }
      </div>

      <!-- Full Corridors Table -->
      <div class="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-[#003432] font-nunito">All Active Currency Pairs</h3>
            <p class="text-xs text-slate-500 mt-0.5">Rates used across all wallet conversions and transfers.</p>
          </div>
          <button (click)="loadRates()" class="text-xs font-bold text-[#0BB4D2] hover:text-[#003432]">
            Refresh Rates
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700">
            <thead class="text-xs font-semibold text-slate-600 bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-5 py-3">Base (From)</th>
                <th class="px-5 py-3">Target (To)</th>
                <th class="px-5 py-3">Exchange Rate</th>
                <th class="px-5 py-3">Inverse Rate</th>
                <th class="px-5 py-3">Last Modified</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans text-xs">
              @for (r of rates(); track r.id) {
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="px-5 py-3 font-sans font-bold text-slate-900 flex items-center gap-2">
                    <span class="text-base">{{ getCurrencyFlag(r.from_currency) }}</span>
                    <span>{{ r.from_currency }}</span>
                  </td>
                  <td class="px-5 py-3 font-sans font-bold text-teal-700">
                    <span class="text-base mr-1">{{ getCurrencyFlag(r.to_currency) }}</span>
                    <span>{{ r.to_currency }}</span>
                  </td>
                  <td class="px-5 py-3 text-emerald-600 font-bold font-mono text-sm">
                    {{ r.rate | number:'1.2-6' }}
                  </td>
                  <td class="px-5 py-3 text-slate-500 font-mono">
                    {{ getInverseRate(r.rate) | number:'1.4-6' }}
                  </td>
                  <td class="px-5 py-3 font-sans text-slate-400 text-[11px]">
                    {{ r.updated_at | date:'medium' }}
                  </td>
                  <td class="px-5 py-3 text-right font-sans">
                    <button (click)="openEditModal(r)"
                            class="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#003432] transition">
                      Adjust
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Edit / Create Rate Modal -->
    @if (activeModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
        <div class="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
          
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold font-nunito text-[#003432] flex items-center gap-2">
              <span>💱</span>
              <span>{{ isEditing() ? 'Adjust FX Conversion Multiplier' : 'Register New Currency Corridor' }}</span>
            </h3>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-700 font-semibold mb-1">Base Currency:</label>
                <select [(ngModel)]="formFromCurrency"
                        [disabled]="isEditing()"
                        class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs font-bold focus:ring-2 focus:ring-[#003432] outline-none">
                  <option value="USD">USD ($ - United States Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="NGN">NGN (₦ - Nigerian Naira)</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-700 font-semibold mb-1">Target Currency:</label>
                <select [(ngModel)]="formToCurrency"
                        [disabled]="isEditing()"
                        class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs font-bold focus:ring-2 focus:ring-[#003432] outline-none">
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="NGN">NGN (₦ - Nigerian Naira)</option>
                  <option value="USD">USD ($ - United States Dollar)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">Exchange Rate (1 {{ formFromCurrency }} = ? {{ formToCurrency }}):</label>
              <input [(ngModel)]="formRate"
                     type="number"
                     step="0.0001"
                     min="0.000001"
                     placeholder="e.g. 0.9250"
                     class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono text-sm font-bold focus:ring-2 focus:ring-[#003432] outline-none">
              <span class="text-[10px] text-slate-400 mt-1 block">
                Preview: 1 {{ formFromCurrency }} will convert to {{ formRate || 0 }} {{ formToCurrency }}.
              </span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button (click)="closeModal()"
                    [disabled]="saving()"
                    class="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition">
              Cancel
            </button>
            <button (click)="saveRate()"
                    [disabled]="saving() || !formRate || formRate <= 0"
                    class="theme_btn apply_btn py-2 px-5 rounded-xl text-xs font-bold text-white shadow-xs transition">
              {{ saving() ? 'Saving...' : 'Save Multiplier' }}
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class AdminRatesComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(ModalService);

  rates = signal<ExchangeRate[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);

  // Modal State
  activeModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  formFromCurrency: string = 'USD';
  formToCurrency: string = 'EUR';
  formRate: number | null = null;

  ngOnInit() {
    this.loadRates();
  }

  loadRates() {
    this.loading.set(true);
    this.adminService.listExchangeRates().subscribe({
      next: (res) => {
        this.rates.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.modalService.alert({
          title: 'Rates Retrieval Error',
          message: err.error?.message || 'Failed to load exchange rates.',
          type: 'danger'
        });
      }
    });
  }

  getCurrencyFlag(code: string): string {
    switch (code) {
      case 'USD': return '🇺🇸';
      case 'EUR': return '🇪🇺';
      case 'GBP': return '🇬🇧';
      case 'NGN': return '🇳🇬';
      default: return '🌐';
    }
  }

  getInverseRate(rate: number | string): number {
    const num = typeof rate === 'string' ? parseFloat(rate) : rate;
    return num > 0 ? (1 / num) : 0;
  }

  openEditModal(r?: ExchangeRate) {
    if (r) {
      this.isEditing.set(true);
      this.formFromCurrency = r.from_currency;
      this.formToCurrency = r.to_currency;
      this.formRate = parseFloat(r.rate as any);
    } else {
      this.isEditing.set(false);
      this.formFromCurrency = 'USD';
      this.formToCurrency = 'EUR';
      this.formRate = null;
    }
    this.activeModal.set(true);
  }

  closeModal() {
    this.activeModal.set(false);
  }

  saveRate() {
    if (!this.formRate || this.formRate <= 0) return;

    this.saving.set(true);
    this.adminService.updateExchangeRate(this.formFromCurrency, this.formToCurrency, this.formRate).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.closeModal();
        this.modalService.alert({
          title: 'Rate Updated',
          message: res.message || 'Currency exchange rate updated successfully.',
          type: 'success'
        });
        this.loadRates();
      },
      error: (err) => {
        this.saving.set(false);
        this.modalService.alert({
          title: 'Update Error',
          message: err.error?.message || 'Failed to update rate.',
          type: 'danger'
        });
      }
    });
  }
}
