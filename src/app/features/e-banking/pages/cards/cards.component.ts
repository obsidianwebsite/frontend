import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService } from '../../../../core/services/domain.services';
import { ModalService } from '../../../../core/services/modal.service';
import { Card } from '../../../../core/models/bank.models';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      
      <!-- Top Title & Request Action -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#003432] tracking-tight">Payment Cards &amp; Tiered Virtual Credentials</h1>
          <p class="text-xs text-slate-500 mt-1">Manage Standard, Gold, Platinum, and Vault Black metal cards with instant freezing and limit controls.</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="toggleDetails()"
                  class="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-xs transition">
            {{ showDetails() ? 'Hide Credentials 🔒' : 'Reveal Credentials 👁️' }}
          </button>
          <button (click)="openIssueModal()"
                  class="bg-[#003432] hover:bg-[#002625] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2">
            <span>+ Issue Custom Card</span>
          </button>
        </div>
      </div>

      <!-- Visual Card Grid -->
      @if (cards().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (c of cards(); track c.id; let idx = $index) {
            <div class="rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
                 [ngClass]="getCardSkinClass(c.tier || 'STANDARD', idx)">
              
              <!-- Frosted Overlay when FROZEN -->
              @if (c.status !== 'ACTIVE') {
                <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-20 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <div class="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 shadow-xl">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <div class="text-white font-black text-sm">CARD TEMPORARILY FROZEN</div>
                  <p class="text-[11px] text-slate-300">All transactions and card authorization requests are blocked.</p>
                  <button (click)="toggleCard(c)" 
                          class="mt-2 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-xs">
                    Unfreeze Card
                  </button>
                </div>
              }

              <!-- Card Header: Brand & Contactless Symbol -->
              <div class="flex items-center justify-between mb-6 relative z-10">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black tracking-widest text-[#0BB4D2]">VAULTATLANTIC</span>
                  <span class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-white/10 text-slate-200 border border-white/20">
                    {{ c.tier || 'STANDARD' }}
                  </span>
                </div>
                <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M10.232 18.525a2.5 2.5 0 013.536 0M5.99 14.283a8.5 8.5 0 0112.02 0M3.869 12.162a11.5 11.5 0 0116.262 0"/>
                </svg>
              </div>

              <!-- EMV Chip & Hologram Indicator -->
              <div class="flex items-center justify-between mb-6 relative z-10">
                <div class="w-12 h-9 rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-600/40 shadow-inner flex items-center justify-center p-1">
                  <div class="w-full h-full border border-amber-800/30 rounded grid grid-cols-2 gap-0.5 opacity-60">
                    <div class="border-r border-b border-amber-800/30"></div>
                    <div class="border-b border-amber-800/30"></div>
                    <div class="border-r border-amber-800/30"></div>
                    <div></div>
                  </div>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                      [ngClass]="c.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'">
                  {{ c.status }}
                </span>
              </div>

              <!-- Masked PAN Number -->
              <div class="text-xl sm:text-2xl font-mono tracking-widest text-white mb-6 font-bold drop-shadow-xs relative z-10">
                {{ showDetails() ? revealPan(c.card_number_masked) : c.card_number_masked }}
              </div>

              <!-- Cardholder & Expiry Row -->
              <div class="flex items-end justify-between text-xs relative z-10 border-t border-white/10 pt-4">
                <div>
                  <div class="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">Cardholder Name</div>
                  <div class="font-bold tracking-wide uppercase text-white">{{ c.card_holder_name }}</div>
                </div>
                <div>
                  <div class="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">Expires</div>
                  <div class="font-mono font-bold text-white">{{ c.expiry_date }}</div>
                </div>
                <div class="text-right">
                  <div class="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">CVV</div>
                  <div class="font-mono font-bold text-[#0BB4D2]">{{ showDetails() ? (c.cvv || '742') : '•••' }}</div>
                </div>
                <div class="font-black italic text-lg text-white">
                  {{ c.brand }}
                </div>
              </div>

              <!-- Spending Limit Strip -->
              <div class="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300 relative z-10 font-tabular">
                <span>Spending Limit: <strong class="text-white">&#36;{{ (c.spending_limit || 15000) | number:'1.0-0' }}</strong></span>
                <button (click)="toggleCard(c)" class="text-[#0BB4D2] hover:underline font-bold font-sans">
                  {{ c.status === 'ACTIVE' ? 'Freeze Card ❄️' : 'Unfreeze Card 🔓' }}
                </button>
              </div>

            </div>
          }
        </div>
      } @else {
        <div class="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div class="text-3xl mb-2">💳</div>
          <div class="font-bold text-slate-700 text-sm">No Active Payment Cards</div>
          <p class="text-xs text-slate-400 mt-1">Issue a new instant virtual card to begin making online transactions.</p>
        </div>
      }

      <!-- Custom Card Issuance Modal -->
      @if (showIssueModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-lg font-black text-slate-900">Issue Tiered Payment Card</h3>
                <p class="text-xs text-slate-500">Instant virtual provision with zero issuance fees.</p>
              </div>
              <button (click)="showIssueModal.set(false)" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
            </div>

            <form (ngSubmit)="submitCardRequest()" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Card Brand</label>
                  <select [(ngModel)]="cardForm.brand" name="brand"
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                    <option value="VISA">Visa Signature</option>
                    <option value="MASTERCARD">Mastercard World Elite</option>
                    <option value="AMEX">American Express</option>
                    <option value="DISCOVER">Discover Network</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Prestige Tier</label>
                  <select [(ngModel)]="cardForm.tier" name="tier"
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                    <option value="STANDARD">Standard Metallic</option>
                    <option value="GOLD">Gold Prestige</option>
                    <option value="PLATINUM">Platinum Mirror</option>
                    <option value="OBSIDIAN_BLACK">Vault Black Metal</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Card Form Factor</label>
                  <select [(ngModel)]="cardForm.cardType" name="cardType"
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
                    <option value="VIRTUAL">Virtual Instant Access</option>
                    <option value="DEBIT">Physical Metal Debit</option>
                    <option value="CREDIT">Commercial Credit Line</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Monthly Spending Limit</label>
                  <select [(ngModel)]="cardForm.spendingLimit" name="spendingLimit"
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none font-tabular">
                    <option [value]="5000">$5,000 / month</option>
                    <option [value]="15000">$15,000 / month</option>
                    <option [value]="50000">$50,000 / month</option>
                    <option [value]="100000">$100,000 / month</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" (click)="showIssueModal.set(false)" 
                        class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" [disabled]="issuing()"
                        class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2">
                  <span>{{ issuing() ? 'Provisioning...' : 'Provision Card Now' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class CardsComponent implements OnInit {
  private cardService = inject(CardService);
  private modalService = inject(ModalService);

  cards = signal<Card[]>([]);
  showDetails = signal<boolean>(false);
  showIssueModal = signal<boolean>(false);
  issuing = signal<boolean>(false);

  cardForm = {
    brand: 'VISA' as 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER',
    tier: 'OBSIDIAN_BLACK' as 'STANDARD' | 'GOLD' | 'PLATINUM' | 'OBSIDIAN_BLACK',
    cardType: 'VIRTUAL' as 'DEBIT' | 'CREDIT' | 'VIRTUAL',
    spendingLimit: 50000
  };

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.cardService.listCards().subscribe({
      next: (res) => {
        if (res.data) {
          this.cards.set(res.data);
        }
      }
    });
  }

  toggleDetails(): void {
    this.showDetails.set(!this.showDetails());
  }

  revealPan(masked: string): string {
    return masked.replace(/•/g, '•');
  }

  getCardSkinClass(tier: string, idx: number): string {
    if (tier === 'OBSIDIAN_BLACK') return 'bg-gradient-to-br from-[#002625] via-[#003432] to-[#041c1b] text-white border border-teal-800/40';
    if (tier === 'GOLD') return 'bg-gradient-to-br from-amber-700 via-yellow-600 to-amber-900 text-white border border-amber-600/30';
    if (tier === 'PLATINUM') return 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-900 text-white border border-slate-500/30';
    return idx % 2 === 0 ? 'bg-gradient-to-br from-[#003432] to-[#002625] text-white border border-teal-800/40' : 'bg-gradient-to-br from-[#003432] to-[#0bb4d2] text-white border border-teal-500/30';
  }

  toggleCard(card: Card): void {
    const isActivating = card.status !== 'ACTIVE';
    const actionLabel = isActivating ? 'Activate' : 'Freeze';
    const newStatus = isActivating ? 'ACTIVE' : 'FROZEN';

    this.modalService.confirm({
      title: 'Confirm Card Action',
      message: `Are you sure you want to ${actionLabel.toLowerCase()} this card?`,
      confirmText: `Yes, ${actionLabel}`,
      type: isActivating ? 'info' : 'warning'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.cardService.toggleCardStatus(card.id, newStatus).subscribe({
          next: () => {
            this.modalService.alert({ title: 'Updated', message: `Card has been set to ${newStatus}.`, type: 'success' });
            this.loadCards();
          },
          error: () => {
            this.modalService.alert({ title: 'Error', message: 'Failed to update card status.', type: 'danger' });
          }
        });
      }
    });
  }

  openIssueModal() {
    this.showIssueModal.set(true);
  }

  submitCardRequest() {
    this.issuing.set(true);
    this.cardService.requestCard(this.cardForm).subscribe({
      next: (res) => {
        this.issuing.set(false);
        this.showIssueModal.set(false);
        this.modalService.alert({
          title: 'Card Provisioned',
          message: `Your ${this.cardForm.tier} ${this.cardForm.brand} card has been issued: ${res.data.cardNumberMasked} (CVV: ${res.data.cvv}).`,
          type: 'success'
        });
        this.loadCards();
      },
      error: () => {
        this.issuing.set(false);
        this.modalService.alert({ title: 'Error', message: 'Failed to issue new card.', type: 'danger' });
      }
    });
  }
}
