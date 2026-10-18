import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BeneficiaryService } from '../../../../core/services/domain.services';
import { ModalService } from '../../../../core/services/modal.service';
import { Beneficiary } from '../../../../core/models/bank.models';

@Component({
  selector: 'app-beneficiaries',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      
      <!-- Top Title & Add Action -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#003432] tracking-tight">Beneficiaries Directory</h1>
          <p class="text-xs text-slate-500 mt-1">Manage saved institutional and personal counterparties for rapid wire settlement.</p>
        </div>
        <button (click)="openAddModal()"
                class="bg-[#003432] hover:bg-[#002625] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 self-start transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span>Add New Beneficiary</span>
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search by recipient name, bank, or account number..."
                 class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none">
        </div>
        <div class="text-xs font-bold text-slate-500">
          Total: <span class="text-[#003432]">{{ filteredBeneficiaries().length }}</span> Saved Contacts
        </div>
      </div>

      <!-- Beneficiaries List Card -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        @if (filteredBeneficiaries().length > 0) {
          
          <!-- Desktop Table View -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th class="py-3.5 px-5">Beneficiary Legal Name</th>
                  <th class="py-3.5 px-5">Receiving Bank</th>
                  <th class="py-3.5 px-5">Account Number</th>
                  <th class="py-3.5 px-5">SWIFT / Routing</th>
                  <th class="py-3.5 px-5">Bank Address</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (b of filteredBeneficiaries(); track b.id) {
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3.5 px-5">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-teal-50 text-[#003432] font-bold text-xs flex items-center justify-center shrink-0 border border-teal-100">
                          {{ b.name.slice(0, 1) }}
                        </div>
                        <span class="font-bold text-[#003432] text-xs">{{ b.name }}</span>
                      </div>
                    </td>
                    <td class="py-3.5 px-5 text-slate-700 font-semibold">{{ b.bank_name }}</td>
                    <td class="py-3.5 px-5 font-mono text-[#003432] font-bold">{{ b.account_number }}</td>
                    <td class="py-3.5 px-5 font-mono text-slate-600">{{ b.swift_routing || 'N/A' }}</td>
                    <td class="py-3.5 px-5 text-slate-500 truncate max-w-xs">{{ b.bank_address || 'N/A' }}</td>
                    <td class="py-3.5 px-5 text-right space-x-2">
                      <a routerLink="/e-banking/fund-transfer"
                         class="px-3 py-1.5 rounded-lg bg-teal-50 text-[#003432] hover:bg-teal-100 border border-teal-200 font-bold text-[11px] transition inline-flex items-center gap-1">
                        <span>Send</span>
                        <span>&rarr;</span>
                      </a>
                      <button (click)="deleteBeneficiary(b.id, b.name)" 
                              class="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold text-[11px] transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Mobile Modern Card Feed -->
          <div class="sm:hidden divide-y divide-slate-100">
            @for (b of filteredBeneficiaries(); track b.id) {
              <div class="p-4 space-y-3 hover:bg-slate-50 transition">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-teal-50 text-[#003432] font-bold text-sm flex items-center justify-center shrink-0 border border-teal-100">
                      {{ b.name.slice(0, 1) }}
                    </div>
                    <div>
                      <div class="font-bold text-sm text-[#003432]">{{ b.name }}</div>
                      <div class="text-xs text-slate-500 font-medium">{{ b.bank_name }}</div>
                    </div>
                  </div>
                </div>

                <div class="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-mono text-slate-700 space-y-1">
                  <div>Account: <strong class="text-[#003432] font-bold">{{ b.account_number }}</strong></div>
                  @if (b.swift_routing) {
                    <div>SWIFT: <span>{{ b.swift_routing }}</span></div>
                  }
                </div>

                <div class="flex items-center justify-between pt-1">
                  <a routerLink="/e-banking/fund-transfer"
                     class="bg-[#003432] text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs">
                    <span>Send Funds</span>
                    <span>&rarr;</span>
                  </a>
                  <button (click)="deleteBeneficiary(b.id, b.name)" 
                          class="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold">
                    Delete
                  </button>
                </div>
              </div>
            }
          </div>

        } @else {
          <!-- Empty State -->
          <div class="p-16 text-center text-slate-500 text-xs">
            <svg class="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            <p class="font-bold text-slate-700 text-sm">No Beneficiary Found For This Account</p>
            <p class="text-slate-400 mt-1">Add domestic or international recipients to speed up wire transfers.</p>
          </div>
        }

      </div>

      <!-- Add Beneficiary Modal -->
      @if (showAddModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-5">
            
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-lg font-black text-[#003432]">Add New Wire Beneficiary</h3>
                <p class="text-xs text-slate-500 mt-0.5">Enrolled for instant automated settlement</p>
              </div>
              <button (click)="closeAddModal()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold">&times;</button>
            </div>

            <form (ngSubmit)="saveBeneficiary()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Beneficiary Legal Name *</label>
                <input type="text" [(ngModel)]="addForm.name" name="name" required 
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                       placeholder="e.g. Elena Rostova">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Bank Name *</label>
                <input type="text" [(ngModel)]="addForm.bankName" name="bankName" required 
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                       placeholder="e.g. Credit Suisse Zurich">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Account Number *</label>
                  <input type="text" [(ngModel)]="addForm.accountNumber" name="accountNumber" required 
                         class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                         placeholder="CH56...">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">SWIFT / Routing</label>
                  <input type="text" [(ngModel)]="addForm.swiftRouting" name="swiftRouting" 
                         class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono uppercase text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                         placeholder="CRESCHZZ">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Bank Address</label>
                <input type="text" [(ngModel)]="addForm.bankAddress" name="bankAddress" 
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#003432] focus:border-transparent outline-none" 
                       placeholder="Paradeplatz 8, Zurich, Switzerland">
              </div>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" (click)="closeAddModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" class="bg-[#003432] hover:bg-[#002625] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs transition">
                  Save Beneficiary &rarr;
                </button>
              </div>
            </form>

          </div>
        </div>
      }

    </div>
  `
})
export class BeneficiariesComponent implements OnInit {
  private beneficiaryService = inject(BeneficiaryService);
  private modalService = inject(ModalService);

  beneficiaries = signal<Beneficiary[]>([]);
  searchQuery = '';
  showAddModal = signal<boolean>(false);

  filteredBeneficiaries = computed(() => {
    const list = this.beneficiaries();
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(b => 
      b.name.toLowerCase().includes(q) ||
      b.bank_name.toLowerCase().includes(q) ||
      b.account_number.toLowerCase().includes(q)
    );
  });

  addForm = {
    name: '',
    bankName: '',
    accountNumber: '',
    swiftRouting: '',
    bankAddress: ''
  };

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  loadBeneficiaries(): void {
    this.beneficiaryService.listBeneficiaries().subscribe({
      next: (res) => {
        if (res.data) {
          this.beneficiaries.set(res.data);
        }
      }
    });
  }

  openAddModal(): void {
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.addForm = {
      name: '',
      bankName: '',
      accountNumber: '',
      swiftRouting: '',
      bankAddress: ''
    };
  }

  saveBeneficiary(): void {
    if (!this.addForm.name || !this.addForm.bankName || !this.addForm.accountNumber) {
      this.modalService.alert({ title: 'Missing Fields', message: 'Please complete all required fields.', type: 'warning' });
      return;
    }

    this.beneficiaryService.addBeneficiary(this.addForm).subscribe({
      next: () => {
        this.modalService.alert({ title: 'Success', message: 'Beneficiary added successfully.', type: 'success' });
        this.closeAddModal();
        this.loadBeneficiaries();
      },
      error: () => {
        this.modalService.alert({ title: 'Error', message: 'Failed to save beneficiary.', type: 'danger' });
      }
    });
  }

  deleteBeneficiary(id: string, name: string): void {
    this.modalService.confirm({
      title: 'Delete Beneficiary',
      message: `Are you sure you want to remove ${name} from your beneficiaries?`,
      confirmText: 'Yes, Delete',
      type: 'warning'
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.beneficiaryService.deleteBeneficiary(id).subscribe({
          next: () => {
            this.modalService.alert({ title: 'Deleted', message: 'Beneficiary removed.', type: 'success' });
            this.loadBeneficiaries();
          },
          error: () => {
            this.modalService.alert({ title: 'Error', message: 'Failed to delete beneficiary.', type: 'danger' });
          }
        });
      }
    });
  }
}
